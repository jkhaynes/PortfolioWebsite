# Project Instructions

## Feature workflow

New features use the Superpowers skill flow. The custom skills under `.claude/skills/` (`plan-work`, `implement-work`, `review-work`, `review-pr`, `create-pr` and the rest) are legacy: do not use them for new work unless explicitly asked.

1. `superpowers:brainstorming` to settle the design. Skip it when an approved spec or design review already covers the feature.
2. `superpowers:writing-plans` to write the plan to `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`.
3. `superpowers:subagent-driven-development` (default) or `superpowers:executing-plans` to implement the plan task by task, test first.
4. `superpowers:finishing-a-development-branch` to verify the branch and open the PR.

`docs/PRD.md` stays the canonical source for product scope, the roadmap and branch naming (`feature/<slug>` off `main`). Do not duplicate those decisions here.

## Existing scaffold

The repository begins with a minimal Next.js + TypeScript application and reusable Claude Code skills. Treat the UI as a starter scaffold, not as an approved product specification.

Do not substantially expand the site until the PRD has been created and reviewed.

## Engineering defaults

- Prefer simple, readable implementations.
- Keep changes scoped to the current approved unit of work.
- Do not commit secrets or local credentials.
- Follow the Superpowers flow above rather than allowing planning, implementation, review, and PR creation to collapse into one autonomous agent step.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
