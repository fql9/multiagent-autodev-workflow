---
name: architecture-design
description: 架构设计技能 - 在既有代码库约束下产出可落地的技术方案、分层边界与演进路径
allowed-tools: Read, Grep, Glob, LS
---

# Architecture Design Skill - 架构设计技能

## 目标

- 在不“脑补”的前提下，基于现有实现做方案设计
- 明确接口契约、依赖边界、兼容策略与回滚策略

## 输出（建议格式）

```yaml
architecture_design:
  problem: "{要解决的问题}"
  constraints:
    - "{约束}"
  proposed_changes:
    - area: "{模块/目录}"
      change: "{要做的改动}"
  interfaces:
    - name: "{接口/函数/类}"
      contract: "{签名+行为}"
  risks:
    - "{风险}"
  rollout:
    - "{分阶段落地步骤}"
```


