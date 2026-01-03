---
name: code-review
description: 代码审查技能 - 代码质量评估、安全审查、最佳实践检查
allowed-tools: Read, Grep, Glob, LS, Bash(git diff*), Bash(git log*)
---

# Code Review Skill - 代码审查技能

## 概述

此技能提供系统化的代码审查方法，确保代码质量、安全性和可维护性。

## 审查维度

### 1. 正确性
```yaml
correctness:
  - check: "逻辑是否正确"
    items:
      - "算法实现是否符合预期"
      - "边界条件是否处理"
      - "异常情况是否覆盖"
  
  - check: "是否满足需求"
    items:
      - "功能是否完整"
      - "验收标准是否满足"
      - "是否有遗漏场景"
```

### 2. 可读性
```yaml
readability:
  - check: "命名"
    items:
      - "变量/函数名是否清晰"
      - "是否符合项目命名规范"
      - "是否有误导性命名"
  
  - check: "结构"
    items:
      - "函数长度是否合适"
      - "嵌套层级是否过深"
      - "逻辑是否易于理解"
  
  - check: "注释"
    items:
      - "复杂逻辑是否有解释"
      - "公开 API 是否有文档"
      - "是否有过时注释"
```

### 3. 可维护性
```yaml
maintainability:
  - check: "模块化"
    items:
      - "职责是否单一"
      - "耦合度是否合理"
      - "是否易于测试"
  
  - check: "可扩展性"
    items:
      - "是否易于修改"
      - "是否有硬编码"
      - "配置是否外置"
  
  - check: "一致性"
    items:
      - "是否符合项目风格"
      - "是否复用现有组件"
      - "错误处理是否统一"
```

### 4. 性能
```yaml
performance:
  - check: "算法效率"
    items:
      - "时间复杂度是否合理"
      - "是否有不必要的循环"
      - "是否有 N+1 查询"
  
  - check: "资源使用"
    items:
      - "内存使用是否合理"
      - "是否有资源泄漏"
      - "是否正确关闭连接"
  
  - check: "缓存"
    items:
      - "是否合理使用缓存"
      - "缓存失效策略是否正确"
```

### 5. 安全性
```yaml
security:
  - check: "输入验证"
    items:
      - "是否验证用户输入"
      - "是否防止注入攻击"
      - "是否有长度限制"
  
  - check: "认证授权"
    items:
      - "是否正确检查权限"
      - "是否有越权风险"
      - "敏感操作是否审计"
  
  - check: "数据保护"
    items:
      - "敏感数据是否加密"
      - "是否有信息泄露"
      - "日志是否脱敏"
```

## 审查清单

### 通用清单
```markdown
## 正确性
- [ ] 代码实现了预期功能
- [ ] 边界条件处理正确
- [ ] 错误处理完善

## 可读性
- [ ] 命名清晰有意义
- [ ] 代码结构合理
- [ ] 必要的注释

## 安全性
- [ ] 无明显安全漏洞
- [ ] 输入已验证
- [ ] 敏感信息未泄露

## 测试
- [ ] 有足够的测试覆盖
- [ ] 测试用例设计合理
- [ ] 边界情况已测试

## 兼容性
- [ ] 向后兼容或有迁移方案
- [ ] 依赖变更已评估
```

### 安全审查清单
```markdown
## 输入处理
- [ ] 所有外部输入已验证
- [ ] SQL 查询使用参数化
- [ ] 文件路径已验证

## 认证授权
- [ ] 敏感接口需要认证
- [ ] 权限检查正确
- [ ] 会话管理安全

## 数据处理
- [ ] 密码正确哈希存储
- [ ] 敏感数据传输加密
- [ ] 日志不含敏感信息

## 依赖
- [ ] 无已知漏洞依赖
- [ ] 依赖来源可信
```

## 常见问题模式

### 代码异味
```yaml
code_smells:
  - smell: "过长函数"
    sign: ">50 行"
    fix: "拆分为多个小函数"
  
  - smell: "过多参数"
    sign: ">4 个参数"
    fix: "使用对象封装"
  
  - smell: "重复代码"
    sign: "相似代码块出现多次"
    fix: "提取公共函数"
  
  - smell: "嵌套过深"
    sign: ">3 层嵌套"
    fix: "提前返回，减少嵌套"
  
  - smell: "魔术数字"
    sign: "硬编码数字"
    fix: "使用命名常量"
```

### 安全漏洞
```yaml
security_issues:
  - issue: "SQL 注入"
    pattern: "字符串拼接 SQL"
    fix: "使用参数化查询"
  
  - issue: "XSS"
    pattern: "未转义输出用户内容"
    fix: "使用模板引擎转义"
  
  - issue: "敏感信息泄露"
    pattern: "日志打印密码/token"
    fix: "脱敏或移除"
  
  - issue: "不安全的随机数"
    pattern: "Math.random() 用于安全场景"
    fix: "使用加密安全的随机数"
```

## 反馈格式

### 问题描述
```yaml
issue:
  id: "R{n}"
  severity: "critical|major|minor|suggestion"
  category: "bug|security|performance|style|design"
  location:
    file: "{文件路径}"
    line: {行号}
  description: |
    {问题描述}
  suggestion: |
    {改进建议}
  example: |
    {示例代码}
  required: true|false
```

### 审查总结
```yaml
review_summary:
  verdict: "approve|request_changes|comment"
  
  highlights:
    positive:
      - "{亮点1}"
      - "{亮点2}"
    concerns:
      - "{问题1}"
      - "{问题2}"
  
  action_items:
    required:
      - "{必须修改1}"
    recommended:
      - "{建议修改1}"
  
  overall_comment: |
    {总体评价}
```

## 审查原则

### DO
- 聚焦于代码本身
- 提供具体可操作的建议
- 解释问题的原因
- 承认好的实现
- 区分"必须"和"建议"

### DON'T
- 审查人而非代码
- 模糊不清的评论
- 只批评不建议
- 过度追求完美
- 忽略上下文背景

