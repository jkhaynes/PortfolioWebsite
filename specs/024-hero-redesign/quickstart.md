# Quickstart: validate the 024 hero redesign

## Prerequisites

Run these in PowerShell from the worktree `.worktrees/024-hero-redesign`:

```powershell
npm ci
npx playwright install
```

## Automated checks

```powershell
npx playwright test tests/e2e/hero.spec.ts tests/e2e/hero-fairy-model.spec.ts   # this feature
npx playwright test tests/e2e/accessibility.spec.ts tests/e2e/impact-navigation.spec.ts tests/e2e/ribbon-roundup.spec.ts tests/e2e/theme-toggle.spec.ts tests/e2e/card-structure.spec.ts tests/e2e/pokemon-polish.spec.ts
./scripts/check.sh                                                              # the one definition of green
```

Expected: all pass, and axe reports zero violations in Light, Dark and Pokémon at 390px and 1280px.

## Manual look

Start a dev server on a port other than 3010:

```powershell
npx next dev -p 3024
```

Open http://127.0.0.1:3024 and compare it against the six "F" boards on the approved canvas ([mockup.md](mockup.md)). Then check:

1. **Desktop, 1280×800, each theme**:
   - The greeting, both buttons and all four impact numbers show without scrolling.
   - The fairy drifts for a few seconds, then rests beside "Jessica".
   - Moving the mouse over the hero makes the fairy follow it with sparkles; it settles within about 3 s after the mouse stops.
2. **Pokémon**:
   - The "Take a play break" badge sits centered above the greeting, and the fairy is the ribbon bow.
   - Opening the game from the badge, then pressing Escape, returns focus to the badge.
3. **Impact numbers**: activating each one lands on its evidence, highlighted.
4. **Reduced motion** (in Chrome DevTools, Rendering panel, emulate prefers-reduced-motion): nothing moves, and the fairy rests beside the name.
5. **Phone**:
   - At 390px with touch emulated, the layout is one column, the buttons are full width and the numbers sit two by two.
   - The fairy rests beside the name.
   - At 320px there is no horizontal scroll.
6. **Keyboard**: tab through the hero; the focus order is badge (Pokémon only), View Featured Work, Download Resume, Email, GitHub, LinkedIn, then the four impact numbers, with a visible ring on each.
7. **Off screen**: scroll the hero away and back. The fairy pauses while it is off screen; in DevTools, the canvas's `data-fairy-state` shows `paused`, then `resting`.
