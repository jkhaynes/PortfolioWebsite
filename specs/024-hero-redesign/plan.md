# Implementation Plan: Hero Redesign

**Branch**: `024-hero-redesign` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md) | **Mockup**: [mockup.md](mockup.md)

**Input**: Feature specification from `specs/024-hero-redesign/spec.md`

## Summary

Rebuild the homepage hero as approved option F. The new hero has:

- a centered gradient "Hi, I'm Jessica" heading over a soft glow, followed by the role line, tagline and a short bio;
- the two actions and the three contact links;
- the four Impact numbers, moved into the hero under the existing motif divider (the Impact section is deleted);
- a static scroll cue.

The portraits go. In Pokémon, the game launcher becomes a centered badge above the heading.

A decorative fairy is drawn on a `pointer-events: none` canvas, in a small client component. Its motion rules live in a pure, tested state machine that never moves on its own for more than 5 s (WCAG 2.2.2, clarified 2026-10-20).

## Technical Context

**Language/Version**: TypeScript, React (latest), Next.js App Router (`next@latest`; read `node_modules/next/dist/docs/` before coding)

**Primary Dependencies**: Next.js, React, Tailwind CSS 4. No new dependencies.

**Storage**: N/A (static site)

**Testing**: Playwright with `@axe-core/playwright`. Pure fairy logic is tested in the Playwright runner without a page, like `ribbon-model.spec.ts`.

**Target Platform**: Modern evergreen browsers (Chromium, Firefox, WebKit), on desktop and phone

**Project Type**: Static web site (Next.js, deployed by Vercel)

**Performance Goals**: The fairy draws at the display's frame rate while active, and costs no frames while resting or off screen.

**Constraints**:

- All three themes, 320px to desktop, keyboard, reduced motion and axe clean.
- WCAG 2.2.2: no self-started motion longer than 5 s.
- No em dashes in copy.
- Content works without JavaScript.

**Scale/Scope**: One section of one page:

- 3 new files: `Hero.tsx`, `HeroFairy.tsx`, `src/lib/hero-fairy.ts`.
- 1 new data file: `src/data/impact.ts`.
- 2 deleted components: `HeroPortrait.tsx`, `SylveonPortrait.tsx`.
- 2 components changed: `RibbonRoundupLauncher.tsx` and `ImpactMetricLink.tsx` each gain a variant.
- 2 more files changed: `page.tsx` and `globals.css`.
- About 7 test files touched.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                                                   | Status         | How                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Spec Before Code                                                         | PASS           | spec.md, clarified, with an approved mockup.                                                                                                                                                                                              |
| II. Test-First                                                              | PASS           | Every task in tasks.md starts with a failing Playwright test (hero content, impact links, game badge, fairy contract, fairy model).                                                                                                       |
| III. Superpowers Owns Implementation                                        | PASS           | Built in `.worktrees/024-hero-redesign` with subagent-driven development; `/speckit-implement` is not used.                                                                                                                               |
| IV. Simplicity                                                              | PASS           | No new dependencies. Existing pieces are reused: `ImpactMetricLink`, `RibbonRoundupLauncher`, `.motif-divider`, theme tokens and `useTheme`. The one new abstraction (the fairy state machine) exists to make the 5-second rule testable. |
| V. Decisions Are Recorded                                                   | PASS           | No new library, store or cross-cutting pattern, so no ADR. `docs/architecture.md` gets the new hero components and the removed Impact section; `docs/state.md` is updated at the end.                                                     |
| Constraints: no backend, forms or cookies; free tooling                     | PASS           | Nothing added.                                                                                                                                                                                                                            |
| Constraints: three themes, phone and desktop, keyboard, reduced motion, axe | PASS (planned) | Covered by `hero.spec.ts` and the existing `accessibility.spec.ts`.                                                                                                                                                                       |

