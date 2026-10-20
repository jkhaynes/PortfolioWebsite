#!/usr/bin/env python3
"""Local merge gate: a PreToolUse hook on Bash that stands in for branch protection.

Private repos on the free GitHub plan can't enforce branch protection, so this hook
blocks Claude Code from merging on red:

- `gh pr merge`: allowed only when `gh pr checks` is all green. Pending, failing or
  missing checks block. Set MERGE_GATE_ALLOW_NO_CHECKS=1 for a repo without CI.
- `git push` to main or master: blocked. Go through a PR.
- `git merge <branch>` (or `git pull <remote> <branch>`) while on main or master:
  allowed only when that branch's PR checks are green, the same rule as `gh pr merge`.
  CI runs scripts/check.sh on the branch, so this is "scripts/check passed" for the
  code actually coming in, not for the tree you're merging into.

Anything else exits 0 straight away. Exit 2 blocks the command and shows stderr to
Claude. A merge is never allowed by accident: if the gate can't tell, it blocks.
Run through merge-gate.sh, which also blocks merges if Python itself can't start.
"""
import json
import os
import re
import shlex
import shutil
import subprocess
import sys

PROTECTED = {"main", "master"}
OPERATORS = {"&&", "||", ";", "|", "&", "\n", ";;", "|&"}
GH_MERGE_VALUE_FLAGS = {"-b", "--body", "-F", "--body-file", "-t", "--subject",
                        "-A", "--author-email", "--match-head-commit", "-R", "--repo"}
GIT_PUSH_VALUE_FLAGS = {"-o", "--push-option", "--repo", "--receive-pack", "--exec"}
GIT_MERGE_VALUE_FLAGS = {"-m", "-F", "--file", "-s", "--strategy", "-X", "--strategy-option",
                         "--cleanup", "--into-name", "-S", "--gpg-sign"}
GIT_GLOBAL_VALUE_FLAGS = {"-C", "-c", "--git-dir", "--work-tree", "--namespace"}


class Block(Exception):
    pass


def segments(command):
    """Split a shell command into simple commands, respecting quotes."""
    lex = shlex.shlex(command, posix=True, punctuation_chars=";&|\n")
    lex.whitespace = " \t\r"
    lex.whitespace_split = True
    try:
        toks = list(lex)
    except ValueError:
        # Unbalanced quotes: fall back to a plain split. Over-matching only blocks.
        toks = re.split(r"(&&|\|\||[;|\n])", command)
        toks = [t for part in toks for t in ([part] if part in OPERATORS else part.split())]
    current = []
    for t in toks:
        if t in OPERATORS or set(t) <= set(";&|\n"):
            if current:
                yield current
            current = []
        else:
            current.append(t)
    if current:
        yield current


def strip_env(toks):
    while toks and re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", toks[0]):
        toks = toks[1:]
    return toks


def prog(tok):
    name = os.path.basename(tok).lower()
    return name[:-4] if name.endswith(".exe") else name


def git_subcommand(toks):
    """Return (subcommand, args, global_opts) for a git command."""
    i, global_opts = 1, []
    while i < len(toks) and toks[i].startswith("-"):
        if toks[i] in GIT_GLOBAL_VALUE_FLAGS and i + 1 < len(toks):
            global_opts += toks[i:i + 2]
            i += 2
        else:
            global_opts.append(toks[i])
            i += 1
    if i >= len(toks):
        return None, [], []
    return toks[i], toks[i + 1:], global_opts


def positionals(args, value_flags):
    out, flags, i = [], set(), 0
    while i < len(args):
        a = args[i]
        if a in value_flags:
            i += 2
            continue
        if a.startswith("-"):
            flags.add(a.split("=", 1)[0])
        else:
            out.append(a)
        i += 1
    return out, flags


def run(args, cwd, timeout=120):
    return subprocess.run(args, cwd=cwd, capture_output=True, text=True,
                          encoding="utf-8", errors="replace", timeout=timeout)


def current_branch(cwd, global_opts):
    git = shutil.which("git")
    if not git:
        raise Block("git not found on PATH, so the merge gate can't tell which branch you're on.")
    r = run([git, *global_opts, "rev-parse", "--abbrev-ref", "HEAD"], cwd, timeout=30)
    if r.returncode != 0:
        raise Block("couldn't read the current branch: " + r.stderr.strip())
    return r.stdout.strip()


def require_green_checks(selector, cwd, repo=()):
    """Block unless `gh pr checks <selector>` reports every check green."""
    gh = shutil.which("gh")
    if not gh:
        raise Block("the GitHub CLI (gh) isn't installed or isn't on PATH, so CI status can't be "
                    "checked. Install gh and run `gh auth login`, then try again.")
    target = [selector] if selector else []
    r = run([gh, "pr", "checks", *target, *repo], cwd)
    out = (r.stdout + "\n" + r.stderr).strip()
    if r.returncode == 0:
        return
    pr = f"PR {selector}" if selector else "this branch's PR"
    if "no checks reported" in out.lower():
        if os.environ.get("MERGE_GATE_ALLOW_NO_CHECKS") == "1":
            return
        raise Block(f"no CI checks reported for {pr}; is .github/workflows/ci.yml set up? "
                    "For a repo with no CI, set MERGE_GATE_ALLOW_NO_CHECKS=1.")
    if "auth login" in out.lower() or "not logged in" in out.lower():
        raise Block("gh isn't authenticated, so CI status can't be checked. Run `gh auth login`.")
    not_green = []
    for line in r.stdout.splitlines():
        cols = line.split("\t")
        if len(cols) >= 2 and cols[1].strip().lower() not in ("pass", "skipping"):
            not_green.append(f"  {cols[0].strip()}: {cols[1].strip()}")
    state = "still pending" if r.returncode == 8 else "not green"
    detail = "\n".join(not_green) if not_green else "  " + (out or f"gh exited {r.returncode}")
    watch = " ".join(["gh pr checks", *target, "--watch"])
    raise Block(f"CI checks for {pr} are {state}:\n{detail}\n"
                f"Wait with `{watch}`, fix any failure, then merge.")


