---
name: create-pr
description: Use this skill when the user wants to create, open, or prepare a pull request for the current completed and reviewed unit of work, including requests like "create the PR", "open a pull request", "make the PR", or "submit this branch".
---

Create a pull request for the current completed and reviewed unit of work.

Invoking this skill means the implementation and PR review have been accepted by the user.

Do not modify application code, tests, product documentation, configuration, or the approved plan.

Do not merge the pull request.

## Workflow contract

Read `docs/PRD.md` and its Development Model.

Use:

- canonical unit-of-work terminology;
- current planning folder;
- configured `base_branch`;
- branch convention;
- Learning Mode.

Read the current unit's available artifacts:

- `plan.md`;
- `implementation-summary.md`;
- `review.md`;
- `pr-review.md`;
- `learning-checkpoint.md` when present.

Also inspect:

- current branch and commit history;
- complete diff against the base branch;
- build/test results available from implementation/reviews.

Use actual branch contents as the ultimate source of truth.

Do not claim work exists unless it is in the branch.

## Pre-flight checks

Before creating the PR:

1. Confirm current branch is not the configured base branch.
2. Confirm the branch corresponds to the current approved unit and configured branch convention.
3. Inspect the complete diff against the base branch.
4. Confirm the diff contains no:
   - unrelated work;
   - other roadmap items;
   - accidental local files;
   - secrets or credentials.
5. Check for meaningful uncommitted changes.
6. If meaningful uncommitted changes exist, stop and report them. Do not commit automatically.
7. Confirm the branch has commits not present on the base branch.
8. Check whether the branch has been pushed.

If branch name/content/diff does not correspond to the current unit, stop.

If unrelated work is mixed in, stop.

Do not rewrite history, force-push, rebase, squash, or merge automatically.

If only a normal push is required before creating the PR, you may push.

## Pull request title

Create a concise title describing the actual outcome.

Use the project's canonical terminology when it improves clarity.

Examples:

```text
Milestone 1: Add initial LLM interaction
```

```text
Feature: Add project portfolio filtering
```

```text
Add responsive project detail layout
```

Avoid vague titles such as:

```text
Updates
Changes
Work
Misc fixes
```

## Pull request description

Write for another engineer — and make it easy for someone browsing the repository to understand the progression.

Always include:

### Summary
Purpose and outcome of the change.

### What Changed
Concise bullets describing meaningful behavior/architecture. Do not list every file.

### Design / Tradeoffs
Important decisions, compromises, and deliberately deferred work when worth calling out.

### Validation
Only validation actually performed:
- build;
- tests;
- integration/manual checks;
- evaluation runs where relevant.

### Next Step
Briefly identify the next canonical roadmap item when one exists.
Do not over-describe future implementation.

## Conditional learning sections

If `learning_mode: enabled`, also include:

### Learning Objective
What concept or engineering principle this unit was designed to teach and why it appears at this point in the roadmap.

### What I Observed
Important behaviors, limitations, tradeoffs, or failure modes actually observed.

### Intentional Limitations
Limitations deliberately left unresolved for later learning work. Do not present them as accidental defects.

The learning narrative may communicate:

`What we built → What we observed → Why it matters → What comes next`

Do not make an early learning-stage implementation sound more production-ready than it is.

If `learning_mode: disabled`:

- omit the learning-only sections;
- do not invent a teaching narrative;
- keep the PR focused on engineering outcome, tradeoffs, and validation.

## AI-specific wording, when relevant

If the project/work uses AI:

- be technically precise;
- do not exaggerate model capability;
- distinguish deterministic application behavior from model behavior;
- distinguish implemented grounding/retrieval/evaluation from future plans;
- document intentional AI limitations when Learning Mode requires it.

Do not add AI terminology to non-AI projects.

## Keep the PR professional

The description should:

- be concise;
- be technically accurate;
- avoid marketing language;
- avoid exaggerated claims;
- avoid unnecessary implementation detail;
- use terminology consistent with `docs/PRD.md`;
- clearly distinguish current implementation from future plans.

## Create the PR

If GitHub CLI is installed and authenticated:

1. Push the current branch if necessary.
2. Create the PR with the generated title/description.
3. Target the configured base branch.
4. Do not merge it.

If GitHub CLI is unavailable or authentication fails:

1. Do not attempt unsafe workarounds.
2. Provide the finalized PR title and description.
3. Explain what prevented automatic creation.

## After creation

Report:

- PR title;
- canonical unit of work;
- source branch;
- target branch;
- PR URL, if created;
- whether the branch was pushed;
- issues encountered.

Do not begin another roadmap item.

Do not merge the PR.

Do not modify files after PR creation.
