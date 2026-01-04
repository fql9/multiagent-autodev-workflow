---
allowed-tools: Read, Grep, Glob, LS, Write, Edit
model: sonnet
description: 记录一次显式人工审批（用于高风险变更的治理与可追溯性）
---

# /approve 命令 - 风险审批

将“高风险操作需审批”从口头变成**可追踪事件**。

> 建议与 `/plan`、`/swe` 配套使用：当识别到高风险变更时，先请求 `/approve`，审批通过后才进入 EXECUTE。

## 使用方式
```
/approve <审批范围/说明>
```

## 适用场景（高风险示例）
- 鉴权/权限/安全策略
- 支付/计费
- 依赖大版本升级
- 数据库 Schema 变更
- CI/CD 配置变更（`.github/` 等）
- 删除大量文件或大范围重构

## 输出内容

### 1. Approval Record（审批记录）
记录审批的范围、原因、时间、风险点与缓解策略。

### 2. Dashboard 同步建议
提示将审批结果写入 `DASHBOARD.md` 的 Risk Register / Issues 区域。

## 输出格式

```yaml
approval_record:
  timestamp: "{ISO8601}"
  approver: "{name-or-handle}"
  scope: "{审批范围}"
  reason: "{为何需要审批}"
  risks:
    - "{风险点}"
  mitigations:
    - "{缓解措施}"
  expires_at: "{可选：审批有效期}"
  status: "approved"
```

## 参数
- `$ARGUMENTS`: 审批范围/说明

## 示例
```
/approve 升级 Next.js 到 v15（依赖大版本升级）
/approve 修改登录鉴权流程（安全敏感）
```


