#!/usr/bin/env python3
"""Review panel dashboard: a live, read-only board of every feature in this repo.

Run from anywhere in the repo (the main checkout or any worktree):

    python3 scripts/dashboard.py            # http://127.0.0.1:4317
    python3 scripts/dashboard.py --port 5000 --open

It never writes anything. Each poll it reads the files the workflow already makes:
specs/NNN-*/ (mockup.md, spec.md, plan.md, tasks.md, reviews/round-N/*.md,
decision.md) from every worktree, every NNN-* branch and the default branch, the
Superpowers progress log in each worktree, the reviewer agents in
.claude/agents/reviewer-*.md, and PR checks from `gh` (cached, refreshed every 30s).
How stages are worked out: docs/worktrees.md and REVIEW.md.
"""
import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

FEATURE_RE = re.compile(r"^\d{3}-[A-Za-z0-9._-]+$")
ROUND_RE = re.compile(r"^reviews/round-(\d+)/(.+)$")
VERDICT_RE = re.compile(r"^VERDICT:\s*(PASS|CHANGES|SKIPPED)\s*$")
TASK_RE = re.compile(r"^\s*[-*]\s+\[([ xX])\]")
MAX_FILES = 200
HERE = os.path.dirname(os.path.abspath(__file__))


# ---------- parsers (pure) ----------

def _lines(text):
    return (text or "").lstrip("﻿").replace("\r\n", "\n").split("\n")


def parse_tasks(text):
    done = total = 0
    for line in _lines(text):
        m = TASK_RE.match(line)
        if m:
            total += 1
            done += m.group(1) in "xX"
    return done, total


def first_verdict(text):
    for line in _lines(text):
        if line.strip():
            m = VERDICT_RE.match(line.strip())
            return m.group(1) if m else None
    return None


def _section(lines, heading):
    out, inside = [], False
    for line in lines:
        if line.startswith("## "):
            inside = line[3:].strip().lower().startswith(heading)
            continue
        if inside:
            out.append(line)
    return "\n".join(out).strip()


def parse_decision(text):
    lines = _lines(text)
    first = next((l.strip() for l in lines if l.strip()), "")
    if first not in ("APPROVE", "ESCALATE"):
        return None
    for_owner = _section(lines, "for the owner") or _section(lines, "for the human")
    return {"verdict": first, "why": _section(lines, "why"), "forOwner": for_owner}


def mockup_approved(text):
    return re.search(r"approved:\s*\d{4}-\d{2}-\d{2}", (text or "").replace("*", ""), re.I) is not None


def ledger_activity(text):
    for line in reversed(_lines(text)):
        s = line.strip()
        if s and not s.startswith("#"):
            return re.sub(r"^[-*]\s+", "", s).replace("**", "")
    return ""


def parse_agent(text):
    lines = _lines(text)
    if not lines or lines[0].strip() != "---":
        return {}
    out = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        key, _, value = line.partition(":")
        if key.strip() in ("name", "model") and value.strip():
            out[key.strip()] = value.strip()
    return out


def spec_title(text):
    for line in _lines(text):
        if line.startswith("# "):
            title = re.sub(r"^feature specification:\s*", "", line[2:].strip(), flags=re.I)
            return None if not title or title.startswith("[") else title
    return None


def slug_title(feature_id):
    words = re.sub(r"^\d+-", "", feature_id).replace("-", " ").strip()
    return words[:1].upper() + words[1:] if words else feature_id


def parse_worktrees(text):
    out, cur = [], None
    for line in _lines(text):
        if line.startswith("worktree "):
            cur = {"path": line[len("worktree "):], "branch": None}
            out.append(cur)
        elif line.startswith("branch ") and cur is not None:
            cur["branch"] = line[len("branch "):].replace("refs/heads/", "", 1)
    return out


def ci_summary(pr):
    if pr is None:
        return {"state": "none", "label": "no PR"}
    if pr.get("state") == "MERGED":
        return {"state": "merged", "label": "merged"}
    checks = pr.get("statusCheckRollup") or []
    if not checks:
        return {"state": "nochecks", "label": "no checks"}
    bad = {"FAILURE", "CANCELLED", "TIMED_OUT", "ACTION_REQUIRED", "STARTUP_FAILURE", "ERROR"}
    red = pending = False
    for c in checks:
        if "status" in c:  # a check run
            if c.get("status") != "COMPLETED":
                pending = True
            elif (c.get("conclusion") or "").upper() in bad:
                red = True
        else:  # a commit status
            state = (c.get("state") or "").upper()
            if state in bad:
                red = True
            elif state in ("PENDING", "EXPECTED"):
                pending = True
    if red:
        return {"state": "red", "label": "CI red"}
    if pending:
        return {"state": "pending", "label": "CI pending"}
    return {"state": "green", "label": "CI green"}