Post-design re-check (after research.md, data-model.md, contracts and quickstart): still PASS. There are no violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/024-hero-redesign/
├── mockup.md            # Approved 2026-10-20, with mockup/ (canvas copy)
├── spec.md
├── plan.md              # This file
├── research.md          # R1 to R10
├── data-model.md        # Impact metric, fairy state machine
├── quickstart.md
├── contracts/hero-ui.md # DOM and behavior contract the tests rely on
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                   # CHANGED: renders <Hero />, drops the #impact section, stats move out
│   └── globals.css                # CHANGED: new .portfolio-hero styles (glow, gradient text, badge, stats,
│                                  #          scroll cue, forced-colors); portrait and Sylveon-card CSS removed
├── components/
│   ├── Hero.tsx                   # NEW (server): all hero markup
│   ├── HeroFairy.tsx              # NEW (client): canvas, observers, draws the butterfly or ribbon fairy
│   ├── ImpactMetricLink.tsx       # CHANGED: variant "hero" (value, label, evidence cue; same name and behavior)
│   ├── RibbonRoundupLauncher.tsx  # CHANGED: variant "badge" (bow image, aria-hidden subtitle)
│   ├── HeroPortrait.tsx           # DELETED
│   └── SylveonPortrait.tsx        # DELETED
├── data/
│   └── impact.ts                  # NEW: the four metrics, moved from page.tsx
└── lib/
    └── hero-fairy.ts              # NEW: pure state machine, targets, easing, trail

public/images/pokemon/
├── sylveon.png                    # DELETED (no remaining use)
└── README.md                      # CHANGED: drop its credit line

tests/e2e/
├── hero.spec.ts                   # NEW: content, actions, impact links, themes, badge, fairy contract,
│                                  #      phone and desktop, 320px, keyboard order, reduced motion, touch
├── hero-fairy-model.spec.ts       # NEW: pure state-machine tests (5-second rule, transitions)
├── hero-portrait.spec.ts          # DELETED (replaced by hero.spec.ts)
├── card-structure.spec.ts         # CHANGED: no #impact strip; About and Contact align with each other
├── theme-toggle.spec.ts           # CHANGED: h1 asserts the gradient; Pokémon asserts the badge, not the Sylveon card
├── pokemon-polish.spec.ts         # CHANGED: portrait image-loading test replaced by a badge no-shift test
└── about-section.spec.ts          # CHECK: comment and assertions about numbers repeated from the hero
```

**Structure Decision**: Single Next.js project, using the existing layout from `CLAUDE.md` (routes in `src/app`, UI in `src/components`, content in `src/data`, logic in `src/lib`, tests in `tests/e2e`).

## Build order (for /speckit-tasks)

1. **Fairy model** (pure, test-first): `src/lib/hero-fairy.ts` with `hero-fairy-model.spec.ts`. This has no UI dependency, so it can go first or in parallel.
2. **Hero content (US1)**: `src/data/impact.ts`, `Hero.tsx`, the `ImpactMetricLink` hero variant, `page.tsx` without `#impact`, and the base CSS. Tests: content, actions, impact links, phone and desktop layout, 320px, keyboard order, and no `#impact`.
3. **Themes (US2)**: the gradient, glow, divider and forced-colors CSS; portrait components and CSS deleted; `theme-toggle` and `card-structure` updated. Tests: axe in three themes at two widths, no portraits, gradient present.
4. **Game badge (US3)**: the `RibbonRoundupLauncher` badge variant, `.hero-game` gating, and `pokemon-polish` updated. Tests: the badge is visible only in Pokémon, it opens the game, focus returns, and nothing shifts.
5. **Fairy (US4)**: `HeroFairy.tsx` wired to the model. Tests use the contract's data attributes: intro to resting within 5 s, following, settling, reduced motion, touch, paused, theme kind, and `elementFromPoint` never hitting the canvas.
6. **Docs**: `docs/architecture.md` and `docs/state.md`; delete `sylveon.png` and its credit.

## Complexity Tracking

None.
