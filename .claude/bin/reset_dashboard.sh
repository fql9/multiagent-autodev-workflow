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

uuid="$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "session-$(date +%s)")"
ts="$(date -u +"%Y-%m-%d %H:%M:%S")"
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"
repo_root="$(pwd)"

content="$(cat "$template")"
content="${content//session-{uuid}/session-${uuid}}"
content="${content//\{timestamp\}/${ts}}"
content="${content//\{git_branch\}/${branch}}"
content="${content//\{repo_root\}/${repo_root}}"

printf "%s\n" "$content" > "$out"
echo "OK: reset ${out} from ${template}"


