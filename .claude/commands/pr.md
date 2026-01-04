---
allowed-tools: Read, Grep, Glob, LS, Bash(git status), Bash(git diff:*), Bash(git log:*)
model: sonnet
description: 生成标准化 PR 描述（含 AC、证据、风险与回滚）
---

# /pr 命令 - PR 文案生成器

输出一份可直接粘贴到 GitHub PR 的描述，确保包含：变更摘要、验收标准、测试证据、风险与回滚。

## 使用方式
```
/pr
/pr <范围/主题>
```

## 输出内容
- 标题建议
- 背景/动机
- 变更点（Changelog）
- AC checklist
- Evidence（测试命令 + 结果摘要）
- 风险与回滚策略

## 输出格式（Markdown）

```markdown
## Summary
- ...

## Acceptance Criteria
- [ ] AC1: ...

## Evidence
- `command` -> result summary

## Risk & Rollback
- Risk:
- Rollback:
```


