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
