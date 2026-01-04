---
allowed-tools: Read, Grep, Glob, LS, Bash(git status), Bash(git diff:*), Bash(npm test:*), Bash(npm run lint:*), Bash(npm run build:*), Bash(pytest:*), Bash(python -m pytest:*), Bash(go test:*), Bash(cargo test:*), Bash(jest:*), Bash(vitest:*)
model: sonnet
description: 修复 CI / 测试失败并产出最小修复方案 + 复测证据
---

# /fixci 命令 - CI 修复助手

给定失败日志或失败测试名称，产出**最小修复**与**复测证据**。

## 使用方式
```
/fixci <粘贴失败日志或描述失败测试>
```

## 执行流程
1. **归因**：失败属于 lint / test / build / 环境 / flaky 哪一类
2. **最小修复方案**：优先修复根因，避免大范围重构
3. **复测**：给出最小复测命令（fast）+ 完整复测命令（full）
4. **证据**：记录命令与结果摘要（便于写入 Dashboard Evidence）

## 输出格式

```yaml
fixci_report:
  timestamp: "{ISO8601}"
  failure_type: "lint|unit_test|integration_test|build|env|flaky|unknown"
  suspected_root_cause: "{根因假设}"
  proposed_fix:
    - "{最小修复步骤}"
  verify_steps:
    fast:
      - "{快速复测命令}"
    full:
      - "{完整复测命令}"
  evidence_template:
    - "{执行命令} -> {结果摘要}"
```


