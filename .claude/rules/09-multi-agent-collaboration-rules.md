# 09 — Multi-Agent Collaboration Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity

## Agent Routing

| Task | Agent |
|------|-------|
| Feature implementation, code edits | Claude Code or Codex |
| Planning, orchestration | Antigravity |
| Browser/UI verification | Codex (isolated Chrome DevTools MCP) |
| Final verification | Codex only |

**Antigravity must not perform final verification.**

## Chrome DevTools MCP

Requires explicit user approval before use. Mandatory flags: `--isolated`, `--no-usageStatistics`. Never connect to production.

## Handoff

Use `handoff-flow` skill at session end. Include current state, files changed, next steps.
