# Data Model: 024 Hero Redesign

The site is static, with no stored data. Two shapes matter.

## Impact metric (content, `src/data/impact.ts`)

It moves unchanged from `src/app/page.tsx`. The same four entries, in this order:

| Field      | Type               | Rule                                                                                                                                           |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | string             | Shown large, in gradient text: `9+`, `95%`, `81%`, `50%`.                                                                                      |
| `label`    | string             | Shown under the value, for example "Faster nightly job runtime".                                                                               |
| `category` | string             | Not shown in the hero, but kept in the accessible name: "Impact metric: {value} {label}. Category: {category}".                                |
| `href`     | `` `#${string}` `` | Must match an existing evidence anchor: `#experience-heading`, `#impact-nightly-job`, `#impact-security-flaws`, `#impact-support-escalations`. |

## Fairy state (runtime only, `src/lib/hero-fairy.ts`)

```text
                  pointer moves (mouse)
   ┌──────────┐ ─────────────────────────► ┌───────────┐
   │  intro   │                            │ following │◄──┐
   └────┬─────┘                            └─────┬─────┘   │ pointer moves
        │ 4.5 s elapsed                          │ 1.5 s still, or pointer leaves
        ▼                                        ▼         │
   ┌──────────┐◄──────── arrived or 1.5 s ─┌───────────┐   │
   │ resting  │                            │ settling  │───┘
   └────┬─────┘──── pointer moves ────────►└───────────┘   (resting also → following)
        │
   hero off screen (from any state) → paused; back on screen → resting
   reduced motion or no fine pointer → resting, and no other state is entered
```

| Field             | Meaning                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| `state`           | `intro`, `following`, `settling`, `resting` or `paused`                           |
| `x`, `y`          | The fairy's position in hero CSS pixels                                           |
| `target`          | The pointer, the intro drift path or the resting point, depending on state        |
| `rest`            | A point beside the end of the `h1`, re-measured on resize                         |
| `trail[]`         | Sparkles `{x, y, born, size, hue}`, each removed after 1.1 s; empty while resting |
| `stateSince`      | The time the state was entered, used for the 4.5 s and 1.5 s limits               |
| `lastPointerMove` | The time of the last mouse move over the hero                                     |
| `kind`            | `butterfly` (Light, Dark) or `ribbon` (Pokémon)                                   |

**Invariants**

- The animation loop runs only in `intro`, `following` and `settling`. Self-started motion (`intro`, or `settling` after the pointer stops) never exceeds 5 s.
- `resting` draws exactly one frame, and draws again only when the theme, size or rest point changes.