def gh_error_summary(stderr):
    s = (stderr or "").lower()
    if "no pull requests found" in s:
        return ci_summary(None)
    if "remote" in s:
        return {"state": "unknown", "label": "no GitHub remote"}
    if "auth" in s or "logged in" in s:
        return {"state": "unknown", "label": "gh not logged in"}
    return {"state": "unknown", "label": "gh error"}


# ---------- one feature ----------

def build_feature(feature_id, source, panel, merged=False, ledger="", branch=None, worktree=None, ci=None):
    files = source.list()
    have = set(files)

    def read(rel):
        return source.read(rel) if rel in have else None

    tasks = parse_tasks(read("tasks.md")) if "tasks.md" in have else None
    decision = parse_decision(read("decision.md")) if "decision.md" in have else None
    mockup = read("mockup.md")

    by_round = {}
    for rel in files:
        m = ROUND_RE.match(rel)
        if not m:
            continue
        r = by_round.setdefault(int(m.group(1)), {"n": int(m.group(1)), "verdicts": {}, "fixes": False})
        name = m.group(2)
        if name == "fixes.md":
            r["fixes"] = True
        elif name.startswith("review-") and name.endswith(".md") and "/" not in name:
            r["verdicts"][name[len("review-"):-3]] = first_verdict(read(rel)) or "pending"
    rounds = [by_round[n] for n in sorted(by_round)]
    n = rounds[-1]["n"] if rounds else 0
    lenses = list(panel) + sorted({l for r in rounds for l in r["verdicts"]} - set(panel))
    verdicts = {l: rounds[-1]["verdicts"].get(l, "pending") for l in lenses} if rounds else {}

    if merged:
        stage = "Merged"
    elif decision:
        stage = "Decision"
    elif rounds:
        stage = "Review"
    elif tasks is not None:
        stage = "Build"
    else:
        stage = "Design"

    needs = None
    if not merged:
        if mockup is not None and not mockup_approved(mockup):
            needs = "Mockup waiting for your approval"
        elif decision and decision["verdict"] == "ESCALATE":
            needs = "Approver escalated"

    if stage == "Merged":
        activity = "Merged"
    elif stage == "Decision":
        why = decision["why"].split("\n")[0]
        activity = decision["verdict"] + (": " + why if why else "")
    elif stage == "Review":
        k = sum(1 for v in verdicts.values() if v != "pending")
        changes = [l for l, v in verdicts.items() if v == "CHANGES"]
        if k < len(verdicts):
            activity = f"Round {n}: {k} of {len(verdicts)} verdicts in"
        elif changes:
            activity = f"Round {n}: CHANGES from {', '.join(changes)}" + ("; fixes in" if rounds[-1]["fixes"] else "; fixer working")
        else:
            activity = f"Round {n}: all clear, approver next"
    elif stage == "Build":
        activity = ledger or f"{tasks[0]} of {tasks[1]} tasks done"
    elif not files:
        activity = f"No specs/{feature_id}/ yet"
    elif needs:
        activity = needs
    elif "plan.md" in have:
        activity = "Planned"
    elif "spec.md" in have:
        activity = "Specified"
    else:
        activity = "Mockup approved"

    return {
        "id": feature_id,
        "name": spec_title(read("spec.md")) or slug_title(feature_id),
        "branch": branch,
        "worktree": worktree,
        "stage": stage,
        "needsYou": needs is not None,
        "needsReason": needs,
        "tasks": {"done": tasks[0], "total": tasks[1]} if tasks else None,
        "activity": activity[:160],
        "round": n,
        "rounds": rounds,
        "verdicts": verdicts,
        "decision": decision,
        # Everything above used the full list; only the list shown (and readable) is capped.
        # Top-level files and reviews first, so a big mockup/ export can't push them out.
        "files": sorted(files, key=lambda p: (p.startswith("mockup/"), p))[:MAX_FILES],
        "ci": ci or {"state": "none", "label": "no PR"},
    }


# ---------- reading the repo ----------

def git(cwd, *args, check=True):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if check and r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip()}")
    return r.stdout if r.returncode == 0 else None


class DiskSource:
    def __init__(self, folder):
        self.folder = folder

    def list(self):
        out = []
        for dirpath, dirnames, filenames in os.walk(self.folder):
            dirnames.sort()
            for f in sorted(filenames):
                out.append(os.path.relpath(os.path.join(dirpath, f), self.folder).replace(os.sep, "/"))
        return out

    def read(self, rel):
        try:
            with open(os.path.join(self.folder, rel), encoding="utf-8", errors="replace") as f:
                return f.read()
        except OSError:
            return None

    def describe(self):
        return {"kind": "disk", "folder": self.folder}


