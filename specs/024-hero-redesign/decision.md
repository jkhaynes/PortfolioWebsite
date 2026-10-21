APPROVE

## Why

Everything the round 2 escalation asked for is now done. The owner signed off the tooling and mockup changes. `mockup.md` records the mockup differences and the progress log records the owner's decisions of 2026-10-20 and 2026-10-21. The Firefox rest test now checks the 5 second rule on the page's own clock. All four round 3 reviews are `VERDICT: PASS` with no real problem in their Notes. All 16 tasks are checked off. I ran `./scripts/check.sh` and it passed: 602 passed, 14 skipped, no retries. `git merge-tree --write-tree main HEAD` reports no conflicts. The branch adds no dependency and doesn't touch `.github/`, `.claude/`, `scripts/`, `package.json` or the Next config.

## Acceptance scenarios

1. US1-1 (desktop shows the greeting, role line, tagline, bio, both actions, contact links and four numbers): met. The "hero copy and actions" tests and the 1280x800 layout tests in `tests/e2e/hero.spec.ts` pass.
2. US1-2 (each impact number reaches the same evidence): met. The `impact-navigation` specs and the hero impact link tests pass.
3. US1-3 (View Featured Work reaches Featured Projects): met. `hero.spec.ts:51` passes. `hero.spec.ts:108` also shows that the projects heading keeps focus after the Umami fix.
4. US1-4 (Download Resume opens the PDF): met. `hero.spec.ts:60` passes.
5. US1-5 (no Impact section, Featured Projects comes next): met. `hero.spec.ts:98` passes.
6. US1-6 (phone: one column, stacked full-width actions, 2x2 numbers): met. The phone 390x844 tests pass in all three themes.
7. US2-1 (the toggle restyles the hero): met. `theme-toggle.spec.ts` passes in Chromium, Firefox and WebKit.
8. US2-2 (no portrait in any theme): met. The no-portrait and no-Sylveon-card tests pass, and both portrait components are deleted.
9. US2-3 (AA contrast, including gradient text): met. The pixel contrast test and axe pass. Light's glow is 14% to keep contrast, an owner-approved difference recorded in `mockup.md`.
10. US3-1 to US3-3 (Pokémon badge above the h1, opens the game, focus returns, not shown in Light or Dark): met. The "hero game badge" tests and `ribbon-roundup.spec.ts` pass.
11. US4-1 (follows the mouse with a trail): met. Its test passes.
12. US4-2 (rests within 5 seconds of load): met. This is my spot-check of the progress log's claim that the fairy rests 4.49 to 4.56 s after its intro starts, measured on the page's clock. I read `expectRestsInTime` (`hero.spec.ts:921`). It records each state change in the page with `performance.now()`, waits up to 20 s for a rest, then asserts that the rest came no more than 5000 ms after the intro, measured on the page's clock. `INTRO_MS` is 4500 in `src/lib/hero-fairy.ts`. I ran the SC-005 test and the three "rests clear of all text at 375px" tests 3 times each in Chromium, Firefox and WebKit: 36 of 36 passed with no retries. The 375px Firefox case was the one that failed in round 2.
13. US4-3 (settles after the pointer stops or leaves): met. `expectRestsAfterPointer` checks this on the page's clock, and the tests pass.
14. US4-4 and US4-5 (reduced motion and touch: the fairy rests still): met. The touch test is skipped in Firefox by a ruling in the progress log.
15. US4-6 (clicks pass through the fairy): met. `hero.spec.ts:1319` passes in all themes and browsers.
16. US4-7 (pauses off screen): met. `hero.spec.ts:1303` passes.
17. US4-8 (hidden from assistive tech): met. The canvas is `aria-hidden="true"` with `pointer-events: none`, and a test asserts both.
18. FR-026 and SC-009 (the hero fills the first screen): met. The tests pass at 1280x800, 1440x1000 and 1920x1080 in every theme.

## For the owner

Nothing blocks this. Put these in the PR description:

- The PR includes a fix for a bug already on main. `src/components/Button.tsx` now reports View Featured Work through `umami.track`, because Umami's own follow-up jump was taking focus off the projects heading. You chose to keep it in this PR, and the bug is logged in `docs/state.md`.
- Tooling you signed off: `E2E_PORT`, the hero tests now running in Firefox and WebKit too, Firefox capped at 3 workers, and Prettier skipping `specs/*/reviews/` and `.superpowers/`.
- Follow-ups noted by reviewers, none blocking:
  - Test runs send pageviews to the real Umami Cloud.
  - The WebKit resize test fails now and then; it did that before this branch.
  - Shipped code carries test-only `data-fairy-*` attributes.
  - The contrast margins are tight (4.53 and 4.69).
