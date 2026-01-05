#!/usr/bin/env bash
set -euo pipefail

# call_subagent.sh
# C-Plan: Force sub-agent calls to go through Claude Code CLI (claude) via Bash
# and emit reproducible Evidence artifacts under .claude/state/.
#
# Usage:
#   .claude/bin/call_subagent.sh <agent_name> <task_id> <prompt_file> [-- <claude_args...>]
#
# Output:
#   - Prints EV_ID to stdout for easy copy/paste into DASHBOARD.md
#   - Writes:
#       .claude/state/evidence/<EV_ID>.md        (index + metadata)
#       .claude/state/logs/<EV_ID>.out.txt      (stdout)
#       .claude/state/logs/<EV_ID>.err.txt      (stderr)
#       .claude/state/logs/<EV_ID>.cmd.txt      (exact command)

usage() {
  cat <<'EOF'
Usage:
  .claude/bin/call_subagent.sh <agent_name> <task_id> <prompt_file> [-- <claude_args...>]

Examples:
  .claude/bin/call_subagent.sh implementer T3 ./prompts/T3.md
  .claude/bin/call_subagent.sh repo-scout S1 ./prompts/S1.md -- --help
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

agent="${1:-}"
task_id="${2:-}"
prompt_file="${3:-}"
shift 3 || true

claude_args=()
if [[ "${1:-}" == "--" ]]; then
  shift || true
  claude_args=("$@")
fi

if [[ -z "$agent" || -z "$task_id" || -z "$prompt_file" ]]; then
  usage
  exit 2
fi

if [[ ! -f "$prompt_file" ]]; then
  echo "ERROR: prompt_file not found: $prompt_file" >&2
  exit 2
fi

ts_utc="$(date -u +"%Y%m%d-%H%M%S")"
safe_agent="$(echo "$agent" | tr -cs 'A-Za-z0-9._-' '_' | sed 's/^_//;s/_$//')"
safe_task="$(echo "$task_id" | tr -cs 'A-Za-z0-9._-' '_' | sed 's/^_//;s/_$//')"
ev_id="EV-${ts_utc}-${safe_agent}-${safe_task}"

state_root=".claude/state"
ev_dir="${state_root}/evidence"
log_dir="${state_root}/logs"
mkdir -p "$ev_dir" "$log_dir"

stdout_file="${log_dir}/${ev_id}.out.txt"
stderr_file="${log_dir}/${ev_id}.err.txt"
cmd_file="${log_dir}/${ev_id}.cmd.txt"
evidence_file="${ev_dir}/${ev_id}.md"

start_ts="$(date -u +"%F %T UTC")"

# Build a self-contained prompt by prefixing the agent spec (if present).
prompt_out="${log_dir}/${ev_id}.prompt.md"

{
  echo "# Subagent: ${agent}"
  echo "# Task: ${task_id}"
  echo "# Generated: ${start_ts}"
  echo
  agent_file=""
  if [[ -f ".claude/agents/${agent}.md" ]]; then
    agent_file=".claude/agents/${agent}.md"
  elif [[ -f ".claude/agents/${agent}.prompt.md" ]]; then
    agent_file=".claude/agents/${agent}.prompt.md"
  fi
  if [[ -n "$agent_file" ]]; then
    echo "## Agent Spec (${agent_file})"
    echo
    cat "$agent_file"
    echo
    echo "## Task Prompt (${prompt_file})"
    echo
  else
    echo "## Task Prompt (${prompt_file})"
    echo
  fi
  cat "$prompt_file"
  echo
  echo
  echo "## Output Requirements"
  echo "- Return a structured response (YAML or JSON) plus a short human summary."
  echo "- Include Evidence pointers (files/commands) if you claim completion."
} > "$prompt_out"

# Default to non-interactive Claude Code CLI mode when args are not provided.
# This is the recommended mode for building an auditable pipeline.
if [[ ${#claude_args[@]} -eq 0 ]]; then
  claude_args=(-p --output-format json --agent "$agent")
fi

# Determine command; keep it explicit for auditability.
cmd=(claude "${claude_args[@]}")
printf '%q ' "${cmd[@]}" > "$cmd_file"
printf '\n' >> "$cmd_file"

# Local audit log (independent from any external hooks)
audit_log="${state_root}/audit.log"
{
  printf '[%s] call_subagent: agent=%s task_id=%s cmd=' "$(date -u +"%F %T UTC")" "$agent" "$task_id"
  cat "$cmd_file" | tr -d '\n'
  printf '\n'
} >> "$audit_log"

exit_code=0
if ! command -v claude >/dev/null 2>&1; then
  # Still emit evidence so the failure is observable and debuggable.
  echo "ERROR: claude CLI not found in PATH." >"$stderr_file"
  exit_code=127
else
  set +e
  # Many versions of Claude Code CLI are interactive by default.
  # We feed prompt via stdin and capture stdout/stderr for evidence.
  "${cmd[@]}" < "$prompt_out" 1>"$stdout_file" 2>"$stderr_file"
  exit_code=$?
  set -e
fi

end_ts="$(date -u +"%F %T UTC")"

# Local audit log (post)
{
  printf '[%s] call_subagent: EV=%s exit_code=%s\n' "$(date -u +"%F %T UTC")" "$ev_id" "$exit_code"
} >> "$audit_log"

{
  echo "# Evidence ${ev_id}"
  echo
  echo "## Summary"
  echo "- **agent**: \`${agent}\`"
  echo "- **task_id**: \`${task_id}\`"
  echo "- **started_at**: ${start_ts}"
  echo "- **ended_at**: ${end_ts}"
  echo "- **exit_code**: ${exit_code}"
  echo
  echo "## Command"
  echo
  echo "\`${cmd_file}\`"
  echo
  echo "## Artifacts"
  echo "- stdout: \`${stdout_file}\`"
  echo "- stderr: \`${stderr_file}\`"
  echo "- prompt: \`${prompt_out}\`"
  echo "- audit: \`${audit_log}\`"
  echo
  echo "## Notes"
  echo '- If the CLI is interactive in your environment, add non-interactive flags after `--`.'
  echo '  Example: `.claude/bin/call_subagent.sh implementer T1 prompt.md -- --help`'
} > "$evidence_file"

echo "$ev_id"
exit "$exit_code"


