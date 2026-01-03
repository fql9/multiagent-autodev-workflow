---
name: workflow-control
description: 工作流控制技能 - 管理多智能体工作流的状态转换、回滚、重试与人工介入
allowed-tools: Read, Grep, Glob, LS, Task
---

# Workflow Control Skill - 工作流控制技能

## 概述

此技能用于管理多智能体系统的工作流状态，包括状态机转换、异常处理、回滚机制和人工介入。

## 工作流状态机

```
                    ┌─────────────┐
                    │   INIT      │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
              ┌─────│  PLANNING   │─────┐
              │     └──────┬──────┘     │
              │            │            │
              │            ▼            │
              │     ┌─────────────┐     │
              │     │  EXECUTING  │◄────┤
              │     └──────┬──────┘     │
              │            │            │
              │     ┌──────┴──────┐     │
              │     │             │     │
              │     ▼             ▼     │
              │ ┌───────┐   ┌─────────┐ │
              │ │ VERIFY│   │  FAIL   │─┘
              │ └───┬───┘   └────┬────┘
              │     │            │
              │     ▼            │
              │ ┌───────┐        │
              │ │REVIEW │        │
              │ └───┬───┘        │
              │     │            │
              │     ▼            │
              │ ┌───────────┐    │
              └─│ COMPLETED │    │
                └───────────┘    │
                                 │
                    ┌────────────┘
                    ▼
              ┌─────────────┐
              │  ROLLBACK   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   BLOCKED   │
              └─────────────┘
```

## 状态定义

| 状态 | 描述 | 允许的转换 |
|-----|------|-----------|
| INIT | 初始状态，等待任务输入 | → PLANNING |
| PLANNING | 任务分解与 DAG 生成 | → EXECUTING, → BLOCKED |
| EXECUTING | 执行任务 DAG | → VERIFY, → FAIL, → BLOCKED |
| VERIFY | 运行验证（测试/lint/build） | → REVIEW, → FAIL |
| REVIEW | 代码审查阶段 | → COMPLETED, → EXECUTING |
| COMPLETED | 任务成功完成 | 终态 |
| FAIL | 执行失败 | → ROLLBACK, → EXECUTING |
| ROLLBACK | 回滚变更 | → BLOCKED, → PLANNING |
| BLOCKED | 需要人工介入 | → PLANNING, → 终止 |

## 状态转换规则

### 正常流程
```yaml
transitions:
  - from: INIT
    to: PLANNING
    trigger: "task_received"
    
  - from: PLANNING
    to: EXECUTING
    trigger: "dag_approved"
    guard: "dag_valid && resources_available"
    
  - from: EXECUTING
    to: VERIFY
    trigger: "all_tasks_completed"
    
  - from: VERIFY
    to: REVIEW
    trigger: "verification_passed"
    
  - from: REVIEW
    to: COMPLETED
    trigger: "review_approved"
```

### 异常流程
```yaml
transitions:
  - from: EXECUTING
    to: FAIL
    trigger: "task_failed"
    action: "record_failure"
    
  - from: FAIL
    to: ROLLBACK
    trigger: "retry_exceeded"
    guard: "retry_count >= 3"
    
  - from: FAIL
    to: EXECUTING
    trigger: "retry"
    guard: "retry_count < 3"
    action: "increment_retry"
    
  - from: ROLLBACK
    to: BLOCKED
    trigger: "rollback_complete"
    action: "notify_human"
```

## 回滚策略

### 代码变更回滚
```bash
# 回滚到上一个检查点
git checkout {checkpoint_commit}

# 或软回滚（保留变更但撤销提交）
git reset --soft HEAD~{n}
```

### 状态回滚
```yaml
rollback_checkpoint:
  timestamp: "{检查点时间}"
  state_snapshot:
    dag_state: "{DAG 快照}"
    completed_tasks: ["{已完成任务}"]
    artifacts: ["{产物列表}"]
  restore_commands:
    - "{恢复命令1}"
    - "{恢复命令2}"
```

## 重试策略

### 指数退避
```python
retry_delay = base_delay * (2 ** retry_count)
max_delay = 60  # 秒
```

### 重试条件
| 错误类型 | 是否重试 | 最大次数 |
|---------|---------|---------|
| 网络超时 | 是 | 3 |
| API 限流 | 是（退避） | 5 |
| 测试失败 | 是（修复后） | 3 |
| 权限拒绝 | 否 | 0 |
| 语法错误 | 否 | 0 |

## 人工介入触发条件

### 必须介入
- 安全敏感操作（认证、加密、支付）
- 大范围重构（>20% 代码变更）
- 删除关键文件
- 修改生产配置
- 重试 3 次后仍失败

### 建议介入
- 发现多个等价方案无法决策
- 需求存在歧义
- 发现潜在架构问题
- 测试覆盖不足

## 检查点机制

### 自动检查点
在以下节点自动创建检查点：
1. 任务 DAG 生成完成
2. 每个子任务完成
3. 验证阶段开始前
4. 审查通过后

### 检查点数据
```yaml
checkpoint:
  id: "cp-{uuid}"
  timestamp: "{ISO timestamp}"
  phase: "{当前阶段}"
  git_ref: "{commit hash}"
  state:
    dag: "{DAG 状态}"
    completed: ["{已完成任务}"]
    artifacts: ["{产物}"]
  metadata:
    token_used: {数量}
    tool_calls: {数量}
    elapsed_time: "{时间}"
```

## Dashboard 更新

工作流状态变更时自动更新 DASHBOARD.md：
- 状态转换记录
- 当前任务进度
- 资源消耗统计
- 错误与警告日志

