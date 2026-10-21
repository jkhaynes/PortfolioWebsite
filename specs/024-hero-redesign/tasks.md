---
description: "Task list for 024 Hero Redesign"
---

# Tasks: Hero Redesign

**Input**: Design documents from `specs/024-hero-redesign/` (spec.md, plan.md, research.md, data-model.md, contracts/hero-ui.md, quickstart.md, mockup.md)

**Tests**: Required. The constitution (II) is test-first, so every task writes its failing Playwright test first, sees it fail, then implements (red, green, refactor). Tests follow `docs/testing.md`, and each acceptance scenario in spec.md maps to at least one test.

**Organization**: One phase per user story, in priority order. Each task is one reviewable commit that leaves `./scripts/check.sh` green. When a task passes review, tick it here (`- [x]`) in that task's commit.

**Visual reference**: The approved canvas copy is in `specs/024-hero-redesign/mockup/` (`Main.dc.html` holds the hero markup, sizes, colors and the fairy drawing code). Match it.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: US1 to US4 from spec.md

---

## Phase 1: Setup

- [x] T001 Confirm a green baseline in the worktree root:
  - Run `npm ci` and `npx playwright install`, then `./scripts/check.sh`, and record the result.
  - Read the guides in `node_modules/next/dist/docs/` on server and client components and `next/image` (CLAUDE.md requires it). Add any breaking change that affects this plan to research.md R10.
  - Never commit `next-env.d.ts` changes.

---

## Phase 2: Foundational (blocks the user stories)

- [x] T002 [P] Move the four impact metrics from the `stats` array in `src/app/page.tsx` into `src/data/impact.ts`.
  - Export `impactMetrics` with the same `value`, `label`, `category` and `href` fields and the same order (data-model.md).
  - Import it in `page.tsx`. Behavior must not change: `tests/e2e/impact-navigation.spec.ts` stays green unchanged.
- [x] T003 [P] Write the fairy state machine test-first, in `tests/e2e/hero-fairy-model.spec.ts` (pure, no page, like `tests/e2e/ribbon-model.spec.ts`), then implement it in `src/lib/hero-fairy.ts`.
  - **Exports**:
    - Types `FairyState = "intro" | "following" | "settling" | "resting" | "paused"` and `FairyKind = "butterfly" | "ribbon"`.
    - Constants `INTRO_MS = 4500`, `IDLE_MS = 1500`, `SETTLE_MS = 1500` and `TRAIL_MS = 1100`.
    - `createFairy({ now, rest, still })`.
    - A pure `stepFairy(fairy, input)` that returns the next fairy. `input` is `{ now, pointer, pointerInside, lastPointerMove, visible, rest, still }`, and the result carries `state`, `x`, `y`, `stateSince`, `trail`.
    - `isAnimating(state)`.
  - **Tests (one per rule in data-model.md)**:
    - When `still` is set, the state is always `resting` at `rest`, with an empty trail.
    - `intro` becomes `resting` by `INTRO_MS + SETTLE_MS` and never later than 5000 ms without a pointer.
    - A pointer move gives `following`. `IDLE_MS` after the last move, or on `pointerInside: false`, the state becomes `settling`; it reaches `resting` at `rest` within `SETTLE_MS`.
    - When `visible` is false, the state is `paused` from any state; when visible again, it becomes `resting`.
    - Trail sparkles expire after `TRAIL_MS`, and the trail is empty in `resting`.
    - `isAnimating` is true only for `intro`, `following` and `settling`.
  - Port the easing and trail rules from the mockup's `frame()` in `specs/024-hero-redesign/mockup/Main.dc.html`.

**Checkpoint**: The data has moved and the model is green. The user stories can start.

---

## Phase 3: User Story 1 - A recruiter sees who Jessica is and proof of her work in one screen (Priority: P1) 🎯 MVP

**Goal**: The centered hero with greeting, role, tagline, bio, actions, contact links and the four impact numbers. The Impact section is gone.

**Independent Test**: Load `/` at 1280×800 and 390px in each theme. Every piece of hero content is present, every action and number goes where it should, and Featured Projects directly follows the hero.

