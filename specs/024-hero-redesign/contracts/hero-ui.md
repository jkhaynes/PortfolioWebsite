# UI Contract: Homepage Hero

This is what tests and other parts of the site may rely on. Anything not listed here may change.

## Structure

| Element          | Contract                                                                                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Section          | `section.portfolio-hero` is the first child of `main#main-content` after `#top`.                                                                                                                                                                         |
| Heading          | Exactly one `h1` on the page, with the text "Hi, I'm Jessica" (curly or straight apostrophe, matched by tests as `/Hi, I.m Jessica/`).                                                                                                                   |
| Role line        | Text "Senior Software Engineer · C#/.NET · Backend + Full Stack".                                                                                                                                                                                        |
| Tagline          | Text "I build reliable software for messy, real-world problems."                                                                                                                                                                                         |
| Bio              | Text "9+ years building and modernizing production .NET systems, with AI used inside a disciplined engineering process."                                                                                                                                 |
| Primary action   | A link named "View Featured Work" with `href="#projects"` that moves focus to `#projects-heading` (unchanged behavior).                                                                                                                                  |
| Secondary action | A link named "Download Resume" with `href="/Jessica_Haynes_Resume.pdf"` that opens in a new tab.                                                                                                                                                         |
| Contact links    | Links named Email, GitHub and LinkedIn, with today's targets.                                                                                                                                                                                            |
| Impact links     | Four links whose names start "Impact metric:", inside the hero, with today's `href`s and click behavior.                                                                                                                                                 |
| Impact section   | No `#impact` element remains on the page.                                                                                                                                                                                                                |
| Game badge       | In Pokémon only: a button named "Take a play break", inside `.hero-game`, placed before the `h1` in DOM order, that opens the "Ribbon Roundup" dialog and returns focus to itself on close. In Light and Dark, `.hero-game` is hidden (`display: none`). |
| Portraits        | No `.hero-portrait` and no `.sylveon-portrait` element exists.                                                                                                                                                                                           |
| Fairy canvas     | `canvas.hero-fairy` inside the hero with `aria-hidden="true"`, computed `pointer-events: none`, `data-fairy-kind` set to `butterfly` or `ribbon`, and `data-fairy-state` set to `intro`, `following`, `settling`, `resting` or `paused`.                 |
| Scroll cue       | A decorative element with `aria-hidden="true"` that never animates.                                                                                                                                                                                      |

## Behavior

| When                                                             | Then                                                                                |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| The page loads with motion allowed and a fine pointer            | `data-fairy-state` is `intro`, then becomes `resting` within 5 s if no mouse moves. |
| A mouse moves over the hero                                      | The state becomes `following`.                                                      |
| The mouse stops (or leaves)                                      | The state becomes `settling`, then `resting`, within 5 s in total.                  |
| Reduced motion is on, or there is no fine pointer                | The state is `resting` from the first frame and never changes except to `paused`.   |
| The hero is scrolled off screen                                  | The state becomes `paused`; when it scrolls back, the state becomes `resting`.      |
| The theme changes to Pokémon                                     | `data-fairy-kind` becomes `ribbon`; in Light or Dark it becomes `butterfly`.        |
| `document.elementFromPoint` is called at any point over the hero | It never returns the canvas.                                                        |
