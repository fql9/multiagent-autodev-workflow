#!/usr/bin/env bash
set -euo pipefail

# Reset DASHBOARD.md from template, filling basic placeholders.
# Usage: .claude/bin/reset_dashboard.sh

template=".claude/templates/DASHBOARD_TEMPLATE.md"
out="DASHBOARD.md"

if [[ ! -f "$template" ]]; then
  echo "ERROR: missing template: $template" >&2
  exit 2
fi

uuid="$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "$(date +%s)")"
ts="$(date -u +"%Y-%m-%d %H:%M:%S")"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"
repo_root="$(pwd)"

# Use Python for literal, deterministic replacements (avoid Bash glob/pattern surprises).
python3 - <<PY
from pathlib import Path

template = Path("${template}")
out = Path("${out}")

text = template.read_text(encoding="utf-8")
text = text.replace("session-{uuid}", f"session-${uuid}")
text = text.replace("{timestamp}", "${ts}")
text = text.replace("{git_branch}", "${branch}")
text = text.replace("{repo_root}", "${repo_root}")

out.write_text(text, encoding="utf-8")
print(f"OK: reset {out} from {template}")
PY
echo "OK: reset ${out} from ${template}"


