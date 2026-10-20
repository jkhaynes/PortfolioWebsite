# 0002. Next.js static site on Vercel

**Status:** Accepted
**Date:** 2026-10-20 (records a choice made when the site was started in August 2026)

## Context

The site is a personal portfolio: a single scrolling homepage plus one route per case study, no accounts, no forms, no database. It needs fast pages, good image handling, Open Graph images, and preview deploys for each change.

## Options Considered

1. **Plain HTML and CSS**: nothing to learn, but every shared piece (cards, nav, case-study layout) is copied by hand.
2. **Next.js (App Router) + TypeScript + Tailwind on Vercel**: components and typed content data, built-in image optimization and OG image routes, and Vercel builds a preview for every PR and production from `main` with no workflow to maintain.
3. **A static site generator (Astro, Eleventy) on GitHub Pages**: also fine, but a deploy workflow to own and less overlap with the owner's React work.

## Decision

Option 2. Content lives in `src/data/`, pages in `src/app/`, shared UI in `src/components/`. Vercel's Git integration deploys; GitHub Actions only runs `scripts/check.sh`.

## Consequences

- `npm run build` must pass for a deploy, so CI runs it on every PR.
- Next.js changes quickly (dependencies are pinned to `latest` in package.json, locked by package-lock.json). Read `node_modules/next/dist/docs/` before relying on an API.
- Moving off Vercel would mean adding a deploy workflow.
