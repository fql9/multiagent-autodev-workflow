---
name: api-design
description: API 设计技能 - 设计稳定、可测试、可演进的接口契约（函数/类/API/事件）
allowed-tools: Read, Grep, Glob, LS
---

# API Design Skill - API 设计技能

## 目标

- 明确输入/输出、错误模型、兼容策略
- 给出可测试的验收标准与示例

## 输出（建议格式）

```yaml
api_design:
  interface:
    name: "{接口名}"
    type: "function|class|http|event"
    signature: "{签名/请求响应}"
  behavior:
    happy_path: "{正常路径}"
    error_cases:
      - case: "{错误场景}"
        error: "{错误类型/码}"
  compatibility:
    breaking: false
    migration: "{如需要}"
  examples:
    - input: "{示例输入}"
      output: "{示例输出}"
```


