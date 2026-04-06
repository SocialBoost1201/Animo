# Skills Selection Policy

> Local pointer. Full policy: `/Users/takumashinnyo/workspace/projects/docs/ai/skills-selection-policy.md`

## This Repo's Core Shelf (7 skills)

Located in `.claude/skills/`:

| Skill | Trigger |
|-------|---------|
| `commit-writer` | Any commit |
| `bugfix-flow` | Any bug |
| `implementation-flow` | Any feature |
| `ui-qa-check` | Any UI change |
| `db-safe-update` | Any Supabase / auth change |
| `docs-writer` | Any documentation |
| `handoff-flow` | Session end / agent switch |

## Runtime Shelf

See `.claude/skills-runtime/README.md` — 17 task-type groups, 35+ skills available.

## Anomaly Resolution (2026-04-02)

Previous state: 134 skills in `.agent/skills/` (full vault copy).
Current state: 7 skills in `.claude/skills/` (curated core shelf).
`.agent/skills/` preserved as reference vault — do not bulk-load.
