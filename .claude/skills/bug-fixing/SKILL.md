---
name: bug-fixing
description: Bug 修复技能 - 复现→定位→最小修复→回归测试→验证证据
allowed-tools: Read, Grep, Glob, LS, Bash
---

# Bug Fixing Skill - Bug 修复技能

## 标准流程

- 复现（最小步骤/命令）
- 证据（日志/堆栈/相关代码引用）
- 根因假设（给置信度）
- 最小修复（避免顺带重构）
- 回归测试（新增用例覆盖）

## 输出（建议格式）

```yaml
bug_fix:
  repro:
    steps:
      - "{步骤}"
    command: "{命令}"
  evidence:
    - "{日志/堆栈/代码引用}"
  root_cause:
    hypothesis: "{根因}"
    confidence: "high|medium|low"
  fix:
    summary: "{修复摘要}"
    files:
      - "{file}"
  tests:
    added:
      - "{测试}"
    run:
      - "{验证命令}"
```


