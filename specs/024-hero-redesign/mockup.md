# Mockup: 024 hero redesign

Canvas: https://claude.ai/artifact/CBBwsPXeudSBdqEPHoVfjq (claude.ai Design canvas, "024 Hero Redesign")

Approved: 2026-10-20

Exploratory options this came from: https://claude.ai/artifact/EBCX6tTQu8TbeQnSUu6XWA (the owner picked option F, inspired by https://buscodes.tech/).

## What was approved

The six "F" boards at the top of the canvas (desktop and phone, in Light, Dark and Pokémon) show the approved design. The question rows below them are the alternatives the owner chose between.

- **Layout:** a centered hero, over a soft radial glow in the accent colors.
- **Headline (Q2 A):** "Hi, I'm Jessica" as the main heading, in a rose to mauve gradient (accent to accent-secondary).
- **Below the headline:** the role line (Senior Software Engineer · C#/.NET · Backend + Full Stack), the existing tagline (static, not rotating) and a shortened bio: "9+ years building and modernizing production .NET systems, with AI used inside a disciplined engineering process."
- **Actions:** a gradient primary "View Featured Work" button, the outlined "Download Resume" button, and the Email, GitHub and LinkedIn links.
- **Impact (Q4 A):** the four Impact numbers (9+, 95%, 81%, 50%) move into the hero under a thin motif divider (a sparkle in Light and Dark, a ribbon bow in Pokémon). Each keeps its link to its evidence anchor with a "View evidence ↓" cue. The separate Impact section is removed.
- **Scroll cue:** a small scroll cue sits under the numbers.
- **Theme toggle:** the existing Light / Dark / Pokémon pill toggle stays, with the "Theme" menu on phones. F's three-dot switch is not used.
- **Portrait:** no portrait in any theme. `HeroPortrait` (the arch photo) and `SylveonPortrait` (the Sylveon card) leave the hero.
- **Game (Q1 A):** in Pokémon, the "Take a play break" game launcher becomes a centered badge above the greeting, with the ribbon bow and "a Sylveon mini game". It stays in the centered column, so the layout doesn't shift.
- **Fairy:** in Light and Dark, a butterfly fairy drawn on a canvas over the hero only (pointer-events none), in the accent colors. It follows a mouse pointer with a sparkle trail, and drifts around the headline when idle.
- **Pokémon fairy (Q3 B):** a Sylveon ribbon fairy, a pink bow with pink and blue trailing ribbons and a pink and blue sparkle trail.
- **Fairy at rest:** with prefers-reduced-motion and on touch screens, the fairy rests still beside the name. It pauses when the hero is off screen.

## Files

`mockup/` is a byte-for-byte copy of the canvas files as approved. `Main.dc.html` is the shared hero component; every other board imports it with different props (theme, device, game, headline, pokemonFairy, impact, crop).
