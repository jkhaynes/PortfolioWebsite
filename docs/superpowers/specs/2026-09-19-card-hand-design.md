# Dealt Hand and Case-Study Card Backs (Design Review R7, R8, R10)

**Status:** Approved design, 2026-09-19
**Source:** jessbuilds.dev Design Review R7 (card anatomy), R8 (projects as a hand), R10 (case studies in the card system) (https://claude.ai/code/artifact/c3f02a92-d712-4b70-99f3-119f5e124f76)
**Approved mockups:** full phase preview https://claude.ai/artifact/2FAXJtuxw77XGKZxGj5519; hand option C "Dealt hand" in https://claude.ai/artifact/4WTgnnJbXBGJubrFQFAfmz; case-study option B "The back of the card" in https://claude.ai/artifact/BUkLWULzFHvev89MCnLyfG

## Goal

Show the three Featured Projects as a hand of cards that is dealt in once, with shorter cards that each open their case study; open every case study as "the back of the card" with a TL;DR strip; and end every case study by dealing the next project.

## Decisions

| Decision | Choice |
| --- | --- |
| Scope | One phase: homepage hand, compact cards, all three case-study heroes, Next in the set |
| Homepage layout, 1024px and up | Overlapping hand: 296px cards fanned −9° / 0° / +9° around a point below the cards, offset ±190px; the right card sits on top |
| Hover and keyboard focus | The hand spreads to ±240px; the hovered or focused card straightens, rises 34px and comes to the front; the others dim (`saturate(.85) brightness(.92)`) |
| Deal-in | Once per page load, when the section nears the viewport: cards rise from a stack and fan out, 0.7s each, staggered 0.05s / 0.2s / 0.35s. No animation with reduced motion |
| Below 1024px | A horizontal scroll-snap row (cards 82% wide), no tilt, no overlap, no deal |
| Card link | Whole card opens its case study through a stretched link on the title (link name is the project title) |
| "View larger" on homepage cards | Removed (a button can't sit inside a card link); case studies keep their screenshot dialogs |
| GitHub / demo links on cards | Removed from cards; each case study keeps its GitHub link |
| Card content | Featured build label, status, screenshot, title, one-line summary, first three tags, decorative "View case study →" |
| Case-study hero | One Pearl-framed "card back": header row (Featured build · kicker, status), title and summary, the page's art window, and a TL;DR strip |
| TL;DR strip | Role, Status, Outcome, Stack (Status instead of Timeline; no dates available) |
| Next in the set | After each case study's existing closing section: the next project's card, the remaining card, and a "Let's connect" email prompt using the Contact section's copy. Order loops PokéJudge → Loot Singles → Loot Membership → PokéJudge |
| Pokémon mode | Keeps its stationery frame, bows, bookmark ribbon and Sylveon peek on cards; the case-study card back uses the same Pokémon frame |

## Copy (approved drafts)

| Project | One-line summary | Outcome |
| --- | --- | --- |
| PokéJudge AI | An AI rules assistant that asks the right questions before it recommends a cited ruling. | End-to-end pipeline with grounding validation and Source Support |
| Loot Singles Fulfillment | A set-aware picking app built to prevent wrong-card mistakes and order collisions. | Order detail with set, condition and variant up front |
| Loot Membership Integration | A Shopify app that ties member discounts to verified Discord roles. | Tier editor mapping Discord roles to Shopify customer tags |

TL;DR Role / Status / Stack per page: PokéJudge "Sole developer & product designer" / "In development · local .NET console app" / "C#, .NET, Gemini embeddings, xUnit"; Loot Singles "Sole developer & product designer" / "In development · order-detail foundation built" / "React, TypeScript, ASP.NET Core, Azure SQL"; Loot Membership "Sole developer & designer" / "In development" / "TypeScript, React Router, Cloudflare Workers, D1".

## Structure

- `src/data/projects.ts`: each `Project` gains `cardSummary` and `outcome`; a `projectSet` array fixes the order.
- `ProjectShowcase` becomes the compact card (`article[data-project-card]`, `h3 > a.project-card-link` stretched over the card). The screenshot is a plain `next/image` (first card `priority`, the rest lazy).
- `ProjectHand` (client): wraps the cards in `div.project-hand`; an `IntersectionObserver` (root margin `0px 0px 15% 0px`) sets `data-dealt="true"` once; skipped under reduced motion.
- `CaseStudyHero`: shared card-back hero taking `project`, `kicker`, `summary`, actions and an `art` node, plus TL;DR items. Replaces each page's header; the hero keeps the page's single `h1`.
- `NextInSet`: renders the next and remaining cards and the connect prompt; section heading "Next in the set" (h2).

## Accessibility

- One link per card, named by the project title; the rest of the card is its click area. Focus shows the same lift as hover and a visible outline.
- Decorative "View case study →" is `aria-hidden`.
- Reduced motion: no deal, no hover transforms, no shimmer (existing rule).
- Heading order stays valid on every page; each case study still has exactly one `h1`.

## Testing

New tests, written first:
- Homepage: three cards in the fixed order, each with one link named by its title to its case study, the one-line summary, three tags, and no "View larger" or GitHub links; at 1280px the cards are fanned (rotated) and overlapping, and hovering one straightens it (`rotate(0)`); `data-dealt` becomes `true` after scrolling to the section; with reduced motion no deal animation runs; at 390px the row scrolls horizontally with no rotation.
- Case studies: each opens with the card back (one `h1`, the TL;DR strip with four labeled cells and the approved values) and ends with "Next in the set" linking to the correct next case study; "Explore more projects" still works.

Updated tests: `media-dialog.spec.ts` and the two accessibility dialog checks move to case-study pages; `trading-card-motif.spec.ts` and `loot-membership.spec.ts` follow the new card links; `card-structure.spec.ts` keeps its Pearl and Pokémon checks.

Regression gates: Pokémon element screenshots of homepage sections outside Featured Projects (temporary), the accessibility suite, full suite, lint, build, and screenshots against the phase preview.
