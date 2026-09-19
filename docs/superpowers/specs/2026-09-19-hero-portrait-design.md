# Hero Portrait (Design Review R4)

**Status:** Approved design, 2026-09-19
**Source:** jessbuilds.dev Design Review, recommendation R4 (https://claude.ai/code/artifact/c3f02a92-d712-4b70-99f3-119f5e124f76)
**Approved mockup:** option B "Circle portrait with a halo" in https://claude.ai/artifact/3NqSbQy8YjpbxpxHaE39p3 (also compared in https://claude.ai/artifact/VxMbhHaVfmPoejVrKN6R7b)

## Goal

Give the Light and Dark hero a visual anchor: a circular photo of Jessica beside the intro on desktop. R4 originally proposed a trading-card "trainer card"; three rounds of mockups (a stylized card, a realistic holo card, a full-art card) were rejected as cheesy. The trading-card identity stays with the project cards; the hero gets a polished, personal portrait.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Treatment | Circle portrait with a thin Pearl ring and a soft halo; no tilt, no animation, no card elements | Chosen from the round 2 mockup |
| Mobile and tablet (below 1024px) | Portrait hidden; hero stays one column as today | Chosen by Jessica; keeps the mobile hero short |
| Pokémon mode | Sylveon keeps the slot; the portrait does not show | One hero visual per theme |
| Hero layout | Pokémon's two-column hero rules become shared | Same structure-vs-flavor split as R2 |

## Design

- **Asset:** `public/images/jessica-haynes-portrait.webp`, 480×480 WebP (2× the displayed size), cropped from the supplied photo around the face (the mockup's 125% zoom, focus about 18% from the top). About 25-40KB.
- **Component:** `src/components/HeroPortrait.tsx`, a server component rendering a `div.hero-portrait` with a Next `Image`: `src="/images/jessica-haynes-portrait.webp"`, `alt="Portrait of Jessica Haynes"`, `width={480}`, `height={480}`, `unoptimized` (the file is already optimized, matching `SylveonPortrait`), and default lazy loading so hidden breakpoints never fetch it. Rendered in `src/app/page.tsx` inside the hero `Container`, after `<SylveonPortrait />`.
- **Portrait styles:** 14.75rem square, `border-radius: 50%`, 5px padding over `conic-gradient(from 200deg, var(--pearl-1), var(--pearl-2), var(--pearl-3), var(--pearl-1))`, `box-shadow: var(--shadow-soft), 0 0 0 14px color-mix(in srgb, var(--color-accent-soft) 70%, transparent)`. The image fills the circle (`object-fit: cover`).
- **Visibility:** `.hero-portrait { display: none; }` by default; shown at `min-width: 1024px`; `[data-theme="pokemon"] .hero-portrait { display: none; }` always.
- **Shared hero layout:** the three rules `[data-theme="pokemon"] .hero-container { max-width: 1112px; display: grid; align-items: center; gap: 3rem; }`, `[data-theme="pokemon"] .hero-copy { max-width: 42rem; }` and the `min-width: 1024px` column template `minmax(0, 1fr) 20rem` drop their Pokémon prefix. Below 1024px the hero stays a single column in every theme; hidden children take no grid cell, so the portrait (Light/Dark) or Sylveon (Pokémon) fills the second column. The portrait is centered in its column.
- **Accessibility:** meaningful `alt` text; no motion; heading structure unchanged.

## Out of scope

Hero copy changes, R5's impact-strip trim, any trading-card element on the portrait, showing the portrait in Pokémon mode or below 1024px.

## Testing

New `tests/e2e/hero-portrait.spec.ts`, written first:
- Light and Dark at 1280px: the portrait is visible, its image has loaded (`naturalWidth > 0`), and it sits to the right of the hero copy.
- Light and Dark at 390px: the portrait is hidden and its image is never requested.
- Pokémon at 1280px: the portrait is hidden and the Sylveon portrait is visible.

Regression gates: Pokémon homepage pixel baseline at 1440px and 390px (temporary, not committed), the accessibility suite (axe on 4 routes × 3 themes, 320px reflow), theme and overflow suites, `npm run lint`, `npm run build`, and screenshots of the Light and Dark hero at desktop and mobile width compared against the mockup.
