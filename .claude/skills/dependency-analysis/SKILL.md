---
name: dependency-analysis
description: 依赖分析技能 - 追踪模块依赖、评估变更影响范围、识别循环依赖与关键路径
allowed-tools: Read, Grep, Glob, LS, Bash(git log*), Bash(git show*), Bash(git blame*)
---

# Dependency Analysis Skill - 依赖分析技能

## 目标

- 快速回答“这个改动会影响到哪里？”
- 找出入口点、核心调用链、上下游依赖
- 识别潜在的循环依赖/层级破坏

## 输出（建议格式）

```yaml
dependency_analysis:
  target: "{模块/文件/符号}"
  direct_dependencies:
    - "{直接依赖A}"
  reverse_dependencies:
    - "{谁依赖它B}"
  call_chain_hints:
    - from: "{入口}"
      to: "{目标}"
      evidence:
        - file: "{path}"
          lines: [start, end]
  risks:
    - "{风险点}"
  suggested_tests:
    - "{建议跑的测试/命令}"
```