class GitSource:
    def __init__(self, cwd, ref, folder):
        self.cwd, self.ref, self.folder = cwd, ref, folder.rstrip("/")

    def list(self):
        out = git(self.cwd, "ls-tree", "-r", "--name-only", self.ref, "--", self.folder + "/", check=False) or ""
        prefix = self.folder + "/"
        return [l[len(prefix):] for l in out.splitlines() if l.startswith(prefix)]

    def read(self, rel):
        return git(self.cwd, "show", f"{self.ref}:{self.folder}/{rel}", check=False)

    def describe(self):
        return {"kind": "git", "ref": self.ref, "folder": self.folder}


def default_branch(cwd):
    head = git(cwd, "symbolic-ref", "--short", "refs/remotes/origin/HEAD", check=False)
    if head and "/" in head.strip():
        return head.strip().split("/", 1)[1]
    for name in ("master", "main"):
        if git(cwd, "rev-parse", "--verify", "-q", f"refs/heads/{name}", check=False):
            return name
    return "master"


def newest_ledger(worktree):
    paths = glob.glob(os.path.join(worktree, ".superpowers", "sdd", "*", "progress.md"))
    paths += glob.glob(os.path.join(worktree, ".superpowers", "sdd", "progress.md"))
    if not paths:
        return ""
    try:
        with open(max(paths, key=os.path.getmtime), encoding="utf-8", errors="replace") as f:
            return ledger_activity(f.read())
    except OSError:
        return ""


def worktree_feature_dir(wt, branch):
    if os.path.isdir(os.path.join(wt, "specs", branch)):
        return branch
    try:
        with open(os.path.join(wt, ".specify", "feature.json"), encoding="utf-8") as f:
            name = os.path.basename(str(json.load(f).get("feature_directory", "")).rstrip("/\\"))
        if FEATURE_RE.match(name) and os.path.isdir(os.path.join(wt, "specs", name)):
            return name
    except (OSError, ValueError, AttributeError):
        pass
    return branch


_git_cache = {}


def _cached(key, make):
    if key not in _git_cache:
        if len(_git_cache) > 500:
            _git_cache.clear()
        _git_cache[key] = make()
    return _git_cache[key]


def collect_state(start, ci=None):
    ci = ci or {}
    trees = parse_worktrees(git(start, "worktree", "list", "--porcelain"))
    root = trees[0]["path"]
    base = default_branch(root)

    panel = []
    for path in sorted(glob.glob(os.path.join(root, ".claude", "agents", "reviewer-*.md"))):
        lens = os.path.basename(path)[len("reviewer-"):-3]
        with open(path, encoding="utf-8", errors="replace") as f:
            meta = parse_agent(f.read())
        panel.append({"lens": lens, "name": meta.get("name", f"reviewer-{lens}"), "model": meta.get("model", "")})
    lenses = [p["lens"] for p in panel]

    worktree_of = {t["branch"]: t["path"] for t in trees[1:] if t["branch"]}
    branches = set((git(root, "for-each-ref", "--format=%(refname:short)", "refs/heads") or "").split())
    feature_branches = sorted(b for b in branches | set(worktree_of) if FEATURE_RE.match(b))
    base_specs = set((git(root, "ls-tree", "--name-only", f"{base}:specs", check=False) or "").split())
    base_sha = (git(root, "rev-parse", base, check=False) or "").strip()

    features, sources = [], {}
    for branch in feature_branches:
        wt = worktree_of.get(branch)
        if branch in base_specs:
            # Merged: its PR says so (covers squash and rebase merges), or a plain merge made it an ancestor.
            pr_merged = (ci.get(branch) or {}).get("state") == "merged"
            if pr_merged or subprocess.run(["git", "merge-base", "--is-ancestor", branch, base], cwd=root,
                                           capture_output=True).returncode == 0:
                continue  # listed from the default branch below
        if wt:
            fid = worktree_feature_dir(wt, branch)
            src = DiskSource(os.path.join(wt, "specs", fid))
            f = build_feature(fid, src, lenses, ledger=newest_ledger(wt), branch=branch, worktree=wt,
                              ci=ci.get(branch))
        else:
            fid = branch
            src = GitSource(root, branch, f"specs/{branch}")
            sha = (git(root, "rev-parse", branch, check=False) or "").strip()
            f = dict(_cached(("branch", sha, branch, tuple(lenses)),
                             lambda: build_feature(fid, src, lenses, branch=branch)))
            f["ci"] = ci.get(branch) or f["ci"]
        features.append(f)
        sources[f["id"]] = src

    active = {f["id"] for f in features}
    for name in sorted(base_specs - active):
        if not FEATURE_RE.match(name):
            continue
        src = GitSource(root, base, f"specs/{name}")
        f = _cached(("base", base_sha, name, tuple(lenses)),
                    lambda: build_feature(name, src, lenses, merged=True, branch=name))
        features.append(f)
        sources[name] = src

    features.sort(key=lambda f: f["id"])
    return {
        "repo": os.path.basename(root.rstrip("/\\")),
        "root": root,
        "base": base,
        "panel": panel,
        "features": features,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "_sources": sources,
    }


