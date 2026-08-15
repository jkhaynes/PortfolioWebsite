---
name: review-pr
description: Use this skill when the user wants to review the current branch or changes before opening a pull request, including requests like "review my changes", "review this branch", "is this ready for a PR?", or "do a PR review".
---

Review the current changes as if you are a senior engineer performing a pull request review before merge.

This is review-only.

Do not modify code, tests, product documentation, configuration, project files, or git history.

The only file this skill may write is its PR review artifact.

## Workflow contract

Read `docs/PRD.md` and its Development Model.

Use:

- canonical unit-of-work terminology;
- current planning folder;
- configured `base_branch`;
- Learning Mode;
- planning artifact tracking behavior.

Read the current unit's available artifacts:

- `plan.md`;
- `implementation-summary.md`;
- `review.md`;
- `learning-checkpoint.md` when it exists and is relevant.

Then inspect:

- current git branch;
- complete diff against the configured base branch;
- commit history relevant to the branch;
- associated tests;
- surrounding code needed to understand impact.

Focus on the branch/diff, not a broad rewrite review of the whole repository.

## Branch check

Before reviewing:

1. Confirm current branch is not the configured base branch.
2. Confirm the branch appears to correspond to the current approved unit of work and configured branch pattern.
3. Review the complete diff against the base branch, not only uncommitted changes.
4. Check for unrelated work mixed into the branch.
5. If branch name/content/diff appears unrelated to the current plan, stop rather than reviewing mixed work.
6. Do not switch branches, rewrite history, rebase, merge, or force-push.

## Review priorities

Review in this order:

1. Correctness
2. Safety/security
3. Scope
4. Maintainability
5. Test coverage
6. Domain/integration-specific risks
7. Style

Do not prioritize style over functional issues.

## 1. Correctness

Look for:

- bugs;
- incorrect assumptions;
- broken control flow;
- edge cases;
- null/error handling;
- async/concurrency problems;
- resource-management issues;
- incorrect API/framework usage;
- state-management bugs.

Focus on meaningful risk, not remote theoretical possibilities.

## 2. Security and secrets

Check for:

- credentials/API keys/tokens;
- secrets in logs;
- sensitive config;
- unsafe user-controlled content;
- excessive error/log data;
- project-specific security concerns.

For AI-related changes, additionally consider when relevant:

- prompt injection;
- unsafe trust in retrieved/tool content;
- secret leakage into model inputs;
- model output used unsafely downstream.

Do not require future security infrastructure that the current scope does not yet need.

## 3. Scope and architecture

Check whether changes:

- stay within the approved unit;
- include unrelated work;
- implement future roadmap items;
- add unnecessary abstractions/dependencies;
- introduce architecture without a concrete need;
- conflict with PRD technical direction;
- silently change approved design decisions.

Do not penalize intentionally simple code merely because the final system may become more sophisticated.

## 4. Domain / AI-specific review

Review specialized concerns only when relevant to the actual code.

For AI work, this may include:

- system instructions vs. user content;
- prompt construction;
- supplied context;
- structured-output schemas;
- model-generated vs. application-owned state;
- assumptions the model may make;
- retrieval;
- chunking;
- embeddings;
- grounding;
- citations;
- tool calling;
- evaluation behavior.

Ask:

> Could this appear to work while relying on behavior the project did not intend?

For non-AI work, apply equivalent project-specific scrutiny rather than forcing an AI checklist.

## 5. Tests

Review whether tests:

- cover meaningful deterministic behavior;
- test behavior rather than incidental implementation details;
- include important failures/edges;
- would fail if the feature actually broke.

Do not require tests for every trivial line.

Do not use ordinary unit tests as proof of probabilistic AI correctness.

Distinguish appropriately between:

- unit tests;
- integration/contract tests;
- manual experiments;
- AI evaluation tests.

## 6. Conditional learning constraints

If `learning_mode: enabled`:

- do not flag a safe, explicitly planned pedagogical limitation solely because later work will improve it;
- verify intentional learning constraints were preserved;
- distinguish learning scaffolding from actual PR defects.

If `learning_mode: disabled`:

- review normally for delivery quality;
- do not preserve a defect merely because it could be educational.

## 7. Run validation

Where appropriate:

- build the project;
- run relevant tests;
- inspect failures.

Do not fix failures. Report them.

## Severity

### Blocker
Must be fixed before merge because of incorrect behavior, security/data-loss risk, broken build/tests, or violation of a core requirement.

### Major
Should be fixed before merge because of meaningful correctness, maintainability, architecture, or domain behavior problems.

### Minor
Worth improving but not necessarily merge-blocking.

### Note
Observation, question, or optional improvement.

Avoid severity inflation.

## Output

Write:

`pr-review.md`

inside the current unit's planning folder.

Overwrite an older PR review for the same unit.

Use:

### PR Review Summary
Include:
- canonical unit being reviewed;
- current branch;
- base branch;
- what changed;
- overall impression;
- build/test status.

### 🚫 Blockers
Include file/location, problem, why it matters, recommended direction.
If none: `None`.

### ⚠️ Major Issues
Same format.
If none: `None`.

### 🔎 Minor Issues
Concise.
If none: `None`.

### 💬 Review Notes
Optional questions/suggestions.

### Domain-Specific Review
Summarize specialized concerns relevant to the project.

If AI is involved, title this section `### 🤖 AI-Specific Review` and explicitly mention hidden model assumptions or AI-specific risks that matter now.

### 🧪 Test Review
Summarize:
- existing coverage;
- important gaps;
- build/test results;
- appropriate manual/evaluation work.

### 📦 Scope Check
Answer:
- Does the branch correspond to the current canonical unit?
- Does the diff contain only appropriate work?
- Is unrelated work mixed in?
- Did it implement future roadmap items?
- Did it introduce unnecessary architecture/dependencies?

If Learning Mode is enabled, optionally add:

### 🎓 Learning Constraint Check
State whether planned pedagogical limitations remain intentional and safe.

### Final Verdict
Choose exactly one:
- `Approve`
- `Approve With Minor Comments`
- `Request Changes`

Give a concise explanation.

## Planning artifact tracking

Follow the PRD's `planning_artifacts` setting.

This skill does not stage or commit its review.

## Console response

Reply only with:

- canonical unit;
- PR review file path;
- Final Verdict;
- one-sentence reason.

Tell the user to open the file for full detail.

Do not create the PR.

Do not implement review suggestions.

Do not start future work.
