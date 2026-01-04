---
allowed-tools: Read, Grep, Glob, LS, Bash(git status), Bash(git diff:*), Bash(npm test:*), Bash(npm run lint:*), Bash(npm run build:*), Bash(pytest:*), Bash(python -m pytest:*), Bash(go test:*), Bash(cargo test:*), Bash(jest:*), Bash(vitest:*)
model: sonnet
description: 执行质量门（pre-commit / pre-merge）并产出证据
---

# /gate 命令 - 质量门执行器

把“质量门”变成可执行动作，并产出可追溯证据（Evidence）。

## 使用方式
```
/gate pre-commit
/gate pre-merge
```

## 规则
- **未通过 gate，不得标记为 Done**（也不应进入下一个阶段）。
- 若仓库没有现成 lint/test 命令，必须先在 `/clarify` 或 `/plan` 中确认项目技术栈与验证策略。

## 执行内容（建议默认）

### pre-commit（快速）
- Lint / Format（若项目支持）
- Unit Tests（快速范围）
- `git diff` 摘要（用于 Review）

### pre-merge（完整）
- 全量测试（单元 + 集成，必要时 E2E）
- Build（若项目需要）
- 安全检查（依赖审计/敏感信息扫描：按项目实际能力）

## 输出格式

```yaml
gate_result:
  gate: "pre-commit|pre-merge"
  timestamp: "{ISO8601}"
  commands:
    - cmd: "{执行命令}"
      exit_code: 0
      duration: "{耗时}"
      summary: "{关键输出摘要}"
  verdict: "pass|fail"
  evidence:
    - "{可复制的命令 + 结果摘要}"
  next_actions:
    - "{失败时下一步修复建议}"
```


