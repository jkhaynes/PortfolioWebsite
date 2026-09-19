# About Merge and Nav (Design Review R13, R3, About part of R5)

**Status:** Approved design, 2026-09-19
**Source:** jessbuilds.dev Design Review R13 (merge the soft sections, fix the nav), R3 (Pokémon mode discoverable), R5 (stop repeating numbers, About copy only) (https://claude.ai/code/artifact/c3f02a92-d712-4b70-99f3-119f5e124f76)
**Approved mockup:** Option A "one framed panel, stacked" and the proposed nav in https://claude.ai/artifact/2h6CA72w45mjAWQ3SwZaRh

## Goal

Replace the four soft blocks after Experience (How I Work, the curiosity quote line, Learning Now, About Me) with one framed About section, stop About repeating the hero's numbers, make Pokémon mode discoverable, and give the nav an About link, a desktop Résumé button and a current-section highlight.

## Decisions

| Decision | Choice |
| --- | --- |
| Layout | Option A: About paragraph, pull quote, "How I work" cards, "Learning now" sentence and chips, Pokémon hint, all in one framed panel |
| About copy | The approved draft (below). No numbers |
| Dropped copy | How I Work's one-liner ("I'm a collaborative developer who cares about quality, follow-through, and continuing to grow."); About's three paragraphs (replaced by the draft) |
| Kept copy, verbatim | Both How I Work card texts, the Learning Now sentence and themes, the curiosity line (now the pull quote) |
| Section heading | "About" (was "About Me") |
| Nav links | Work (`/#projects`), Experience, About (`/#about`), Contact. "Home" removed; the brand still links to `/#top` |
| Résumé in nav | Desktop only (1024px and up); opens the PDF in a new tab with the existing `resume_download` event |
| Current-section highlight | The link for the section in view gets `aria-current="location"` and the hover style; only on the homepage |
| Pokémon hint | "Psst, there's a Pokémon mode." plus a "Try Pokémon mode" button that switches the theme; hidden in Pokémon mode; after switching, focus moves to the About heading so it isn't lost |

**About paragraph (approved draft):** "I'm a senior software engineer who builds and modernizes full-stack enterprise applications, mostly C#/.NET backends, APIs and Entity Framework, with MySQL, Angular and TypeScript alongside. I've led technical projects, mentored engineers, written technical designs, and worked closely with Product, QA and DevOps."

## Structure

```
section#about[aria-labelledby=about-heading]      (framed by the R2 panel rule)
  div (Container)
    h2#about-heading[tabindex=-1] "About"
    p   About paragraph
    p   pull quote
    section#how-i-work[aria-labelledby=how-i-work-heading]
      h3 "How I work"; two Cards (unchanged copy)
    section#learning-now[aria-labelledby=learning-now-heading]
      h3 "Learning now"; sentence; ul[aria-label="Current learning themes"] of 3 chips with the quiet sparkle facet
    p.pokemon-hint (client component)
```

Both anchors (`#how-i-work`, `#learning-now`) keep working and both sub-sections stay named regions. The hint sits outside `#learning-now`, so that region still contains no links or buttons.

## Styles

- Sub-headings: small uppercase muted labels (the "How I work" / "Learning now" treatment in the mockup).
- Pull quote: Lora italic, `--color-accent-secondary`.
- Chips: pill, `color-mix(in srgb, var(--card-edge-mauve) 35%, var(--color-border))` border, `color-mix(in srgb, var(--color-accent-soft) 45%, var(--color-surface))` background.
- Hint: a dashed rose top border separating it from Learning Now; small outlined pill button. `[data-theme="pokemon"] .pokemon-hint { display: none; }`.
- Removed: `.learning-specimen-strip` rules (unused) and the `#learning-now h2` branch of the R2 section-header selectors (no longer an h2).
- Nav: `aria-current="location"` link gets the hover style; mobile link grid columns re-weighted for the new labels; `.site-nav-resume` hidden below 1024px.

## Testing

New `tests/e2e/about-section.spec.ts` and `tests/e2e/site-nav.spec.ts`, written first:
- About is one top-level section; `#how-i-work` then `#learning-now` sit inside it; headings are h2 "About" then h3s; the About text has no "9+", "95%" or "6+ months"; the curiosity line appears once; `/#learning-now` still scrolls to its sub-section.
- The hint's button switches to Pokémon, the hint then hides and focus lands on the About heading; the hint is hidden in Pokémon mode.
- Nav links are exactly Work, Experience, About, Contact; Résumé shows at 1280px and not at 390px; scrolling to About marks the About link `aria-current="location"`, and scrolling to Projects marks Work.

Updated tests: `learning-now.spec.ts` (section order), `theme-toggle.spec.ts` (clicks "Work" instead of "Projects").

Regression gates: unchanged sections (hero, impact, projects, experience, contact) screenshot-identical in Pokémon mode at 1440px and 390px (temporary, element screenshots, since About and the nav intentionally change); the accessibility suite; the full suite; `npm run lint`; `npm run build`; screenshots against the mockup.
