---
allowed-tools: Read, Write, Edit, Grep, Glob, LS, Bash, Task
model: sonnet
description: 执行完整的软件工程任务流程
---

# /swe 命令 - 软件工程任务执行器

执行一个完整的软件工程任务，包括分析、规划、实现、测试和审查。

## 使用方式
```
/swe <任务描述>
```

## 执行流程

### 1. 需求分析
- 理解用户任务目标
- 提取关键需求和约束
- 生成验收标准

### 2. 代码分析
**必须通过 Bash + Claude Code CLI 调用子智能体（C 方案）**：
- 使用 `.claude/bin/call_subagent.sh` 或 `.claude/bin/swe_exec.sh`
- 每次调用必须生成 EV 证据，并写入 `DASHBOARD.md` Evidence Index

### 3. 任务规划
生成任务 DAG：
- 分解为子任务
- 确定依赖关系
- 分配执行者

### 4. 方案设计（如需要）
**必须通过 Bash + Claude Code CLI 调用子智能体（C 方案）**：
- 设计技术方案
- 定义接口契约
- 评估风险

### 5. 代码实现
**必须通过 Bash + Claude Code CLI 调用子智能体（C 方案）**：
- 主控节点（Cursor）不得直接“手写实现代码”
- Implementer 的工作应通过 CLI agent 执行，并输出 Evidence（命令/输出/文件）

### 6. 验证
**必须通过 Bash + Claude Code CLI 调用子智能体（C 方案）**：
- 运行测试 / 静态检查
- 输出可复现 Evidence（测试命令 + 结果摘要 + 相关文件路径）

### 7. 审查
**必须通过 Bash + Claude Code CLI 调用子智能体（C 方案）**：
- 代码审查
- 验收检查
- 输出结构化审查报告（含阻塞项/建议项）

### 8. 状态更新
更新 DASHBOARD.md：
- 记录完成状态
- 汇总产出物
- 记录审计日志

---

## 推荐执行方式（主控只做 Plan，其余全部 CLI）

1) 先 `/plan` 生成 DAG（主控节点完成）

2) 再用脚本执行非计划阶段（全部 Bash → Claude Code CLI）：

```bash
.claude/bin/swe_exec.sh <task_id> "<task_goal>"
```

脚本会自动生成 prompts（在 `.claude/state/attachments/`）并依次调用：
`repo-scout` → `architect` → `implementer` → `tester` → `reviewer`

产出 Evidence 位置：
- `.claude/state/audit.log`
- `.claude/state/evidence/<EV_ID>.md`
- `.claude/state/logs/<EV_ID>.*`

## 参数
- `$ARGUMENTS`: 任务描述

## 示例
```
/swe 修复用户登录时的空指针异常
/swe 添加用户邮箱验证功能
/swe 重构 UserService 提高可测试性
```

