---
allowed-tools: Read, Write, Bash
description: 彻底退出框架模式（写入 flag），后续仅作为普通 AI 助手响应
---

# /exit - 退出框架模式（Hard Exit）

## 行为
- 写入一个退出标记文件：`.claude/state/framework_disabled.flag`
- 后续对话中，若检测到该文件存在：
  - 不再强制执行状态机（CLARIFY→PLAN→EXECUTE→VERIFY→REVIEW→DONE）
  - 不再强制维护 `DASHBOARD.md`
  - 仅作为普通 AI 助手响应

## 执行

```bash
mkdir -p .claude/state
date -u +"%F %T UTC" > .claude/state/framework_disabled.flag
echo "Framework mode disabled. Remove .claude/state/framework_disabled.flag to re-enable."
```


