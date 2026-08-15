---
name: create-prd
description: Use this skill when the user wants to turn an idea into a defined project, create or substantially revise a PRD, explore requirements, define features, design the product before implementation, or establish a roadmap.
---

Guide the user from an initial idea to an approved Product Requirements Document.

The final artifact is:

`docs/PRD.md`

This is an **interactive discovery and design process**, not a one-shot document-generation task.

Do not implement application code.

# 1. Understand the starting point

Inspect the repository for useful existing context when one exists.

Relevant context may include:

- README files
- existing documentation
- source/project structure
- package or project files
- prototypes/scaffolds
- design notes
- `CLAUDE.md`
- an existing PRD
- visible repository conventions

Use existing context to avoid asking questions that are already answered.

Do not assume starter code represents an approved final design.

If `docs/PRD.md` already exists, read it first and determine whether the user wants to refine, expand, redesign, or replace it.

Preserve confirmed existing decisions unless the user chooses to change them.

# 2. Run an adaptive discovery conversation

## Start with an open context pass

Before asking structured discovery questions, first give the user one open-ended opportunity to share any additional context they already have about the project.

Ask a broad question such as:

> Before we get into specific questions, is there anything else you want me to know about the idea — features, goals, preferences, examples, constraints, concerns, things you definitely want or do not want, or anything else that might shape the project?

Do this before proposing features, narrowing scope, or asking targeted discovery questions.

Use whatever the user shares to shape the discovery conversation that follows.

If the user has already provided substantial free-form project context in the current conversation, do not make them repeat it. Acknowledge that context and proceed to focused discovery.

Interview the user until the project is defined well enough to plan without inventing major product behavior.

Ask one focused question at a time, or a small group of tightly related questions.

Do not send a large generic questionnaire.

Skip anything already answered.

Adapt each question to the idea, previous answers, and unresolved decisions.

Establish enough to understand:

- what is being built;
- why it should exist;
- who it is for;
- the problem or opportunity;
- what success looks like;
- core capabilities and workflows;
- initial scope;
- later or explicitly deferred ideas;
- important non-goals;
- meaningful constraints;
- data or integrations where relevant;
- important UX, interaction, or interface behavior where relevant;
- domain-specific risks or requirements where relevant.

Do not add features merely because similar products commonly have them.

If you think something should be added, present it as a recommendation and ask the user whether they want it.

## Scope classification

Keep these categories distinct:

- **Initial requirements** — behavior required for the initial planned product/release.
- **Deferred capabilities** — functionality the user wants, but has intentionally postponed.
- **Non-goals** — functionality or outcomes the project is explicitly not intended to support.

Do not place a deferred capability under current Functional Requirements.

Do not describe a requirement or constraint of a future deferred capability as a current Non-Goal.

When scope changes during discovery, reclassify the affected item rather than allowing it to appear in multiple categories.

## Decision discipline

Track material decisions as:

- **Confirmed** — explicitly chosen or approved by the user.
- **Open / Proposed** — not yet approved.
- **Deferred** — intentionally postponed because it can safely be decided later.

Do not present an assumption, inference, or recommendation as a confirmed requirement.

Ask for confirmation when a decision materially affects:

- scope;
- user experience;
- core workflows;
- architecture direction;
- security/privacy;
- roadmap;
- development workflow.

Only confirmed and intentionally deferred decisions should appear as settled choices in the approved PRD.

# 3. Make the product design complete enough

Before drafting the PRD, confirm that the product is designed enough that `/plan-work` will not need to invent major behavior.

Use the representation appropriate to the project.

Depending on the product, this may mean clarifying:

- primary user flows;
- screens, views, or information structure;
- API/service behavior;
- commands/interfaces;
- state transitions;
- roles and permissions;
- data flow;
- integrations;
- important failure paths;
- inputs and outputs.

Do not force every project into a UI-centric design process.

When the product's value depends materially on visual or interaction design, naming screens, sections, or pages alone is not enough. Establish the major experience with the user, including the important information hierarchy, navigation, interaction behavior, and broad visual direction.

Do not require pixel-perfect UI design or low-level technical contracts unless the user explicitly wants them.

## Domain-specific second pass

Once the basic product is understood, ask:

> What important concerns are common to this type of product that we have not discussed yet?

Explore only concerns that could materially affect requirements, architecture, risk, or roadmap.

Examples may include:

- identity and permissions;
- privacy or compliance;
- financial correctness;
- collaboration and ownership;
- retries/idempotency;
- concurrency;
- accessibility;
- reliability;
- offline behavior;
- data retention;
- AI grounding, uncertainty, evaluation, or human oversight.

These are examples, not mandatory requirements.

Only explore what is relevant to this project.

