---
name: code-implementation
description: 代码实现技能 - 高质量代码编写、变更管理、测试编写
allowed-tools: Read, Write, Edit, Grep, Glob, LS
---

# Code Implementation Skill - 代码实现技能

## 概述

此技能提供系统化的代码实现方法，确保代码质量、变更可控、测试充分。

## 实现流程

### 1. 准备阶段
```yaml
preparation:
  - action: "理解接口契约"
    check: "输入/输出类型明确"
  
  - action: "确认边界条件"
    check: "异常情况已识别"
  
  - action: "运行现有测试"
    check: "基线状态正常"
  
  - action: "创建工作分支"
    command: "git checkout -b feature/{name}"
```

### 2. 实现阶段
```yaml
implementation:
  - step: "搭建骨架"
    action: "先写函数签名和主要结构"
  
  - step: "核心逻辑"
    action: "实现主路径，暂时忽略边界"
  
  - step: "边界处理"
    action: "添加错误处理和边界检查"
  
  - step: "自测"
    action: "本地运行相关测试"
```

### 3. 完善阶段
```yaml
polish:
  - action: "代码清理"
    items:
      - "移除调试代码"
      - "添加必要注释"
      - "优化命名"
  
  - action: "格式化"
    command: "npm run format / black ."
  
  - action: "静态检查"
    command: "npm run lint / mypy ."
```

## 代码质量标准

### 命名规范
```yaml
naming:
  variables:
    - rule: "使用有意义的名称"
      good: "userAge, isActive, totalCount"
      bad: "x, temp, data"
  
  functions:
    - rule: "动词开头，描述行为"
      good: "calculateTotal, validateInput, fetchUser"
      bad: "total, input, user"
  
  classes:
    - rule: "名词，描述实体"
      good: "UserService, PaymentHandler"
      bad: "DoStuff, Manager"
  
  constants:
    - rule: "全大写，下划线分隔"
      good: "MAX_RETRY_COUNT, API_BASE_URL"
```

### 函数设计
```yaml
function_design:
  - rule: "单一职责"
    description: "一个函数只做一件事"
    max_lines: 30
  
  - rule: "参数数量"
    description: "参数不超过4个，否则用对象"
    max_params: 4
  
  - rule: "返回值"
    description: "返回类型一致，避免 null/undefined 歧义"
  
  - rule: "错误处理"
    description: "预期错误使用返回值，意外错误抛异常"
```

### 注释规范
```yaml
comments:
  - when: "复杂算法"
    example: "// 使用 KMP 算法进行字符串匹配"
  
  - when: "业务规则"
    example: "// 根据公司政策，折扣不能超过30%"
  
  - when: "临时解决方案"
    example: "// TODO: 重构为异步处理 (tracking: ISSUE-123)"
  
  - when: "外部依赖约束"
    example: "// Note: API v2 要求此字段必须是 ISO 格式"
```

## 变更管理

### 原子变更原则
```yaml
atomic_changes:
  - rule: "每个提交只做一件事"
    good:
      - "feat: add user validation"
      - "fix: handle null input in validateUser"
    bad:
      - "misc changes"
      - "fix bug and add feature"
  
  - rule: "重构与功能分离"
    approach: "先提交重构，再提交功能"
```

### Commit Message 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 格式调整（不影响代码逻辑）
- `refactor`: 重构（不改变功能）
- `test`: 测试相关
- `chore`: 构建/工具变更

### Patch 生成
```bash
# 生成 patch 文件
git diff > changes.patch
git format-patch HEAD~1

# 应用 patch
git apply changes.patch
git am < patch_file.patch
```

## 测试编写

### 测试类型
```yaml
test_types:
  unit:
    scope: "单个函数/类"
    isolation: "mock 外部依赖"
    speed: "毫秒级"
  
  integration:
    scope: "多个模块交互"
    isolation: "mock 外部服务"
    speed: "秒级"
  
  e2e:
    scope: "完整用户流程"
    isolation: "真实环境"
    speed: "分钟级"
```

### 测试命名
```yaml
test_naming:
  pattern: "{action}_{scenario}_{expected_result}"
  examples:
    - "login_withValidCredentials_returnsToken"
    - "createUser_withDuplicateEmail_throwsError"
    - "calculateDiscount_withNegativeAmount_returnsZero"
```

### 测试结构（AAA）
```python
def test_example():
    # Arrange - 准备测试数据
    user = create_test_user()
    
    # Act - 执行被测代码
    result = service.process(user)
    
    # Assert - 验证结果
    assert result.success == True
    assert result.data.id == user.id
```

## 常见模式

### 错误处理
```typescript
// 使用 Result 类型
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}
```

### 输入验证
```typescript
function validateInput(input: unknown): Input {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  // ... more validation
  return input as Input;
}
```

### 防御性编程
```typescript
function processItems(items?: Item[]) {
  const safeItems = items ?? [];
  return safeItems.map(item => transform(item));
}
```

