---
allowed-tools: Read, Bash
model: sonnet
description: 通过 Bash 调用 Claude Code CLI 的 reviewer 子 agent 进行审查并生成 Evidence
---

# /review 命令 - 代码审查

**C 方案强制**：该命令不由主控节点直接输出审查结论；而是通过 Bash 调用 `claude` CLI 的 `reviewer` 子 agent 输出结构化审查报告，并生成 EV Evidence。

## 使用方式
```
/review [目标]
```

## 执行（Bash → Claude Code CLI）

```bash
chmod +x .claude/bin/review_exec.sh
.claude/bin/review_exec.sh [target]
```

> 可选 smoke：`.claude/bin/review_exec.sh -- --help`

## 审查目标

### 当前变更
```
/review
```
审查 git 工作区的未提交变更。

### 指定提交
```
/review HEAD~3..HEAD
/review abc123
```

### 指定文件
```
/review src/services/UserService.ts
```

### PR 模式
```
/review --pr
```
模拟 PR 审查，生成完整的审查报告。

## 审查维度

1. **正确性**
   - 逻辑是否正确
   - 边界条件处理
   - 错误处理

2. **可读性**
   - 命名规范
   - 代码结构
   - 注释质量

3. **安全性**
   - 输入验证
   - 注入防护
   - 敏感数据处理

4. **性能**
   - 算法效率
   - 资源使用
   - 潜在问题

5. **测试**
   - 测试覆盖
   - 测试质量

## 输出格式

```yaml
review_report:
  target: "{审查目标}"
  verdict: "approve|request_changes|comment"
  
  issues:
    - id: "R1"
      severity: "critical|major|minor|suggestion"
      category: "{类别}"
      file: "{文件}"
      line: {行号}
      description: "{描述}"
      suggestion: "{建议}"
      required: true|false
  
  highlights:
    positive: ["{亮点}"]
    concerns: ["{担忧}"]
  
  summary: "{总结}"
  
  checklist:
    - item: "{检查项}"
      status: "pass|fail|na"
```

## 参数
- `$ARGUMENTS`: 审查目标

## 示例
```
/review
/review HEAD~1
/review src/auth/
/review --pr
```

