#!/usr/bin/env bash
set -euo pipefail

# Execute /review via Claude Code CLI "reviewer" agent (C-plan).
# The control-plane only collects raw diff/log context; conclusions come from reviewer agent.
#
# Usage:
#   .claude/bin/review_exec.sh [<target>] [-- <claude_args...>]
#
# Examples:
#   .claude/bin/review_exec.sh
#   .claude/bin/review_exec.sh "HEAD~1..HEAD"
#   .claude/bin/review_exec.sh "src/auth/"
#   .claude/bin/review_exec.sh -- --help   # smoke

usage() {
  cat <<'EOF'
Usage:
  .claude/bin/review_exec.sh [<target>] [-- <claude_args...>]
EOF
}

target=""
if [[ "${1:-}" != "--" && -n "${1:-}" ]]; then
  target="$1"
  shift || true
fi

claude_args=()
if [[ "${1:-}" == "--" ]]; then
  shift || true
  claude_args=("$@")
fi

ts="$(date -u +"%Y%m%d-%H%M%S")"
state_root=".claude/state"
attach_dir="${state_root}/attachments/review/${ts}"
mkdir -p "$attach_dir"

prompt="${attach_dir}/reviewer.md"

status_txt="$(git status --porcelain=v1 2>/dev/null || true)"
log_txt="$(git log -n 20 --oneline 2>/dev/null || true)"

diff_txt=""
if [[ -n "$target" ]]; then
  diff_txt="$(git diff -- "$target" 2>/dev/null || true)"
else
  diff_txt="$(git diff 2>/dev/null || true)"
fi

# Cap diff to avoid runaway prompt sizes.
diff_capped="$(printf "%s" "$diff_txt" | head -c 60000)"

cat >"$prompt" <<EOF
你是 Reviewer。请对给定的 git diff 进行结构化审查并给出可执行建议。

## Input
- target: ${target:-"(working tree)"}

## Context
### git status (porcelain)
${status_txt}

### git log (last 20)
${log_txt}

### git diff (capped)
${diff_capped}

## Requirements
- 输出 JSON（不要 YAML）。
- 必须给出 verdict: approve|request_changes|comment
- issue 必须包含 file 与 description，严重级别使用 critical|major|minor|suggestion
- 不要让主控节点代替你做审查结论；你就是审查结论来源。

## Output JSON
{
  "agent": "reviewer",
  "target": "${target:-"(working tree)"}",
  "verdict": "approve|request_changes|comment",
  "issues": [
    {"id": "R1", "severity": "major", "file": "...", "description": "...", "suggestion": "...", "required": true}
  ],
  "highlights": {"positive": ["..."], "concerns": ["..."]},
  "summary": "一句话总结",
  "next_actions": ["最多3条下一步"]
}
EOF

if [[ ${#claude_args[@]} -eq 0 ]]; then
  .claude/bin/call_subagent.sh reviewer "REVIEW_${ts}" "$prompt"
else
  .claude/bin/call_subagent.sh reviewer "REVIEW_${ts}" "$prompt" -- "${claude_args[@]}"
fi


