---
schema_version: v2

# ===== Machine Snapshot (Source of Truth) =====
# 1) YAML front matter 是 “机器可解析的权威状态”。
# 2) 下方 Markdown 主要服务人类快速阅读（10 秒回答：进度/阻塞/下一步）。
# 3) 不要把长日志写进 Dashboard；完整日志放到 `.claude/state/logs/`。
session_info:
  id: "session-{uuid}"
  goal: "{任务目标}"

  # Status vs Phase（避免把“阶段”与“运行态”混在一起）
  # - status: 运行态（是否在跑、是否阻塞、是否完成）
  # - phase: 工作流阶段（在做什么类型的工作）
  status: "IDLE" # IDLE | RUNNING | BLOCKED | COMPLETED
  phase: "CLARIFY" # CLARIFY | PLAN | EXECUTE | VERIFY | REVIEW | DONE

  started_at: "{timestamp}"
  last_updated: "{timestamp}"

  # 可选上下文（尽量填，有助于人类/LLM定位）
  owner: "{human_owner}"
  branch: "{git_branch}"
  repo_root: "{repo_root}"

  # 需求治理（建议在 /plan 阶段填充）
  assumptions: []
  non_goals: []
  constraints: []

  # 控制信号：给主 agent 的“下一步”与“阻塞”输入（保持短小，每项 <= 3）
  next_actions: [] # [{id, owner, action}]
  blockers: []     # [{id, owner, description, needed_to_unblock}]

acceptance_criteria:
  items: [] # [{id, description, status, evidence_ids}]

dag:
  # Node schema（最少字段）
  # {id, name, agent, status, risk, deps, inputs, outputs, verify, artifacts}
  nodes: []
  # Edge schema（可选；也可以从 deps 推导）
  # {from, to}
  edges: []

quality_gates:
  pre_commit:
    status: "PENDING" # PENDING | RUNNING | PASS | FAIL | SKIPPED
    checks:
      lint: "PENDING"
      unit_test: "PENDING"
    evidence: [] # [{id, command, result, artifact_path}]
  pre_merge:
    status: "PENDING"
    checks:
      integration_test: "PENDING"
      code_review: "PENDING"
      security_scan: "PENDING"
    evidence: [] # [{id, command_or_link, result, artifact_path}]

risks: [] # [{id, risk, level, mitigation, owner, approval_required, approved, approval_id}]

approvals: [] # [{id, scope, risk_reason, requested_by, approved_by, timestamp}]

resources:
  token_budget: 500000
  tokens_used_estimate: 0
  tool_budget: 100
  tools_used: 0

events:
  recent: [] # keep last 5; [{time, type, actor, ref, summary, evidence_ids}]

artifacts:
  root: ".claude/state"
  logs_dir: ".claude/state/logs"
  evidence_dir: ".claude/state/evidence"
  attachments_dir: ".claude/state/attachments"

last_updated: "{timestamp}" # mirror of session_info.last_updated
---

# Multi-Agent SWE Dashboard

> **Human Summary**: {一句话当前状态摘要，例如：正在执行 T2（Implementer），等待产出 `index.ts`}

---

## Status Overview（10 秒可读）

| Attribute | Value |
|-----------|-------|
| **Goal** | {任务目标} |
| **Status** | {IDLE / RUNNING / BLOCKED / COMPLETED} |
| **Phase** | {CLARIFY / PLAN / EXECUTE / VERIFY / REVIEW / DONE} |
| **Next Actions (Top 3)** | {下一步行动（最多 3 条）} |
| **Blockers** | {当前阻塞点 或 None} |
| **Last Updated** | {timestamp} |

---

## Acceptance Criteria & Evidence（验收标准与证据链）

> 规则：只要你写“完成/已修复/可用”，就必须在这里把 AC 标记为 ✅ 并提供 Evidence（可追溯）。

| ID | 验收标准 (AC) | 状态 | Evidence IDs | 证据摘要 |
|----|--------------|------|-------------|---------|
| AC1 | {标准1} | ⏳ / ✅ / ❌ | EV-001 | {例如：`npm test` 通过} |
| AC2 | {标准2} | ⏳ / ✅ / ❌ | EV-002 | {例如：日志/截图/链接} |

### Evidence Index（证据索引）

| Evidence ID | Type | Path / Reference | Notes |
|-------------|------|------------------|-------|
| EV-001 | test | `.claude/state/evidence/EV-001.txt` | {测试命令与输出摘要} |
| EV-002 | doc  | `.claude/state/evidence/EV-002.md`  | {设计/决策说明} |

---

## Task DAG & Progress（任务图与进度）

```mermaid
graph TD
  A[CLARIFY] --> B[PLAN]
  B --> C[T1 Implement]
  C --> D[T2 Test]
  D --> E[REVIEW]
  E --> F[DONE]
```

### Task List（Nodes）
| ID | Task Name | Agent | Status | Risk | Deps | Artifacts | Verify |
|----|-----------|-------|--------|------|------|----------|--------|
| T1 | {实现...} | Implementer | PENDING/RUNNING/DONE/BLOCKED | Low/Med/High | - | {paths} | {how} |

---

## Risk Register & Approvals（风险与审批）

### Risks
| ID | Risk | Level | Mitigation | Approval Required | Approved (Approval ID) |
|----|------|-------|------------|-------------------|------------------------|
| R1 | {风险描述} | Low/Med/High | {缓解措施} | Yes/No | {Yes APP-001 / No} |

### Approvals（高风险变更审批）
| Approval ID | Scope | Requested By | Approved By | Time | Rationale |
|-------------|-------|--------------|-------------|------|-----------|
| APP-001 | {例如：升级依赖 major 版本} | {agent} | {human} | {timestamp} | {原因} |

---

## Quality Gates（质量门）

> 质量门必须可执行、可复现：写清楚 “跑了什么命令 / 结果是什么 / 证据在哪”。

### Pre-commit
- Status: {PENDING/RUNNING/PASS/FAIL/SKIPPED}
- Commands:
  - `{lint_command}` → {PASS/FAIL} (EV-xxx)
  - `{unit_test_command}` → {PASS/FAIL} (EV-xxx)

### Pre-merge
- Status: {PENDING/RUNNING/PASS/FAIL/SKIPPED}
- Checks:
  - Integration Test → {PASS/FAIL} (EV-xxx)
  - Code Review → {PASS/FAIL} (EV-xxx)
  - Security Scan → {PASS/FAIL} (EV-xxx)

---

## Resource Usage（资源消耗）

| Resource | Used | Limit | Status |
|----------|------|-------|--------|
| **Tokens** | 0 | 500k | 🟢 |
| **Tools** | 0 | 100 | 🟢 |

---

## Recent Events（Last 5）

| Time | Type | Actor | Ref | Summary | Evidence |
|------|------|-------|-----|---------|----------|
| - | - | - | - | - | - |

> Full logs: `.claude/state/logs/`

---

<sub>Updated by Main Agent | {timestamp}</sub>
