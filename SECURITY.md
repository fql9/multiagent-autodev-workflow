# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of this framework seriously. If you find a security vulnerability, please follow these steps:

1.  **Do NOT open a public issue.**
2.  Send a report to the maintainers (or simulate a secure report in the context of this AI project).
3.  Include details about:
    *   Description of the vulnerability.
    *   Steps to reproduce.
    *   Potential impact.

## Critical Security Rules for Agents

The **Main Agent (Cursor)** enforces the following security rules:

1.  **Principle of Least Privilege**: Sub-agents run with restricted permissions by default.
2.  **Human-in-the-loop**:
    *   Write operations to critical paths require explicit confirmation (`/swe confirmation`).
    *   Deletion of >5 files requires `/approve`.
    *   Modification of `.github/` or `.claude/rules/` requires `/approve`.
3.  **Sandboxing**: All shell commands are executed in a restricted environment where possible.

## Security Audits

You can trigger a security audit of the current codebase using:

```bash
/swe mode=audit
# or
/review --security
```

