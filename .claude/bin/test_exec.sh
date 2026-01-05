#!/usr/bin/env bash
set -euo pipefail

# Execute /test via Claude Code CLI "tester" agent (C-plan).
# This prevents the control-plane (Cursor) from directly running tests or producing test conclusions.
#
# Usage:
#   .claude/bin/test_exec.sh "<scope>" [-- <claude_args...>]
#
# Examples:
#   .claude/bin/test_exec.sh "all"
#   .claude/bin/test_exec.sh "src/auth/"
#   .claude/bin/test_exec.sh "fast"
#   .claude/bin/test_exec.sh "all" -- --help   # smoke

usage() {
  cat <<'EOF'
Usage:
  .claude/bin/test_exec.sh "<scope>" [-- <claude_args...>]
EOF
}

scope="${1:-}"
shift || true

claude_args=()
if [[ "${1:-}" == "--" ]]; then
  shift || true
  claude_args=("$@")
fi

if [[ -z "$scope" ]]; then
  usage
  exit 2
fi

ts="$(date -u +"%Y%m%d-%H%M%S")"
state_root=".claude/state"
attach_dir="${state_root}/attachments/test/${ts}"
mkdir -p "$attach_dir"

prompt="${attach_dir}/tester.md"
cat >"$prompt" <<EOF
你是 Tester。请通过你在 Claude Code CLI 环境中的能力来执行测试并生成结构化报告。

## Input
- scope: ${scope}

## Requirements
- 你必须亲自运行合适的测试命令（例如 npm/jest/pytest/go test/cargo test 等），并把命令与关键输出写进你的 evidence 字段。
- 不要假装“测试通过”。如果你无法运行（权限/环境/依赖缺失），请明确说明并给出可执行的替代验证方案。
- 输出 JSON，且最多 3 条 next_actions。

## Output JSON
{
  "agent": "tester",
  "scope": "${scope}",
  "status": "success|partial|failure",
  "summary": "一句话总结",
  "evidence": [
    {"type": "command", "cmd": "...", "result": "PASS|FAIL|SKIP", "notes": "..."}
  ],
  "failures": [
    {"name": "...", "file": "...", "error": "...", "suggestion": "..."}
  ],
  "next_actions": ["..."]
}
EOF

if [[ ${#claude_args[@]} -eq 0 ]]; then
  .claude/bin/call_subagent.sh tester "TEST_${ts}" "$prompt"
else
  .claude/bin/call_subagent.sh tester "TEST_${ts}" "$prompt" -- "${claude_args[@]}"
fi


