# JessBuilds portfolio

Jessica Haynes's portfolio site, live at https://www.jessbuilds.dev. Next.js, React, TypeScript and Tailwind CSS, deployed by Vercel from `main`.

## Run it

```bash
npm ci
npm run dev
```

Then open http://127.0.0.1:3010.

## Check it

```bash
./scripts/check.sh
```

Format check, lint, Playwright tests and build: the same script CI runs on every pull request. On Windows PowerShell, use `./scripts/check.ps1`.

## How work gets done

New features are designed with Spec Kit and built with Superpowers, each in its own git worktree, then reviewed by the review panel and merged through a pull request with green CI. `CLAUDE.md` has the steps, `docs/ai-workflow.html` shows the whole flow as one diagram, and `docs/worktrees.md` covers working in worktrees. Product scope and the roadmap live in `docs/prd.md`.

To watch every feature in flight:

```bash
python3 scripts/dashboard.py --open
```
