# CLAUDE.md

<!-- Keep this file short. It loads into every session. Put detail in docs/ and link to it. -->

## Project

**JessBuilds portfolio** (https://www.jessbuilds.dev): Jessica Haynes's portfolio site for recruiters and hiring managers, with case studies for her featured projects and three themes (Light, Dark, Pokémon).
Full product context: `docs/prd.md`. Current status and next step: `docs/state.md`.

## Commands

```bash
# Install: npm ci
# Run:     npm run dev                    # http://127.0.0.1:3010 (use `npx next dev -p <port>` for another port)
# Build:   npm run build
# Test:    npm run test:e2e               # Playwright (Chromium, plus Firefox and WebKit for theme specs); starts the dev server
# Lint:    npm run lint
# Format:  npm run format                 # Prettier; CI fails on unformatted files (format:check)
# Check:   ./scripts/check.sh             # format check, lint, test, build; the one definition of green
# Board:   python3 scripts/dashboard.py --open   # live, read-only view of every feature
```

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS, a static site deployed by Vercel from `main`; Playwright with axe for tests. Why: `docs/adr/0002-nextjs-on-vercel.md`.

## Conventions

- Layout: routes in `src/app/` (case studies under `src/app/work/<slug>/`), shared UI in `src/components/`, content in `src/data/`, theme and game logic in `src/lib/`, images in `public/`, tests in `tests/e2e/`.
- Every UI change works in all three themes (Light, Dark, Pokémon), at phone and desktop widths, with keyboard focus and reduced motion, and passes the axe checks.
- No em dashes in site copy or docs (`tests/e2e/copy-dashes.spec.ts` checks the copy).
- No backend, forms or cookies: contact is mailto, the resume is a static PDF.
- Never commit secrets. Local config goes in a gitignored `.env` (see `.env.example`).

## Temporary files

- Name throwaway files in the repo `<name>.tmp.<ext>` (gitignored by `*.tmp.*`).
- Temp folders, downloads and logs go in the session scratchpad, not the repo.
- Delete files with a plain `rm` on the exact file. Never `rm -rf`.
- Leave `.superpowers/sdd/tasks/` in place.

## Where things live

| Need                                        | Read                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| What we're building and why                 | `docs/prd.md`                                                                         |
| How the site fits together                  | `docs/architecture.md`                                                                |
| Why a past decision was made                | `docs/adr/` (index in `docs/adr/README.md`)                                           |
| How to test                                 | `docs/testing.md`                                                                     |
| Non-negotiable engineering rules            | `.specify/memory/constitution.md`                                                     |
| What reviewers check, severity, loop limits | `REVIEW.md`                                                                           |
| Feature specs, plans, tasks                 | `specs/NNN-feature-name/` (features 1 to 23: `docs/superpowers/` and the PRD roadmap) |
| Working in and watching worktrees           | `docs/worktrees.md`                                                                   |
| The whole AI workflow as one diagram        | `docs/ai-workflow.html` (open in a browser)                                           |

Read these when the task needs them, not up front. The skills in `.claude/skills/` other than `speckit-*` and `review-panel` (`plan-work`, `implement-work`, `create-pr` and the rest) are legacy: don't use them unless asked.

## Workflow

This project uses **Spec Kit for design** and **Superpowers for implementation**.

**1. Pick the track by size of change**

- **Feature** (new behavior, touches several files, worth remembering why): full Spec Kit track below.
- **Small change** (bug fix, tweak, refactor): skip Spec Kit. Use Superpowers directly (systematic-debugging for bugs, test-driven-development for everything else).
- **Spike / experiment**: Superpowers brainstorming, throwaway branch, no spec. If it survives, promote it to a feature.

**2. Feature track: design (Spec Kit owns this)**

0. Worktree first: from the main checkout on `main`, `git worktree add .worktrees/NNN-feature-name -b NNN-feature-name main` (NNN = next number unused in `specs/` and in `git worktree list`, starting at 024 to follow the PRD roadmap; use `git worktree add`, not Claude's own worktree tool, so names match). Then start a new Claude session with that folder as its working directory (in the Claude desktop app, start it yourself; elsewhere, tell the owner to run `claude` there) and continue the feature in that session. Every later step runs in that folder. Guide: `docs/worktrees.md`.
1. Mockup: any feature with new or changed UI gets a mockup on a claude.ai Design canvas before `/speckit-specify`. Planning waits for the owner's explicit approval. Record it in `specs/NNN-*/mockup.md` (canvas link, an `Approved: YYYY-MM-DD` line, what was approved), with a copy of the canvas files in `specs/NNN-*/mockup/`.
2. `/speckit-specify` : what and why, no tech choices. Give it the worktree's NNN.
3. `/speckit-clarify` : resolve ambiguity before planning
4. `/speckit-plan` : technical approach
5. `/speckit-tasks` : ordered task list
6. `/speckit-analyze` : consistency check across spec, plan, tasks

During these steps Spec Kit is the source of truth. Do not run Superpowers brainstorming or writing-plans on top of a Spec Kit feature; that creates a second, competing plan.

**3. Feature track: implementation (Superpowers owns this)**

Do NOT use `/speckit-implement`. Instead, for `specs/NNN-*/tasks.md`:

1. using-git-worktrees : confirms you're in the feature's worktree from design step 0, installs dependencies and checks the baseline is green
2. subagent-driven-development : one fresh subagent per task from tasks.md, test-first (red, green, refactor), spec-compliance review then code-quality review. When a task passes its review, check it off in tasks.md (`- [x]`) in that task's commit; Superpowers doesn't, and the dashboard and the approver count those boxes.
3. requesting-code-review, then `/review-panel` : every `.claude/agents/reviewer-*.md` in parallel, fixes for at most 3 rounds, then the approver writes `decision.md` (`REVIEW.md`, Review panel). On ESCALATE, stop and ask the owner. Findings left unfixed go in the PR's "Review findings not fixed".
4. Open a PR, wait for `gh pr checks --watch` to be green, then merge. The merge-gate hook (`.claude/hooks/merge-gate.py`) blocks merging on red, pushing to `main`, and local merges of a branch whose PR checks aren't green.

If implementation reveals the spec was wrong, stop and update spec.md/plan.md first, then continue.

**4. Before ending a session**

- Update `docs/state.md` (what changed, what's next, any blockers).
- Made a real architectural decision (library, data store, pattern, trade-off)? Add an ADR in `docs/adr/`.
- Changed how components connect? Update `docs/architecture.md`.
- Changed the workflow itself (this Workflow section, the review panel, hooks, `scripts/check`, the dashboard, `ci.yml`)? Update `docs/ai-workflow.html` to match.
- Did a bug reach main? Log it under Escaped bugs in `docs/state.md` and close the loop.

## Learned rules

<!-- Short rules from owner corrections, dated. -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
