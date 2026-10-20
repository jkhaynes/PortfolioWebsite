# Feature Specification: Hero Redesign

**Feature Branch**: `024-hero-redesign`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "Redesign the homepage hero of jessbuilds.dev exactly as approved in specs/024-hero-redesign/mockup.md: centered "Hi, I'm Jessica" gradient headline over a soft glow; role line, static tagline and shortened bio; gradient View Featured Work, outlined Download Resume, Email/GitHub/LinkedIn; the four Impact numbers move into the hero under a motif divider, each still linking to its evidence, and the separate Impact section is removed; small scroll cue; the existing Light/Dark/Pokémon pill toggle stays; no portrait in any theme; in Pokémon the "Take a play break" game launcher becomes a centered badge above the greeting; a decorative fairy over the hero only (butterfly in Light/Dark, Sylveon ribbon fairy in Pokémon) that follows a mouse pointer leaving a sparkle trail, drifts when idle, rests still beside the name for reduced motion and touch, pauses when the hero is off screen, and never blocks clicks. Must work in all three themes, phone and desktop widths, keyboard focus, reduced motion, and pass axe. No em dashes in copy."

**Approved mockup**: [mockup.md](mockup.md) (approved 2026-10-20). Where this spec and the mockup disagree on look, the mockup wins.

## Clarifications

### Session 2026-10-20

- Q: When nobody is moving the mouse, should the fairy keep drifting around the greeting forever, or settle beside the name after a few seconds? → A: On load it drifts briefly (under 5 seconds), then settles beside the name; it flies again only while the mouse moves over the hero, and settles a few seconds after the mouse stops or leaves (WCAG 2.2.2, no self-started motion longer than 5 seconds).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - A recruiter sees who Jessica is and proof of her work in one screen (Priority: P1)

A recruiter or hiring manager lands on the homepage. Without scrolling, the hero tells them who she is ("Hi, I'm Jessica"), her role and stack, her one-line pitch and a short bio, gives them the two main actions (see featured work, download the resume) and the contact links, and shows her four impact numbers. Each number takes them to the evidence for it.

**Why this priority**: The hero is the first and often only thing a recruiter reads. Putting the proof (the impact numbers) next to the pitch is the main reason for the redesign.

**Independent Test**: Load the homepage at desktop and phone widths in each theme and check that the greeting, role line, tagline, bio, both actions, three contact links and four impact numbers are present and readable, and that each number and action goes where it should.

**Acceptance Scenarios**:

1. **Given** a visitor opens the homepage on a desktop screen, **When** the page loads, **Then** they see, centered, the greeting "Hi, I'm Jessica" as the page's main heading, the role line "Senior Software Engineer · C#/.NET · Backend + Full Stack", the tagline "I build reliable software for messy, real-world problems.", the shortened bio, a "View Featured Work" button, a "Download Resume" button, Email, GitHub and LinkedIn links, and the four impact numbers (9+, 95%, 81%, 50%) with their labels.
2. **Given** the hero is showing, **When** the visitor activates an impact number, **Then** the page takes them to that number's evidence exactly as the Impact section's numbers do today (same targets, same highlight, same reduced-motion behavior).
3. **Given** the hero is showing, **When** the visitor activates "View Featured Work", **Then** they reach the Featured Projects section, as today.
4. **Given** the hero is showing, **When** the visitor activates "Download Resume", **Then** the resume PDF opens, as today.
5. **Given** the redesigned page, **When** the visitor scrolls past the hero, **Then** the next section is Featured Projects; there is no separate Impact section.
6. **Given** a phone-width screen, **When** the page loads, **Then** the same content shows in one centered column, the two actions stack full width, and the impact numbers sit in two rows of two.

---

### User Story 2 - The hero matches the chosen theme, and the theme toggle still works (Priority: P1)

A visitor switches between Light, Dark and Pokémon with the existing pill toggle (the "Theme" menu on phones). The hero takes each theme's colors: the gradient greeting, glow, primary button and impact numbers all use that theme's accent colors, and the motif divider above the numbers uses the theme's motif (a sparkle in Light and Dark, a ribbon bow in Pokémon).

**Why this priority**: The three themes are part of the site's identity, and every change must work in all of them.

**Independent Test**: Switch themes with the toggle and check the hero's colors, divider motif and contrast in each.

**Acceptance Scenarios**:

1. **Given** any theme, **When** the visitor picks another theme with the pill toggle, **Then** the hero restyles to that theme and the toggle shows the new choice, as today.
2. **Given** any theme, **When** the hero renders, **Then** no portrait is shown (no arch photo in Light or Dark, no Sylveon card in Pokémon).
3. **Given** any theme, **When** the hero's text is checked for contrast, **Then** all text, including the gradient greeting and gradient numbers, meets WCAG AA contrast against its background.

---

