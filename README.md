# 🤖 Multi-Agent SWE Framework

> 基于 Cursor + Claude Code Subagents 的多智能体软件工程框架

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ 特性

- **🎯 多智能体协作**：6 个专业化子智能体，各司其职
- **📊 实时 Dashboard**：可视化任务进度、DAG、智能体状态
- **🔄 DAG 任务建模**：复杂任务分解为有向无环图，支持并行执行
- **✅ 质量内建**：Pre-commit 和 Pre-merge 双重质量门
- **🔐 安全控制**：最小权限原则，高风险操作需审批
- **📦 模块化设计**：易于扩展和定制

---

## 🏗️ 架构概览

```
┌────────────────────────────────────────────────────────────┐
│                    Cursor (Main Agent)                      │
│                      控制面 Control Plane                    │
├────────────────────────────────────────────────────────────┤
│  任务解析  │  DAG 规划  │  状态机  │  质量门  │  资源管理   │
└─────────────────────────┬──────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │ Repo Scout │  │ Architect  │  │Implementer │
   │  代码侦察   │  │  架构设计   │  │  代码实现   │
   └────────────┘  └────────────┘  └────────────┘
          │               │               │
          ▼               ▼               ▼
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │   Tester   │  │  Reviewer  │  │ Supervisor │
   │  测试验证   │  │  代码审查   │  │  任务协调   │
   └────────────┘  └────────────┘  └────────────┘
```

---

## 📁 项目结构

```
.
├── CLAUDE.md                    # 📖 主记忆文件
├── DASHBOARD.md                 # 📊 实时状态仪表板
├── README.md                    # 📋 项目说明
├── .claude/
│   ├── settings.json           # ⚙️ 权限与配置
│   ├── agents/                 # 🤖 子智能体定义
│   │   ├── supervisor.md       #    监督者
│   │   ├── repo-scout.md       #    代码侦察
│   │   ├── architect.md        #    架构师
│   │   ├── implementer.md      #    实现者
│   │   ├── tester.md           #    测试者
│   │   └── reviewer.md         #    审查者
│   ├── skills/                 # 🎯 技能定义
│   │   ├── dag-planning/       #    DAG 规划
│   │   ├── workflow-control/   #    工作流控制
│   │   ├── code-search/        #    代码搜索
│   │   ├── code-implementation/#    代码实现
│   │   ├── testing/            #    测试
│   │   └── code-review/        #    代码审查
│   ├── rules/                  # 📏 规则文件
│   │   ├── workflow.md         #    工作流规则
│   │   ├── code-quality.md     #    代码质量规则
│   │   ├── security.md         #    安全规则
│   │   └── dashboard-update.md #    Dashboard 更新规则
│   ├── commands/               # ⌨️ 自定义命令
│   │   ├── swe.md             #    /swe 完整流程
│   │   ├── analyze.md         #    /analyze 代码分析
│   │   ├── plan.md            #    /plan 任务规划
│   │   ├── test.md            #    /test 测试执行
│   │   ├── review.md          #    /review 代码审查
│   │   └── status.md          #    /status 状态查看
│   └── state/                  # 📦 运行时状态
└── docs/                       # 📚 项目文档
    ├── ARCHITECTURE.md         #    架构设计文档
    ├── GETTING_STARTED.md      #    快速开始指南
    └── PHILOSOPHY.md           #    工程哲学
```

---

## 🚀 快速开始

### 1. 安装

将框架文件复制到你的项目根目录。

### 2. 配置

根据项目需求调整 `.claude/settings.json`。

### 3. 使用

在 Cursor 中使用命令：

```bash
# 查看状态
/status

# 执行完整 SWE 流程
/swe 修复用户登录的空指针异常

# 分析代码
/analyze src/services/UserService.ts

# 生成任务计划
/plan 实现用户邮箱验证功能

# 运行测试
/test src/auth/

# 代码审查
/review
```

详见 [快速开始指南](./docs/GETTING_STARTED.md)。

---

## 🤖 子智能体

| 智能体 | 职责 | 核心能力 |
|--------|------|----------|
| **Supervisor** | 任务协调、DAG 生成、质量门控 | 规划、调度、监控 |
| **Repo Scout** | 代码检索、依赖分析、影响评估 | 搜索、分析、追踪 |
| **Architect** | 技术方案、接口设计、风险评估 | 设计、评估、权衡 |
| **Implementer** | 代码实现、Bug 修复、测试编写 | 编码、重构、测试 |
| **Tester** | 测试执行、结果分析、覆盖率 | 验证、分析、报告 |
| **Reviewer** | 代码审查、安全检查、验收 | 审查、检查、验收 |

---

## 📊 Dashboard

实时展示工作流状态：

- **Session Info**：会话基本信息
- **Task DAG**：任务依赖关系图（Mermaid）
- **Agent Status**：各智能体状态
- **Task List**：子任务列表与进度
- **Verification**：验证状态（lint/test/build）
- **Activity Log**：活动日志
- **Resource Usage**：资源消耗统计

查看 [DASHBOARD.md](./DASHBOARD.md)。

---

## 🎯 设计理念

### 控制面与数据面分离

- **控制面**：任务调度、状态管理、质量门控
- **数据面**：代码检索、工具执行、结果收集

### 结构化通信

智能体之间使用 YAML/JSON 格式通信，减少歧义，便于验证。

### 质量内建

- **Pre-commit Gate**：lint + typecheck + 单元测试
- **Pre-merge Gate**：全量测试 + 审查

### 最小权限

默认只允许读取操作，写入需确认，危险操作需审批。

详见 [工程哲学](./docs/PHILOSOPHY.md)。

---

## 📖 文档

| 文档 | 描述 |
|------|------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 详细架构设计 |
| [GETTING_STARTED.md](./docs/GETTING_STARTED.md) | 快速开始指南 |
| [PHILOSOPHY.md](./docs/PHILOSOPHY.md) | 设计理念与工程哲学 |
| [CLAUDE.md](./CLAUDE.md) | 项目记忆文件 |
| [DASHBOARD.md](./DASHBOARD.md) | 实时状态仪表板 |

---

## 🔧 自定义

### 添加新智能体

在 `.claude/agents/` 创建新的 `.md` 文件。

### 添加新技能

在 `.claude/skills/` 创建新目录和 `SKILL.md`。

### 添加新规则

在 `.claude/rules/` 创建新的 `.md` 文件。

### 添加新命令

在 `.claude/commands/` 创建新的 `.md` 文件。

---

## 📜 许可证

MIT License

---

## 🙏 致谢

本框架的设计理念借鉴了：

- **DR Agent 论文**：Deep Research Agents 的系统架构思想
- **Claude Code 官方文档**：记忆系统与子智能体机制
- **LangGraph**：状态机与图编排思想
- **Anthropic 工程博客**：长程 AI 系统设计经验

---

<sub>Multi-Agent SWE Framework v1.0.0 | Built with ❤️ for developers</sub>
