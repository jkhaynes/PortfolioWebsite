ESCALATE

## Why

The hero itself looks ready: every acceptance scenario has a passing test, all four round 1 reviews are `VERDICT: PASS`, all 16 tasks are checked off, the branch merges cleanly into `main`, and lint, build and the full Playwright suite pass (587 passed, 13 skipped). But `./scripts/check.sh` fails at its first step, format. Two committed review files, `reviews/round-1/review-ui.md` and `review-ux.md`, are not Prettier-formatted (each needs a blank line after its headings), so CI on this branch will go red. A branch whose check fails is not done, so I can't approve it.

## Acceptance scenarios

1. US1-1 (desktop shows greeting, role line, tagline, bio, both actions, contact links, four numbers): met. Covered by `hero.spec.ts` "hero copy and actions" and the 1280x800 layout tests, which pass.
2. US1-2 (impact numbers reach the same evidence): met. Covered by the `impact-navigation` specs and the hero impact link tests, which pass.
3. US1-3 (View Featured Work reaches Featured Projects): met. "View Featured Work jumps to the projects heading" passes.
4. US1-4 (Download Resume opens the PDF): met. "Download Resume opens the PDF in a new tab" passes.
5. US1-5 (no separate Impact section, Featured Projects comes next): met. "the separate impact section is gone and projects follows the hero" passes, and `page.tsx` drops the section.
6. US1-6 (phone: one column, full-width stacked actions, 2x2 numbers): met. The "phone 390x844" tests pass in all three themes.
7. US2-1 (the toggle restyles the hero): met. `theme-toggle.spec.ts` and the hero styling tests pass in Chromium, Firefox and WebKit.
8. US2-2 (no portrait in any theme): met. The "no arch portrait" and "no Sylveon portrait card" tests pass, and both components are deleted.
9. US2-3 (AA contrast, including gradient text): met. The pixel-sampling contrast test (Chromium only) and axe pass. The margins are tight (4.53 and 4.69).
10. US3-1 to US3-3 (Pokémon badge above the h1, opens the game, focus returns, not in Light or Dark): met. The "hero game badge" tests and `ribbon-roundup.spec.ts` pass.
11. US4-1 (follows the mouse with a trail): met. "follows the mouse over the hero" passes.
12. US4-2 (rests within 5 seconds of load): met. I spot-checked this one, the progress log's SC-005 claim. I read the test at `hero.spec.ts:940`: it logs the fairy's state changes, asserts intro to resting takes 5000 ms or less, and asserts the fairy doesn't move afterwards. I ran it, and it passes in Chromium, Firefox and WebKit.
13. US4-3 (settles after the pointer stops or leaves): met. The mouse-stop and mouse-leave tests pass, though their polls allow up to 5.5 s.
14. US4-4 and US4-5 (reduced motion and touch: the fairy rests still): met. Both tests pass. The touch test is skipped in Firefox, by a ruling recorded in the progress log.
15. US4-6 (clicks pass through the fairy): met. The "never covers a hero link or button (SC-006)" tests pass, and the canvas has `pointer-events: none`.
16. US4-7 (pauses off screen): met. "pauses while the hero is off screen" passes.
17. US4-8 (hidden from assistive tech): met. The canvas has `aria-hidden="true"`, and a test asserts it.
18. FR-026 and SC-009 (the hero fills the first screen): met. The "hero fills the first screen" tests pass at 1280x800, 1440x1000 and 1920x1080 in every theme.

## For the owner

1. **Needed before merge:** run `npx prettier --write specs/024-hero-redesign/reviews/round-1/review-ui.md specs/024-hero-redesign/reviews/round-1/review-ux.md` in the worktree, commit, and confirm `./scripts/check.sh` is green. Prettier only adds blank lines after headings. Consider adding `specs/*/reviews/` to `.prettierignore`, or having the reviewer agents write formatted files, so later panels don't hit this again. That is a workflow change, so it's your call. (The untracked `.playwright-mcp/` folder also fails the format check locally, but CI never sees it. Delete it or add it to `.gitignore`.)
2. **Worth a look, not blocking:**
   - The UX reviewer saw the resting butterfly touch the last letter of "Jessica" at 375px in Light. The spec's edge case says the fairy must not cover text. The test's 24px clearance box is smaller than the fairy's real drawing. See `review-ux.md` and `hero.spec.ts` `clearOf`.
   - Pokémon desktop top padding is 30px where the mockup has 92px, so that everything fits at 1280x800 (SC-001). Light glow is 14% where the mockup has 16%, to keep contrast. These deviations are recorded only in `.superpowers/sdd/tasks/progress.md`, not in spec.md or plan.md. List them in the PR description, as T013 says.
   - `playwright.config.ts` now takes `E2E_PORT` and runs `npx next start -p <port>` in place of `npm run start`. CI uses this file, but its default behavior there is unchanged (port 3010).
