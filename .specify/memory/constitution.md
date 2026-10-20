# JessBuilds Portfolio Constitution
<!-- Starter constitution from the project template. Run /speckit-constitution to tailor it to this project; it will fill the bracketed placeholders and bump the version. -->
<!-- Starter 0.2.0: every change passes scripts/check and every review finding is fixed or answered in the PR. Principle III: each feature in its own worktree under .worktrees/, guide in docs/worktrees.md. -->

## Core Principles

### I. Spec Before Code
Every feature starts as a spec in `specs/NNN-feature-name/` (spec.md, plan.md, tasks.md) created through Spec Kit. Small changes (bug fixes, refactors, tweaks) may skip the spec, but anything that adds user-visible behavior may not. When implementation shows the spec is wrong, the spec is updated first, then the code.

### II. Test-First (NON-NEGOTIABLE)
Tests are written before implementation and must fail before any production code is written (red, green, refactor). Code written before its test is deleted and rewritten test-first. See `docs/testing.md` for what to test at which level.

### III. Superpowers Owns Implementation
Implementation of any Spec Kit task list MUST follow the Superpowers workflow: its own git worktree under `.worktrees/NNN-feature-name` on branch `NNN-feature-name` (see `docs/worktrees.md`), test-driven development, subagent-driven execution with spec-compliance review then code-quality review, code review, finish branch. `/speckit-implement` is not used in this project.

### IV. Simplicity
Build the smallest thing that satisfies the spec. No speculative abstractions, no features outside the current spec. Added complexity must be justified in plan.md or an ADR.

### V. Decisions Are Recorded
Architectural decisions (libraries, data stores, patterns, notable trade-offs) are captured as ADRs in `docs/adr/`. `docs/architecture.md` reflects the current system, and `docs/state.md` is updated at the end of each working session.

## Technical Constraints

- Stack: Next.js (App Router), React, TypeScript, Tailwind CSS; static site on Vercel; Playwright with axe for tests.
- Secrets never live in source control.
- No backend, forms, accounts or cookies. Contact is mailto; the resume is a static PDF.
- Every page works in all three themes (Light, Dark, Pokémon), at phone and desktop widths, by keyboard and with reduced motion, and passes axe.
- Free tooling only: no paid CI minutes and no API-billed actions.

## Development Workflow

- One feature per worktree and branch; the main checkout stays on `main`, which stays releasable.
- Every change passes `scripts/check`, and every review finding is fixed or answered in the PR.
- Commit messages: one short imperative sentence, e.g. "Add the MCP server to the pricewatch case study".

## Governance

This constitution supersedes other practice docs when they conflict. Amendments are made through `/speckit-constitution`, with the version bumped (MAJOR for removed or redefined principles, MINOR for added ones, PATCH for wording) and a short note of what changed.

**Version**: 0.2.0 | **Ratified**: 2026-10-20 | **Last Amended**: 2026-10-20
