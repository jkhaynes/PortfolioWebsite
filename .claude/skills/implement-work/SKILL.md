---
name: implement-work
description: Use this skill when the user wants to start, begin, implement, build, or work on the current approved unit of project work, including requests like "let's do the next milestone", "start the feature", "implement this plan", "let's build it", or "go ahead with the approved plan".
---

Read `docs/PRD.md` and the approved plan for the current unit of work.

Invoking this skill means the current plan has been reviewed and approved by the user.

Implement only that approved scope.

Do not expand into future roadmap items.

## Workflow contract

Read the `workflow` configuration from the PRD first.

Use the configured:

- canonical `unit_of_work` terminology
- `plan_root`
- `work_folder_pattern`
- `branch_pattern`
- `base_branch`
- `planning_artifacts`
- `learning_mode`

throughout this skill.

Resolve the current planning folder and read its `plan.md`.

If no current plan can be identified, stop rather than inventing one.

Never substitute a different term such as "milestone" or "feature" for the canonical project term.

## Branch setup

Before modifying application files:

1. Check git status and the current branch.
2. If there are meaningful uncommitted changes unrelated to the approved plan, stop and report them.
3. If currently on the configured `base_branch`, create and switch to a branch derived from the PRD's `branch_pattern`.
4. Fill placeholders in the branch pattern from the current plan, such as:
   - `<number>`
   - `<id>`
   - `<short-description>`
5. Keep the branch name short and descriptive.
6. If already on the correct branch for this unit, continue using it.
7. If already on a different feature/milestone/task branch that appears unrelated, stop rather than mixing work.
8. Do not delete, rename, merge, rebase, rewrite, or force-push branches automatically.
9. Confirm the branch name before beginning implementation.

All implementation for this approved unit should remain on this branch so it can later be reviewed with `/review-pr` and submitted with `/create-pr`.

## Before implementation

Before changing code, briefly summarize:

- which canonical unit of work is being implemented;
- what will be built;
- which files/components are expected to change;
- which planned behavior is deterministic and should be test-first;
- important constraints or intentional tradeoffs from the plan.

If `learning_mode: enabled`, also summarize:

- the main concept or engineering principle being learned;
- intentional limitation/experiment that must remain observable.

Then begin.

Do not ask for another approval. Invoking this skill is the approval to implement the existing plan.

## Test-driven implementation flow

Follow test-first development for behavior that is deterministic and reasonably unit/integration testable.

### What counts as deterministic

Ask:

> Given the same controlled input and environment, should this specific piece of logic produce the same observable result?

Examples of deterministic behavior include:

- parsing
- validation
- transformations
- branching/business rules
- state transitions
- formatting
- deterministic adapters when dependencies are controlled

Behavior that depends on live external/non-deterministic systems — for example a live LLM response, time-varying remote service, or probabilistic result — should not be given misleading unit tests that pretend its output is fixed.

Use the appropriate tool instead:

- integration testing
- contract testing
- manual experimentation
- fixtures/mocks for deterministic boundaries
- evaluation harnesses for probabilistic AI behavior

### 1. Red — tests first

Before implementation:

1. From the approved plan, identify each meaningful deterministic behavior.
2. Write tests for that behavior before implementing it.
3. Include expected edge/failure cases where useful.
4. If Learning Mode is enabled and the plan intentionally expects a deterministic behavior to be flawed or partial at this stage, test the behavior the plan explicitly intends to demonstrate rather than silently "fixing" it.
5. Confirm the tests fail or fail to compile because the implementation does not yet exist.

Do not write tests that assert an exact live-model or other inherently variable external response.

### 2. Green — implement

Implement the approved plan to make the tests pass.

Do not weaken or rewrite tests merely to accommodate an accidental implementation choice.

Then implement approved behavior that is not meaningfully unit-testable.

### 3. Final coverage review

After the implementation works end-to-end:

1. Inspect the actual diff.
2. Identify any deterministic behavior introduced during implementation that the original plan did not anticipate.
3. Add appropriate tests for meaningful gaps.
4. Re-run the full relevant test suite.

This final pass supplements test-first development; it does not replace it.

## Implementation requirements

### 1. Follow the approved plan

Treat the plan as the implementation scope.

Do not:

- add unrelated features;
- implement future roadmap items;
- expand architecture because it may be useful someday;
- quietly change major product or design decisions.

### 2. Keep architecture proportional

Follow the architecture and technical direction defined by the PRD.

Do not create unnecessary:

- services or deployment units;
- class-library/project splits;
- factories;
- infrastructure layers;
- message buses;
- abstractions;
- framework dependencies;

