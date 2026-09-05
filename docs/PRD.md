# Product Requirements Document: Jessica Haynes Portfolio Site

**Status: APPROVED**

## 1. Product Overview

A personal portfolio and engineering site for Jessica Haynes, a Senior Software Engineer (C#/.NET). The site presents her professional credibility (experience, measurable impact, project work, engineering approach) alongside a distinctly personal aesthetic, so visitors come away thinking "clearly an experienced engineer, but this also feels uniquely hers."

## 2. Problem Statement

Generic developer portfolios tend to look interchangeable — dark-mode templates, sterile minimalism, or corporate boilerplate — and don't communicate personality or working style. Jessica wants a site that proves senior-level engineering credibility to recruiters and hiring managers while authentically reflecting who she is, without tipping into unserious or gimmicky territory.

## 3. Target Users / Stakeholders

- **Primary**: Recruiters and hiring managers evaluating Jessica for senior software engineering roles.
- **Secondary**: Engineers, peers, and potential collaborators who want to understand Jessica's work, technical interests, and engineering approach.
- **Site owner**: Jessica, who maintains the content and wants the site to feel like an authentic reflection of her rather than a resume clone.

## 4. Primary Use Cases / Workflows

- A recruiter lands on the site (often via a shared link on LinkedIn/email) and within seconds gets a sense of seniority and credibility via the hero and impact stats.
- A recruiter scans measurable outcomes and featured projects to assess technical depth and quality of work.
- A recruiter or hiring manager reads "How I Work" to gauge collaboration style and engineering values.
- A recruiter downloads Jessica's resume PDF and/or emails her or visits her LinkedIn/GitHub directly from the site.
- A visitor browses the site casually and comes away with a sense of Jessica's personality (soft/cute, collectible-card-inspired aesthetic) alongside her professional substance.

## 5. Goals

- Communicate senior-level engineering credibility quickly and convincingly (experience, measurable impact, project depth).
- Reflect Jessica's personal aesthetic (soft pinks/blush/mauve, playful-but-clean, subtle collectible-card inspiration) in a way that still reads as professional.
- Frame her growing interest in AI development and AI-assisted software engineering honestly as active exploration, not established specialization.
- Make it effortless for a recruiter to take the next step: email her, view her resume, or check her GitHub/LinkedIn.

## 6. Non-Goals

- Not positioning Jessica as an AI specialist or claiming AI expertise she doesn't yet have.
- Not a literal Pokémon fan site — character art and sprites are limited to the explicitly selected Pokémon mode (Feature 20).
- Not a generic dark-mode-only developer template — the light, pink/blush/mauve identity remains the default experience even after the dark variant ships (Roadmap Feature 18).
- Not an overly minimal/sterile design.
- Not a contact form with backend infrastructure (mailto/social links only, for now).
- Not a fully multi-page site — the homepage remains a single-page scroll; only Featured Projects with a full case study get a dedicated route (Roadmap Features 11–12).

## 7. Functional Requirements

### 7.1 Page Structure

The site is a single scrolling page with anchor-based navigation, containing the following sections in order:

1. **Hero** — name, title/positioning, a short personal-yet-professional statement, primary CTAs (resume download, email, GitHub/LinkedIn).
2. **Impact / Highlights** — the strongest evidence at a glance: a scannable stat strip of 2–4 quantified engineering outcomes, positioned near the top for time-pressed recruiters who may not read further.
3. **About Me** — personal narrative and background: who Jessica is, the kinds of problems she enjoys solving, and her personality, woven into a professional introduction.
4. **Featured Projects** — A curated set of projects, quality over quantity. Launches with at least one strong project and is designed to grow to 2–4+ as more are ready; the layout must read well with a single project, not just a full set. Each project entry includes a description of the problem/approach, relevant tech tags, and links to a live demo (when available) and/or GitHub repo. Styled with the site's card-based, rarity-accent visual motif.
5. **How I Work** — Jessica's engineering approach and values: quality, follow-through, collaboration, and improving systems.
6. **Experience** — the context behind the career: a timeline of roles giving depth and narrative to how Jessica got here, each including relevant tech tags and inline measurable outcomes. Distinct from Impact/Highlights, which surfaces the top-line numbers up front — Experience is where a reader who wants the fuller story goes to find it (rather than a separate skills list or a separate detailed impact section).
7. **Currently Exploring** — Jessica's growing interest in AI development and AI-assisted software engineering, framed as active exploration and learning rather than expertise.
8. **Contact** — email (mailto) and links to LinkedIn/GitHub. No contact form.

### 7.2 Skills / Tech Stack Representation

There is no standalone "Skills / Tech Stack" section. Technical skills are represented as tags/labels attached to individual Featured Projects and Experience entries, so every claimed skill is backed by evidence.

### 7.3 Resume

A prominent "Download Resume" action (in the Hero and/or Contact area) links to a resume PDF. The PDF file itself is supplied by Jessica during implementation.

### 7.4 Navigation

Anchor-based in-page navigation allows jumping directly to key sections (at minimum: Projects, Experience, Contact) from the top of the page.

## 8. Cross-Cutting / Non-Functional Requirements

- **Content accuracy**: Professional experience, impact metrics, technical claims, and project descriptions must reflect real, supportable work. Do not use fabricated metrics, placeholder achievements, or exaggerated claims to make the site appear more complete.
- **Responsiveness**: The site must be fully usable and visually polished across mobile, tablet, and desktop viewports.
- **Accessibility**: Semantic HTML, sufficient color contrast (notable given the pastel palette), keyboard navigability, and reasonable screen-reader support are expected throughout, not deferred to a final pass.
- **Performance**: Fast page loads; no heavy unnecessary assets or render-blocking animations.
- **Analytics**: Lightweight, privacy-friendly pageview analytics (no invasive tracking/cookies). Ships as its own post-launch feature — not required for initial launch.
- **Social sharing**: Custom Open Graph metadata (title, description, preview image) so shared links render a polished preview card. Ships as its own post-launch feature — not required for initial launch.
- **Motion**: Subtle micro-interactions only (hover lift, soft shadow shift, smooth transitions). No card-flip, bounce, or heavy game-like animation in ordinary portfolio browsing. Feature 20 permits necessary ribbon movement inside the explicitly started game, with optional effects suppressed under reduced motion and slower untimed practice available.

## 9. Product Design / Interaction Model

- **Palette**: Soft pinks, blush tones, mauves, and warm neutrals — building on and extending the starter scaffold's existing lavender-leaning palette.
- **Shape language**: Rounded cards and buttons, soft shadows, consistent with a friendly-but-polished feel.
- **Typography**: Playful but clean — expressive enough to carry personality without sacrificing legibility or professionalism.
- **Signature motif**: A card-shaped UI treatment with subtle "rarity"/badge-style accents applied to Featured Projects (and optionally Experience entries) — an abstracted nod to collectible-card game aesthetics, using original visual language in Light and Dark modes. The explicitly selected Pokémon mode adds contained Sylveon artwork and ribbon details (Feature 20).
- **Theme**: Light (pink/blush/mauve) is the default theme. The selector offers Light, Dark, and Pokémon (Features 18 and 20). With no saved choice, follow the system light/dark preference; Pokémon is selected explicitly and uses native light color-scheme. All three appearances meet the accessibility/contrast bar in this document.
- **Overall tone target**: Friendly and feminine without being childish; personality-forward without undermining professional credibility for senior engineering roles.

## 10. High-Level Architecture / Technical Direction

- Built on the existing Next.js + TypeScript + Tailwind starter scaffold.
- Primarily a single-page site with anchor navigation. Featured Projects that get a full case study (Loot Singles, PokéJudge) get their own dedicated routes (e.g. `/work/loot-singles`, `/work/pokejudge`) per Roadmap Features 11–12; this introduces minimal additional routing rather than a full multi-page restructure.
- No backend/server infrastructure required for contact (mailto-based) or resume (static PDF asset).

## 11. Data / Integration Strategy

- Resume: static PDF asset supplied by Jessica.
- Analytics: a lightweight, privacy-friendly analytics integration (exact provider decided during implementation).
- No database or CMS in initial scope; content (project write-ups, experience entries, stats) is authored directly.

## 12. Development Model

```yaml
workflow:
  unit_of_work: "feature"
  unit_of_work_plural: "features"
  plan_root: ".project-plans"
  work_folder_pattern: "<NN>-<slug>"
  branch_pattern: "feature/<slug>"
  base_branch: "main"
  planning_artifacts: "local"
  learning_mode: "disabled"
```

Note: the repository is not yet a git repository. `git init` (and creation of the `main` base branch) must happen before the branch/PR workflow can be used.

## 13. Roadmap

The roadmap is sequenced so the site can go live as soon as the core, actionable content is ready — launch does not require every section to be built first. Launch requires Features 1–3 (content) plus Feature 5 (launch readiness gate). Features 4 and 6 are intentional fast-follows that ship after initial launch.

1. **Design System & Foundation** — Establish the pink/blush/mauve/warm-neutral palette, typography, base layout and anchor navigation, card and button primitives, subtle motion primitives, responsive grid, and favicon. Everything downstream depends on this.
2. **Hero, Impact & About** — Build the first-impression flow: Hero section with primary CTAs, the Impact/Highlights stat strip, and the About Me narrative.
3. **Featured Projects, Experience & Contact** — Build the evidence-and-action core: Featured Project cards (with rarity-style accents, tech tags, live demo/GitHub links), the Experience timeline (with inline tech tags and measurable outcomes), and the Contact section (resume download, mailto, social links). **Once this feature is complete with real content, the site has everything a recruiter needs to evaluate Jessica and take action — this is the minimum launchable version.**
4. **How I Work & Currently Exploring** — Add engineering-philosophy and AI-exploration depth (narrative sections, not action-oriented). Intentionally sequenced as a fast-follow after the initial launch rather than a launch blocker, since it deepens the story rather than enabling a new action.
5. **Polish & Launch Readiness** — Cross-device/browser verification, accessibility pass, performance pass, real content proofread, final resume PDF wiring. Run against the Feature 1–3 scope as the gate for initial launch; revisit lightly once Feature 4 ships.
6. **Analytics & Social Metadata** — Lightweight, privacy-friendly pageview analytics integration and custom Open Graph metadata/preview image for social sharing. Ships after initial launch; not required to go live.

### 13.1 Post-Launch Improvement Roadmap

Following initial launch, a second round of improvements (sourced from `JessBuilds_Portfolio_Improvement_Roadmap.docx`, reviewed 2026-09-03) sharpens messaging, evidence, and interaction quality on top of the now-live site. These are additive to Features 1–6 above and adapted to the site's actual light (pink/blush/mauve) theme rather than the dark-mauve assumption in the source doc. Per the source doc's own guidance, ship one feature at a time rather than waiting for the full set — the hero rewrite, career-progression timeline, and first polished case study deliver most of the value on their own.

7. **Rewrite the Hero** — Replace tentative language ("lately, I'm expanding into AI-assisted development") with copy that presents AI-assisted engineering as a current practice: a role/stack eyebrow, one memorable headline, a two-sentence supporting paragraph, and two clear calls to action (e.g. "View featured work" / "Download resume"), keeping the first viewport focused on identity, value proposition, proof, and next action.
8. **Show 8am Career Progression** — Model 8am as a single timeline entry with two nested roles ("Team Lead / Senior Software Engineer IV," Jan 2024–present, and "Senior Software Engineer III," Mar 2022–Jan 2024), a small "Promoted" marker at the transition, and deep links from Impact metrics into the relevant role.
9. **Rebuild Page Hierarchy** — Reorder sections around the hiring manager's questions: Hero, Impact, Featured Work, Experience, How I Engineer, About, Contact. Remove the standalone "Currently Exploring" section from its current placement (see Feature 16), reduce repeated PokéJudge descriptions to one primary home, and add stable section IDs for navigation and metric deep-links.
10. **Reusable Project Showcase Component** — Replace the current project cards with one shared, data-driven component (problem statement, solution summary, technical decisions, build approach, status, links) used by both Loot Singles and PokéJudge, with distinct "View case study" and "View GitHub" actions so a third project only needs data, not new markup.
11. **Loot Singles Case Study Page** — Dedicated route (e.g. `/work/loot-singles`) telling the fuller story: operational context, the problems with printed invoices, V1 constraints and what was deliberately left out, workflow design, key engineering decisions, current status, and next steps, with an annotated screenshot and a compact workflow diagram. Updates the PRD's page-structure scope per the revised Non-Goals (§6) and Architecture (§10).
12. **PokéJudge Case Study Page** — Dedicated route (e.g. `/work/pokejudge`) presenting PokéJudge as a grounded AI decision-support system rather than a generic chatbot: the retrieve → clarify → re-retrieve → generate → validate pipeline explained in plain English, a sample conversation walkthrough with cited sources, and an honest evaluation section (dataset size, known limitations). Updates the PRD's page-structure scope per the revised Non-Goals (§6) and Architecture (§10).
13. **Screenshots & Media Behavior** — Capture one sanitized hero screenshot per featured project plus supporting detail shots for each case study; add a restrained image frame, a "View larger" modal with focus trapping/Escape/return-focus, and lazy-loading for below-the-fold images (first featured image loads eagerly).
14. **Impact Metrics as Navigation** — Turn the four impact stats (9+ years, 95% faster nightly job, 81% fewer security flaws, 50% fewer support escalations) into deep links into the Experience section, each labeled with its category (Experience, Performance, Application Security, Quality & Reliability) and briefly highlighting the target accomplishment on arrival.
15. **Rewrite "How I Engineer"** — Replace "How I Work" with four evidence-backed principles (start with the problem; design for change, not hypotheticals; use AI as an engineering tool; leave the system better), each paired with one concrete supporting example, scannable in about 30 seconds.
16. **Replace "Currently Exploring"** — Remove the duplicated PokéJudge description and either drop the section or replace it with a compact "Learning now" strip (3–4 current themes, one sentence on what's being learned), distinct from the tech-tag stack already shown on projects/experience.
17. **Trading-Card Visual Personality** — Add a restrained, original card-inspired motif (border/glow/rarity-accent/radius/shadow/motion tokens; a small rarity-style marker paired with text, never visual-only) applied mainly to Featured Projects, using the site's existing light pink/blush/mauve palette rather than new bright colors, with all decorative effects disabled under reduced-motion.
18. **Light/Dark Theme Toggle** — Add a user-facing control to switch between the current light theme and a new dark mauve variant, defaulting to the visitor's `prefers-color-scheme`, persisting their explicit choice, and meeting the same contrast/accessibility bar in both modes. Updates the PRD's theme scope per the revised Non-Goals (§6) and Product Design (§9).
19. **Accessibility, Responsiveness & Final Polish (Round 2)** — Re-run the Feature 5 audit against everything added in Features 7–18: both themes, the new case-study routes, screenshots/media, and the restructured hierarchy. Verify keyboard, focus, modal, and reduced-motion behavior throughout, and add page titles/meta descriptions/canonical URLs for the new case-study pages.

20. **Sylveon Pokémon Mode** — Add an opt-in third appearance alongside Light and Dark: regular Sylveon art, ivory/blush surfaces, rose actions, and restrained ribbon details. Preserve professional content and actual screenshots. Phase 1 delivers the theme and assets; Phase 2 adds the optional Ribbon Roundup game with a rare shiny bonus. Pokémon uses native light color-scheme, persists explicit selection, and never follows automatically from system preference. Character art and necessary gameplay motion are scoped to this mode; gameplay requires an explicit start.

## 14. Testing / Evaluation Strategy

- **Cross-device verification**: Manually verify layout and usability on representative mobile, tablet, and desktop viewport widths for every section.
- **Accessibility verification**: Check color contrast for all text/background combinations (particularly pastel-on-pastel combinations), verify keyboard navigation through all interactive elements (nav links, project links, resume download, contact links), and confirm semantic heading structure.
- **Link/asset verification**: Confirm all external links (GitHub, LinkedIn, live project demos), the resume PDF download, and the mailto link all function correctly.
- **Social preview verification**: Once Feature 6 ships, confirm Open Graph metadata renders a correct preview when the site URL is shared (e.g., via a link-preview debugging tool).
- **Content review**: Proofread all copy (About, Projects, Experience, How I Work, Currently Exploring) for accuracy and tone consistency with the intended personality-plus-professionalism balance.
- **Performance check**: Verify page load remains fast with real content and images in place (no unoptimized/oversized assets).

## 15. Security / Privacy Considerations

- No user data is collected beyond lightweight, privacy-friendly pageview analytics — no forms, no accounts, no cookies requiring consent banners.
- No secrets or credentials are required for the initial scope (mailto-based contact, static resume asset).

## 16. Success Criteria

### Product success
- A recruiter or hiring manager can, within seconds of landing, identify Jessica's seniority and the kind of impact she's had.
- The site is memorable and distinctly "her" — soft/cute personality reads clearly without undermining perceived professionalism or seniority.
- The AI-exploration framing reads as genuine curiosity and growth, not overstated expertise.
- It's effortless to take a next step: download the resume, email her, or visit GitHub/LinkedIn.

### Delivery / quality success
- All sections in the roadmap are implemented and match the approved design direction (palette, shape language, motion level, card/rarity motif).
- The site passes the cross-device, accessibility, link, and performance checks described in the Testing / Evaluation Strategy.
- No dark patterns, unnecessary tracking, or unused backend complexity (e.g., no contact form backend was built, per non-goals).

## 17. Open Questions / Deferred Decisions

- Exact analytics provider — to be decided during implementation (Feature 6).
- Source of the OG preview image — likely derived from a hero visual, finalized during Feature 6 (Analytics & Social Metadata) unless Jessica supplies one earlier.
- A contact form is intentionally deferred beyond this initial release (see Non-Goals). Dedicated case-study routes and a light/dark theme toggle are no longer deferred — see Roadmap Features 11, 12, and 18 (§13.1).
- Exact dark-theme palette values (Feature 18) and whether "Currently Exploring" is removed entirely or replaced with a compact strip (Feature 16) — to be decided when each feature is planned.
