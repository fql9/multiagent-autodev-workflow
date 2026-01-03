---
name: dag-planning
description: DAG 任务建模与依赖分析技能 - 将复杂任务分解为有向无环图，管理任务依赖关系和执行顺序
allowed-tools: Read, Grep, Glob, LS
---

# DAG Planning Skill - 任务建模技能

## 概述

此技能用于将复杂的软件工程任务分解为结构化的 DAG（有向无环图），确保任务依赖关系清晰、执行顺序合理。

## 任务分解原则

### 1. 原子性
- 每个任务应该是可独立完成的最小单元
- 任务完成状态应该是明确的（完成/未完成）
- 避免任务过大导致难以追踪

### 2. 依赖明确
- 显式声明任务间的依赖关系
- 避免隐式依赖（如共享状态）
- 检测并消除循环依赖

### 3. 并行最大化
- 无依赖的任务应该可以并行执行
- 合理拆分以增加并行度
- 考虑资源限制（token、工具调用）

## DAG 结构定义

```yaml
task_dag:
  metadata:
    id: "dag-{uuid}"
    created_at: "{ISO timestamp}"
    goal: "{用户原始目标}"
    estimated_total_effort: "small|medium|large|xlarge"
  
  nodes:
    - id: "T1"
      name: "{任务名称}"
      type: "analysis|design|implement|test|review|document"
      description: "{详细描述}"
      assignee: "supervisor|repo-scout|architect|implementer|tester|reviewer"
      inputs:
        - from: "user|{task_id}"
          data: "{数据描述}"
      outputs:
        - type: "report|patch|test_result|review"
          schema: "{输出格式}"
      estimated_effort: "small|medium|large"
      timeout_minutes: 10
  
  edges:
    - from: "T1"
      to: "T2"
      type: "data|control|optional"
      description: "{依赖说明}"
  
  critical_path: ["T1", "T2", "T4", "T6"]
  
  parallel_groups:
    - group: 1
      tasks: ["T2", "T3"]
      can_parallel: true
```

## 任务类型定义

| 类型 | 描述 | 典型耗时 | 输出 |
|-----|------|---------|------|
| analysis | 代码分析、需求理解 | 2-5min | 分析报告 |
| design | 方案设计、接口定义 | 3-10min | ADR/设计文档 |
| implement | 代码编写、修改 | 5-15min | Patch/Diff |
| test | 测试执行、验证 | 2-10min | 测试报告 |
| review | 代码审查、质量检查 | 3-8min | 审查报告 |
| document | 文档编写、更新 | 2-5min | 文档变更 |

## 依赖类型

- **data**: 数据依赖 - 后续任务需要前置任务的输出数据
- **control**: 控制依赖 - 后续任务需要等待前置任务完成
- **optional**: 可选依赖 - 有则更好，无则可以继续

## 示例：Bug 修复任务 DAG

```yaml
task_dag:
  metadata:
    id: "dag-bugfix-001"
    goal: "修复用户登录时的空指针异常"
  
  nodes:
    - id: "T1"
      name: "定位问题代码"
      type: "analysis"
      assignee: "repo-scout"
    
    - id: "T2"
      name: "分析根因"
      type: "analysis"
      assignee: "repo-scout"
    
    - id: "T3"
      name: "设计修复方案"
      type: "design"
      assignee: "architect"
    
    - id: "T4"
      name: "实现修复"
      type: "implement"
      assignee: "implementer"
    
    - id: "T5"
      name: "编写回归测试"
      type: "implement"
      assignee: "implementer"
    
    - id: "T6"
      name: "运行测试验证"
      type: "test"
      assignee: "tester"
    
    - id: "T7"
      name: "代码审查"
      type: "review"
      assignee: "reviewer"
  
  edges:
    - from: "T1" 
      to: "T2"
    - from: "T2"
      to: "T3"
    - from: "T3"
      to: "T4"
    - from: "T3"
      to: "T5"  # T4, T5 可并行
    - from: "T4"
      to: "T6"
    - from: "T5"
      to: "T6"
    - from: "T6"
      to: "T7"
```

## 调度策略

### 优先级规则
1. 关键路径上的任务优先
2. 阻塞其他任务的优先
3. 资源占用小的优先（快速释放）

### 失败处理
- 单任务失败：标记 blocked，通知 supervisor
- 关键任务失败：暂停下游，触发回滚/重规划
- 资源耗尽：保存状态，请求扩展或人工介入

