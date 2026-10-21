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
2. Done (owner decision 2026-10-20): no Pokémon ribbon fairy below 360px; Light and Dark keep the butterfly.
3. Playwright runs in worktrees use `E2E_PORT` (see `docs/worktrees.md`). Firefox runs at most 3 workers (Playwright's Firefox hangs a call under heavier parallel load).
4. Follow-up: Playwright runs load the real Umami Cloud script, so test runs send pageviews to the live analytics. Block or stub it in tests.
5. Follow-up: one Chromium theme-toggle stall was seen once under full load during 024 (not reproduced).
6. Run `/speckit-constitution` once to review and ratify the starter constitution.

## Blockers / Open Questions

- None.

## Escaped bugs

<!-- Bugs that reached main. Each gets a regression test (red first) and, if a reviewer should have caught it, a line in REVIEW.md's Learned review rules. -->

- 2026-10-21, View Featured Work lost focus: about a second after the click, focus left `#projects-heading` and the URL became `#projects`. Cause: Umami's tracker cancels clicks on links with `data-umami-event` and follows the link itself after its beacon. Fixed in 024 (705ce0d): scroll-and-focus buttons report through `umami.track` instead; regression test in `tests/e2e/hero.spec.ts` (red first). Not a reviewer miss: it only shows with the live Umami script loaded.

## Notes for Next Session

- Multi-route specs (`media-dialog`, `theme-toggle`, `accessibility` reflow) time out against `npm run dev` under full parallel load, which is why `scripts/check` tests the production build with a quarter of the cores.
- `next dev` and `next build` rewrite `next-env.d.ts` (`.next/dev/types` vs `.next/types`). Don't commit that flip.
