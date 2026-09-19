# Experience Evolution Line (Design Review R12, section order, R16 part)

**Source:** jessbuilds.dev Design Review: R12 (show the growth), the recommended section order for Experience, the Experience part of R16 (mobile length) and the "Protect" list (https://claude.ai/code/artifact/c3f02a92-d712-4b70-99f3-119f5e124f76)

**Mockups:** walkthrough https://claude.ai/artifact/27gvwtnAX5rG6PTeqq9SCo, line ideas https://claude.ai/artifact/PdpcytqXksCcNYbYaYHm9v, chosen line (version 2, "Words on the track") https://claude.ai/artifact/SEDY8utH3Ns5cJSGLCx57g

## Goal

Make the climb from Programmer to Team Lead visible at a glance and make Experience shorter. The section keeps full detail for the recent roles, folds the three roles before 2020 behind one toggle, and ends with a link to the full résumé.

## Decisions

| Topic | Decision |
|---|---|
| Career line | A compact metro line above the entries: one continuous rose line, one stop per role, oldest on the left |
| Stops | Programmer 2016, Senior Developer 2017, Senior Developer (Growers Edge) 2019, Lead Developer 2020, Senior III 2022, Team Lead / Senior IV 2024 |
| Stop labels | Short role name, then "Company · year" underneath; the current stop reads "8am · 2024 – now" |
| Promotions | The word "promoted" sits on the track leading into a promotion: into Senior Developer (Proplanner) and into Team Lead / Senior IV (8am). Company changes are not labeled |
| Current role | Its stop keeps the normal look and gains a Pearl halo; no other stop is highlighted |
| Stop links | Each stop links to its role in the entries below; a stop for an earlier role opens the "Earlier roles" group first |
| Full entries | 8am (both roles, with the PROMOTED pill between them) and Proplanner Lead Developer, unchanged |
| Earlier roles | Option A: a closed disclosure, "Earlier roles (3)" with "2016 – 2020", that opens to the full entries for Growers Edge and the two earlier Proplanner roles (PROMOTED pill kept) |
| Résumé | "View full résumé ↗" closes the section: the PDF in a new tab, with the existing `resume_download` event |
| Foil | Pearl, as on the project cards; the review's gold foil is not added |
| Mobile | The line becomes one row you swipe (about 118px per stop); no page-level horizontal overflow |
| Pokémon | Same structure in Pokémon tokens; no Sylveon or extra art |
| Reduced motion | The Pearl halo does not shimmer |

## Structure

- Experience data moves from `src/app/page.tsx` to `src/data/experience.ts`, keeping the existing `ExperienceRole` / `ExperienceBullet` shapes and anchor ids. Each role gains `shortRole` (the stop label) and each company entry gains `earlier?: true` for the three pre-2020 roles.
- The career line is derived from that data, not written separately: stops are every role, oldest first; a stop is a promotion when the previous role is in the same entry; the year is the start of the role's period.
- New `src/components/CareerLine.tsx` (server component) renders the line as an `ol` labelled "Career path, 2016 to now". Each stop is one link whose accessible name includes role, company, year, and "promoted" where it applies. The current stop has `aria-current="step"`.
- `#experience` renders: heading, `CareerLine`, the full entries, the `details` group of earlier entries, the résumé link.
- A small client helper opens the `details` group when a link or URL hash targets a role inside it, then moves focus to that role heading.
- Styles live in `globals.css` next to the other section styles and use theme tokens only.

## Keep

- The PROMOTED pill between roles.
- The "View evidence" targets: `impact-nightly-job`, `impact-security-flaws`, `impact-support-escalations` all stay in the full entries, with their focus behavior.
- Role anchor ids used by the Impact links.

## Out of scope

- Content edits to roles or bullets.
- The About section, hero and case studies.
- The review's gold `--color-foil` token.

## Testing

- The line has six stops, oldest first, with the names and years above; "promoted" appears exactly twice, before Senior Developer and before Team Lead / Senior IV.
- Only the current stop has `aria-current="step"`.
- "Earlier roles (3)" is closed on load and holds three roles; the full entries hold the other three.
- Activating the Programmer stop opens the group and moves focus to the Programmer role; loading `/#` plus an earlier role's id does the same.
- The existing Impact "View evidence" tests still pass.
- "View full résumé" links to the PDF with `target="_blank"`.
- No page-level horizontal overflow at 320px and 390px; the line scrolls inside its own row.
- With reduced motion, the current stop has no running animation.
- axe passes in Light, Dark and Pokémon.
