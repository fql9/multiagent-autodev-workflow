---
allowed-tools: Read, Grep, Glob, LS, Bash(git log*), Bash(git show*), Bash(git blame*)
model: sonnet
description: 分析代码库，理解结构和依赖
---

# /analyze 命令 - 代码分析

分析代码库或特定文件/功能，输出结构化的分析报告。

## 使用方式
```
/analyze <目标>
```

## 分析类型

### 文件分析
分析单个文件的结构、依赖和职责。

### 模块分析
分析一个模块/目录的组织、接口和依赖。

### 功能分析
分析特定功能的实现，追踪调用链。

### 依赖分析
分析项目依赖关系，识别潜在问题。

## 输出格式

```yaml
analysis_report:
  target: "{分析目标}"
  type: "file|module|feature|dependency"
  
  structure:
    files: ["{文件列表}"]
    entry_points: ["{入口点}"]
    key_components: ["{关键组件}"]
  
  dependencies:
    internal: ["{内部依赖}"]
    external: ["{外部依赖}"]
    circular: ["{循环依赖，如有}"]
  
  metrics:
    lines_of_code: {行数}
    complexity: "low|medium|high"
    test_coverage: "{覆盖率}"
  
  findings:
    - type: "observation|suggestion|warning"
      description: "{描述}"
  
  recommendations: ["{建议}"]
```

## 参数
- `$ARGUMENTS`: 分析目标（文件路径、模块名或功能名）

## 示例
```
/analyze src/services/UserService.ts
/analyze src/auth/
/analyze 用户认证流程
/analyze 项目依赖
```

