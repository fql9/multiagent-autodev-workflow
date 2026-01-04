---
allowed-tools: Read, Grep, Glob, LS
model: sonnet
description: 澄清需求并产出验收标准（AC）与非目标（Non-goals）
---

# /clarify 命令 - 需求澄清

在进入 `/plan` 或 `/swe` 之前，先把需求澄清到**可执行、可验证**。

## 使用方式
```
/clarify <任务描述>
```

## 输出内容

### 1. 澄清问题清单（Questions）
- 识别缺失信息、歧义点、边界条件
- 每个问题说明为什么重要

### 2. Acceptance Criteria（验收标准）
- 必须可测试（testable）
- 建议 3-8 条，覆盖核心路径和错误路径

### 3. Non-goals（非目标）
- 明确本次不做什么，防止 scope creep

### 4. Assumptions（假设）
- 无法立即确认但需要暂定的前提

### 5. Risk Flags（风险标记）
- 是否安全敏感 / 是否破坏性变更 / 是否大范围重构

## 输出格式

```yaml
clarify_result:
  goal: "{任务目标}"

  questions:
    - id: "Q1"
      question: "{需要用户确认的问题}"
      why: "{为什么需要这个信息}"

  acceptance_criteria:
    - id: "AC1"
      criterion: "{验收标准}"
      testable: true

  non_goals:
    - "{本次不做的内容}"

  assumptions:
    - "{暂定假设}"

  risk_flags:
    security_sensitive: false
    breaking_change: false
    large_refactor: false
```

## 参数
- `$ARGUMENTS`: 任务描述

## 示例
```
/clarify 实现用户邮箱验证功能
/clarify 给首页加暗黑模式切换
```


