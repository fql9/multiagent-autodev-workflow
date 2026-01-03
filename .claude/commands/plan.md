---
allowed-tools: Read, Grep, Glob, LS
model: sonnet
description: 生成任务执行计划和 DAG
---

# /plan 命令 - 任务规划

为给定任务生成详细的执行计划和任务 DAG。

## 使用方式
```
/plan <任务描述>
```

## 输出内容

### 1. 需求分析
- 任务目标
- 约束条件
- 验收标准

### 2. 任务分解
- 子任务列表
- 每个任务的描述、执行者、预估时间
- 任务依赖关系

### 3. DAG 可视化
使用 Mermaid 生成任务流程图。

### 4. 风险评估
- 识别的风险
- 缓解措施
- 回滚策略

### 5. 资源估算
- 预计 token 消耗
- 预计时间
- 需要的工具

## 输出格式

```yaml
execution_plan:
  goal: "{任务目标}"
  
  acceptance_criteria:
    - "{标准1}"
    - "{标准2}"
  
  task_dag:
    nodes:
      - id: "T1"
        name: "{任务名}"
        assignee: "{执行者}"
        estimated: "{时间}"
    edges:
      - from: "T1"
        to: "T2"
  
  risks:
    - risk: "{风险}"
      mitigation: "{措施}"
  
  estimates:
    tokens: {数量}
    time: "{时间}"
```

## 参数
- `$ARGUMENTS`: 任务描述

## 示例
```
/plan 实现用户注册功能
/plan 优化首页加载性能
/plan 将认证系统迁移到 OAuth2
```

