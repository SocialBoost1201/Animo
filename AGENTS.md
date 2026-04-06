# AGENTS.md — Animo

> Applies to: Claude Code, Codex, Antigravity
> This file is a compact operating contract. Details live in `.claude/rules/` and `docs/ai/`.

---

## Quick Start

1. Read `CLAUDE.md` — commands, tech stack, pnpm, framework rules
2. Load `.claude/rules/` — scoped operating rules for your task type
3. Check `.claude/skills/` — 7 core workflow skills
4. Read `docs/ai/architecture-summary.md` if you need architecture context

---

## Operating Rules (by concern)

| File | Scope |
|------|-------|
| `.claude/rules/01-core-operating-rules.md` | Implementation flow, completion requirements |
| `.claude/rules/02-git-safety-rules.md` | Branch safety, commit format |
| `.claude/rules/03-architecture-and-stack-rules.md` | Directory conventions, component rules, AI SDK, pnpm |
| `.claude/rules/04-ui-ux-rules.md` | Design system, GSAP, Three.js, Lenis, Embla |
| `.claude/rules/05-data-and-db-safety-rules.md` | Supabase Auth, RLS, rate limiting, security |
| `.claude/rules/06-testing-and-validation-rules.md` | Lint, build, verification |
| `.claude/rules/07-reporting-and-delivery-rules.md` | Completion report format |
| `.claude/rules/08-skill-loading-and-context-rules.md` | Skill load order, context budget (critical) |
| `.claude/rules/09-multi-agent-collaboration-rules.md` | Agent routing, MCP rules |

---

## Core Skill Shelf (7 skills)

`.claude/skills/` — always-available workflow skills:

| Skill | Use when |
|-------|----------|
| `commit-writer` | Any commit |
| `bugfix-flow` | Any bug (AI SDK, TipTap, Three.js patterns included) |
| `implementation-flow` | Any feature |
| `ui-qa-check` | Any UI change (GSAP cleanup, Three.js SSR included) |
| `db-safe-update` | Any Supabase / auth / rate-limit change |
| `docs-writer` | Any documentation |
| `handoff-flow` | Session end or agent switch |

Runtime skills: see `.claude/skills-runtime/README.md`

---

## Context Safety Warning

This repo previously had 134 skills active (anomaly, now fixed).
- Core shelf: `.claude/skills/` (7 skills) — canonical active shelf
- Reference vault: `.agent/skills/` (134 skills) — do NOT bulk-load
- Runtime catalog: `.claude/skills-runtime/README.md`

---

## Shared Policy

Full workspace contract: `/Users/takumashinnyo/workspace/projects/docs/ai/execution-contract.md`

---

## Key Rules (non-negotiable)

- Present plan and wait for approval before implementing
- Verify before claiming completion (file-level evidence required)
- All AI endpoints must have Upstash Rate Limit applied
- Three.js: dynamic import + `ssr: false` + Suspense — always
- Skill Usage Report required in every completion response
