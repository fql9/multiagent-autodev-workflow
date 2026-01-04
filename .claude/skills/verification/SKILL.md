---
name: verification
description: 验证技能 - 将“完成”落实为可复现的证据（lint/typecheck/test/build），并结构化记录
allowed-tools: Read, Grep, Glob, LS, Bash
---

# Verification Skill - 验证技能

## 原则

- 先快测（pre-commit），再全量（pre-merge）
- 每个声明的结论都要有证据（命令 + 退出码 + 摘要）

## 输出（建议格式）

```yaml
verification:
  stages:
    - name: "lint"
      command: "{命令}"
      exit_code: 0
      summary: "{摘要}"
    - name: "tests"
      command: "{命令}"
      exit_code: 0
      summary: "{摘要}"
  evidence_files:
    - ".claude/state/audit.log"
```


