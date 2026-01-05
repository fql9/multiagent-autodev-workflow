---
allowed-tools: Read, Bash
description: 通过 Bash 调用 Claude Code CLI (claude) 执行子 agent，并生成 Evidence
---

# /subagent - 通过 Claude Code CLI 调用子 agent（带证据链）

## 用途
将“子 agent 调用”强制落地为 **Bash + Claude Code CLI**，并自动生成：
- `.claude/state/evidence/<EV_ID>.md`
- `.claude/state/logs/<EV_ID>.out.txt`
- `.claude/state/logs/<EV_ID>.err.txt`
- `.claude/state/logs/<EV_ID>.cmd.txt`

> 你可以把 `EV_ID` 写入 `DASHBOARD.md` 的 Evidence Index，实现可追溯证据链（C 方案）。

## 用法

```bash
/subagent <agent_name> <task_id> <prompt_file> [-- <claude_args...>]
```

### 示例

```bash
.claude/bin/call_subagent.sh repo-scout S1 prompts/S1.md
.claude/bin/call_subagent.sh implementer T3 prompts/T3.md
.claude/bin/call_subagent.sh reviewer R1 prompts/R1.md -- --help
```

## 注意
- 若你的 `claude` CLI 默认是交互式，请在 `--` 后追加非交互参数（取决于你的 claude-code 版本）。
- 审计日志：`.claude/settings.json` 已配置 hooks，会把 Bash 调用写入 `.claude/state/audit.log`。


