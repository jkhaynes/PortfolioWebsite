# REVIEW.md

Guidance for every reviewer of this repo: the review panel (`.claude/agents/reviewer-*.md`, the fixer and the approver), the Superpowers task and code-quality reviews, `requesting-code-review`, and any PR bot. Read it before reviewing a change.

## Always check

- The change follows every principle in the constitution (`.specify/memory/constitution.md`).
- Each acceptance scenario in the feature's spec (`specs/NNN-*/spec.md`) has a test that exercises it.
- No secrets, keys, tokens or real credentials in code, config, tests or fixtures.
- Error handling follows the conventions in `CLAUDE.md`.
- `scripts/check` passes. A change that makes it fail is not done.

## Don't flag

- Style the formatter or linter already enforces.
- Decisions the owner recorded in a spec, plan or ADR (`docs/adr/`). If one looks wrong, say so once as a question, not a finding.
- Anything in this project-specific list:
  - Spec Kit's own files (`.specify/scripts/`, `.specify/templates/`, `.claude/skills/speckit-*`).
  - Copies of an approved canvas under `specs/*/mockup/`, kept byte-for-byte as approved.
  - Next.js's generated `next-env.d.ts`.

## Severity

| Level | Meaning | Blocks merge? |
|-------|---------|---------------|
| Critical | Wrong result, data loss, or a security hole | Yes |
| Important | A bug likely to happen in real use | Yes |
| Minor | Clarity, naming, small cleanups | No |

Only Critical and Important block. Every blocking finding is fixed (test-first) or answered in the PR's "Review findings not fixed" section.

## Review loop limits

- At most 3 review rounds per PR.
- From round 2 on, review only the new diff since the last round.
- Never repeat a finding that was already resolved or dismissed.
- When one bug appears in several places, flag the class once and list every location.

## Review panel

`/review-panel` (`.claude/skills/review-panel/SKILL.md`) runs after requesting-code-review, before the PR:

1. Every `.claude/agents/reviewer-*.md` reviews the branch in parallel and writes `specs/NNN-*/reviews/round-N/review-<lens>.md`.
2. Any CHANGES: the `fixer` agent fixes each Critical and Important finding test-first and writes `fixes.md` in the same round folder. Then the next round.
3. No CHANGES: the `approver` agent writes `specs/NNN-*/decision.md`, starting `APPROVE` or `ESCALATE`. It escalates money, auth, CI, hooks, dependencies, migrations, product decisions and changes from the approved mockup. APPROVE never merges by itself; the PR still needs green CI and the merge gate.
4. Round 3 with CHANGES still open: the skill writes an ESCALATE decision and stops.

The files are a contract. The dashboard (`scripts/dashboard.py`) reads them:

- A review file's first line is exactly `VERDICT: PASS`, `VERDICT: CHANGES` or `VERDICT: SKIPPED`.
- `decision.md`'s first line is exactly `APPROVE` or `ESCALATE`, followed by `## Why` and, when escalating, `## For the owner`.
- Review rounds and decisions are committed on the feature branch, so they stay with the feature after it merges.

**Adding a reviewer:** copy one of the `reviewer-*.md` files to `reviewer-<lens>.md` and change its name, description, focus and model. The panel and the dashboard pick it up with no other change; add it to the panel list in `docs/ai-workflow.html` too. Add a `review-paths:` list of globs to its frontmatter to skip it when no changed file matches (the UX and UI reviewers are set to `src/**` and `public/**`; a list still in `[e.g. ...]` brackets means "always run").

## Learned review rules

<!-- Added by the escaped-bugs loop: when a bug reaches `main` that a reviewer should have caught, add a one-line rule here, dated, with a link to the entry in docs/state.md. -->
