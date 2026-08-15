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
- Not a literal Pokémon fan site — no characters, sprites, or branded game assets.
- Not a generic dark-mode developer portfolio template.
- Not an overly minimal/sterile design.
- Not a contact form with backend infrastructure (mailto/social links only, for now).
- Not a multi-page site with dedicated project case-study pages (single-page scroll, for now).
- Not a dark mode / theme toggle.

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
- **Motion**: Subtle micro-interactions only (hover lift, soft shadow shift, smooth transitions). No card-flip, bounce, or heavy game-like animation.

## 9. Product Design / Interaction Model

- **Palette**: Soft pinks, blush tones, mauves, and warm neutrals — building on and extending the starter scaffold's existing lavender-leaning palette.
- **Shape language**: Rounded cards and buttons, soft shadows, consistent with a friendly-but-polished feel.
- **Typography**: Playful but clean — expressive enough to carry personality without sacrificing legibility or professionalism.
- **Signature motif**: A card-shaped UI treatment with subtle "rarity"/badge-style accents applied to Featured Projects (and optionally Experience entries) — an abstracted nod to collectible-card game aesthetics, using original visual language rather than any literal characters, sprites, or branded assets.
- **Theme**: Light theme only; no dark mode.
- **Overall tone target**: Friendly and feminine without being childish; personality-forward without undermining professional credibility for senior engineering roles.

## 10. High-Level Architecture / Technical Direction

- Built on the existing Next.js + TypeScript + Tailwind starter scaffold.
- Single-page site structure with anchor navigation (no routing complexity required for the initial release).
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
- Multi-page project case studies, a contact form, and dark mode are intentionally deferred beyond this initial release (see Non-Goals).
