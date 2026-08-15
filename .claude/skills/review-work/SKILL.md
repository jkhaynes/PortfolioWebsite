---
name: review-work
description: Use this skill when the user wants to review, validate, or check the unit of work that was just implemented against its approved plan and project requirements, including requests like "review what we built", "check this feature against the plan", "review the milestone", or "did we implement this correctly?".
---

Review the current implemented unit of work against its approved plan and `docs/PRD.md`.

This is a review-only stage.

Do not modify application code, tests, product documentation, or the approved plan.

The only file this skill may write is its own review artifact.

## Workflow contract

Read the PRD's `Development Model` workflow configuration.

Use the configured:

- canonical unit-of-work terminology;
- plan root and folder pattern;
- planning artifact tracking behavior;
- Learning Mode.

Resolve and read the current unit's:

- `plan.md`;
- `implementation-summary.md`, when present;
- implementation and relevant git diff.

If the current unit cannot be identified reliably, stop rather than guessing.

## Review goals

### 1. Scope adherence

Compare implementation against the approved plan.

Check for:

- missing planned work;
- unplanned features;
- work belonging to later roadmap items;
- unnecessary abstractions or complexity;
- architectural/product changes that were not approved.

Do not criticize intentional simplicity merely because future work may evolve it.

### 2. Correctness

Review for:

- bugs;
- incorrect assumptions;
- error-handling gaps;
- async/concurrency issues where relevant;
- misuse of frameworks/libraries/APIs;
- state-management problems;
- security/secret-management problems;
- tests that do not validate the intended behavior.

Run relevant builds/tests where appropriate.

Do not fix failures. Report them.

### 3. Technology/domain correctness

Review concerns relevant to the actual project and current scope.

For AI-related work, this may include:

- prompt construction;
- system vs. user instructions;
- supplied context;
- structured outputs;
- model assumptions;
- grounding/retrieval;
- embeddings;
- state ownership;
- evaluation behavior.

For non-AI work, apply the equivalent domain-specific review rather than manufacturing AI concerns.

Do not require capabilities intentionally deferred by the roadmap.

### 4. Test quality

Check whether:

- deterministic behavior has meaningful automated coverage;
- tests validate behavior rather than implementation trivia;
- important failure/edge cases are covered where appropriate;
- variable external/probabilistic behavior is not falsely "proven" by brittle unit tests.

### 5. Conditional learning review

If `learning_mode: enabled`, determine whether the implementation exposes the learning objective clearly.

Check:

- Is the important behavior visible and understandable?
- Has unnecessary abstraction hidden the concept?
- Were planned experiments/limitations preserved?
- Can the developer observe the expected failure modes?
- Did implementation accidentally solve a limitation intended for later learning?

Treat intentional pedagogical limitations as learning experiments, not defects, when they are safe and explicitly planned.

Compare expected limitations with what actually happened:

- present and observable;
- accidentally hidden;
- more severe than expected;
- different than predicted.

If `learning_mode: disabled`, omit this learning-specific evaluation. Do not downgrade correct production work for failing to expose a teaching moment.

### 6. Code quality

Evaluate normal software-engineering quality appropriate to the project:

- readability;
- naming;
- separation of concerns;
- duplication;
- testability;
- consistency with repository conventions.

Prefer proportional simplicity.

Do not recommend patterns, abstractions, projects, or infrastructure merely for aesthetic cleanliness.

## Output

Write the review to:

`review.md`

inside the current unit's planning folder.

If it already exists, overwrite it with the latest review.

Use these sections:

### <Canonical Unit> Review
State the canonical unit being reviewed and plan used.

### ✅ Matches the Plan
Briefly identify what was implemented correctly.

### 🚨 Must Fix
For each required fix include:
- file/location;
- problem;
- why it matters;
- recommended direction.

Do not implement fixes.

### ⚠️ Consider Improving
Worthwhile but non-blocking improvements. Avoid speculative cleanup.

If Learning Mode is enabled, also include:

### 🧪 Learning Observations
Important behaviors/limitations the developer should inspect and why they matter.

### 🎯 Learning Objective Check
Answer:
1. What was this unit intended to teach?
2. Does the implementation expose it clearly?
3. What should the developer be able to explain?
4. Is an abstraction hiding something important?

Omit these two sections when Learning Mode is disabled unless the user explicitly requests a learning-oriented review.

### 🧪 Test Review
Summarize test coverage, gaps, and build/test results.

### 📋 Plan Completion
Classify each planned step as:
- Complete
- Partially complete
- Missing
- Intentionally deferred

### Final Verdict
Choose exactly one:
- `Ready to Complete`
- `Ready After Minor Fixes`
- `Needs Revision`

Give a concise reason.

## Planning artifact tracking

If `planning_artifacts: tracked`, the review is intended to be committed later, but this skill does not stage or commit it.

If `planning_artifacts: local`, do not stage or commit the review.

## Console response

After writing the review, reply only with:

- canonical unit name;
- review file path;
- Final Verdict;
- one-line reason.

Tell the user to open the file for the full review.

Do not begin the next unit of work.

Do not modify files other than the review artifact.

Do not automatically fix findings.
