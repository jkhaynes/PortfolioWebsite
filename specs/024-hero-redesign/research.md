# Research: 024 Hero Redesign

No open NEEDS CLARIFICATION items: the stack is fixed by the constitution and ADR 0002, and the look is fixed by the approved mockup. These are the design decisions the plan rests on.

## R1. Split the hero into server markup plus one small client island

- **Decision**: A new `src/components/Hero.tsx` (server component) renders all hero text, actions, impact links, divider and scroll cue. The fairy is a separate client component, `src/components/HeroFairy.tsx`. The game badge reuses the existing client `RibbonRoundupLauncher`.
- **Rationale**: Every word and link renders on the server and works without JavaScript (FR-025). Only the decorative canvas needs the client. This follows the site's existing split (for example `ImpactMetricLink` and `ThemeToggle` are the only client parts of their sections).
- **Alternatives considered**: Making the whole hero a client component, rejected because the content would depend on hydration for no reason.

## R2. Draw the fairy on a 2D canvas, with no animation library

- **Decision**: One `<canvas aria-hidden="true">` absolutely positioned over the hero with `pointer-events: none`, drawn with the 2D context and `requestAnimationFrame`. The drawings follow the approved mockup (`mockup/Main.dc.html`): a butterfly in the theme's accent colors, a Sylveon ribbon fairy in Pokémon, and a four-point sparkle trail.
- **Rationale**: It is a few dozen shapes per frame, which needs no dependency (constitution IV, Simplicity). A canvas never takes part in hit testing or the accessibility tree once `pointer-events: none` and `aria-hidden` are set (FR-019).
- **Alternatives considered**: DOM or SVG elements moved with CSS transforms (more nodes, and the sparkle trail would churn the DOM); an animation library such as Framer Motion (a new dependency for one effect).

## R3. Fairy behavior as a small pure state machine

- **Decision**: Put the motion rules in `src/lib/hero-fairy.ts` as pure functions: the state step, target choice, easing and trail aging. The canvas component only feeds it time, pointer events and the resting point, then draws. States:
  - `intro`: drifts around the heading for at most 4.5 s after load.
  - `following`: chases the pointer while it moves over the hero.
  - `settling`: eases back to the resting point. It starts 1.5 s after the last pointer move or on pointer leave, and lasts at most 1.5 s.
  - `resting`: drawn once beside the name, with the animation loop stopped.
  - `paused`: the hero is off screen; the loop stops.
    Reduced motion and coarse-only pointers go straight to `resting` and never leave it.
- **Rationale**: This meets the clarified rule (WCAG 2.2.2): the fairy never moves on its own for more than 5 seconds. The longest self-started run is the 4.5 s intro, and settling after a pointer stops takes 1.5 s + 1.5 s = 3 s. Pure functions can be tested test-first in the Playwright runner without a browser page, exactly like `tests/e2e/ribbon-model.spec.ts` does for the game model.
- **Alternatives considered**: Logic inline in a React effect, rejected because it can only be tested through timing-sensitive browser tests.

## R4. How the fairy learns theme, motion and pointer type

- **Decision**:
  - **Theme**: read the colors with `getComputedStyle` from the CSS tokens (`--color-accent`, `--color-accent-secondary`, `--color-foreground`), plus the theme from `useTheme()` in `src/lib/theme-store.ts` to choose butterfly or ribbon. Re-read on theme change (FR-020).
  - **Motion**: `matchMedia("(prefers-reduced-motion: reduce)")`, listening for `change`.
  - **Pointer type**: `matchMedia("(pointer: fine)")` together with `(any-pointer: fine)`. Only `pointermove` events whose `pointerType === "mouse"` steer the fairy, so hybrid devices follow the mouse and otherwise rest.
  - **Resting point**: measured from the `h1`'s bounding box, with a `ResizeObserver` on the hero.
  - **Off screen**: an `IntersectionObserver` on the hero (FR-018).
- **Rationale**: The theme store already broadcasts changes, and the tokens are the single source of the colors, so the fairy cannot drift from the theme.

## R5. A test hook for the fairy's state

