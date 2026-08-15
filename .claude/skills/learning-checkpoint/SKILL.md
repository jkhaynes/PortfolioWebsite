---
name: learning-checkpoint
description: Use this skill when the user explicitly wants to verify understanding, be quizzed on recently completed work, or run a learning checkpoint. Automatically treat it as part of the normal workflow only when the project's PRD has learning_mode enabled.
---

Run an interactive understanding checkpoint for the current completed unit of work.

This skill is optional.

It is a normal workflow stage only when the PRD's `learning_mode` is `enabled`.

Do not modify application code or product documentation.

The only file this skill may write is its checkpoint transcript.

## Workflow contract

Read `docs/PRD.md` and its Development Model.

Resolve:

- canonical unit-of-work terminology;
- current planning folder;
- `learning_mode`;
- planning artifact tracking behavior.

Read the current unit's:

- `plan.md`;
- `implementation-summary.md`;
- `review.md`;
- relevant implementation/code.

### If Learning Mode is disabled

If the user explicitly invoked this skill anyway, proceed as an optional engineering-understanding checkpoint.

Do not imply that passing it is required before PR review.

Focus on understanding the implementation, architecture, tradeoffs, and relevant technologies rather than inventing a formal learning curriculum.

If the skill was selected automatically rather than explicitly requested and Learning Mode is disabled, stop and state that the project does not include a required learning checkpoint.

## Quiz approach

Ask questions one at a time.

Wait for the user's answer before asking the next.

Use approximately 5–8 questions depending on scope.

Prioritize understanding over memorization.

Questions may focus on:

- why something was implemented this way;
- how data/control flows through the implementation;
- responsibility boundaries;
- assumptions and tradeoffs;
- failure modes;
- how changes would affect behavior;
- relevant framework/domain concepts;
- why later roadmap work may be needed.

For AI work, appropriate questions may include:

- what is actually sent to the model;
- system instruction vs. user content;
- model responsibility vs. application responsibility;
- structured output vs. semantic correctness;
- grounding/retrieval limitations;
- probabilistic vs. deterministic behavior.

Do not force AI questions into non-AI work.

Avoid trivia such as exact method names unless the method itself represents an important concept.

## Follow-up behavior

After each answer:

1. Rate it:
   - Correct
   - Mostly correct
   - Needs clarification
2. Briefly explain what was missed.
3. Give a polished interview-style explanation when useful.
4. Provide a short memory trick when it genuinely helps.
5. If a misconception needs probing, ask a short follow-up before moving on.

Do not give the answer before the user attempts the question.

## Learning-mode-specific behavior

If `learning_mode: enabled`:

- use the plan's Learning Objective and Expected Limitations/Observations;
- ask at least one question about an intentional limitation or tradeoff;
- verify the developer understands why that limitation exists and how later work addresses it;
- do not quiz on concepts explicitly deferred to later roadmap items.

If Learning Mode is disabled:

- do not manufacture expected failures;
- focus on explainability of the actual completed work.

## Recording the transcript

Keep the quiz fully interactive in the console.

Track:

- each question;
- the user's raw answer verbatim;
- feedback;
- follow-up question/answer where applicable;
- polished explanation and memory trick when provided.

At the end, write:

`learning-checkpoint.md`

inside the current unit's planning folder.

If it exists, overwrite it with the latest run.

Structure:

## Q&A Transcript

For each top-level question include:

- Question
- User Answer
- Assessment
- Feedback
- Polished Explanation, if given
- Memory Trick, if given
- Follow-up, if any

Then append the Final Assessment.

## Final assessment

### Learning Checkpoint Result

Choose:
- `Strong`
- `Developing`
- `Needs Review`

### Concepts I Understand
Brief list.

### Concepts to Reinforce
Brief list.

### <Canonical Unit> Takeaway
Give 2–4 important things to remember.

### Interview Readiness
Give 1–3 realistic questions and what a strong answer should cover.

### Recommendation

If Learning Mode is enabled, choose:
- `Ready for PR Review`
- `Review These Concepts First`

If Learning Mode is disabled, choose:
- `Understanding Check Complete`
- `Optional Review Recommended`

Do not make PR readiness depend on this checkpoint when Learning Mode is disabled.

## Planning artifact tracking

Follow the PRD's `planning_artifacts` setting.

This skill never stages or commits the checkpoint itself.

## Stop condition

Do not start another unit of work.

Do not modify code or product documentation.

Do not run `/review-pr` automatically.
