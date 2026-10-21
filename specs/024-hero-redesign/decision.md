ESCALATE

## Why

The round 1 blocker is fixed. The format check now passes, all four round 2 reviews are `VERDICT: PASS` with no real problem in their Notes, all 16 tasks are checked off, and `git merge-tree --write-tree main HEAD` reports no conflicts. But `./scripts/check.sh` failed when I ran it (597 passed, 1 failed, 14 skipped), and a targeted rerun turned up a second Firefox failure, in a test added this round. The branch also changes test and format tooling that CI runs, and round 1 left that for the owner to decide. I found no record that the owner did.

## Acceptance scenarios

1. US1-1 (desktop shows the greeting, role line, tagline, bio, both actions, contact links and four numbers): met. `hero.spec.ts` "hero copy and actions" and the 1280x800 layout tests pass.
2. US1-2 (impact numbers reach the same evidence): met. The `impact-navigation` specs and the hero impact link tests pass. "impact links hide the category visibly but keep it in the name" failed once in Firefox during the full check, with "Tearing down context exceeded the test timeout". It passed all 9 Firefox runs in my rerun.
3. US1-3 (View Featured Work reaches Featured Projects): met. Its test passes, and the SC-006 test also clicks it with the fairy on top.
4. US1-4 (Download Resume opens the PDF): met. Its test passes.
5. US1-5 (no Impact section, Featured Projects comes next): met. Its test passes.
6. US1-6 (phone: one column, stacked full-width actions, 2x2 numbers): met. The phone 390x844 tests pass in all three themes.
7. US2-1 (the toggle restyles the hero): met. `theme-toggle.spec.ts` passes in Chromium, Firefox and WebKit.
8. US2-2 (no portrait): met. The tests pass, and both portrait components are deleted.
9. US2-3 (AA contrast, including gradient text): met. The pixel contrast test (Chromium only) and axe pass. The margins are tight (4.53 and 4.69).
10. US3-1 to US3-3 (Pokémon badge above the h1, opens the game, focus returns, not in Light or Dark): met. The badge tests and `ribbon-roundup.spec.ts` pass.
11. US4-1 (follows the mouse with a trail): met. Its test passes.
12. US4-2 (rests within 5 seconds of load): met on Chromium and WebKit, flaky on Firefox. In my rerun, one of three Firefox runs of the new "rests clear of all text at 375px, dark" test was still in `intro` after its 5.5 s poll. That is either a test that is too tight under parallel load or a real miss of SC-005 on a slow Firefox.
13. US4-3 (settles after the pointer stops or leaves): met. Its tests pass.
14. US4-4 and US4-5 (reduced motion and touch: the fairy rests still): met. The touch test is skipped in Firefox, by a ruling in the progress log.
15. US4-6 (clicks pass through the fairy): met. This is my spot-check of the progress log's SC-006 claim. I read `hero.spec.ts:1230`: it moves the mouse to every visible hero link and button, asserts `elementFromPoint` is never the canvas, then clicks View Featured Work with the fairy over it. I ran it 3 times each in Light and Pokémon on Chromium, Firefox and WebKit, and it passed all 18 runs.
16. US4-7 (pauses off screen): met. Its test passes.
17. US4-8 (hidden from assistive tech): met. The canvas has `aria-hidden="true"`, and a test asserts it.
18. FR-026 and SC-009 (the hero fills the first screen): met. The tests pass at 1280x800, 1440x1000 and 1920x1080 in every theme.
19. Round 1 UX note (the fairy touched "Jessica" at 375px): fixed. `clearOf` now uses the real drawn extent (`EXTENT` times `data-fairy-scale`), and the new 375px tests pass whenever the fairy reaches rest in time.

## For the owner

1. **Make `./scripts/check.sh` green and stable.** Locally it is red. CI sets `retries: 1`, so CI may still pass by retrying, but a retry only hides the flake. Look at `tests/e2e/hero.spec.ts:1132` ("rests clear of all text at 375px"). Under load in Firefox the fairy can still be in `intro` after 5.5 s. Decide whether that is a test timing problem (for example, wait with the same allowance the SC-005 test at about line 940 uses) or an SC-005 bug in `src/components/HeroFairy.tsx` and `src/lib/hero-fairy.ts`. Also look at the Firefox context-teardown timeout at `hero.spec.ts:272`. Then run the full check twice in a row.
2. **Confirm the tooling changes CI runs.** Round 1 left the first one for you to decide.
   - `.prettierignore` now skips `specs/*/reviews/` (and the git-ignored `.superpowers/`), so the format check no longer covers review output. This is a workflow change, and `docs/ai-workflow.html` wasn't updated (CLAUDE.md asks for that when the workflow changes).
   - `playwright.config.ts`: the test server is now `npx next start -p $E2E_PORT` in place of `npm run start`, and Firefox and WebKit now also run `hero.spec.ts`. The default port stays 3010.
3. **Mockup deviation (judgement call).** At desktop width in Pokémon, the hero's top padding is 30px; the mockup has 92px. This keeps the badge and the numbers inside 1280x800 (SC-001). Light's glow is 14% where the mockup has 16%, to keep contrast. The reasons are recorded only in `.superpowers/sdd/tasks/progress.md`, not in `spec.md` or `plan.md`. Either accept them and list them in the PR description, or record them in `specs/024-hero-redesign/mockup.md`.
