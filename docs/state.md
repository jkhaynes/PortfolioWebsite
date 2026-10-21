# Project State

<!-- Session-to-session memory. Claude updates this at the end of each working session. Keep it short: replace old content instead of appending forever. The exception is Escaped bugs, a running log. -->

**Last updated:** 2026-10-20

## Current Focus

Feature 024, the homepage hero redesign, is built on branch `024-hero-redesign` and in review (review panel and PR next).

## Recently Done

- Feature 24 (built, in review): new hero with the impact links folded in, a decorative fairy canvas, and the Pokémon-only "Take a play break" badge; the Sylveon portrait is gone.
- Feature 21: RoleSync case study (renamed from Loot Membership; the old URL redirects).
- Feature 22: pricewatch case study, including its MCP server.
- Feature 23: Job Hunt Pipeline case study.
- Repo-wide Prettier pass so `format:check` can gate CI.
- Project-template workflow merged (PR #43).

## Next Up

1. Run `/review-panel` on 024, open the PR, wait for green checks, merge.
2. Owner: confirm the fairy at 320px wide (it is drawn at 65% and sits tight to the right edge).
3. Pre-existing bug, not from 024: after clicking View Featured Work, `#projects-heading` loses focus about a second later and the URL becomes `#projects` despite `preventDefault`.
4. Playwright runs in worktrees use `E2E_PORT` (see `docs/worktrees.md`).
5. Run `/speckit-constitution` once to review and ratify the starter constitution.

## Blockers / Open Questions

- None.

## Escaped bugs

<!-- Bugs that reached main. Each gets a regression test (red first) and, if a reviewer should have caught it, a line in REVIEW.md's Learned review rules. -->

## Notes for Next Session

- Multi-route specs (`media-dialog`, `theme-toggle`, `accessibility` reflow) time out against `npm run dev` under full parallel load, which is why `scripts/check` tests the production build with a quarter of the cores.
- `next dev` and `next build` rewrite `next-env.d.ts` (`.next/dev/types` vs `.next/types`). Don't commit that flip.
