"""Tests for scripts/dashboard.py. Run: python3 -m unittest discover -s scripts/tests"""
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import dashboard as d  # noqa: E402


class ParsersTest(unittest.TestCase):
    def test_tasks_counts_checked_and_open_boxes(self):
        text = "# Tasks\n- [x] T001 one\n- [X] T002 two\n- [ ] T003 three\n* [ ] T004 four\nnot a task [ ]\n"
        self.assertEqual(d.parse_tasks(text), (2, 4))

    def test_tasks_none_when_no_boxes(self):
        self.assertEqual(d.parse_tasks("# Tasks\nnothing yet\n"), (0, 0))

    def test_first_verdict(self):
        self.assertEqual(d.first_verdict("VERDICT: PASS\n\n## Findings\nNone."), "PASS")
        self.assertEqual(d.first_verdict("\ufeffVERDICT: CHANGES\r\n"), "CHANGES")
        self.assertEqual(d.first_verdict("VERDICT: SKIPPED\n"), "SKIPPED")
        self.assertIsNone(d.first_verdict("Looks fine to me\nVERDICT: PASS"))
        self.assertIsNone(d.first_verdict(""))

    def test_decision(self):
        text = "ESCALATE\n\n## Why\nAdds a dependency. More text.\n\n## For the owner\nDecide on date-fns.\n"
        dec = d.parse_decision(text)
        self.assertEqual(dec["verdict"], "ESCALATE")
        self.assertEqual(dec["why"], "Adds a dependency. More text.")
        self.assertEqual(dec["forOwner"], "Decide on date-fns.")
        self.assertIsNone(d.parse_decision("maybe\n"))

    def test_mockup_approved(self):
        self.assertTrue(d.mockup_approved("Canvas: https://x\nApproved: 2026-10-20\n"))
        self.assertTrue(d.mockup_approved("**Approved:** 2026-10-20 by owner"))
        self.assertFalse(d.mockup_approved("Canvas: https://x\nApproved: [DATE]\n"))
        self.assertFalse(d.mockup_approved("Canvas: https://x\n"))

    def test_ledger_activity_is_last_meaningful_line(self):
        text = "# SDD ledger - plan: specs/007/plan.md\nTask 9: complete (abc123)\n- Task 10: fix round 1 dispatched\n\n"
        self.assertEqual(d.ledger_activity(text), "Task 10: fix round 1 dispatched")
        self.assertEqual(d.ledger_activity("# only a heading\n"), "")

    def test_parse_agent_frontmatter(self):
        text = '---\nname: reviewer-ux\nmodel: sonnet\nreview-paths: ["src/**", "[e.g. x]"]\n---\nbody'
        self.assertEqual(d.parse_agent(text), {"name": "reviewer-ux", "model": "sonnet"})
        self.assertEqual(d.parse_agent("no frontmatter"), {})

    def test_spec_title(self):
        self.assertEqual(d.spec_title("# Feature Specification: Price alert emails\n"), "Price alert emails")
        self.assertEqual(d.spec_title("# Value chart\n"), "Value chart")
        self.assertIsNone(d.spec_title("# Feature Specification: [FEATURE NAME]\n"))
        self.assertEqual(d.slug_title("008-supplier-compare"), "Supplier compare")

    def test_parse_worktrees(self):
        text = ("worktree C:/r/app\nHEAD aaa\nbranch refs/heads/master\n\n"
                "worktree C:/r/app/.worktrees/008-x\nHEAD bbb\nbranch refs/heads/008-x\n\n"
                "worktree C:/r/app/.worktrees/tmp\nHEAD ccc\ndetached\n\n")
        self.assertEqual(d.parse_worktrees(text), [
            {"path": "C:/r/app", "branch": "master"},
            {"path": "C:/r/app/.worktrees/008-x", "branch": "008-x"},
            {"path": "C:/r/app/.worktrees/tmp", "branch": None},
        ])

    def test_ci_summary(self):
        self.assertEqual(d.ci_summary(None)["state"], "none")
        self.assertEqual(d.ci_summary({"state": "MERGED", "statusCheckRollup": []})["state"], "merged")
        self.assertEqual(d.ci_summary({"state": "OPEN", "statusCheckRollup": []})["state"], "nochecks")
        green = {"state": "OPEN", "statusCheckRollup": [{"status": "COMPLETED", "conclusion": "SUCCESS"},
                                                         {"status": "COMPLETED", "conclusion": "SKIPPED"}]}
        self.assertEqual(d.ci_summary(green)["state"], "green")
        pending = {"state": "OPEN", "statusCheckRollup": [{"status": "IN_PROGRESS", "conclusion": ""}]}
        self.assertEqual(d.ci_summary(pending)["state"], "pending")
        red = {"state": "OPEN", "statusCheckRollup": [{"status": "COMPLETED", "conclusion": "FAILURE"},
                                                       {"state": "PENDING"}]}
        self.assertEqual(d.ci_summary(red)["state"], "red")
        ctx = {"state": "OPEN", "statusCheckRollup": [{"state": "SUCCESS"}]}
        self.assertEqual(d.ci_summary(ctx)["state"], "green")

    def test_gh_error_summary(self):
        self.assertEqual(d.gh_error_summary('no pull requests found for branch "x"')["label"], "no PR")
        self.assertEqual(d.gh_error_summary("none of the git remotes configured for this repository point to a known GitHub host")["label"], "no GitHub remote")
        self.assertEqual(d.gh_error_summary("To get started with GitHub CLI, please run:  gh auth login")["label"], "gh not logged in")
        self.assertEqual(d.gh_error_summary("boom")["label"], "gh error")