- **Decision**: The canvas carries `data-fairy-state` with the current state (`intro`, `following`, `settling`, `resting` or `paused`) and `data-fairy-kind` (`butterfly` or `ribbon`).
- **Rationale**: Browser tests can then prove the 5-second rule, reduced motion, touch rest, pausing off screen and the theme swap without reading pixels. It is invisible and hidden from assistive technology.

## R6. Gradient heading and numbers

- **Decision**: `background-image: linear-gradient(100deg, var(--color-accent), var(--color-accent-secondary))` with `background-clip: text` and `color: transparent`. Under `@media (forced-colors: active)` the background is dropped and `color: CanvasText` is restored. The primary button uses the same gradient as its fill.
- **Rationale**: Both gradient stops already pass AA against each theme's page color, so every point of the gradient does:

  | Theme   | Text against | Ratios                                   |
  | ------- | ------------ | ---------------------------------------- |
  | Light   | page #fdf6f6 | #b8306f about 5.6:1, #8f5f86 about 5.4:1 |
  | Dark    | page #1a1220 | #f4a7cb and #c9a0dc above 8:1            |
  | Pokémon | page #fce8ef | #ac365c about 5.3:1, #914560 about 6.5:1 |

  The button text (`--color-on-accent`) passes against both stops in every theme. axe reports gradient text as "needs review" rather than a violation, so contrast is also checked in review against these numbers.

- **Existing test to update**: `tests/e2e/theme-toggle.spec.ts` asserts the `h1` text color in Dark. It changes to assert the gradient (background-image), since the text color is now transparent.

## R7. Game launcher placement without layout shift

- **Decision**: Render `RibbonRoundupLauncher` with a new `variant="badge"` (bow image, "a Sylveon mini game" in an `aria-hidden` span, so the button's name stays "Take a play break") inside `.hero-game`. CSS shows `.hero-game` only under `[data-theme="pokemon"]`, the same way the Sylveon card is shown today.
- **Rationale**: The theme is set on `<html>` before paint, so CSS gating avoids hydration flicker. Keeping the name means the game tests (`ribbon-roundup.spec.ts`, `pokemon-polish.spec.ts`) keep finding it.

## R8. Impact numbers move into the hero

- **Decision**:
  - Move the `stats` array from `src/app/page.tsx` to `src/data/impact.ts`, following the convention that content lives in `src/data/`.
  - Give `ImpactMetricLink` a `variant="hero"`. The hero variant shows the value, label and "View evidence ↓" cue, keeps the category in the accessible name, and keeps the same click, scroll, focus and highlight handling (FR-007).
  - Delete the `#impact` section.
  - Reuse the existing `.motif-divider` for the divider above the numbers; it already switches from a sparkle to a ribbon bow in Pokémon.
- **Existing test to update**: `tests/e2e/card-structure.spec.ts` uses `#impact .grid` as the alignment reference and as a framed panel. It changes to compare the About and Contact frames with each other.

## R9. What is removed

- **Components**: `HeroPortrait.tsx` and `SylveonPortrait.tsx` are deleted, along with their CSS: `.hero-portrait`, `.sylveon-portrait*`, `.sylveon-ribbon`, and the ear-twitch keyframes and layer.
- **Images**: `public/images/pokemon/sylveon.png` loses its last use, so it is removed along with its credit line in `public/images/pokemon/README.md`. `public/images/jessica-haynes-portrait.webp` also loses its last use but stays in `public/`: it is the owner's own photo, small (41KB), and likely to be reused (for example in About). Nothing links to it, so it is never downloaded.
- **Tests**:
  - `hero-portrait.spec.ts` is replaced by `hero.spec.ts`.
  - The portrait-only parts of `pokemon-polish.spec.ts` and `theme-toggle.spec.ts` (`.sylveon-portrait` visibility and the image-loading layout check) are rewritten to check the badge instead.

## R10. Next.js version notes

- **Decision**: The project pins `next` to `latest` (16.3.1 and React 19.2.8 when this was planned; the bundled server and client components guide showed no change affecting this plan), so before writing code the implementer reads the relevant guides in `node_modules/next/dist/docs/` (server and client components, `next/image`), as `CLAUDE.md` requires.
- **Rationale**: Nothing in this feature needs a new Next API. The hero uses plain components, and the fairy is a `"use client"` component with effects.
