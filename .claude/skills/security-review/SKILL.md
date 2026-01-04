---
name: security-review
description: 安全审查技能 - 对输入验证、权限边界、敏感数据、依赖漏洞等进行结构化检查
allowed-tools: Read, Grep, Glob, LS, Bash(git diff*), Bash(git log*)
---

# Security Review Skill - 安全审查技能

## 检查清单（最小集）

- 输入验证：长度/格式/类型/路径规范化
- 注入：SQL/命令/模板/反序列化
- 权限：鉴权/授权/资源所有权
- 敏感信息：密钥/PII/日志脱敏
- 依赖：高危漏洞、供应链风险

## 输出（建议格式）

```yaml
security_review:
  verdict: "approve|request_changes|comment"
  findings:
    - severity: "critical|high|medium|low"
      category: "auth|injection|data|deps|config"
      description: "{问题}"
      evidence: "{文件/行号/片段}"
      recommendation: "{建议}"
```