unless the current plan or an actual implementation need justifies them.

A conceptual responsibility does not automatically need its own project, interface, module, or service.

### 3. Do not silently redesign approved work

If implementation reveals a meaningful problem with the approved design:

1. Stop before making the material architectural/product change.
2. Explain:
   - what the issue is;
   - why the approved design causes it;
   - the change you recommend;
   - the effect on scope, tests, and later roadmap items.
3. If Learning Mode is enabled, also explain whether the change would undermine the intended learning objective or remove an intentional experiment.
4. Wait for user direction.

Small implementation details that do not materially alter the approved design do not require another approval.

### 4. Preserve understandability

Prefer code that is easy to trace and explain.

Do not introduce abstractions merely to make the code look "enterprise-ready."

For integrations and complex behavior, keep important inputs, outputs, state ownership, and dependency boundaries inspectable.

### 5. AI-specific implementation behavior, when relevant

If the current project/work actually involves AI, preserve visibility into relevant concepts such as:

- system instructions vs. user input;
- context supplied to the model;
- structured outputs;
- model responses;
- token/context behavior;
- embeddings;
- retrieved chunks;
- similarity results;
- tool calls;
- application-owned state versus model-generated output.

Do not introduce AI-specific architecture into projects or work that do not use AI.

If Learning Mode is enabled, avoid hiding the AI concept being learned behind a framework when seeing it directly is part of the approved learning objective.

### 6. Conditional learning-first behavior

If `learning_mode: enabled`:

- preserve intentional learning experiments from the plan;
- do not automatically solve a limitation that the plan intentionally wants the developer to observe;
- prefer small pedagogical scaffolding over large disposable architecture;
- use the project's learning loop when applicable:

`Build → Observe → Understand → Improve`

If `learning_mode: disabled`:

- do not preserve known defects merely for education;
- do not manufacture intentional limitations;
- optimize for the approved product/engineering outcome.

### 7. Tests

Tests for deterministic logic should be written first as described above.

Do not use ordinary unit tests to claim correctness for probabilistic behavior.

Keep test scope proportional to the current work.

### 8. Secrets and configuration

Do not commit credentials, API keys, secrets, tokens, or sensitive local configuration.

Use the repository's established secret/configuration approach.

Before finishing, verify no secret-bearing files have accidentally become tracked or staged.

### 9. Planning artifact tracking

Use the PRD's `planning_artifacts` setting.

If `tracked`:

- plans, implementation summaries, and reviews are part of the repository's engineering record;
- do not hide them from git.

If `local`:

- do not stage or commit those artifacts;
- keep them excluded according to the project's configured local convention.

## Validation

After implementation:

1. Build the relevant project/application.
2. Run relevant automated tests.
3. Confirm tests written in the Red step now pass without changing their intended meaning.
4. Fix implementation errors within approved scope.
5. Re-run validation.
6. Perform the final coverage-review pass and add any warranted deterministic tests.
7. Inspect git status for:
   - expected files;
   - unexpected/unrelated changes;
   - secrets;
   - planning artifacts handled according to the PRD configuration.

Do not implement future work while fixing current problems.

## Completion summary

Write the full implementation summary to:

`implementation-summary.md`

inside the current unit's planning folder.

Overwrite an existing summary for the same unit rather than appending stale runs.

Include:

### <Canonical Unit> Implemented
Use the project's canonical term and identify the unit.

### What Changed
Summarize meaningful implementation changes.

### Validation
Report:
- build result;
- test result;
- tests written in the initial Red step versus added during final coverage review;
- other validation actually performed.

### Design / Tradeoffs
Summarize important implementation decisions, tradeoffs, and intentionally deferred work.

If Learning Mode is enabled, also include:

### Intentional Limitations
List limitations/failure modes intentionally left observable and why.

### Learning Focus
Explain the concepts demonstrated by this implementation.

### What I Should Try
Give a small set of manual experiments or inspections that expose important behavior and limitations.

If Learning Mode is disabled, omit those learning-only sections unless the user explicitly asked for them.

### Git Status
Report:
- current branch;
- whether implementation changes remain uncommitted;
- unexpected files, if any;
- planning artifact tracking status.

This skill does not commit or push automatically unless the approved plan explicitly says otherwise.

After writing the file, reply with only:

- canonical unit name/identifier;
- summary file path;
- 2–3 sentences on build/test status and the most important implementation note.

Tell the user to open the file for full detail.

## Stop condition

Stop after the completion summary.

Do not automatically:

- start the next roadmap item;
- run `/review-work`;
- run `/learning-checkpoint`;
- run `/review-pr`;
- create or merge a pull request.

The user controls progression.
