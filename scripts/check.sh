#!/usr/bin/env bash
# One definition of green: format check, lint, tests, build, in that order.
# CLAUDE.md, CI (.github/workflows/ci.yml) and the merge-gate hook all run this.
# Fill in the commands below for this project's stack. A value still in
# [brackets] is a placeholder: it is skipped with a warning instead of failing.
# Keep scripts/check.ps1 in sync.
set -uo pipefail

FORMAT_CMD="npm run format:check"
LINT_CMD="npm run lint"
TEST_CMD="npm run test:e2e"
BUILD_CMD="npm run build"

cd "$(dirname "$0")/.."

run_step() {
  local name="$1" cmd="$2"
  if [[ -z "$cmd" || "$cmd" == \[* ]]; then
    echo "check: WARNING: $name command is a placeholder, skipping. Fill it in at the top of scripts/check.sh."
    return 0
  fi
  echo "check: $name: $cmd"
  if ! bash -c "$cmd"; then
    echo "check: FAILED at $name. Fix it and run ./scripts/check.sh again." >&2
    exit 1
  fi
}

run_step "format" "$FORMAT_CMD"
run_step "lint" "$LINT_CMD"
run_step "test" "$TEST_CMD"
run_step "build" "$BUILD_CMD"
echo "check: all steps passed (or were skipped)."
