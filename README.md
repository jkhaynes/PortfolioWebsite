# Personal Website Starter

A minimal Next.js + TypeScript starter repository with a reusable, human-in-the-loop Claude Code development workflow.

## First-time setup

```bash
npm install
npm run dev
```

Then open the local URL printed by Next.js.

## Start the workflow

This starter intentionally does **not** contain a PRD.

The first project-design step is:

```text
/create-prd
```

or simply ask Claude naturally to create the PRD for the project.

That skill creates `docs/PRD.md`, which becomes the source of truth for project terminology, roadmap structure, branch naming, planning artifacts, and whether learning mode is enabled.

After the PRD is reviewed, the reusable workflow is:

```text
create-prd
   ↓
plan-work
   ↓
human review
   ↓
implement-work
   ↓
review-work
   ↓
(optional) learning-checkpoint
   ↓
review-pr
   ↓
create-pr
```

## Claude Code skills

Reusable skills live under:

```text
.claude/skills/
```

Included skills:

- `create-prd`
- `plan-work`
- `implement-work`
- `review-work`
- `learning-checkpoint`
- `review-pr`
- `create-pr`

The skills are intentionally generic so this workflow can be reused across other repositories.

## Important

The existing homepage is only a starter scaffold. The PRD should define the actual website scope and roadmap before substantial implementation begins.
