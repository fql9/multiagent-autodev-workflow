---
allowed-tools: Read, Grep, Glob, LS
model: sonnet
description: 查看当前任务状态和 Dashboard
---

# /status 命令 - 状态查看

查看当前任务执行状态和 Dashboard 信息。

## 使用方式
```
/status [选项]
```

## 功能

### 查看完整状态
```
/status
```
显示 DASHBOARD.md 的完整内容。

### 查看任务列表
```
/status tasks
```
显示当前任务 DAG 和各子任务状态。

### 查看智能体状态
```
/status agents
```
显示各子智能体的当前状态。

### 查看活动日志
```
/status log
```
显示最近的活动日志。

### 查看资源消耗
```
/status resources
```
显示 token 消耗、时间等资源统计。

## 输出内容

### 基本信息
- Session ID
- 开始时间
- 当前阶段
- 任务目标

### 任务进度
- 已完成任务数
- 进行中任务
- 待执行任务
- 阻塞的任务

### 智能体状态
- 各智能体的当前状态
- 正在执行的任务
- 已完成的任务数

### 验证状态
- Lint 状态
- TypeCheck 状态
- 测试状态
- 构建状态

### 资源消耗
- Token 已用/预算
- 工具调用次数
- 运行时间

## 参数
- `$ARGUMENTS`: 状态类型选项

## 示例
```
/status
/status tasks
/status agents
/status log
```