## Cross-cutting requirements

Identify cross-cutting requirements such as security, accessibility, responsiveness, privacy, performance, reliability, or observability when relevant.

These should apply throughout the appropriate roadmap items rather than being deferred entirely to a final "polish" feature.

A final audit or hardening item may still exist when it adds value beyond the baseline expected throughout development.

# 4. Keep product definition separate from implementation planning

The PRD should focus on:

- what is being built;
- why;
- for whom;
- product behavior;
- scope and boundaries;
- constraints;
- major design decisions;
- high-level technical direction;
- sequencing.

Leave detailed implementation choices to `/plan-work`, including:

- exact files;
- classes/modules;
- folder structure;
- exact libraries;
- low-level patterns;
- implementation steps;
- detailed test implementation.

Include a technical detail in the PRD only when it is a real project constraint or materially affects the product, architecture, or roadmap.

Unless explicitly established as project constraints, do not put exact source paths, route patterns, file formats, class/module names, package choices, or implementation-specific data representations into the PRD. Leave those to `/plan-work`.

# 5. Define the development model

Once the product is sufficiently understood, establish the workflow configuration used by the shared development skills.

## Canonical unit of work

Choose one term for the project's primary planned unit of development.

Examples:

- milestone
- feature
- story
- task
- phase

Prefer terminology already used naturally by the user.

If no obvious term exists, recommend one and confirm it.

Do not use competing terms for the same planning concept.

## Learning mode

Ask whether the project is intentionally being used as a structured learning project.

Allowed values:

- `enabled`
- `disabled`

Do not enable learning mode merely because the developer expects to learn while building.

If enabled, establish the main learning goals.

If disabled, downstream skills should not require learning checkpoints or manufacture educational failure modes.

## Planning artifacts

Determine whether workflow plans and reviews should be:

- `tracked` — committed as part of repository history;
- `local` — used by the workflow but excluded from source control.

## Required Development Model block

The PRD must include:

`## Development Model`

with:

```yaml
workflow:
  unit_of_work: "<singular canonical term>"
  unit_of_work_plural: "<plural canonical term>"
  plan_root: ".project-plans"
  work_folder_pattern: "<folder naming pattern>"
  branch_pattern: "<git branch naming pattern>"
  base_branch: "main"
  planning_artifacts: "tracked|local"
  learning_mode: "enabled|disabled"
```

Use the repository's actual base branch if it differs from `main`.

Keep branch and folder patterns simple and consistent with the canonical terminology.

# 6. Build a useful roadmap

The roadmap must use the canonical unit-of-work terminology consistently.

Each roadmap item should represent a cohesive increment of:

- product value;
- user capability;
- validated system behavior;
- or meaningful engineering outcome.

Do not mechanically create one roadmap item per:

- screen;
- page section;
- component;
- endpoint;
- entity;
- requirement heading.

A roadmap item may satisfy multiple related requirements.

A requirement may span more than one roadmap item.

## Roadmap quality gate

Before accepting the roadmap, check whether it simply mirrors screens, page sections, components, endpoints, entities, or requirement headings.

If it does:

1. reconsider whether related requirements can be grouped into more cohesive outcomes;
2. compare at least one alternative decomposition;
3. choose the decomposition that best represents meaningful delivery increments;
4. if the alternatives materially change sequencing or scope, show the tradeoff to the user before finalizing the roadmap.

Structural one-to-one roadmap items are acceptable only when there is a concrete reason they should be planned and delivered independently.

## Roadmap sizing check

After grouping requirements into cohesive outcomes, check that individual roadmap items have reasonably balanced scope.

Ask:

> Can this item reasonably be planned, implemented, reviewed, and submitted as one coherent change?

A roadmap item may be too large if it combines several independently valuable capabilities, unrelated concerns, or substantially different kinds of work.

A roadmap item may be too small if it delivers little meaningful value on its own and exists only because a screen, component, section, endpoint, or requirement was listed separately.

Prefer roadmap items that are:

- meaningful on their own;
- cohesive in purpose;
- reasonably reviewable;
- small enough for `/plan-work` to produce a focused implementation plan.

Do not force roadmap items to be equal in size. Use this as a sanity check, not a rigid sizing rule.

Each roadmap item should include enough for `/plan-work` to understand:

- name or identifier;
- intended outcome;
- meaningful scope;
- important dependencies or ordering, when relevant.

Do not include detailed implementation steps.

If learning mode is enabled, roadmap items may also include learning objectives or useful limitations to observe.

If learning mode is disabled, do not add artificial learning goals.

# 7. Review the design before approval

Before treating the PRD as final, present a concise design checkpoint to the user.

Include:

