# 08 — Skill Loading and Context Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity

## Skill Load Order

1. `.claude/skills/` — core shelf (always available, canonical target)
2. `.claude/skills-runtime/` — task-scoped
3. `.agent/skills/` — legacy migration source (134 skills; do not bulk-load)

## .agents/skills Compatibility Bridge

`.agents/skills` is a symlink → `../.claude/skills` (the curated 7-skill shelf).
Any agent or tool following `.agents/skills` will land on the correct core shelf.
Do NOT retarget this symlink to `.agent/skills` — that is the 134-skill legacy vault.

## Core Shelf (this repo)

`.claude/skills/` — 7 skills:
- `commit-writer` — any commit
- `bugfix-flow` — any bug
- `implementation-flow` — any feature
- `ui-qa-check` — any UI change
- `db-safe-update` — any Supabase / auth change
- `docs-writer` — documentation
- `handoff-flow` — session end / agent switch

## Context Budget

**IMPORTANT**: This repo previously had 134 skills in `.agent/skills/`. That was a context overload anomaly, now fixed.

- Core shelf: 7 skills (always on)
- Runtime: max 3 per task
- Never load `.agent/skills/` in bulk — it is a reference vault, not the active shelf
- Total active at any time: ≤10 skills

## Selection Heuristics

| Task | Skill |
|------|-------|
| Commit | `commit-writer` |
| Bug | `bugfix-flow` |
| Feature | `implementation-flow` |
| UI | `ui-qa-check` |
| Auth/DB | `db-safe-update` |
| Docs | `docs-writer` |
| Handoff | `handoff-flow` |
| GSAP animation | (runtime) `gsap-core`, `gsap-react` |
| Three.js | (runtime) — see `.claude/skills-runtime/README.md` for r3f/drei patterns |
| AI SDK | (runtime) `geo-fundamentals`, `gemini-api-dev` |
| SEO | (runtime) `schema-markup`, `seo-checklist` |
