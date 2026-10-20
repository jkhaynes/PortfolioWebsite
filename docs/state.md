# Project State

<!-- Session-to-session memory. Claude updates this at the end of each working session. Keep it short: replace old content instead of appending forever. The exception is Escaped bugs, a running log. -->

**Last updated:** 2026-10-20

## Current Focus

Moving the site onto the project-template workflow (branch `chore/template-workflow`): Spec Kit, Superpowers in per-feature worktrees, the review panel, CI running `scripts/check.sh`, the merge gate and the dashboard.

## Recently Done

- Feature 21: RoleSync case study (renamed from Loot Membership; the old URL redirects).
- Feature 22: pricewatch case study, including its MCP server.
- Feature 23: Job Hunt Pipeline case study.
- Repo-wide Prettier pass so `format:check` can gate CI.

## Next Up

1. Merge the workflow PR, then run `/speckit-constitution` once to review and ratify the starter constitution.
2. The owner's next site changes: each one a feature (024 onward) in its own worktree, or a small change on its own branch.

## Blockers / Open Questions

- Open questions from the PRD (section 17): analytics provider.

## Escaped bugs

<!-- Bugs that reached main. Each gets a regression test (red first) and, if a reviewer should have caught it, a line in REVIEW.md's Learned review rules. -->

## Notes for Next Session

- `tests/e2e/media-dialog.spec.ts` "media layouts avoid page overflow" visits six routes and can time out on a cold dev server under full parallel load; it passes alone. CI retries it.
- `next dev` and `next build` rewrite `next-env.d.ts` (`.next/dev/types` vs `.next/types`). Don't commit that flip.
