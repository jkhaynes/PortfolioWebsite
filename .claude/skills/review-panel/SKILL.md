---
name: review-panel
description: Run the review panel on the current feature branch. Use after requesting-code-review, before opening the PR, or when the user types /review-panel. Spawns every .claude/agents/reviewer-*.md agent in parallel, loops fixes for at most 3 rounds, then runs the approver, which writes decision.md.
---

# Review panel

You orchestrate the panel for the feature in this worktree. You spawn the agents, wait for them, and write only two kinds of file yourself: SKIPPED review files and, when rounds run out, `decision.md`. You never write reviews, fixes or code. The dashboard (`scripts/dashboard.py`) reads the files this loop produces, so their names and first lines are a contract: keep them exact.

```
reviewers (all reviewer-*.md, in parallel) -> WAIT FOR ALL
   any CHANGES, round < 3 -> fixer -> next round
   any CHANGES, round 3   -> decision.md ESCALATE (you write it)
   none                   -> approver -> decision.md APPROVE | ESCALATE
```

## Set up

1. **Worktree and branch.** Run `git rev-parse --show-toplevel` and `git branch --show-current`. The branch must not be `main` or `master`. If it is, stop: features are built in their own worktree (`docs/worktrees.md`).
2. **Base branch.** `git symbolic-ref --short refs/remotes/origin/HEAD` gives `origin/<base>`. If that fails, use `master` if it exists, else `main`.
3. **Feature folder.** `specs/<branch>/` if it exists. Otherwise the `feature_directory` in `.specify/feature.json`. If neither exists, stop and tell the user which feature folder you expected.
4. **The panel.** Every file matching `.claude/agents/reviewer-*.md`. Each one's `name:` frontmatter is its `subagent_type`, and `<lens>` is the part of the file name after `reviewer-` (`reviewer-security.md` -> `security`). Adding a file adds a reviewer; nothing else needs to change.
5. **Round.** N = one more than the highest `reviews/round-<k>/` in the feature folder (1 if there are none). If N is 4 or more, stop: the 3-round limit in REVIEW.md is used up. Tell the user to look at the last round and the decision.
6. **Ports.** With `n` the feature number (`008` -> 8), the reviewer at position `i` in the panel (alphabetical, from 0) gets port `5100 + 10n + i`. Only reviewers that run the app use it. That leaves room for 10 reviewers per feature; past that, ports overlap the next feature's, so give the extra reviewers `5100 + 10n + 9` in turn, one at a time.

## Round N

1. Create `<feature folder>/reviews/round-<N>/`.
2. **Skips.** If a reviewer's frontmatter has a `review-paths` list, and no file in `git diff --name-only <base>...HEAD` matches any of its globs, don't spawn it. Write its file yourself:

   ```markdown
   VERDICT: SKIPPED

   No changed files match review-paths (<the globs>).
   ```

   A `review-paths` entry still in `[e.g. ...]` brackets is an unfilled placeholder: ignore it. With no real entries left, the reviewer always runs.
3. **Spawn the rest in one message**, so they run in parallel. Each gets this prompt, with absolute paths:

   `Feature folder: <path>. Worktree: <path>. Base branch: <base>. Review round <N>. Output file: <feature folder>/reviews/round-<N>/review-<lens>.md. Port: <port>.`

4. **WAIT FOR ALL.** Tell the user one short line as each verdict lands, for example `round 1: security PASS (2 of 4)`. The round is done only when every reviewer in the panel has a `review-<lens>.md` in the round folder. If an agent finishes without writing its file, or its first line isn't `VERDICT: PASS`, `VERDICT: CHANGES` or `VERDICT: SKIPPED`, stop and tell the user.
5. **Commit the round's reviews:** stage the round folder only, message `docs(review): panel round <N>`.

## Decide

- **No CHANGES:** go to **Approve**.
- **Any CHANGES, N < 3:** spawn `fixer` with the prompt
  `Feature folder: <path>. Worktree: <path>. Base branch: <base>. Fix review round <N>.`
  Wait for it. If `reviews/round-<N>/fixes.md` doesn't exist afterwards, stop and tell the user. Otherwise start **Round N+1**.
- **Any CHANGES, N = 3:** write `<feature folder>/decision.md` yourself:

  ```markdown
  ESCALATE

  ## Why
  Review rounds exhausted. Outstanding CHANGES in reviews/round-3/ from: <lenses>.

  ## For the owner
  Read the round-3 reviews and fixes.md, then decide: fix by hand, accept and answer the findings in the PR, or drop the feature.
  ```

  Commit it (`docs(review): rounds exhausted`) and go to **Report**.

## Approve

Spawn `approver` with the prompt
`Feature folder: <path>. Worktree: <path>. Base branch: <base>. Final round: <N>.`
When it finishes, read the first line of `decision.md`. It must be `APPROVE` or `ESCALATE`; anything else, stop and tell the user.

## Report

One short summary: rounds run, each lens's final verdict, the decision and its reason.

- **APPROVE:** next is the PR (CLAUDE.md implementation step 4). Put any findings that were dismissed in fixes.md into the PR's "Review findings not fixed".
- **ESCALATE:** quote the decision's "For the owner" section. Don't open the PR until the owner answers.

Never merge, never push to the default branch, and never edit a review, fixes or decision file written by an agent.