## Product Definition
- what is being built;
- primary user or stakeholder;
- problem;
- primary value.

## Initial Scope
- core capabilities;
- major workflows;
- important constraints;
- relevant cross-cutting requirements.

## Deferred / Later
- intentionally postponed ideas.

## Non-Goals
- important boundaries.

## Design Summary
Use the representation appropriate to the project.

## Development Model
- canonical unit-of-work term;
- learning mode;
- planning artifact behavior;
- branch convention.

## Proposed Roadmap
Summarize roadmap items as outcomes.

## Open Decisions
List any material decision still needing user input.

## Assumption Confirmation
Before drafting the PRD, explicitly surface any material scope exclusions, architecture choices, workflow choices, or product decisions that were inferred or recommended rather than directly confirmed.

Ask the user to confirm or change them.

Do not hide assumptions inside prose or treat a reasonable default as approval.

Resolve any decision that could materially change:

- primary users;
- initial scope;
- core behavior;
- major workflows;
- product boundary;
- architecture direction;
- security/privacy;
- roadmap structure.

Safe implementation details may remain deferred.

# 8. Draft, review, and finalize the PRD

Once the design is sufficiently complete, create or update:

`docs/PRD.md`

Create `docs/` if needed.

The first written version must be marked:

`**Status: DRAFT — Awaiting Product Design Approval**`

A PRD will often include:

1. Product Overview
2. Problem Statement
3. Target Users / Stakeholders
4. Primary Use Cases / Workflows
5. Goals
6. Non-Goals
7. Functional Requirements
8. Cross-Cutting / Non-Functional Requirements
9. Product Design / Interaction Model, when relevant
10. High-Level Architecture / Technical Direction
11. Technology Constraints, when established
12. Data / Integration Strategy, when relevant
13. Development Model
14. Roadmap
15. Testing / Evaluation Strategy
16. Security / Privacy Considerations
17. Success Criteria
18. Open Questions / Deferred Decisions

Do not include irrelevant sections just because they appear in this list.

## Testing / Evaluation Strategy

When the project has meaningful behavior or user workflows to validate, the Testing / Evaluation Strategy should explain **how we will determine whether the agreed requirements work as intended**.

Focus on validation at the product/design level, such as:

- important user journeys or workflows to verify;
- failure or edge behavior that requires validation;
- supported environments, devices, or platforms to check;
- accessibility, performance, security, reliability, or other cross-cutting requirements that require verification;
- evaluation approaches needed for behavior that cannot be validated by ordinary deterministic tests.

Do not simply repeat Success Criteria.

Do not prescribe exact test files, frameworks, commands, or implementation details unless they are established project constraints.

`Testing / Evaluation Strategy` answers:

> How will we validate this?

`Success Criteria` answers:

> What must be true for us to consider this successful?

## Success criteria

Where appropriate, distinguish between:

### Product success
Evidence that the project accomplishes its intended purpose for the target user.

### Delivery / quality success
Evidence that the implementation meets the agreed engineering expectations.

Do not invent quantitative KPIs if no meaningful metric exists.

## User review

After writing the draft:

1. Summarize the most important confirmed decisions.
2. Call out assumptions or recommendations that still need approval.
3. List deferred decisions.
4. Ask whether the user approves the design or wants revisions.

If changes are requested:

1. update the PRD;
2. re-check affected requirements and roadmap items;
3. present the updated summary.

Do not infer approval from silence or from having completed the questions.

Approval requires an explicit user signal after reviewing the synthesized design.

## Final validation

Before marking the PRD approved, verify:

- problem, users, goals, and scope are clear;
- material decisions are confirmed or intentionally deferred;
- no major open decision or unconfirmed material assumption is hidden;
- requirements describe product behavior rather than implementation detail;
- exact implementation paths, route patterns, formats, modules, or packages appear only when they are true project constraints;
- cross-cutting requirements are represented where relevant;
- roadmap items pass the roadmap quality gate and represent cohesive outcomes rather than copied document structure;
- experience-heavy products have enough design direction beyond merely naming screens/sections;
- roadmap terminology matches the Development Model;
- roadmap ordering and dependencies are sensible;
- the design is complete enough for `/plan-work`;
- success criteria reflect both product purpose and delivery quality where appropriate.

Fix inconsistencies before completion.

After explicit approval and successful validation, change the status to:

`**Status: APPROVED**`

# Final output

Once approved, report:

- PRD path;
- project name;
- one-sentence product definition;
- canonical unit-of-work terminology;
- learning mode;
- planning artifact mode;
- roadmap items;
- intentionally deferred decisions.

State that the project is ready for `/plan-work`.

Do not run `/plan-work` automatically.

Do not implement application code.

The user controls progression.