- [x] T004 [US1] Build the hero copy and actions. Write the tests first in `tests/e2e/hero.spec.ts`:
  - **Tests** (US1 scenarios 1, 3 and 4; contract `contracts/hero-ui.md`):
    - Exactly one `h1`, matching `/Hi, I.m Jessica/`.
    - The role line, tagline and the new bio text, all inside `section.portfolio-hero`.
    - "View Featured Work" links to `#projects` and focuses `#projects-heading`.
    - "Download Resume" links to `/Jessica_Haynes_Resume.pdf` with `target="_blank"`.
    - Email, GitHub and LinkedIn have today's hrefs.
    - The copy is centered: the `h1` center is within 2px of the hero's center at 1280px.
  - **Implement**:
    - Create the server component `src/components/Hero.tsx` and render it from `src/app/page.tsx` in place of the old hero markup.
    - Drop `<HeroPortrait />` from the page.
    - Keep `<SylveonPortrait />` rendered for now, below the contact links, so the game stays reachable until T009.
    - Reuse `Button` and `TextLink` with the same `trackEvent` and `scrollFocusTargetId` props.
    - In `src/app/globals.css`, make `.portfolio-hero` a single centered column (max width about 54ch for the bio, 26ch for the tagline, as in the mockup).
  - **No-JavaScript test** (FR-025): in a context with `javaScriptEnabled: false`, the `h1`, the role line, both actions, the contact links and (after T005) the four impact links still render with correct hrefs.
  - **Tests to update**: In `tests/e2e/hero-portrait.spec.ts`, delete the Light and Dark portrait tests; the Pokémon Sylveon test stays until T009. Update `tests/e2e/accessibility.spec.ts` only if its outline test asserts the old `h1` text.
- [x] T005 [US1] Move the impact numbers into the hero. Write the tests first in `tests/e2e/hero.spec.ts`:
  - **Tests** (US1 scenarios 2 and 5; FR-006 to FR-008):
    - Four links named `/^Impact metric:/` are inside `section.portfolio-hero`, with the four hrefs from `src/data/impact.ts`.
    - Each shows its value, its label and "View evidence".
    - `#impact` has count 0.
    - The first section after the hero is `#projects`.
  - **Implement**:
    - Add a `variant?: "default" | "hero"` prop to `src/components/ImpactMetricLink.tsx`. The `hero` variant shows value, label and the "View evidence ↓" cue, hides the category visually, and keeps the same `aria-label`, click, scroll, focus and highlight code.
    - In `Hero.tsx`, render the existing `.motif-divider` and a grid of `impactMetrics` with `variant="hero"`.
    - Delete the `#impact` section from `src/app/page.tsx`.
    - Remove the `#impact` rules from `src/app/globals.css`, including the Pokémon ones.
  - **Tests to update**:
    - `tests/e2e/card-structure.spec.ts`: drop `#impact .grid` from the framed list, and make About and Contact align with each other instead of with the strip.
    - Check `tests/e2e/about-section.spec.ts` (its comment about numbers in "the hero and impact strip") and adjust the wording only.
  - `tests/e2e/impact-navigation.spec.ts` must pass unchanged.