def read_feature_file(start, state, feature_id, rel):
    """Read one file of a feature, but only a path the feature actually lists."""
    feature = next((f for f in state["features"] if f["id"] == feature_id), None)
    if feature is None or rel not in feature["files"]:
        return None
    src = state.get("_sources", {}).get(feature_id)
    return src.read(rel) if src else None


# ---------- CI cache ----------

class CiCache:
    """Refreshes `gh pr view` for each active branch every 30 seconds, off the request path."""

    def __init__(self, root, interval=30):
        self.root, self.interval = root, interval
        self.branches, self.results = [], {}
        self.gh = shutil.which("gh")
        self.lock = threading.Lock()
        threading.Thread(target=self._loop, daemon=True).start()

    def want(self, branches):
        with self.lock:
            self.branches = list(branches)

    def get(self):
        with self.lock:
            return dict(self.results)

    def _loop(self):
        while True:
            with self.lock:
                branches = list(self.branches)
            for b in branches:
                try:
                    self._fetch(b)
                except Exception as e:  # a timeout or bad output must not stop the refresh loop
                    with self.lock:
                        self.results[b] = {"state": "unknown", "label": "gh error", "detail": repr(e)}
            time.sleep(self.interval if branches else 1)

    def _fetch(self, branch):
        if not self.gh:
            summary = {"state": "unknown", "label": "gh not installed"}
        else:
            r = subprocess.run([self.gh, "pr", "view", branch, "--json", "number,url,state,statusCheckRollup"],
                               cwd=self.root, capture_output=True, text=True, encoding="utf-8",
                               errors="replace", timeout=60)
            if r.returncode == 0:
                pr = json.loads(r.stdout)
                summary = dict(ci_summary(pr), number=pr.get("number"), url=pr.get("url"))
            else:
                summary = gh_error_summary(r.stderr)
        with self.lock:
            self.results[branch] = summary


# ---------- server ----------

def host_allowed(host, port):
    """Only answer requests addressed to this machine, which blocks DNS-rebinding reads from web pages."""
    return host in (f"127.0.0.1:{port}", f"localhost:{port}")


class Dashboard:
    def __init__(self, start):
        self.start = start
        self.lock = threading.Lock()
        self.state, self.at = None, 0.0
        root = parse_worktrees(git(start, "worktree", "list", "--porcelain"))[0]["path"]
        self.ci = CiCache(root)

    def current(self):
        with self.lock:
            if self.state is None or time.time() - self.at > 1.0:
                self.state = collect_state(self.start, self.ci.get())
                self.at = time.time()
                self.ci.want(f["branch"] for f in self.state["features"] if f["stage"] != "Merged" and f["branch"])
            return self.state


def make_handler(dash, port):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def _send(self, code, body, ctype):
            data = body.encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            url = urlparse(self.path)
            if not host_allowed(self.headers.get("Host"), port):
                return self._send(403, "forbidden: open the dashboard at 127.0.0.1 or localhost", "text/plain; charset=utf-8")
            try:
                if url.path == "/":
                    with open(os.path.join(HERE, "dashboard.html"), encoding="utf-8") as f:
                        return self._send(200, f.read(), "text/html; charset=utf-8")
                if url.path == "/api/state":
                    state = {k: v for k, v in dash.current().items() if not k.startswith("_")}
                    return self._send(200, json.dumps(state), "application/json")
                if url.path == "/api/file":
                    q = parse_qs(url.query)
                    text = read_feature_file(dash.start, dash.current(), q.get("id", [""])[0], q.get("path", [""])[0])
                    if text is None:
                        return self._send(404, "not found", "text/plain; charset=utf-8")
                    return self._send(200, text, "text/plain; charset=utf-8")
                return self._send(404, "not found", "text/plain; charset=utf-8")
            except Exception as e:  # keep the server up; show the error on the page
                return self._send(500, json.dumps({"error": repr(e)}), "application/json")

    return Handler


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--port", type=int, default=4317)
    ap.add_argument("--open", action="store_true", help="open the dashboard in your browser")
    args = ap.parse_args()
    try:
        dash = Dashboard(os.getcwd())
    except RuntimeError as e:
        sys.exit(f"dashboard: run this inside the repo ({e})")
    server = ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(dash, args.port))
    url = f"http://127.0.0.1:{args.port}"
    print(f"Review panel dashboard for {dash.current()['repo']}: {url}  (Ctrl+C to stop)")
    if args.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
