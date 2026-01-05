#!/usr/bin/env bash
set -euo pipefail

# swe_exec.sh
# Execute non-planning phases via Bash -> Claude Code CLI (claude) subagents.
#
# This script is intentionally simple: planning stays in Cursor (/plan),
# execution is delegated to Claude Code CLI agents with Evidence emitted.
#
# Usage:
#   .claude/bin/swe_exec.sh <task_id> "<task_goal>"
#
# Output:
#   - Writes a run summary to `.claude/state/evidence/<task_id>.run.md`
#   - Each subagent call produces an EV-... evidence bundle via call_subagent.sh

usage() {
  cat <<'EOF'
Usage:
  .claude/bin/swe_exec.sh <task_id> "<task_goal>"

Example:
  .claude/bin/swe_exec.sh TETRIS_SNAKE "Build a tetris game then auto-switch to snake on game over"
EOF
}

task_id="${1:-}"
task_goal="${2:-}"
if [[ -z "$task_id" || -z "$task_goal" ]]; then
  usage
  exit 2
fi

state_root=".claude/state"
attach_dir="${state_root}/attachments/${task_id}"
mkdir -p "$attach_dir"

mk_prompt() {
  local agent="$1"
  local out="$2"
  cat >"$out" <<EOF
你是 ${agent}。请专注完成你的职责，并输出结构化结果（优先 JSON）。

## Task
- task_id: ${task_id}
- goal: ${task_goal}

## Constraints
- 不要让 Cursor 主控节点直接“手写实现代码”；你的实现应通过 Claude Code CLI 自身能力完成（包括必要的文件修改/测试执行）。
- 任何“完成/通过”的结论必须附可追溯 Evidence：命令 + 关键输出摘要 + 相关文件路径。
- 若遇到权限/环境限制（例如 sandbox/网络/文件 watch），请明确报告并给出可执行的替代方案。

## Required Output (JSON)
{
  "agent": "${agent}",
  "task_id": "${task_id}",
  "status": "success|partial|failure",
  "summary": "一句话总结",
  "changes": ["关键文件路径..."],
  "evidence": [
    {"type": "command", "cmd": "...", "result": "PASS|FAIL", "notes": "..."}
  ],
  "next_actions": ["最多3条下一步"]
}
EOF
}

echo "Running /swe EXECUTE via CLI subagents for task_id=${task_id}"

repo_prompt="${attach_dir}/repo-scout.md"
arch_prompt="${attach_dir}/architect.md"
impl_prompt="${attach_dir}/implementer.md"
test_prompt="${attach_dir}/tester.md"
review_prompt="${attach_dir}/reviewer.md"

mk_prompt "repo-scout" "$repo_prompt"
mk_prompt "architect" "$arch_prompt"
mk_prompt "implementer" "$impl_prompt"
mk_prompt "tester" "$test_prompt"
mk_prompt "reviewer" "$review_prompt"

ev_repo=$(.claude/bin/call_subagent.sh repo-scout "${task_id}_SCOUT" "$repo_prompt" || true)
ev_arch=$(.claude/bin/call_subagent.sh architect "${task_id}_ARCH" "$arch_prompt" || true)
ev_impl=$(.claude/bin/call_subagent.sh implementer "${task_id}_IMPL" "$impl_prompt" || true)
ev_test=$(.claude/bin/call_subagent.sh tester "${task_id}_TEST" "$test_prompt" || true)
ev_rev=$(.claude/bin/call_subagent.sh reviewer "${task_id}_REVIEW" "$review_prompt" || true)

mkdir -p "${state_root}/evidence"
run_summary="${state_root}/evidence/${task_id}.run.md"
{
  echo "# SWE Exec Run Summary"
  echo
  echo "- task_id: \`${task_id}\`"
  echo "- goal: ${task_goal}"
  echo "- time: $(date -u +"%F %T UTC")"
  echo
  echo "## Evidence IDs"
  echo "- repo-scout: \`${ev_repo}\`"
  echo "- architect: \`${ev_arch}\`"
  echo "- implementer: \`${ev_impl}\`"
  echo "- tester: \`${ev_test}\`"
  echo "- reviewer: \`${ev_rev}\`"
  echo
  echo "## Where to look"
  echo "- `.claude/state/evidence/<EV_ID>.md`"
  echo "- `.claude/state/logs/<EV_ID>.*`"
  echo "- `.claude/state/audit.log`"
} > "$run_summary"

echo "OK: wrote ${run_summary}"


