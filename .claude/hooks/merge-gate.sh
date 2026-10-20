#!/usr/bin/env bash
# Wrapper for merge-gate.py so the gate fails closed when Python can't run.
# Claude Code treats any hook exit code other than 2 as "carry on", so a missing
# python3 (or the Windows Store stub) would otherwise let every merge through.
# Exit 0 from the gate allows, exit 2 blocks; anything else blocks only commands
# that could merge or push, so a broken Python doesn't stop all other Bash use.
input="$(cat)"
dir="$(dirname "$0")"
py="$(command -v python3 || command -v python || echo python3)"
printf '%s' "$input" | "$py" "$dir/merge-gate.py"
rc=$?
if [ "$rc" -eq 0 ] || [ "$rc" -eq 2 ]; then
  exit "$rc"
fi
case "$input" in
  *merge*|*pull*|*push*)
    echo "merge-gate: the gate couldn't run (exit $rc from $py), so this merge/push is blocked. Hooks need Python 3 on PATH as python3." >&2
    exit 2 ;;
esac
exit 0
