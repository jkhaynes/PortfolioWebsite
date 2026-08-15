---
name: plan-work
description: Use this skill when the user wants to plan, design, or prepare the next unit of project work before coding, including requests like "plan the next milestone", "plan the next feature", "what's next?", "let's plan the next piece", or "make a plan before we implement".
---

Read `docs/PRD.md` and identify the current or next unit of work using the canonical terminology and workflow configuration defined in its `Development Model` section.

Do not write or modify application code.

## Workflow contract

Read the `workflow` configuration from `docs/PRD.md` before planning.

Use:

- `unit_of_work`
- `unit_of_work_plural`
- `plan_root`
- `work_folder_pattern`
- `branch_pattern`
- `base_branch`
- `planning_artifacts`
- `learning_mode`

as the source of truth.

Never invent alternative terminology for the project's unit of work.

If the PRD is missing the Development Model/workflow configuration, stop and tell the user that the PRD should be created or updated with `/create-prd` before this shared workflow can plan consistently.

## Identify the work

1. If the user explicitly named the unit of work to plan, use that.
2. Otherwise, read the PRD roadmap and identify the next appropriate unit based on sequence, completion state, dependencies, and existing implementation.
3. Confirm that the selected work has not already been completed.
4. Use the canonical project term in all output. For example, say "milestone" in a milestone-based project and "feature" in a feature-based project — not "work item."

## Create the plan

Create a detailed but implementation-focused plan.

Always include:

### Overview
- Canonical unit identifier/name
- Intended outcome
- Why this work comes next

### Scope
- What will be built
- What is explicitly out of scope
- Any relevant dependencies or existing code to preserve

### Implementation Steps
- Ordered steps
- Important files/components expected to change
- Significant design decisions
- External integrations or configuration required

### Test Strategy
- Deterministic behavior that should be covered with automated tests
- Integration behavior that may need broader testing
- Manual validation or experimentation that is appropriate
- Do not invent tests for non-deterministic behavior that ordinary unit tests cannot prove

### Risks / Tradeoffs
- Important technical risks
- Assumptions
- Known constraints
- Decisions intentionally deferred

### Completion Criteria
- Concrete conditions that indicate this unit of work is complete
- Build/test expectations
- Documentation or validation expectations where relevant

## Conditional learning content

Read `learning_mode`.

If `learning_mode: enabled`, also include:

### Learning Objective
- Concepts or engineering principles being learned
- Why this implementation is useful for learning them

### Expected Limitations / Observations
- Limitations, tradeoffs, or failure modes intentionally worth observing
- Which are pedagogical scaffolding versus actual defects
- What the developer should inspect or experiment with

### Understanding Check
- What the developer should be able to explain after completing this unit
- How the next roadmap item is expected to build on these observations

Preserve the project's learning-first progression when the PRD calls for it.

If `learning_mode: disabled`:

- do not add artificial learning objectives;
- do not manufacture intentional failures for educational purposes;
- do not require a learning checkpoint.

## Save the plan

Resolve the planning folder from:

- `plan_root`
- `work_folder_pattern`

Create that folder if needed and write:

`plan.md`

inside it.

Keep all later workflow artifacts for the same unit in that same folder:

- `plan.md`
- `implementation-summary.md`
- `review.md`
- `learning-checkpoint.md` when used
- `pr-review.md`

If a plan already exists for this unit:

- update it only when the user is revising the plan;
- otherwise do not silently replace an approved plan.

## Source-control behavior

If `planning_artifacts: tracked`:

- the plan is part of the repository's engineering record;
- do not hide the planning folder from git.

If `planning_artifacts: local`:

- ensure the configured planning root remains excluded from source control according to the project convention;
- do not stage or commit the plan.

## Stop for approval

After writing the plan:

1. Summarize the plan concisely.
2. State the file path.
3. Call out any decision that deserves explicit human attention.
4. Stop.

Do not implement anything yet.

Invoking `/implement-work` later is the user's approval signal for the current plan.
