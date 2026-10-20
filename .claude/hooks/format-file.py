#!/usr/bin/env python3
"""Format-on-edit: a PostToolUse hook on Edit|Write|MultiEdit.

Looks up the edited file's extension in .claude/hooks/format.json and runs the
matching command, with {file} replaced by the file's path. Example config:
.claude/hooks/format.example.json. No match or an empty config: does nothing.
Never blocks: always exits 0 and logs failures to stderr.
"""
import json
import os
import shlex
import subprocess
import sys


def main():
    try:
        data = json.loads(sys.stdin.read())
        path = (data.get("tool_input") or {}).get("file_path")
        if not path:
            return
        root = os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd()
        config_path = os.path.join(root, ".claude", "hooks", "format.json")
        if not os.path.exists(config_path):
            return
        with open(config_path, encoding="utf-8") as f:
            config = json.load(f)
        ext = os.path.splitext(path)[1].lower()
        template = config.get(ext)
        if not template:
            return
        # POSIX: single-quote so $(...) or backticks in a file name can't run.
        # Windows (cmd.exe): file names can't contain ", so double quotes are enough.
        quoted = '"' + path + '"' if os.name == "nt" else shlex.quote(path)
        cmd = template.replace("{file}", quoted)
        r = subprocess.run(cmd, shell=True, cwd=root, capture_output=True, text=True,
                           encoding="utf-8", errors="replace", timeout=120)
        if r.returncode != 0:
            print(f"format-file: `{cmd}` exited {r.returncode}:\n{(r.stdout + r.stderr).strip()}",
                  file=sys.stderr)
    except Exception as e:
        print(f"format-file: skipped ({e!r})", file=sys.stderr)


if __name__ == "__main__":
    main()
    sys.exit(0)
