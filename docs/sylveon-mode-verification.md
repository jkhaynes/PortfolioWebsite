# Sylveon mode verification

Verified 2026-09-05 on `feature/sylveon-pokemon-mode`.

## Delivered behavior

Light, Dark, and Pokémon remain available globally. Pokémon is explicitly selected and uses the pink Sylveon palette with native light controls. Stored choices survive reloads and routes; system preference is followed only without an explicit choice. Blocked storage preserves the current document's selection without preventing browsing.

The homepage's play-break button opens Ribbon Roundup to instructions. Timed rounds last 30 active seconds; practice is slower and untimed. Pink ribbons score 10, a rare blue ribbon scores 50 and changes the sprite for five active seconds. Practice does not update timed best scores. Closing, navigating away, or leaving Pokémon mode dismisses the game; backgrounding pauses it until Resume.

## Phase 3 corrections

- Bound modal height by both viewport and available containing-block height. At doubled CSS zoom, the previous viewport-only limit let the modal extend above and below the visible screen.
- Restore focus to the known launcher instead of assuming mouse activation focused it. Skip focus restoration during React's development effect replay. This fixes WebKit's initial and restored dialog focus.
- Prevent default pointer behavior on held movement buttons before assigning focus/capture. WebKit otherwise cleared the held direction through a subsequent blur.
- Reconciled PRD theme, artwork, and motion requirements with the opt-in experience.

## Checks and results

| Scope | Result |
| --- | --- |
| Lint, TypeScript/production build, diff whitespace | Passed |
| Chromium | Full existing regression suite plus new polish tests; affected tests rerun successfully after fixes |
| Firefox | 19 theme/game/polish cases passed; affected game/polish cases also rerun after fixes |
| WebKit | All 19 theme/game/polish cases passed after fixes |
| Theme and routes | All three themes on homepage and both case studies, at 320/390/768/1440px; no horizontal overflow |
| Game access | Keyboard, pointer hold, real touch events, Escape, focus containment/restoration, background pause and cross-tab theme dismissal |
| Scoring | Deterministic model tests for collision edges, one-time scoring, frame-rate independence, bonus lifetime, round end, replay, practice and malformed scores |
| Accessibility | Existing axe page checks in all three themes; game dialog axe checks including small-screen practice; reduced-motion and doubled CSS zoom checks |
| Deferred loading | No game bundle or game sprites before activation, including in Pokémon mode; bundle loads when the game opens |
| Artwork stability | Portrait bounds remain identical before and after deliberately delayed image loading; no browser page errors in that test |
| Lifecycle | Closing resets score/time on reopen; navigation removes the dialog and restores page scrolling |

The configured suite contains 102 cases: 64 Chromium cases and 19 focused cases each for Firefox and WebKit. The initial cross-browser attempt required unsandboxed browser launch permissions in this Windows environment. Results above include successful targeted reruns after defects were corrected.

Run locally:

```sh
npx playwright install
npm run lint
npm run build
npm run test:e2e -- --workers=2
```

For only the new polish checks: `npx playwright test tests/e2e/pokemon-polish.spec.ts`.

## Visual review

Reviewed the actual desktop and mobile game captures for legibility, control spacing, restrained pink/blue use and character sizing:

- [Chromium desktop](mockups/ribbon-roundup-desktop.png)
- [Chromium mobile](mockups/ribbon-roundup-mobile.png)
- [WebKit desktop](mockups/ribbon-roundup-webkit.png)
- [Firefox mobile](mockups/ribbon-roundup-firefox.png)

Browser backdrop blur and font rendering differ slightly; the dialog remains readable with the solid tinted backdrop. Essential gameplay motion remains under reduced motion, while the decorative shiny sparkle is removed and slower untimed practice is available.

These are automated desktop browser engines and emulated viewport/touch checks on Windows, not physical iPhone/Safari or screen-reader certification. The zoom regression uses CSS page scaling plus narrow-viewport reflow, rather than claiming a physical-device browser zoom audit. No production deployment was performed.

## Final polish verification

The final review includes mouse-follow movement, game result cards, stationery borders, the portrait ear twitch, and the user-provided project-card peek artwork. New visitors continue to follow their browser preference; returning visitors retain their explicit theme selection.

Lint and production build passed. All 64 Chromium cases passed, followed by all nine polish cases across Chromium, Firefox, and WebKit. The delayed-artwork test now intercepts the original PNG and asserts it is unloaded before releasing the request.