class FakeSource:
    def __init__(self, files):
        self.files = files

    def list(self):
        return sorted(self.files)

    def read(self, rel):
        return self.files.get(rel)


PANEL = ["code", "security", "ui", "ux"]


class FeatureTest(unittest.TestCase):
    def feature(self, files, **kw):
        return d.build_feature("006-value-chart", FakeSource(files), PANEL, **kw)

    def test_design_with_unapproved_mockup_needs_owner(self):
        f = self.feature({"mockup.md": "Canvas: x\nApproved: [DATE]\n"})
        self.assertEqual(f["stage"], "Design")
        self.assertTrue(f["needsYou"])
        self.assertIn("approval", f["activity"])

    def test_design_with_spec_only(self):
        f = self.feature({"spec.md": "# Feature Specification: Value chart\n", "mockup.md": "Approved: 2026-10-01\n"})
        self.assertEqual(f["stage"], "Design")
        self.assertFalse(f["needsYou"])
        self.assertEqual(f["name"], "Value chart")

    def test_build_uses_tasks_and_ledger(self):
        f = self.feature({"spec.md": "# X\n", "tasks.md": "- [x] a\n- [ ] b\n"}, ledger="Task 2: fix round 1")
        self.assertEqual(f["stage"], "Build")
        self.assertEqual(f["tasks"], {"done": 1, "total": 2})
        self.assertEqual(f["activity"], "Task 2: fix round 1")

    def test_review_round_in_progress(self):
        f = self.feature({
            "tasks.md": "- [x] a\n",
            "reviews/round-1/review-code.md": "VERDICT: CHANGES\n",
            "reviews/round-1/review-ux.md": "VERDICT: PASS\n",
            "reviews/round-1/fixes.md": "Starting commit: abc\n",
            "reviews/round-2/review-code.md": "VERDICT: PASS\n",
            "reviews/round-2/review-ui.md": "VERDICT: SKIPPED\n",
        })
        self.assertEqual(f["stage"], "Review")
        self.assertEqual(f["round"], 2)
        self.assertEqual(f["verdicts"], {"code": "PASS", "security": "pending", "ui": "SKIPPED", "ux": "pending"})
        self.assertEqual([r["n"] for r in f["rounds"]], [1, 2])
        self.assertEqual(f["rounds"][0]["verdicts"]["code"], "CHANGES")
        self.assertTrue(f["rounds"][0]["fixes"])
        self.assertIn("2 of 4", f["activity"])

    def test_round_10_sorts_after_round_2(self):
        files = {f"reviews/round-{n}/review-code.md": "VERDICT: PASS\n" for n in (1, 2, 10)}
        self.assertEqual(self.feature(files)["round"], 10)

    def test_escalated_decision_needs_owner(self):
        f = self.feature({
            "reviews/round-1/review-code.md": "VERDICT: PASS\n",
            "decision.md": "ESCALATE\n\n## Why\nAdds a dependency.\n",
        })
        self.assertEqual(f["stage"], "Decision")
        self.assertTrue(f["needsYou"])
        self.assertEqual(f["decision"]["verdict"], "ESCALATE")

    def test_approved_decision_does_not_need_owner(self):
        f = self.feature({"decision.md": "APPROVE\n\n## Why\nAll good.\n"})
        self.assertEqual(f["stage"], "Decision")
        self.assertFalse(f["needsYou"])

    def test_merged_overrides_everything(self):
        f = self.feature({"decision.md": "ESCALATE\n"}, merged=True)
        self.assertEqual(f["stage"], "Merged")
        self.assertFalse(f["needsYou"])

    def test_missing_feature_folder(self):
        f = self.feature({})
        self.assertEqual(f["stage"], "Design")
        self.assertIn("No specs/", f["activity"])


