---
name: testing
description: 测试验证技能 - 测试策略、执行、分析与报告
allowed-tools: Read, Grep, Glob, LS, Bash(npm test*), Bash(pytest*), Bash(cargo test*), Bash(go test*)
---

# Testing Skill - 测试验证技能

## 概述

此技能提供系统化的测试方法，确保代码变更的正确性和质量。

## 测试策略

### 测试金字塔
```
          /\
         /  \        E2E Tests (少量，验证关键流程)
        /----\
       /      \      Integration Tests (适量，验证模块交互)
      /--------\
     /          \    Unit Tests (大量，验证函数逻辑)
    /------------\
```

### 测试选择策略
```yaml
test_selection:
  based_on_change:
    - change_type: "single_function"
      tests: "相关单元测试"
    
    - change_type: "module_interface"
      tests: "单元测试 + 相关集成测试"
    
    - change_type: "cross_module"
      tests: "单元测试 + 集成测试 + E2E"
    
    - change_type: "config_change"
      tests: "全量测试"
  
  based_on_risk:
    - risk: "security"
      tests: "安全测试 + 回归测试"
    
    - risk: "performance"
      tests: "性能基准测试"
    
    - risk: "breaking_change"
      tests: "全量测试 + 兼容性测试"
```

## 测试命令

### JavaScript/TypeScript
```bash
# Jest
npm test                          # 全量测试
npm test -- --watch              # 监视模式
npm test -- --coverage           # 带覆盖率
npm test -- {pattern}            # 匹配测试文件
npm test -- -t "{test_name}"     # 匹配测试名

# Vitest
npx vitest run
npx vitest run --coverage
```

### Python
```bash
# Pytest
pytest                           # 全量测试
pytest -v                        # 详细输出
pytest --cov={module}            # 带覆盖率
pytest {path}                    # 指定路径
pytest -k "{pattern}"            # 匹配测试名
pytest -x                        # 失败即停
pytest --lf                      # 只跑上次失败的
```

### Rust
```bash
cargo test                       # 全量测试
cargo test {name}               # 匹配测试名
cargo test -- --nocapture       # 显示打印
cargo test -- --test-threads=1  # 串行执行
```

### Go
```bash
go test ./...                    # 全量测试
go test -v ./...                 # 详细输出
go test -cover ./...             # 带覆盖率
go test -run {pattern} ./...     # 匹配测试名
```

## 验证流程

### 快速验证 (Pre-commit)
```yaml
fast_verification:
  duration: "<2 min"
  steps:
    - name: "Lint"
      commands:
        js: "npm run lint"
        python: "ruff check . && black --check ."
        rust: "cargo clippy"
        go: "golangci-lint run"
    
    - name: "Type Check"
      commands:
        ts: "tsc --noEmit"
        python: "mypy ."
        rust: "cargo check"
    
    - name: "Unit Tests"
      commands:
        js: "npm test -- --testPathIgnorePatterns=integration"
        python: "pytest -m 'not integration'"
        rust: "cargo test --lib"
        go: "go test -short ./..."
```

### 完整验证 (Pre-merge)
```yaml
full_verification:
  duration: "<15 min"
  steps:
    - name: "All Lint & Type Checks"
    
    - name: "Unit Tests with Coverage"
      commands:
        js: "npm test -- --coverage"
        python: "pytest --cov --cov-report=html"
    
    - name: "Integration Tests"
      commands:
        js: "npm run test:integration"
        python: "pytest -m integration"
    
    - name: "Build"
      commands:
        js: "npm run build"
        rust: "cargo build --release"
        go: "go build ./..."
    
    - name: "Security Scan"
      commands:
        js: "npm audit"
        python: "safety check"
        rust: "cargo audit"
```

## 失败分析

### 分析流程
```yaml
failure_analysis:
  1_categorize:
    - "Assertion failure"
    - "Timeout"
    - "Exception/Error"
    - "Setup failure"
    - "Flaky test"
  
  2_isolate:
    - action: "单独运行失败测试"
      command: "{test_runner} -k {test_name}"
    
    - action: "检查是否可复现"
      repeat: 3
  
  3_investigate:
    - "检查测试代码"
    - "检查被测代码变更"
    - "检查测试数据"
    - "检查环境差异"
  
  4_root_cause:
    - "代码 Bug"
    - "测试本身问题"
    - "环境/配置问题"
    - "竞态条件"
```

### Flaky Test 处理
```yaml
flaky_test_handling:
  detection:
    - "同一测试多次运行结果不一致"
    - "本地通过但 CI 失败"
    - "并行运行时失败"
  
  common_causes:
    - "时间依赖"
    - "随机数据"
    - "共享状态"
    - "网络调用"
    - "文件系统竞争"
  
  solutions:
    - "固定随机种子"
    - "mock 时间"
    - "隔离测试状态"
    - "增加重试"
    - "标记跳过并创建 issue"
```

## 覆盖率分析

### 覆盖率类型
```yaml
coverage_types:
  line: "代码行覆盖"
  branch: "分支覆盖"
  function: "函数覆盖"
  statement: "语句覆盖"
```

### 覆盖率目标
```yaml
coverage_targets:
  minimum:
    overall: 70%
    new_code: 80%
  
  recommended:
    overall: 80%
    new_code: 90%
    critical_paths: 95%
```

### 覆盖率报告解读
```yaml
coverage_analysis:
  - metric: "未覆盖的行"
    action: "检查是否是关键路径"
  
  - metric: "分支覆盖率低"
    action: "添加边界条件测试"
  
  - metric: "函数未覆盖"
    action: "检查是否是死代码"
```

## 测试报告格式

```yaml
test_report:
  summary:
    total: {总数}
    passed: {通过}
    failed: {失败}
    skipped: {跳过}
    duration: "{耗时}"
  
  coverage:
    lines: "{百分比}"
    branches: "{百分比}"
    functions: "{百分比}"
  
  failures:
    - name: "{测试名}"
      file: "{文件}"
      error: "{错误信息}"
      stack: "{堆栈}"
      
  recommendations:
    - "{建议1}"
    - "{建议2}"
```

