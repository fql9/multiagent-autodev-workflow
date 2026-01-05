---
allowed-tools: Read, Bash
model: sonnet
description: 通过 Bash 调用 Claude Code CLI 的 tester 子 agent 运行测试并生成 Evidence
---

# /test 命令 - 测试执行

**C 方案强制**：该命令不由主控节点直接运行测试；而是通过 Bash 调用 `claude` CLI 的 `tester` 子 agent 执行，并生成可追溯 Evidence（EV）。

## 使用方式
```
/test [范围] [选项]
```

## 执行（Bash → Claude Code CLI）

```bash
chmod +x .claude/bin/test_exec.sh
.claude/bin/test_exec.sh "<scope>"
```

> 可选 smoke：`.claude/bin/test_exec.sh "all" -- --help`

## 测试范围

### 全量测试
```
/test all
```

### 指定路径
```
/test src/services/
/test tests/unit/
```

### 匹配模式
```
/test --pattern "user*"
/test --filter "login"
```

### 快速测试
```
/test fast
```
只运行单元测试，跳过集成测试和 E2E。

## 执行流程

1. **检测项目类型**
   - 识别使用的测试框架
   - 确定测试命令

2. **运行测试**
   - 按范围执行测试
   - 收集输出和结果

3. **分析结果**
   - 统计通过/失败
   - 分析失败原因
   - 计算覆盖率（如支持）

4. **生成报告**
   - 结构化测试报告
   - 失败测试详情
   - 改进建议

## 输出格式

```yaml
test_report:
  timestamp: "{时间}"
  scope: "{范围}"
  
  summary:
    total: {总数}
    passed: {通过}
    failed: {失败}
    skipped: {跳过}
    duration: "{耗时}"
  
  coverage:
    lines: "{百分比}"
    branches: "{百分比}"
  
  failures:
    - name: "{测试名}"
      file: "{文件}"
      error: "{错误}"
      suggestion: "{建议}"
  
  recommendations: ["{建议}"]
```

## 参数
- `$ARGUMENTS`: 测试范围和选项

## 示例
```
/test
/test src/auth/
/test --coverage
/test fast
```

