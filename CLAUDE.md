# Project Instructions

This repository uses the reusable Claude Code workflow under `.claude/skills/`.

## Workflow bootstrap

`docs/PRD.md` is intentionally **not** included in the starter repository.

Before using `plan-work`, `implement-work`, or the downstream review/PR workflow for the first time, use the `create-prd` skill to establish:

- the project's canonical unit-of-work terminology;
- roadmap structure;
- branch naming;
- planning artifact behavior;
- whether learning mode is enabled.

Once created, `docs/PRD.md` becomes the canonical source for these workflow decisions.

Do not invent a parallel workflow configuration in this file that can drift from the PRD.

## Existing scaffold

The repository begins with a minimal Next.js + TypeScript application and reusable Claude Code skills. Treat the UI as a starter scaffold, not as an approved product specification.

Do not substantially expand the site until the PRD has been created and reviewed.

## Engineering defaults

- Prefer simple, readable implementations.
- Keep changes scoped to the current approved unit of work.
- Do not commit secrets or local credentials.
- Use the repository's workflow skills rather than allowing planning, implementation, review, and PR creation to collapse into one autonomous agent step.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
