# Testing Strategy

<!-- The constitution says tests come first. This file says what kind of tests, where they go, and how to run them. -->

## Run

```bash
# Everything CI runs:  ./scripts/check.sh            # format check, lint, Playwright, build
# All Playwright:      npm run test:e2e              # starts `npm run dev` on :3010, or reuses one already running
# One spec:            npx playwright test tests/e2e/theme-toggle.spec.ts
# Chromium only:       npx playwright test --project=chromium
# Debug a failure:     npx playwright show-trace test-results/<test>/trace.zip
```

First run on a new machine: `npx playwright install` for the browsers.

## Levels

| Level         | What it covers                                                                                                                   | Location                                                                                 | Framework              |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| End-to-end    | Every section and case study: content, navigation, themes, media dialog, game, layout at phone/tablet/desktop widths, copy rules | `tests/e2e/*.spec.ts`                                                                    | Playwright             |
| Accessibility | axe scans in all themes, keyboard and focus order, reduced motion                                                                | `tests/e2e/accessibility.spec.ts` and the feature specs                                  | `@axe-core/playwright` |
| Pure logic    | Ribbon Roundup model                                                                                                             | `tests/e2e/ribbon-model.spec.ts` (runs in the Playwright runner, no browser page needed) | Playwright             |

Chromium runs every spec. Firefox and WebKit run the theme and Pokémon specs (`playwright.config.ts`). CI retries a failed test up to twice, since a cold dev server compiles each route on first visit; a test that only passes on retry shows as flaky in the output and is worth fixing.

## Rules

- Each acceptance scenario in a feature's spec.md maps to at least one test.
- Tests describe behavior, not implementation (name them after the scenario).
- New UI is tested in all three themes and at phone width.
- External sites are never called from tests; check link targets, not the pages behind them.
- A bug fix starts with a failing test that reproduces the bug.

## Test Data

The site's own content in `src/data/` is the test data. When copy changes on purpose, update the spec that asserts it in the same commit.
