---
allowed-tools: Read, Grep, Glob, LS
model: sonnet
description: 生成交接包（当前状态、未完成事项、下一步、风险）
---

# /handover 命令 - 交接包生成器

用于中断/交接/换人时，快速生成可继续推进的交接包。

## 使用方式
```
/handover
/handover <主题/范围>
```

## 输出内容
- 当前目标与阶段（phase）
- 已完成与未完成的 DAG 节点
- Blockers（阻塞点）与解除方式
- 已有 Evidence（测试/验证记录）
- 下一步（最多 3 条，具体到命令/文件）
- 风险清单与回滚建议

## 输出格式

```yaml
handover:
  timestamp: "{ISO8601}"
  goal: "{目标}"
  phase: "CLARIFY|PLAN|EXECUTE|VERIFY|REVIEW|DONE|BLOCKED"
  completed: ["T1", "T2"]
  in_progress: ["T3"]
  pending: ["T4", "T5"]
  blockers:
    - "{阻塞点}"
  evidence:
    - "{命令} -> {结果摘要}"
  next_actions:
    - "{下一步}"
  risks:
    - "{风险}"
  rollback:
    - "{回滚策略}"
```


