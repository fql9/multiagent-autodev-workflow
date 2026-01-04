---
allowed-tools: Read, Grep, Glob, LS
model: sonnet
description: 生成轻量 ADR（架构决策记录），让取舍可追溯
---

# /adr 命令 - Architecture Decision Record

当涉及技术选型/架构取舍/重大改动时，用 ADR 固化决策与理由。

## 使用方式
```
/adr <决策主题>
```

## 输出内容
- Context（背景与约束）
- Decision（决策）
- Alternatives（备选方案）
- Consequences（影响/风险）
- Follow-ups（后续工作）

## 输出格式

```yaml
adr:
  id: "ADR-{YYYYMMDD}-{slug}"
  title: "{标题}"
  status: "proposed|accepted|rejected|deprecated|superseded"
  context: "{背景}"
  decision: "{决策}"
  alternatives:
    - option: "{方案A}"
      pros: ["..."]
      cons: ["..."]
  consequences:
    positive: ["..."]
    negative: ["..."]
  follow_ups: ["..."]
```

## 建议落盘位置
- `docs/adr/ADR-xxxx.md`


