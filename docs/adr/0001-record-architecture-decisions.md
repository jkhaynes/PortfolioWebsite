# 0001. Record architecture decisions

**Status:** Accepted
**Date:** 2026-10-20

## Context

Decisions made during AI-assisted coding sessions are easy to lose once the session ends, and agents working on this repo later need the reasoning behind the code, not just the code.

## Options Considered

1. **Put decisions in CLAUDE.md**: always loaded, but bloats every session with context most tasks don't need.
2. **Rely on commit messages and PRs**: hard to find, and agents rarely search them.
3. **One ADR file per decision in docs/adr/**: small files, read only when relevant, indexed in README.md.

## Decision

Use ADRs in `docs/adr/`, indexed in `docs/adr/README.md`, with CLAUDE.md pointing to the folder.

## Consequences

- CLAUDE.md stays short.
- Each significant decision takes a few minutes to write up.
- Superseded decisions stay in history instead of being overwritten.
