# Working with worktrees

Every feature gets its own **git worktree**: a second folder of this repo, checked out on the feature's branch. The main checkout stays on the default branch (`main`). That lets two or three features be built at once, one Claude session each, without them stepping on each other or on you.

```
PortfolioWebsite/                main checkout, always on main: merges, pulls, quick looks
PortfolioWebsite/.worktrees/
  008-supplier-compare/          branch 008-supplier-compare: one Claude session works here
  009-csv-export/                branch 009-csv-export: another session works here
```

`.worktrees/` is gitignored, so these folders never get committed. They share one `.git`, so a commit made in any of them is visible from all of them straight away.

## Start a feature

From the main checkout, on an up-to-date `main`:

```powershell
git pull
git worktree add .worktrees/008-supplier-compare -b 008-supplier-compare main
```

Then do **everything** for that feature inside its folder: the mockup, every `/speckit-*` step, and the build. Open Claude there:

- **Claude desktop app:** when Claude creates the worktree, it starts a new session in that folder for you (CLAUDE.md, design step 0), and the session appears in your sidebar. To open one yourself, start a new session and pick `.worktrees/008-supplier-compare` as its folder.
- **Terminal:** `cd .worktrees/008-supplier-compare`, then `claude`.

Create the worktree with `git worktree add` yourself (or ask Claude to run that exact command). Claude's own worktree option picks its own folder and branch names, and then they don't match the spec number.

**Picking the number.** Use the next number not taken in `specs/` on `main` **and** not taken by any branch in `git worktree list`. Spec Kit only sees the folder it runs in, so two worktrees started from the same `main` would both pick the same number. Tell `/speckit-specify` the number: "Use feature number 008, short name supplier-compare."

**Setting up the new folder.** A worktree starts with only committed files:

- Install dependencies in it: `npm ci`. Superpowers' using-git-worktrees step does this and runs the tests once to prove the baseline is green.
- Copy gitignored config you need, such as `.env`, from the main checkout.
- Two features running dev servers at once need different ports. Tell the session which one to use, and run its tests with that port too: `$env:E2E_PORT = "3024"` in PowerShell before `npm run test:e2e` or `./scripts/check.sh`, so Playwright never reuses another checkout's server on 3010.

## Watch every feature at once

Run the dashboard from the main checkout and leave it open:

```powershell
python3 scripts/dashboard.py --open
```

It finds every worktree and `NNN-*` branch by itself and shows each feature's stage, task progress, current Superpowers task, reviewer verdicts, decision and CI, refreshed every 2 seconds. Click a feature to read its spec, reviews and decision. It only reads files, so it can't get in the way of a build. How it works out each stage: `scripts/dashboard.py`, `build_feature`.

## Watch the work in Claude

- **One session per feature.** Each session's sidebar row shows what it's doing, and its task list shows which step it's on.
- **Diff pane:** open a session's diff to see every change it has made in its worktree.
- **Side by side:** drag a second session from the sidebar onto the window, or right-click it and choose Open in > Split view, to watch two features at once.
- **Files:** the file pane opens files from the session's folder, so you can read a spec or a test while it works.

## Watch the work in VS Code

Pick whichever fits how you like to work.

**One window per feature (simplest).** Open the worktree folder as its own window:

```powershell
code .worktrees/008-supplier-compare
```

Everything in that window is that feature: Explorer, search, terminal, and Source Control, which shows its uncommitted changes as they happen.

**Everything in the main window.** The main checkout's Explorer still shows `.worktrees/` (greyed out because it's gitignored), and files open normally. Recent VS Code versions also list each worktree as its own repository in the Source Control view (setting `git.detectWorktrees`), so you can switch between them there. Two settings keep the main window fast and search results clean. Put them in your user settings, since `.vscode/` is gitignored:

```json
"search.exclude": { "**/.worktrees": true },
"files.watcherExclude": { "**/.worktrees/**/node_modules/**": true }
```

**Committed changes.** Source Control only shows what isn't committed yet, and Superpowers commits after each task. To see everything the feature has changed so far, use the Source Control Graph (click a commit to see its files) or run this in the worktree's terminal:

```powershell
git diff --stat main...HEAD
git log --oneline main..HEAD
```

## Watch from a terminal

From the main checkout, without opening anything:

```powershell
git worktree list                                         # every worktree and its branch
git -C .worktrees/008-supplier-compare status --short     # uncommitted changes right now
git log --oneline main..008-supplier-compare            # commits the feature has made
git diff --stat main...008-supplier-compare             # files changed so far
```

A live view that refreshes every 3 seconds (Ctrl+C to stop):

```powershell
while ($true) { Clear-Host; git -C .worktrees/008-supplier-compare status --short; git log --oneline -5 008-supplier-compare; Start-Sleep 3 }
```

## Finish a feature

1. From the worktree: open the PR, wait for `gh pr checks --watch` to be green, then merge (the merge gate enforces this).
2. Back in the main checkout:

```powershell
git pull
git worktree remove .worktrees/008-supplier-compare
git branch -d 008-supplier-compare
```

If `remove` refuses because the folder has uncommitted changes, look at them before doing anything else. Never add `--force` without checking what you'd lose.

## Gotchas

- **A branch can only be checked out in one place.** While `008-supplier-compare` has a worktree, `git checkout 008-supplier-compare` in the main checkout fails. Go to the worktree instead.
- **Don't build features in the main checkout.** Keep it on `main` so merges and the merge gate's local-merge rule always see a clean default branch.
- **Each worktree is a full copy of the build.** `node_modules`, `bin/` and `obj/` exist per worktree, which costs disk space. Remove worktrees once their PR merges.
- **Windows:** if a remove fails with "permission denied", close the VS Code window, dev server or terminal that has the folder open, then try again. If checkouts fail on long paths, run `git config --global core.longpaths true` once.
- **Per-worktree state is a feature:** Spec Kit's `.specify/feature.json` and Superpowers' `.superpowers/` progress log live in each worktree, so parallel features never share them.