### User Story 3 - A Pokémon-theme visitor finds the game at the top of the hero (Priority: P2)

In the Pokémon theme, a "Take a play break" badge with the ribbon bow sits centered above the greeting. Activating it opens the Ribbon Roundup game, as the launcher in the Sylveon card does today. The badge does not shift the centered layout.

**Why this priority**: The game is a loved extra that the owner wants to keep, but it serves a smaller audience than the hero's main content.

**Independent Test**: In the Pokémon theme, find the badge above the greeting, open the game from it by mouse and by keyboard, close it, and check that focus returns to the badge.

**Acceptance Scenarios**:

1. **Given** the Pokémon theme, **When** the hero renders, **Then** a "Take a play break" badge sits centered above the greeting and is reachable by keyboard.
2. **Given** the badge, **When** the visitor activates it, **Then** the Ribbon Roundup game opens in its dialog, and closing it returns focus to the badge.
3. **Given** the Light or Dark theme, **When** the hero renders, **Then** no game badge is shown (the game stays a Pokémon-theme extra, as today).

---

### User Story 4 - A fairy adds a memorable touch without getting in the way (Priority: P3)

On a desktop with a mouse, a small fairy flies over the hero. In Light and Dark it is a butterfly in the theme's accent colors; in Pokémon it is a Sylveon ribbon fairy (a pink bow with pink and blue trailing ribbons). It follows the mouse pointer and leaves a short trail of sparkles in the site's sparkle motif. When the page loads it drifts briefly around the greeting, then settles beside the name; after the pointer stops or leaves the hero, it settles beside the name again within a few seconds. With reduced motion, or on touch screens, it rests still beside the name. It is decoration only and never blocks a click, tap, selection or focus.

**Why this priority**: It is the memorable detail of the chosen design, but the hero must be complete and usable without it.

**Independent Test**: On a desktop, move the mouse over the hero and watch the fairy follow; turn on reduced motion and on a touch device check that it rests still beside the name; click every hero link and button through the fairy's area.

**Acceptance Scenarios**:

1. **Given** a desktop with a mouse and motion allowed, **When** the visitor moves the pointer over the hero, **Then** the fairy follows it and leaves a fading sparkle trail.
2. **Given** the page has just loaded and no pointer is moving, **When** 5 seconds pass, **Then** the fairy has stopped drifting and rests beside the name.
3. **Given** the fairy is flying after the pointer, **When** the pointer stops or leaves the hero, **Then** within 5 seconds the fairy settles beside the name and stays still until the pointer moves over the hero again.
4. **Given** the visitor prefers reduced motion, **When** the hero renders, **Then** the fairy rests still beside the name, with no movement or trail.
5. **Given** a touch-only device, **When** the hero renders, **Then** the fairy rests still beside the name.
6. **Given** the fairy is anywhere over the hero, **When** the visitor clicks or taps any link or button under it, **Then** the link or button responds as if the fairy were not there.
7. **Given** the visitor scrolls the hero out of view, **When** it is off screen, **Then** the fairy stops animating, and it resumes when the hero is back in view.
8. **Given** assistive technology, **When** the hero is read out, **Then** the fairy is not announced.

---

### Edge Cases

- The theme changes while the fairy is flying: the fairy switches to the new theme's fairy and colors without a reload.
- The browser window is resized: the fairy stays within the hero and the resting fairy stays beside the name.
- Reduced motion is turned on or off while the page is open: the fairy switches between resting and flying.
- A device has both touch and a mouse: the fairy follows the mouse when one is used, and otherwise rests beside the name.
- Scripts fail or are slow to load: all hero text, actions, links and impact numbers still show and work; only the fairy is missing.
- Very narrow phone widths (320px): no horizontal scroll, the greeting wraps cleanly, and the resting fairy does not cover text.
- Someone arrives with an impact hash in the URL (for example `/#impact-nightly-job`): it still lands on that evidence, as today.
- Windows high contrast (forced colors): the gradient text and buttons stay readable.
- Pokémon theme on a phone: the game badge fits in the column without overflowing.

## Requirements _(mandatory)_

### Functional Requirements

**Content and layout**

- **FR-001**: The hero MUST be a single centered column on every width, matching the approved mockup.
- **FR-002**: The hero's main heading MUST read "Hi, I'm Jessica" and be the page's only first-level heading, drawn in a gradient from the theme's accent color to its secondary accent.
- **FR-003**: Under the heading the hero MUST show, in order, the role line, the tagline (static, never rotating) and the shortened bio "9+ years building and modernizing production .NET systems, with AI used inside a disciplined engineering process."
- **FR-004**: The hero MUST show a "View Featured Work" primary button with a gradient fill, a "Download Resume" outlined button, and Email, GitHub and LinkedIn links, with the same destinations and analytics events as today.
- **FR-005**: The hero MUST show a soft radial glow in the theme's accent colors behind the heading. The glow is decorative.
- **FR-006**: The hero MUST show the four impact numbers (9+ Years of experience, 95% Faster nightly job runtime, 81% Fewer security flaws, 50% Fewer support escalations) under a thin motif divider, each with a "View evidence" cue, four across on desktop and two by two on phones.
- **FR-007**: Each impact number MUST link to the same evidence target, with the same accessible name, scroll, focus, highlight and reduced-motion behavior as the current Impact section's numbers.
- **FR-008**: The separate Impact & Highlights section MUST be removed from the homepage.
- **FR-009**: The hero MUST end with a small decorative scroll cue that is hidden from assistive technology.
- **FR-010**: The hero MUST NOT show a portrait in any theme.

