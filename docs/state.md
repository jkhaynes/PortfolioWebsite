# Project State

<!-- Session-to-session memory. Claude updates this at the end of each working session. Keep it short: replace old content instead of appending forever. The exception is Escaped bugs, a running log. -->

**Last updated:** 2026-10-20

## Current Focus

The site runs on the project-template workflow (PR #43, merged): Spec Kit, Superpowers in per-feature worktrees, the review panel, CI running `scripts/check.sh`, the merge gate and the dashboard. Next feature number: 024.

## Recently Done

- Feature 21: RoleSync case study (renamed from Loot Membership; the old URL redirects).
- Feature 22: pricewatch case study, including its MCP server.
- Feature 23: Job Hunt Pipeline case study.
- Repo-wide Prettier pass so `format:check` can gate CI.
- Project-template workflow merged (PR #43).
- PRD open questions closed: analytics is Umami Cloud, the OG image comes from `src/app/opengraph-image.tsx`.

## Next Up

1. Run `/speckit-constitution` once to review and ratify the starter constitution.
2. The owner's next site changes: each one a feature (024 onward) in its own worktree, or a small change on its own branch.

## Blockers / Open Questions

- None.

## Escaped bugs

<!-- Bugs that reached main. Each gets a regression test (red first) and, if a reviewer should have caught it, a line in REVIEW.md's Learned review rules. -->

## Notes for Next Session

- Multi-route specs (`media-dialog`, `theme-toggle`, `accessibility` reflow) time out against `npm run dev` under full parallel load, which is why `scripts/check` tests the production build with a quarter of the cores.
- `next dev` and `next build` rewrite `next-env.d.ts` (`.next/dev/types` vs `.next/types`). Don't commit that flip.
