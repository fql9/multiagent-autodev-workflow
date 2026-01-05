# Multi-Agent SWE Framework - 项目记忆

> 这是多智能体软件工程框架的主记忆文件，Claude Code 会在启动时自动加载此文件。

## 🚨 Critical Meta-Rule
**DASHBOARD.md 的 YAML Front Matter 是项目状态的唯一事实来源 (Source of Truth)。**
所有状态变更（Goal, Status, Phase, DAG）必须优先写入 Dashboard YAML，而不是仅在自然语言对话中提及。

---

## 🎯 项目概述

本项目是一个基于 **Cursor (主 Agent)** + **Claude Code Subagents (子智能体)** 的多智能体软件工程框架。

### 核心理念

1. **控制面与数据面分离**
   - 控制面：任务调度、状态管理、质量门控
   - 数据面：代码检索、工具执行、结果收集

2. **DAG 任务建模**
   - 复杂任务分解为有向无环图
   - 支持并行执行无依赖任务
   - 支持动态回滚与重规划

3. **结构化产出**
   - 所有智能体输出结构化数据
   - 便于解析、验证和追溯
   - 支持增量更新 Dashboard

4. **质量闭环**
   - Pre-commit Gate: lint + typecheck + 单元测试
   - Pre-merge Gate: 全量测试 + 审查
   - 失败自动回滚与重试

---

## 🏗️ 框架结构

```
.
├── CLAUDE.md                    # 主记忆文件（本文件）
├── DASHBOARD.md                 # 实时状态仪表板
├── .claude/
│   ├── settings.json           # 权限与配置
│   ├── agents/                 # 子智能体定义
│   │   ├── supervisor.md       # 监督者
│   │   ├── repo-scout.md       # 代码侦察
│   │   ├── architect.md        # 架构师
│   │   ├── implementer.md      # 实现者
│   │   ├── tester.md           # 测试者
│   │   └── reviewer.md         # 审查者
│   ├── skills/                 # 技能定义
│   │   ├── dag-planning/       # DAG 规划
│   │   ├── workflow-control/   # 工作流控制
│   │   ├── code-search/        # 代码搜索
│   │   ├── code-implementation/# 代码实现
│   │   ├── testing/            # 测试
│   │   └── code-review/        # 代码审查
│   ├── rules/                  # 规则文件
│   │   ├── workflow.md         # 工作流规则
│   │   ├── code-quality.md     # 代码质量规则
│   │   ├── security.md         # 安全规则
│   │   └── dashboard-update.md # Dashboard 更新规则
│   ├── commands/               # 自定义命令
│   │   ├── swe.md             # 完整 SWE 流程
│   │   ├── analyze.md         # 代码分析
│   │   ├── plan.md            # 任务规划
│   │   ├── test.md            # 测试执行
│   │   ├── review.md          # 代码审查
│   │   └── status.md          # 状态查看
│   └── state/                  # 运行时状态（自动生成）
└── docs/                       # 项目文档
```

---

## 👥 子智能体协作协议

### 调用约定

```yaml
# 主 Agent 调用子智能体的格式
call_subagent:
  target: "{agent_name}"
  task:
    id: "{task_id}"
    type: "{task_type}"
    description: "{描述}"
    context:
      files: ["{相关文件}"]
      constraints: ["{约束}"]
    expected_output:
      format: "yaml|json|markdown"
      schema: "{输出模式}"
```

### 返回约定

```yaml
# 子智能体返回结果的格式
agent_result:
  agent: "{agent_name}"
  task_id: "{task_id}"
  status: "success|failure|partial"
  output:
    # 具体输出内容
  metadata:
    duration_ms: {耗时}
    tokens_used: {token数}
    tools_called: ["{工具列表}"]
```

### 典型调用流程

```
User Request
    │
    ▼
┌─────────────────┐
│   Supervisor    │ ── 生成任务 DAG
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│Scout  │ │Scout  │ ── 并行检索
└───┬───┘ └───┬───┘
    └────┬────┘
         ▼
   ┌───────────┐
   │ Architect │ ── 设计方案
   └─────┬─────┘
         ▼
  ┌────────────┐
  │Implementer │ ── 实现代码
  └──────┬─────┘
         ▼
    ┌─────────┐
    │ Tester  │ ── 验证
    └────┬────┘
         ▼
   ┌──────────┐
   │ Reviewer │ ── 审查
   └────┬─────┘
         ▼
      Output
```

---

## 📋 任务类型与处理策略

### Bug 修复
```yaml
bug_fix:
  phases:
    - analyze: "定位问题代码，分析根因"
    - design: "设计最小化修复方案（如需要）"
    - implement: "实现修复 + 添加回归测试"
    - verify: "运行测试，确保修复有效"
    - review: "代码审查"
```

### 新功能
```yaml
new_feature:
  phases:
    - analyze: "理解需求，搜索相关代码"
    - design: "技术方案设计，接口定义"
    - implement: "分阶段实现 + 测试"
    - verify: "全量测试"
    - review: "代码审查 + 文档更新"
```

### 重构
```yaml
refactor:
  phases:
    - analyze: "理解现有实现，识别问题"
    - design: "设计重构方案，确保兼容性"
    - implement: "增量重构，保持可测试"
    - verify: "确保行为不变"
    - review: "审查设计合理性"
```

---

## ⚠️ 安全与权限

### 高风险操作（需人工审批）
- 修改认证/授权代码
- 修改加密/安全相关代码
- 大范围重构（>20% 变更）
- 删除关键文件
- 修改生产配置

### 禁止自动执行
- `git push` 到受保护分支
- 删除大量文件
- 执行涉及 `sudo` 的命令
- 访问生产环境

### 允许自动执行
- 读取文件
- 代码搜索
- 运行测试
- 格式化代码
- 本地 git 操作

---

## 📝 Dashboard 更新规则

### 必须更新的时机
1. 任务开始
2. DAG 生成完成
3. 子任务状态变更
4. 验证结果出来
5. 审查完成
6. 任务结束

### 更新内容
- Session 信息
- 任务 DAG 图
- Agent 状态表
- 任务列表
- 验证状态
- 活动日志
- 资源消耗

---

## 🔧 常用命令

| 命令 | 功能 |
|------|------|
| `/swe <任务>` | 执行完整 SWE 流程 |
| `/analyze <目标>` | 分析代码 |
| `/plan <任务>` | 生成任务计划 |
| `/test [范围]` | 运行测试 |
| `/review [目标]` | 代码审查 |
| `/status` | 查看当前状态 |
| `/exit` | 退出框架模式 |
| `/subagent` | 通过 Bash + Claude Code CLI 调用子 agent（生成 EV 证据） |

---

## ✅ C 方案执行约束（重要）
除 **规划（/plan）** 外，执行阶段的工作（实现 / 测试 / 审查）必须通过 **Bash → Claude Code CLI (`claude`)** 调用子 agent 完成，并在 `DASHBOARD.md` 里记录 EV 证据链；主控节点只做调度、状态更新和证据归档。

---

## 📚 导入的规则文件

@.claude/rules/workflow.md
@.claude/rules/code-quality.md
@.claude/rules/security.md
@.claude/rules/dashboard-update.md

---

## 📖 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-01-04 | 初始版本 |

---

<sub>Multi-Agent SWE Framework v1.0.0</sub>