**Themes**

- **FR-011**: The existing Light / Dark / Pokémon pill toggle (and the phone "Theme" menu) MUST stay as it is.
- **FR-012**: Every hero color (gradient heading, glow, primary button, impact numbers, divider) MUST come from the active theme's colors, and the divider motif MUST be a sparkle in Light and Dark and a ribbon bow in Pokémon.

**Pokémon game**

- **FR-013**: In the Pokémon theme only, a "Take a play break" badge with the ribbon bow MUST sit centered above the heading and open the Ribbon Roundup game, keeping the launcher's current dialog and focus-return behavior.
- **FR-014**: The game MUST stay reachable in the Pokémon theme after the Sylveon card is removed from the hero; it MUST NOT appear in Light or Dark.

**Fairy**

- **FR-015**: A decorative fairy MUST be drawn over the hero only: a butterfly in the theme's accent colors in Light and Dark, and a Sylveon ribbon fairy (pink bow, pink and blue ribbons) in Pokémon.
- **FR-016**: With a mouse and motion allowed, the fairy MUST follow the pointer while it is over the hero and leave a short fading trail of sparkles. On page load it MAY drift around the heading for under 5 seconds, then MUST settle beside the name. When the pointer stops or leaves the hero, the fairy MUST settle beside the name within 5 seconds and stay still until the pointer moves over the hero again. The fairy MUST never move on its own for more than 5 seconds (WCAG 2.2.2).
- **FR-017**: With reduced motion preferred, or on a device without a fine pointer, the fairy MUST rest still beside the name, with no trail.
- **FR-018**: The fairy MUST stop animating while the hero is off screen and resume when it returns.
- **FR-019**: The fairy MUST never intercept clicks, taps, text selection or focus, and MUST be hidden from assistive technology.
- **FR-020**: The fairy MUST follow theme and reduced-motion changes made while the page is open.

**Quality**

- **FR-021**: The hero MUST pass the project's axe checks in all three themes, at phone and desktop widths.
- **FR-022**: Every interactive element in the hero MUST be reachable by keyboard in a logical order with a visible focus indicator.
- **FR-023**: The hero MUST not cause horizontal scrolling at widths down to 320px.
- **FR-024**: Hero copy MUST contain no em dashes.
- **FR-025**: All hero content and actions MUST work when the fairy cannot run.

### Key Entities

- **Impact metric**: a value, label, category and evidence target. The same four metrics the Impact section shows today, now shown in the hero.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At a 1280×800 desktop viewport, the greeting, both actions and all four impact numbers are visible without scrolling in every theme.
- **SC-002**: At a 390px phone width, the greeting, role line, tagline and both actions are visible in the first screen, and the impact numbers are reached within one scroll.
- **SC-003**: All four impact numbers reach their evidence in one activation, by mouse and by keyboard.
- **SC-004**: Automated accessibility checks report zero violations on the homepage in all three themes at phone and desktop widths.
- **SC-005**: With reduced motion on, nothing in the hero moves; with motion allowed and no pointer movement, nothing in the hero moves after the first 5 seconds.
- **SC-006**: Every hero link and button responds on the first click or tap anywhere in the fairy's area.
- **SC-007**: In the Pokémon theme, a visitor can open the game from the top of the hero in one activation.
- **SC-008**: The homepage's existing end-to-end checks for themes, navigation, impact links and the game pass after they are updated to the new structure.

## Assumptions

- The approved canvas (mockup.md) is the visual reference for sizes, spacing and colors; this spec does not restate pixel values.
- The page's document title, metadata and share image keep Jessica's full name; only the visible main heading changes to "Hi, I'm Jessica". The nav brand still reads "Jessica Haynes".
- The Pokémon mode hint in the About section stays as it is.
- The Ribbon Roundup game itself is unchanged; only where its launcher sits changes.
- The fairy's look follows the mockup's canvas drawings; small refinements to its drawing are allowed if the owner approves them in review.
- Tests that relied on the removed Impact section, the arch portrait or the Sylveon card are updated or replaced, not deleted without a replacement.
- "Touch screen" means a device whose primary pointer is coarse; such devices get the resting fairy.
