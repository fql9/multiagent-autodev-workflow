---
allowed-tools: Read, Write, Bash
description: 重置会话状态：用模板覆盖生成新的 DASHBOARD.md
---

# /reset - 重置会话状态

## 行为
- 使用 `.claude/templates/DASHBOARD_TEMPLATE.md` 覆盖生成新的 `DASHBOARD.md`
- 填充基本占位符：session id / timestamp / git branch / repo root

## 执行

```bash
chmod +x .claude/bin/reset_dashboard.sh
.claude/bin/reset_dashboard.sh
```


