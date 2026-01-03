---
paths: ["**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx", "**/*.py", "**/*.go", "**/*.rs"]
alwaysApply: true
---

# Code Quality Rules - 代码质量规则

## 通用规则

### 命名规范
- 变量名使用有意义的名称，避免 `x`, `temp`, `data`
- 函数名使用动词开头，描述其行为
- 类名使用名词，描述其代表的实体
- 常量使用全大写，下划线分隔

### 函数设计
- 单个函数不超过 50 行
- 参数不超过 4 个，超过时使用对象封装
- 函数只做一件事（单一职责）
- 避免副作用，优先纯函数

### 代码组织
- 相关代码放在一起
- 导入语句按规范排序
- 避免循环依赖
- 保持模块职责单一

### 错误处理
- 所有可能失败的操作都要处理错误
- 使用具体的错误类型，避免 `Error`
- 提供有意义的错误消息
- 记录错误上下文

### 注释规范
- 复杂算法必须有解释注释
- 公开 API 必须有文档注释
- 避免注释过时的代码
- TODO 必须包含 issue 链接

## TypeScript/JavaScript 规则

### 类型安全
- 避免使用 `any`，优先使用具体类型
- 使用 `unknown` 替代 `any` 处理未知类型
- 启用 strict 模式
- 使用类型守卫处理联合类型

### 异步处理
- 使用 async/await 替代回调
- 正确处理 Promise 拒绝
- 避免未处理的 Promise
- 使用 AbortController 支持取消

### 模块导入
```typescript
// 1. Node.js 内置模块
import fs from 'fs';

// 2. 第三方模块
import express from 'express';

// 3. 内部模块（绝对路径）
import { config } from '@/config';

// 4. 相对路径模块
import { helper } from './helper';
```

## Python 规则

### 类型提示
- 所有函数必须有类型注解
- 使用 `typing` 模块的高级类型
- 配合 mypy 进行静态检查

### 代码风格
- 遵循 PEP 8
- 使用 black 格式化
- 使用 ruff 进行 lint

### 导入顺序
```python
# 1. 标准库
import os
import sys

# 2. 第三方库
import requests
import numpy as np

# 3. 本地模块
from myapp import config
from .helper import utils
```

## 测试规则

### 测试命名
- 使用 `test_<action>_<scenario>_<expected>` 格式
- 测试名应该能说明测试内容

### 测试结构
- 使用 AAA 模式：Arrange, Act, Assert
- 每个测试只验证一件事
- 避免测试间的依赖

### 覆盖率
- 新代码测试覆盖率 >= 80%
- 关键路径覆盖率 >= 95%
- 不要为了覆盖率而写无意义的测试