def check_gh_merge(args, cwd):
    repo = []
    for i, a in enumerate(args):
        if a in ("-R", "--repo") and i + 1 < len(args):
            repo = ["--repo", args[i + 1]]
        elif a.startswith("--repo="):
            repo = ["--repo", a.split("=", 1)[1]]
    pos, _ = positionals(args, GH_MERGE_VALUE_FLAGS)
    require_green_checks(pos[0] if pos else None, cwd, repo)


def check_git_push(args, cwd, global_opts):
    pos, flags = positionals(args, GIT_PUSH_VALUE_FLAGS)
    if flags & {"--all", "--mirror", "--branches"}:
        raise Block("`git push --all/--mirror` would push main or master. Go through a PR.")
    refspecs = pos[1:]
    if not refspecs:
        if "--tags" in flags:
            return
        branch = current_branch(cwd, global_opts)
        if branch in PROTECTED:
            raise Block(f"you're on {branch}; pushing it directly skips CI review. Go through a PR.")
        return
    for spec in refspecs:
        dst = spec.split(":", 1)[1] if ":" in spec else spec
        dst = dst.lstrip("+")
        if dst.startswith("refs/heads/"):
            dst = dst[len("refs/heads/"):]
        if dst == "HEAD":
            dst = current_branch(cwd, global_opts)
        if dst in PROTECTED:
            raise Block(f"pushing to {dst} directly skips CI review. Go through a PR.")


def check_incoming(branches, cwd, global_opts, verb):
    """A merge or pull into main/master is allowed only for branches with green PR checks."""
    target = current_branch(cwd, global_opts)
    if target not in PROTECTED:
        return
    for b in branches:
        name = re.sub(r"^(refs/heads/|refs/remotes/[^/]+/|origin/)", "", b)
        if name in PROTECTED or name in ("FETCH_HEAD", "ORIG_HEAD"):
            continue
        try:
            require_green_checks(name, cwd)
        except Block as e:
            raise Block(f"`git {verb} {b}` into {target} needs {name}'s PR checks to be green. "
                        f"Prefer `gh pr merge`. {e}")


def check_git_merge(args, cwd, global_opts):
    pos, flags = positionals(args, GIT_MERGE_VALUE_FLAGS)
    if flags & {"--abort", "--continue", "--quit"}:
        return
    if not pos and current_branch(cwd, global_opts) in PROTECTED:
        raise Block("`git merge` with no branch named merges the upstream into main/master "
                    "unchecked. Name the branch, or go through a PR.")
    check_incoming(pos, cwd, global_opts, "merge")


def check_git_pull(args, cwd, global_opts):
    pos, _ = positionals(args, GIT_PUSH_VALUE_FLAGS)
    # `git pull` or `git pull origin main` just syncs; `git pull origin feat/x` merges feat/x.
    check_incoming(pos[1:], cwd, global_opts, "pull")


def gate(command, cwd):
    for toks in segments(command):
        toks = strip_env(toks)
        if not toks:
            continue
        p = prog(toks[0])
        if p == "cd" and len(toks) > 1:
            target = os.path.join(cwd, os.path.expanduser(toks[1]))
            if os.path.isdir(target):
                cwd = target
        elif p == "gh" and toks[1:3] == ["pr", "merge"]:
            check_gh_merge(toks[3:], cwd)
        elif p == "git":
            sub, args, global_opts = git_subcommand(toks)
            if sub == "push":
                check_git_push(args, cwd, global_opts)
            elif sub == "merge":
                check_git_merge(args, cwd, global_opts)
            elif sub == "pull":
                check_git_pull(args, cwd, global_opts)


def main():
    raw = sys.stdin.read()
    try:
        data = json.loads(raw)
        command = data.get("tool_input", {}).get("command", "") or ""
        cwd = data.get("cwd") or os.getcwd()
    except Exception:
        # Can't parse the hook input. Block only if it might be a merge, pull or push.
        if re.search(r"\b(merge|pull|push)\b", raw):
            print("merge-gate: couldn't read the hook input, so this merge/push is blocked.",
                  file=sys.stderr)
            sys.exit(2)
        sys.exit(0)

    if not re.search(r"merge|pull|push", command):
        sys.exit(0)
    try:
        gate(command, cwd)
    except Block as e:
        print(f"merge-gate: {e}", file=sys.stderr)
        sys.exit(2)
    except Exception as e:  # never fail open on a merge
        print(f"merge-gate: blocked because the gate itself failed ({e!r}). "
              "Fix the hook or merge by hand after checking CI.", file=sys.stderr)
        sys.exit(2)
    sys.exit(0)


if __name__ == "__main__":
    main()
