# 🤖 Multi-Agent SWE Framework

> 基于 Cursor + Claude Code Subagents 的多智能体软件工程框架

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 简介

这是一个为 **Cursor** 和 **Claude Code** 设计的**多智能体软件工程框架**。它通过将复杂的开发任务分解为**规划、检索、实现、验证、审查**等明确的阶段，并指派给 6 个专业化的子智能体协作完成，从而实现高质量的自动化开发。

与普通的 AI 聊天不同，本框架引入了 **控制面 (Control Plane)** 概念，通过 **DAG 任务图**、**实时 Dashboard** 和 **严格的质量门 (Quality Gates)**，让 AI 真的"乖乖听话"，产出可用的工程代码。

---

## ✨ 核心特性

- **🎯 多智能体协作**：6 个专业化子智能体 (Supervisor, Architect, Implementer 等) 各司其职。
- **📊 实时 Dashboard**：`DASHBOARD.md` 实时展示任务进度、DAG 图、资源消耗。
- **🔄 可控工作流**：支持 `/plan` (规划) -> `/swe` (执行) 分步操作，避免 AI "乱跑"。
- **✅ 质量内建**：Pre-commit (Lint/Test) 和 Pre-merge (Review) 双重质量门。
- **🔐 安全第一**：默认最小权限，写操作需确认，高风险操作需审批。

---

## 🚀 快速开始 (Step-by-Step 指南)

跟随以下步骤，你可以在 5 分钟内上手本框架。

### 第一步：安装与初始化

1. **复制文件**：将本项目的所有文件（`.claude/`, `CLAUDE.md`, `DASHBOARD.md` 等）复制到你的项目根目录。
2. **配置 Cursor 规则**：
   在你的项目根目录创建或更新 `.cursorrules` 文件，填入以下内容以激活 "Main Agent" 模式：
   
   ```markdown
   # Role: Cursor Main Agent (Control Plane)
   你是 Multi-Agent SWE Framework 的主控节点。你的核心目标是交付可验证的软件变更。
   
   ## Operating Principles (Hard Rules)
   1. **状态优先**：行动前必须先 /status 读取 DASHBOARD。
   2. **写操作熔断**：未经用户明确确认，不得进行破坏性写操作。
   3. **证据治理**：任何“完成”结论必须有 Evidence。
   4. **严格状态机**：必须按阶段推进：CLARIFY -> PLAN -> EXECUTE -> VERIFY -> REVIEW -> DONE。
   5. **风险控制**：高风险变更必须请求 /approve。
   
   ## Commands Map
   - /status            -> 读取并摘要 DASHBOARD.md
   - /plan <task>       -> 进入 CLARIFY/PLAN 阶段
   - /swe <confirm>     -> 进入 EXECUTE 阶段
   - /test <scope>      -> 进入 VERIFY 阶段
   - /review            -> 进入 REVIEW 阶段
   - /reset             -> 重置会话
   ```

### 第二步：检查状态

在 Cursor 的 Chat 面板中输入：

```bash
/status
```

如果 Cursor 返回了 `DASHBOARD.md` 的当前状态面板（包含 Session Info, Agent Status 等），说明框架已成功加载。

### 第三步：规划任务 (Plan)

不要急着写代码，先让 AI 思考。输入：

```bash
/plan 开发一个简单的贪吃蛇游戏网页，包含计分板和开始按钮
```

**发生了什么？**
1. **Supervisor** 智能体被唤醒。
2. 它会分析需求，生成一个包含 **架构设计 -> 核心逻辑 -> UI 实现 -> 测试** 的 **DAG (有向无环图)**。
3. 它会把这个计划写入 `DASHBOARD.md`。
4. 你可以检查计划，确认无误后再继续。

### 第四步：执行任务 (Execute)

确认计划后，输入：

```bash
/swe 确认执行贪吃蛇开发计划
```

**发生了什么？**
1. **Architect** 设计数据结构。
2. **Implementer** 开始编写 HTML/CSS/JS。
3. **Tester** 在代码完成后进行逻辑验证。
4. **DASHBOARD.md** 会实时更新每个子任务的状态 (Pending -> Running -> Completed)。

### 第五步：查看结果与验收

1. 观察 `DASHBOARD.md` 变为 **✅ COMPLETED** 状态。
2. 查看生成的文件（例如 `index.html`）。
3. 如果有 Bug，直接输入：`/swe 修复贪吃蛇撞墙判定不准的问题`。

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

## 🤖 子智能体 (Agents)

| 智能体 | 角色 | 职责 | 核心能力 |
|--------|------|------|----------|
| **Supervisor** | PM / 组长 | 任务协调、DAG 生成、进度监控 | 规划、调度 |
| **Repo Scout** | 探路者 | 代码库搜索、依赖分析 | 全局搜索、引用查找 |
| **Architect** | 架构师 | 技术选型、接口设计、风险评估 | 系统设计、文档编写 |
| **Implementer**| 工程师 | 代码编写、Bug 修复 | 编码、重构 |
| **Tester** | 测试工程师 | 测试用例编写、验证执行 | 单元测试、集成测试 |
| **Reviewer** | 审查员 | 代码审查、规范检查 | Code Review、安全审计 |

---

## 📁 项目结构

```
.
├── CLAUDE.md                    # 📖 项目记忆 (规范、常用命令)
├── DASHBOARD.md                 # 📊 实时仪表板 (不要手动修改，由 Agent 维护)
├── .cursorrules                 # 🧠 Cursor 核心指令集
├── .claude/
│   ├── settings.json           # ⚙️ 权限与工具配置
│   ├── agents/                 # 🤖 6个子智能体的 System Prompt
│   ├── skills/                 # 🎯 可复用的技能 (搜索、测试等)
│   ├── rules/                  # 📏 强制性规则 (Lint, Security)
│   └── commands/               # ⌨️ Slash Commands 定义 (/swe, /plan)
└── docs/                       # 📚 详细文档
```

---

## 🔧 常用命令参考

| 命令 | 用途 | 示例 |
|------|------|------|
| `/status` | 查看当前进度 | `/status` |
| `/plan` | 仅生成计划 (不执行) | `/plan 重构 AuthService` |
| `/swe` | 执行完整开发流程 | `/swe 确认执行 <Task>` |
| `/analyze`| 分析代码结构 | `/analyze src/utils/` |
| `/test` | 运行测试并分析失败 | `/test src/components/` |
| `/review` | 对当前变更进行审查 | `/review` |
| `/reset` | 重置会话状态 | `/reset` |

---

## 📜 许可证

[MIT License](https://opensource.org/licenses/MIT)

---

## 🙏 致谢

本框架的设计灵感来源于：
- **Deep Research Agents** (关于多智能体协作的学术研究)
- **Claude Code** (Anthropic 官方的 CLI 工具机制)
- **LangGraph** (图与状态机编排思想)

---

<sub>Multi-Agent SWE Framework v1.0.0 | Built with ❤️ for developers</sub>
