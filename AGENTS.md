# AGENTS.md

Instructions for AI coding agents other than Claude Code (Copilot, Codex, Cursor, etc.).

The canonical agent instructions for this repo live in **`CLAUDE.md`**. Read it first and follow it. The workflow, commands, conventions and doc map there apply to every agent.

Notes for non-Claude agents:

- The Superpowers skills referenced in CLAUDE.md may not be installed in your harness. If not, follow the same discipline by hand: work in the feature's worktree (`docs/worktrees.md`), write the failing test first, implement one task at a time from `specs/NNN-*/tasks.md`, and review against the spec before moving on.
- Spec Kit skills are installed for Claude Code under `.claude/skills/`. To add Spec Kit commands for another agent, run `specify integration install <agent>` (see `specify integration list`).
- Claude Code's hooks (the merge gate and format-on-edit) don't run for you. Do their jobs by hand:
  - Run `./scripts/check.sh` (or `./scripts/check.ps1`) and see it pass before saying work is done.
  - Never push to `main` directly. Open a PR and merge only once `gh pr checks` is green.
- Review against `REVIEW.md`: what to always check, what not to flag, the severity levels and the review loop limits. Fix each finding or answer it in the PR's "Review findings not fixed".
- The review panel (`/review-panel` and `.claude/agents/`) is Claude Code only. Without it, review the branch once per lens (security, code, UX, UI) against `REVIEW.md` before opening the PR, and write the result to `specs/NNN-*/reviews/round-N/review-<lens>.md` with the same `VERDICT:` first line, so the dashboard still shows it.
