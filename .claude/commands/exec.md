---
allowed-tools: Read, Bash
description: 执行阶段：通过 Bash 调用 Claude Code CLI 子 agent 跑 implement/test/review（C 方案）
---

# /exec - 执行（非规划阶段全部走 CLI 子 agent）

## 用途
配合 `/plan` 使用：**规划由主控完成**，执行阶段（scout/design/implement/test/review）全部通过 Bash → `claude` CLI 子 agent 完成，并生成可追溯 EV 证据链。

## 用法

```bash
/exec <task_id> "<task_goal>"
```

## 执行

```bash
chmod +x .claude/bin/swe_exec.sh
.claude/bin/swe_exec.sh <task_id> "<task_goal>"
```

## 证据链
- `.claude/state/audit.log`
- `.claude/state/evidence/<EV_ID>.md`
- `.claude/state/logs/<EV_ID>.*`
- `.claude/state/evidence/<task_id>.run.md`（汇总）