def git(cwd, *args):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr)
    return r.stdout


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


@unittest.skipUnless(shutil.which("git"), "git not installed")
class RepoTest(unittest.TestCase):
    """End to end: a real repo with a merged feature, a branch, and a worktree."""

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        r = self.repo = os.path.join(self.tmp, "app")
        os.makedirs(r)
        git(r, "init", "-q", "-b", "master")
        git(r, "config", "user.email", "t@example.com")
        git(r, "config", "user.name", "t")
        git(r, "config", "core.autocrlf", "false")
        write(os.path.join(r, ".gitignore"), ".worktrees/\n.superpowers/\n")
        write(os.path.join(r, ".claude/agents/reviewer-code.md"), "---\nname: reviewer-code\nmodel: sonnet\n---\n")
        write(os.path.join(r, ".claude/agents/reviewer-security.md"), "---\nname: reviewer-security\nmodel: opus\n---\n")
        write(os.path.join(r, ".claude/agents/fixer.md"), "---\nname: fixer\n---\n")
        write(os.path.join(r, "specs/001-done/spec.md"), "# Feature Specification: Done thing\n")
        write(os.path.join(r, "specs/001-done/decision.md"), "APPROVE\n")
        git(r, "add", "-A")
        git(r, "commit", "-q", "-m", "init")

        # A branch with no worktree, in review.
        git(r, "checkout", "-q", "-b", "002-branch-only")
        write(os.path.join(r, "specs/002-branch-only/tasks.md"), "- [x] a\n")
        write(os.path.join(r, "specs/002-branch-only/reviews/round-1/review-code.md"), "VERDICT: CHANGES\n")
        git(r, "add", "-A")
        git(r, "commit", "-q", "-m", "002")
        git(r, "checkout", "-q", "master")

        # A worktree in build, with uncommitted tasks progress and a ledger.
        wt = self.wt = os.path.join(r, ".worktrees", "003-in-tree")
        git(r, "worktree", "add", "-q", wt, "-b", "003-in-tree", "master")
        write(os.path.join(wt, "specs/003-in-tree/spec.md"), "# Feature Specification: In tree\n")
        write(os.path.join(wt, "specs/003-in-tree/tasks.md"), "- [x] a\n- [x] b\n- [ ] c\n")
        write(os.path.join(wt, ".superpowers/sdd/plan/progress.md"), "# ledger\nTask 3: in progress\n")

        # A worktree just created, with no spec folder yet.
        git(r, "worktree", "add", "-q", os.path.join(r, ".worktrees", "004-new"), "-b", "004-new", "master")

        # 005 was squash-merged: its specs are on master, but the branch is not an ancestor.
        git(r, "checkout", "-q", "-b", "005-squashed")
        write(os.path.join(r, "specs/005-squashed/decision.md"), "APPROVE\n")
        git(r, "add", "-A")
        git(r, "commit", "-q", "-m", "005 on branch")
        git(r, "checkout", "-q", "master")
        write(os.path.join(r, "specs/005-squashed/decision.md"), "APPROVE\n")
        git(r, "add", "-A")
        git(r, "commit", "-q", "-m", "005 squashed")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_squash_merged_branch_counts_as_merged_once_its_pr_is_merged(self):
        by_id = {f["id"]: f for f in d.collect_state(self.repo, ci={})["features"]}
        self.assertEqual(by_id["005-squashed"]["stage"], "Decision")  # PR state unknown yet
        merged = {"005-squashed": {"state": "merged", "label": "merged"}}
        by_id = {f["id"]: f for f in d.collect_state(self.repo, ci=merged)["features"]}
        self.assertEqual(by_id["005-squashed"]["stage"], "Merged")

    def test_merged_worktree_counts_as_merged(self):
        merged = {"003-in-tree": {"state": "merged", "label": "merged"}}
        write(os.path.join(self.repo, "specs/003-in-tree/spec.md"), "# Feature Specification: In tree\n")
        git(self.repo, "add", "-A")
        git(self.repo, "commit", "-q", "-m", "003 squashed")
        by_id = {f["id"]: f for f in d.collect_state(self.repo, ci=merged)["features"]}
        self.assertEqual(by_id["003-in-tree"]["stage"], "Merged")

    def test_big_mockup_folder_does_not_hide_reviews(self):
        folder = os.path.join(self.wt, "specs/003-in-tree")
        for i in range(d.MAX_FILES + 5):
            write(os.path.join(folder, f"mockup/f{i:03}.html"), "x")
        write(os.path.join(folder, "reviews/round-1/review-code.md"), "VERDICT: PASS\n")
        by_id = {f["id"]: f for f in d.collect_state(self.repo, ci={})["features"]}
        self.assertEqual(by_id["003-in-tree"]["stage"], "Review")
        self.assertLessEqual(len(by_id["003-in-tree"]["files"]), d.MAX_FILES)

    def test_collect_state(self):
        state = d.collect_state(self.repo, ci={})
        self.assertEqual(state["base"], "master")
        self.assertEqual([p["lens"] for p in state["panel"]], ["code", "security"])
        by_id = {f["id"]: f for f in state["features"]}
        self.assertEqual(sorted(by_id), ["001-done", "002-branch-only", "003-in-tree", "004-new", "005-squashed"])

        self.assertEqual(by_id["001-done"]["stage"], "Merged")
        self.assertEqual(by_id["001-done"]["name"], "Done thing")

        b = by_id["002-branch-only"]
        self.assertEqual(b["stage"], "Review")
        self.assertIsNone(b["worktree"])
        self.assertEqual(b["verdicts"], {"code": "CHANGES", "security": "pending"})

        t = by_id["003-in-tree"]
        self.assertEqual(t["stage"], "Build")
        self.assertEqual(t["tasks"], {"done": 2, "total": 3})
        self.assertEqual(t["activity"], "Task 3: in progress")
        self.assertTrue(t["worktree"].replace("\\", "/").endswith(".worktrees/003-in-tree"))

        self.assertEqual(by_id["004-new"]["stage"], "Design")

    def test_read_file_only_inside_feature(self):
        state = d.collect_state(self.repo, ci={})
        self.assertEqual(d.read_feature_file(self.repo, state, "003-in-tree", "tasks.md"), "- [x] a\n- [x] b\n- [ ] c\n")
        self.assertEqual(d.read_feature_file(self.repo, state, "002-branch-only", "reviews/round-1/review-code.md"),
                         "VERDICT: CHANGES\n")
        self.assertIsNone(d.read_feature_file(self.repo, state, "003-in-tree", "../../.gitignore"))
        self.assertIsNone(d.read_feature_file(self.repo, state, "nope", "tasks.md"))

    def test_works_from_inside_a_worktree(self):
        state = d.collect_state(self.wt, ci={})
        self.assertEqual(len(state["features"]), 5)


class HostCheckTest(unittest.TestCase):
    def test_only_local_hosts_are_allowed(self):
        self.assertTrue(d.host_allowed("127.0.0.1:4317", 4317))
        self.assertTrue(d.host_allowed("localhost:4317", 4317))
        self.assertFalse(d.host_allowed("evil.example:4317", 4317))
        self.assertFalse(d.host_allowed("127.0.0.1:9999", 4317))
        self.assertFalse(d.host_allowed(None, 4317))


if __name__ == "__main__":
    unittest.main()
