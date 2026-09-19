# Shared Card Structure (Design Review R2)

**Status:** Approved design, 2026-09-19
**Source:** jessbuilds.dev Design Review, recommendation R2 (https://claude.ai/code/artifact/c3f02a92-d712-4b70-99f3-119f5e124f76)
**Approved mockups:**
- Glyph options (four-point sparkle chosen): https://claude.ai/artifact/77EqdnRwAHRRqjHCbXyM6q
- Full homepage, Current vs With R2, Light and Dark: https://claude.ai/artifact/YHent2y3AnR3aNWa5oWVPm

## Goal

Make the trading-card structure part of every theme instead of only Pokémon mode. Light and Dark gain the section headers, brand mark, name divider, framed sections and framed project cards that Pokémon mode already has, drawn with an original four-point sparkle. Pokémon mode keeps its licensed flavor (bows, Sylveon, stationery, Ribbon Roundup) and looks the same as today, except that its small facet icons become sparkles.

## Scope

**In scope:** structure only. Brand mark, name divider, section headers, framed impact strip, framed About and Contact panels, project card frame and top-edge glyph, facet icon.

**Out of scope:**
- The hero card slot. It waits for R4 (trainer card), which gives it content.
- Rarity marks. They wait for R7, which defines what rarity means.
- Any change to copy, theme colors, buttons, tag pills, the How I Work boxes, the Learning Now strip's shape or corner brackets, the hero layout, or the Ribbon Roundup game.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Glyph for Light and Dark | Four-point sparkle | Chosen from the glyph mockup |
| Existing diamond facets | Become sparkles in every theme, including Pokémon | One symbol across the site |
| Build approach | One shared CSS layer; the glyph is swapped through custom properties | One source of truth, no hydration flicker, least markup churn |
| Hero card slot, rarity marks | Deferred to R4 and R7 | They need content those items define |

Rejected approaches: a React `<MotifGlyph>` component (the theme is only known on the client, so it would flicker or need both glyphs rendered), and duplicating the Pokémon rules per theme (drift).

## Design

### Glyph

- New asset `public/images/motif/sparkle.svg`: a single-path four-point sparkle on a 16×16 viewBox:
  `M8 .6C8.5 5 11 7.5 15.4 8 11 8.5 8.5 11 8 15.4 7.5 11 5 8.5.6 8 5 7.5 7.5 5 8 .6Z`
- Two custom properties drive every glyph spot:
  - `--motif-mask`: default `url("/images/motif/sparkle.svg") center / contain no-repeat`
  - `--motif-fill`: default `var(--color-accent)`
- A glyph spot renders as `background: var(--motif-fill); mask: var(--motif-mask);` (with the `-webkit-mask` equivalent).
- Pokémon overrides both: `--motif-mask: none;` and `--motif-fill: url("/images/pokemon/ribbon-pink.svg") center / contain no-repeat;`, so the same rules draw the multicolor bow.
- In `forced-colors: active`, the glyph fill is `CanvasText` so it stays visible.

### Shared structure (all themes)

| Element | Selector (today's Pokémon selector, made shared) | Light and Dark result |
| --- | --- | --- |
| Brand mark | `.portfolio-brand::before` | Glyph before your name, 1.1rem. Pokémon keeps 2rem |
| Name divider | `.pokemon-bow-divider` renamed `.motif-divider` (markup in `src/app/page.tsx`) | Glyph (1.4rem) between two 1px rules at `color-mix(in srgb, var(--card-edge-rose) 45%, transparent)`, max-width 28rem. Pokémon keeps its 2.75rem bow and stationery-trim rules |
| Section headers | `.portfolio-home :is(section > div > h2, #learning-now h2)` | Flex row: glyph (1.25rem) + heading + a 1px rule to the edge at the same 45% rose. Left-aligned, including Featured Projects, which is centered today. `#impact` and `#contact` headings stay centered with a short rule (`flex: 0 1 4rem`). Below 400px, the Contact rule is hidden (today a Pokémon-only rule) |
| Impact strip | `.portfolio-home #impact .grid` | Framed card: 1px border on all sides at `color-mix(in srgb, var(--card-edge-mauve) 40%, var(--color-border))`, 1.5rem radius, `var(--color-surface)` background, `var(--shadow-soft)`, inline padding 1rem |
| About and Contact | `.portfolio-home #about > div`, `.portfolio-home #contact > div` | Framed panels with the same border, radius and background, padding `clamp(1.25rem, 4vw, 2.5rem)`, `var(--shadow-soft)`, width `calc(100% - 2rem)` |
| Project card frame | `.project-specimen-card` | Padding 0.4rem, no border, background `linear-gradient(135deg, color-mix(in srgb, var(--card-edge-rose) 55%, var(--color-surface)), color-mix(in srgb, var(--card-edge-mauve) 55%, var(--color-surface)))`. Hover and focus lift, shadow and sheen unchanged. `data-accent-tone` keeps setting `--specimen-accent` for the "Featured build" label, media ring and sheen |
| Card top-edge glyph | `.project-specimen-card::before` | Replaces the top-left corner bracket: the glyph (1.1rem) centred on a 1.9rem surface-colored disc with a 1.5px rose ring, sitting on the top edge at `top: -0.9rem; left: 1.25rem`. Pokémon keeps its 2.5rem bow here |
| Card bottom-right | `.project-specimen-card::after` | The corner bracket is removed in Light and Dark. Pokémon keeps its bookmark ribbon |
| Facet icon | `.specimen-facet`, `.specimen-facet--quiet` | The CSS-drawn diamond (rotated square + line) becomes the sparkle glyph via the same mask, at 0.8rem (0.7rem quiet), colored by `currentColor` as today. Every theme, including Pokémon |

### Pokémon layer

The Pokémon block keeps only what differs from the shared layer, and must render the same as today apart from the facet:
- `--motif-mask` / `--motif-fill` overrides (bow).
- Glyph sizes: brand and headers 2rem, divider 2.75rem, card top edge 2.5rem with no disc or ring.
- Hardcoded pinks: frame borders `#e4b3c5`, rules `#d78ca8`, card frame border `#d78ca8`, card background `#f8d9e5`, body `#fce8ef`.
- Stationery pattern on the card frame, divider rules, Sylveon portrait border and the contact trim strip.
- Bookmark ribbon on `.project-specimen-card::after`, Sylveon peek, hero two-column layout, Sylveon portrait.

Rules that become shared move out of the Pokémon block rather than being copied.

### Accessibility and motion

- Every glyph and rule is decorative: drawn by pseudo-elements with `content: ""` or elements with `aria-hidden="true"`. Heading accessible names and reading order do not change.
- No new motion. Existing hover, sheen and `prefers-reduced-motion` rules are unchanged.
- The glyph uses `var(--color-accent)`, which already passes as text color in all themes; as a decorative mark it has no contrast requirement.
- No horizontal overflow at 320px in any theme.

## Files

| File | Change |
| --- | --- |
| `public/images/motif/sparkle.svg` | New glyph asset |
| `src/app/globals.css` | Shared structure rules and glyph properties; Pokémon block reduced to overrides; facet and card corner rules updated |
| `src/app/page.tsx` | `pokemon-bow-divider` class renamed to `motif-divider` |
| `tests/e2e/card-structure.spec.ts` | New tests (below) |

## Testing

New `tests/e2e/card-structure.spec.ts`, written before the CSS:
- **Light and Dark:** the brand `::before`, a section heading `::before` and the card `::before` compute a `mask-image` containing `sparkle.svg`; section headings have a visible `::after` rule; `#impact .grid`, `#about > div` and `#contact > div` have a border on all four sides and a non-zero border radius; `.specimen-facet` computes a `mask-image` containing `sparkle.svg`; the name divider is visible.
- **Pokémon:** the brand `::before` and card `::before` compute a `background-image` containing `ribbon-pink.svg` and no mask; `.specimen-facet` uses the sparkle mask.

Regression gates: `trading-card-motif.spec.ts`, `pokemon-polish.spec.ts`, `theme-toggle.spec.ts`, the accessibility suite (axe on 4 routes × 3 themes, 320px reflow), `npm run lint`, `npm run build`, and screenshots of the homepage in all three themes compared against the approved mockup (Pokémon compared against the live site today).
