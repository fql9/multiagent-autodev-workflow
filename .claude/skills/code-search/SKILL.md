---
name: code-search
description: 代码搜索技能 - 高效检索代码库，包括符号搜索、语义搜索、依赖追踪
allowed-tools: Read, Grep, Glob, LS, Bash(git log*), Bash(git show*)
---

# Code Search Skill - 代码搜索技能

## 概述

此技能提供系统化的代码搜索方法，帮助快速定位相关代码、理解代码结构、追踪依赖关系。

## 搜索策略层级

### 第一层：精确搜索（最优先）
成本最低、确定性最高的搜索方式。

#### 符号搜索
```bash
# 函数/类定义
grep -rn "^function\s+{name}" --include="*.js"
grep -rn "^def\s+{name}" --include="*.py"
grep -rn "^class\s+{name}" --include="*.ts"

# 导出
grep -rn "export\s+.*{name}" --include="*.ts"
```

#### 精确字符串
```bash
# 错误信息
grep -rn "exact error message" .

# 配置键
grep -rn '"config_key"' .
```

### 第二层：模式搜索
使用正则表达式匹配模式。

```bash
# 函数调用
grep -rn "{name}\s*\(" --include="*.ts"

# 类型引用
grep -rn ":\s*{TypeName}" --include="*.ts"

# 注释中的 TODO/FIXME
grep -rn "TODO\|FIXME" .
```

### 第三层：语义搜索
理解代码意图和上下文。

- 阅读函数注释/docstring
- 分析测试用例理解行为
- 查看 commit message 理解演变

### 第四层：外部搜索（最后）
仅在本地信息不足时使用。

- 官方文档
- GitHub Issues/PR
- Stack Overflow

## 搜索模板

### 定位 Bug
```yaml
search_template: bug_location
steps:
  1_error_message:
    pattern: "{exact_error_text}"
    scope: "logs, error handlers, throw/raise statements"
  
  2_stack_trace:
    pattern: "{function_name_from_stack}"
    scope: "source files matching trace"
  
  3_data_flow:
    pattern: "{variable_name}"
    scope: "definition → mutation → usage"
  
  4_test_cases:
    pattern: "test.*{related_function}"
    scope: "test files"
```

### 理解功能
```yaml
search_template: feature_understanding
steps:
  1_entry_point:
    pattern: "route|endpoint|handler.*{feature}"
    scope: "routes, controllers, handlers"
  
  2_core_logic:
    pattern: "{service_name}|{function_name}"
    scope: "services, utils, core"
  
  3_data_model:
    pattern: "interface|type|class.*{model_name}"
    scope: "types, models, schemas"
  
  4_dependencies:
    pattern: "import.*{module_name}"
    scope: "all source files"
```

### 影响分析
```yaml
search_template: impact_analysis
steps:
  1_direct_usage:
    pattern: "{symbol_name}"
    scope: "all files"
    output: "files using this symbol"
  
  2_indirect_usage:
    pattern: "files that import direct users"
    scope: "import statements"
  
  3_test_coverage:
    pattern: "{symbol_name}|{file_name}"
    scope: "test files"
  
  4_config_references:
    pattern: "{symbol_name}"
    scope: "config, package.json, .env"
```

## 输出格式

### 搜索结果
```yaml
search_result:
  query: "{搜索查询}"
  total_hits: {数量}
  relevant_hits: {数量}
  
  findings:
    - file: "{文件路径}"
      line: {行号}
      context: |
        {前后5行代码}
      relevance: "high|medium|low"
      type: "definition|usage|test|comment"
```

### 符号图
```yaml
symbol_map:
  name: "{符号名}"
  type: "function|class|variable|type"
  
  definition:
    file: "{文件}"
    line: {行号}
    signature: "{签名}"
  
  usages:
    - file: "{文件}"
      line: {行号}
      type: "call|import|type_ref"
  
  dependencies:
    imports: ["{依赖}"]
    imported_by: ["{被依赖}"]
```

## 最佳实践

### DO
- 从精确搜索开始，逐步放宽
- 记录每次搜索的命中情况
- 组合多种搜索方式交叉验证
- 关注测试文件（行为的真相）

### DON'T
- 不要一开始就做全库扫描
- 不要忽略 node_modules/.gitignore 的文件
- 不要只看第一个命中结果
- 不要忽略注释和文档

## 搜索命令速查

```bash
# 文件名搜索
find . -name "*.ts" -path "*/src/*"

# 内容搜索（排除 node_modules）
grep -rn "pattern" --include="*.ts" --exclude-dir=node_modules

# Git 历史搜索
git log -p -S "search_term" -- "*.ts"
git log --oneline --all --grep="keyword"

# 最近修改
git log -10 --oneline -- "{file_path}"

# 谁改了这行
git blame -L {start},{end} "{file_path}"
```