- [x] T006 [US1] Get the layout right at phone and desktop widths. Write the tests first in `tests/e2e/hero.spec.ts`:
  - **Tests** (US1 scenario 6; SC-001, SC-002, FR-022, FR-023):
    - At 1280×800, in all three themes, the `h1`, both actions and all four impact links are in the viewport without scrolling.
    - At 390×844, the `h1`, role line, tagline and both actions are in the first viewport. The two actions are full width (within 1px of each other's width) and stacked. The impact links form 2 columns.
    - At 390×844, after scrolling down by one viewport height, all four impact links are in the viewport (SC-002).
    - At 320px, `document.documentElement.scrollWidth <= 320`.
    - Tabbing from "View Featured Work" reaches, in order: Download Resume, Email, GitHub, LinkedIn, then the four impact links. Each shows a visible focus outline.
    - The scroll cue is `aria-hidden="true"` and has no animation (`animation-name: none`).
  - **Implement**: Adjust the spacing, type sizes, the 4-to-2 column stats grid and the static scroll cue in `src/app/globals.css` to the mockup's desktop and phone boards.

**Checkpoint**: US1 is complete. The hero is usable and proves the work; this is the MVP.

---

## Phase 4: User Story 2 - The hero matches the chosen theme, and the theme toggle still works (Priority: P1)

**Goal**: Every theme styles the hero from its own tokens, there are no portraits, contrast is AA, and axe is clean.

**Independent Test**: Switch themes with the pill toggle. Check the gradient, glow, divider motif and axe results in each theme at both widths.

- [x] T007 [US2] Style the hero from each theme. Write the tests first in `tests/e2e/hero.spec.ts`:
  - **Tests** (US2 scenarios 1 and 3; FR-002, FR-005, FR-011, FR-012):
    - The `h1` and impact values have a computed `background-image` containing `linear-gradient` and the theme's two accent RGB values (Light #b8306f and #8f5f86; Dark #f4a7cb and #c9a0dc; Pokémon #ac365c and #914560).
    - The "View Featured Work" background is a gradient.
    - The hero's glow pseudo-element exists and has `pointer-events: none`.
    - The divider shows the sparkle mask in Light and Dark and the ribbon in Pokémon.
    - Under emulated `forcedColors: "active"`, the `h1` color is not transparent.
    - axe (wcag2a, wcag2aa, wcag21a, wcag21aa) finds zero violations on `/` in all three themes at 390px and 1280px.
  - **Implement** in `src/app/globals.css`:
    - Gradient text and the primary-button gradient, using `var(--color-accent)` and `var(--color-accent-secondary)`.
    - The radial glow as a `::before` on `.portfolio-hero`, using `color-mix` with the accents.
    - `@media (forced-colors: active)` fallbacks.
    - Add the gradient variant to `src/components/Button.tsx` only if CSS on a hero class cannot do it.
  - **Cross-browser**: add `hero` to the `testMatch` lists of the `firefox` and `webkit` projects in `playwright.config.ts` (so the pattern reads `(?:theme-toggle|ribbon-roundup|pokemon-polish|hero)\.spec\.ts`), and make every `hero.spec.ts` test pass in all three engines.
  - **Contrast note**: axe reports gradient text as "needs review", not as a violation; the reviewer confirms the hand-checked ratios in research.md R6.
  - **Tests to update**: `tests/e2e/theme-toggle.spec.ts` line ~199 asserts the Dark `h1` `color`. Change it to assert the gradient `background-image` with the Dark accent values.
- [x] T008 [US2] Remove the arch portrait. Write the tests first in `tests/e2e/hero.spec.ts`: `.hero-portrait` and the "Portrait of Jessica Haynes" image have count 0 in all themes (US2 scenario 2, FR-010).
  - **Implement**:
    - Delete `src/components/HeroPortrait.tsx`.
    - Delete its CSS (`.hero-portrait*`, and the `.hero-container` grid columns that held it) from `src/app/globals.css`.
    - Delete the rest of `tests/e2e/hero-portrait.spec.ts` except the Pokémon test, which T009 replaces.
  - Keep `public/images/jessica-haynes-portrait.webp` (research.md R9).

**Checkpoint**: US1 and US2 are complete in all three themes.

---

## Phase 5: User Story 3 - A Pokémon-theme visitor finds the game at the top of the hero (Priority: P2)

**Goal**: The "Take a play break" badge sits centered above the greeting in Pokémon only, and the Sylveon card is gone.

**Independent Test**: In Pokémon, open the game from the badge by mouse and by keyboard, then close it; focus returns to the badge. In Light and Dark there is no badge.

- [x] T009 [US3] Add the game badge and remove the Sylveon card. Write the tests first in `tests/e2e/hero.spec.ts`:
  - **Tests** (US3 scenarios 1 to 3; FR-013, FR-014, SC-007):
    - In Pokémon, a button named exactly "Take a play break" is visible inside `section.portfolio-hero`, comes before the `h1` in DOM order, and its center is within 2px of the `h1` center at 1280px and at 390px.
    - Clicking it, or pressing Enter on it, opens the dialog named "Ribbon Roundup"; Escape closes it and focus returns to the badge.
    - At 320px it does not overflow.
    - In Light and Dark it is not visible.
    - `.sylveon-portrait` has count 0 in all themes.
  - **Implement**:
    - Add `variant?: "default" | "badge"` to `src/components/RibbonRoundupLauncher.tsx`. The badge shows the ribbon bow image (`/images/pokemon/ribbon-pink.svg`, `alt=""`), the text "Take a play break", and `<span aria-hidden="true">· a Sylveon mini game</span>`. Its dialog and focus code are unchanged.
    - Render it in `Hero.tsx` inside `<div className="hero-game">` before the `h1`.
    - CSS: `.hero-game { display: none }`, and `[data-theme="pokemon"] .hero-game { display: flex; justify-content: center }`, plus the badge styling from the mockup.
    - Remove `<SylveonPortrait />`, and delete `src/components/SylveonPortrait.tsx`.
    - Delete its CSS from `src/app/globals.css`: `.sylveon-portrait*`, `.sylveon-ribbon`, `.sylveon-ear-layer`, `.sylveon-twitching-ear` and the `sylveon-ear-twitch` keyframes.
    - Delete `public/images/pokemon/sylveon.png` and its line in `public/images/pokemon/README.md`, first confirming with `grep -r "sylveon.png" src tests` that nothing else uses it.
  - **Tests to update**:
    - `tests/e2e/theme-toggle.spec.ts`: change the `.sylveon-portrait` visible and hidden checks (lines ~78 and ~142) to the badge.
    - `tests/e2e/pokemon-polish.spec.ts`: replace the Sylveon image-loading layout test with "the badge does not shift the hero when the bow image loads late" (gate `ribbon-pink.svg` and compare the `h1` box before and after).
    - Delete `tests/e2e/hero-portrait.spec.ts`.
    - `tests/e2e/ribbon-roundup.spec.ts` must pass unchanged in Chromium, Firefox and WebKit.

**Checkpoint**: The game lives at the top of the Pokémon hero, and the centered layout is unchanged.

---

## Phase 6: User Story 4 - A fairy adds a memorable touch without getting in the way (Priority: P3)

**Goal**: The butterfly or ribbon fairy on a canvas, following the model from T003.

**Independent Test**: Drive the canvas's `data-fairy-state` and `data-fairy-kind` (contract) through every transition, and click through the fairy's area.

- [x] T010 [US4] Add the fairy canvas. Write the tests first in `tests/e2e/hero.spec.ts`, all US4 scenarios against the contract's data attributes:
  - **Tests**:
    - `canvas.hero-fairy` is inside the hero, with `aria-hidden="true"` and computed `pointer-events: none`.
    - `data-fairy-kind` is `butterfly` in Light and Dark, and `ribbon` after switching to Pokémon with the toggle (no reload).
    - With motion allowed and a mouse, it starts `intro` and is `resting` within 5000 ms with no input (SC-005).
    - `page.mouse.move` steps over the hero give `following`. After the mouse stops, it reaches `resting` within 5000 ms.
    - With `reducedMotion: "reduce"` it is `resting` at first paint and stays `resting` through mouse moves.
    - In a `hasTouch: true, isMobile: true` context at 390px it is `resting`.
    - Turning reduced motion on mid-visit (`page.emulateMedia({ reducedMotion: "reduce" })` while `following`) makes it `resting` and keeps it there; turning it off again lets a mouse move give `following` (FR-020).
    - After resizing the viewport from 1280 to 390 and back, the fairy's position (exposed for tests as `data-fairy-x` and `data-fairy-y` on the canvas, in CSS pixels) stays inside the canvas bounds, and in `resting` it does not overlap the `h1` text box.
    - Scrolling the hero fully out of view gives `paused`; scrolling back gives `resting`.
    - With the mouse resting over each hero link and button, `document.elementFromPoint` at that point never returns the canvas, and a click activates the link (SC-006).
  - **Implement** `src/components/HeroFairy.tsx` (`"use client"`):
    - Render the canvas with the data attributes, and drive `stepFairy` from `src/lib/hero-fairy.ts` in a `requestAnimationFrame` loop that runs only while `isAnimating(state)`. In `resting`, draw one frame and stop.
    - `pointermove` and `pointerleave` listeners on the hero section (passive). Only `pointerType === "mouse"` moves steer the fairy.
    - `matchMedia("(prefers-reduced-motion: reduce)")` and `matchMedia("(any-pointer: fine)")`, with change listeners.
    - An `IntersectionObserver` and a `ResizeObserver` on the hero. The rest point sits beside the end of the `h1` (measure with a `Range` over its text) and is clamped inside the hero so it never covers text at 320px.
    - Colors come from `getComputedStyle(hero)` (`--color-accent`, `--color-accent-secondary`, `--color-foreground`), re-read on `themechange`. The kind comes from `useTheme()`.
    - Device-pixel-ratio scaling, capped at 2.
    - Port `butterfly()`, `ribbon()` and `spark()` from `specs/024-hero-redesign/mockup/Main.dc.html`. The ribbon trail is pink #e58fb0 and blue #8ac6e6.
    - Mount it in `Hero.tsx` as the hero's first child, absolutely positioned over the hero (`inset: 0`, `z-index` above the glow, below nothing interactive since `pointer-events: none`).

- [ ] T014 [US4] Hide the Pokémon ribbon fairy below 360px (owner decision 2026-10-20, spec FR-015 and Clarifications). Write the tests first in `tests/e2e/hero.spec.ts`:
  - **Tests**:
    - In Pokémon at 320px and 359px, `canvas.hero-fairy` is not visible (or not rendered) and nothing animates: `data-fairy-state` never leaves `resting`/`paused`, or the canvas is absent, for 2 s after load and after mouse moves.
    - In Pokémon at 360px and 390px, the ribbon fairy is shown as before.
    - In Light and Dark at 320px, the butterfly is still shown.
    - Resizing from 390 to 320 in Pokémon hides it; back to 390 shows it again.
  - **Implement** in `src/components/HeroFairy.tsx` and `src/app/globals.css`: below 360px in Pokémon, hide the canvas and stop the loop (no drawing, no rAF, no watchdog). Remove any now-unneeded small-scale ribbon sizing, but keep the butterfly's small-screen placement.

**Checkpoint**: All four stories work on their own.

---

## Phase 7: Polish & Cross-Cutting

- [x] T011 Run the full checks:
  - `npx playwright test tests/e2e/copy-dashes.spec.ts` (no em dashes in the new copy).
  - Then `./scripts/check.sh` (format, lint, build, all Playwright projects).
  - Fix anything red that this branch caused.
- [x] T012 [P] Update the docs:
  - `docs/architecture.md`: Hero, HeroFairy and the `hero-fairy` model; the Impact section folded into the hero; portraits removed.
  - `docs/state.md`: what changed, what's next, blockers.
- [ ] T013 Walk through `specs/024-hero-redesign/quickstart.md` on `npx next dev -p 3024`.
  - Screenshot desktop and phone in each theme to the session scratchpad and compare them with the six approved "F" boards.
  - Record any visible differences in the PR description.

---

## Dependencies & Execution Order

- T001 comes before everything.
- T002 and T003 are independent of each other [P]:
  - T002 blocks T005.
  - T003 blocks T010.
- US1 (T004, then T005, then T006) blocks US2, US3 and US4, because they all edit `Hero.tsx` and the hero CSS.
- Run US2 (T007, T008), then US3 (T009), then US4 (T010) one after another; they share `Hero.tsx`, `globals.css` and `hero.spec.ts`.
- Polish (T011 to T013) comes last. T012 can run alongside T011.

### Parallel opportunities

- T002 and T003, right after T001.
- T012 (docs) while T011 runs.
- Little else: almost every task touches `Hero.tsx`, `globals.css` or `hero.spec.ts`, so one implementer at a time.

## Implementation Strategy

- **MVP**: Phases 1 to 3 (T001 to T006). The hero content, actions and impact numbers are live. It could ship on its own (with the Sylveon card still below the links in Pokémon).
- **Incremental**: Then add theming (US2), the game badge (US3) and the fairy (US4), each leaving `scripts/check.sh` green.
- **Review**: After T013, run requesting-code-review, then `/review-panel` (CLAUDE.md, step 3).
