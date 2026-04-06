# Decision Log — Animo

## 2026-04-02 — Skill Overload Anomaly Fix + Agent OS Migration

**Context**: Animo had 134 skills in `.agent/skills/` — an anomalous full vault copy that caused severe context bloat on every session.

**Root Cause**: Likely an early-setup accidental deployment of the full workspace vault to a single project. Not intentional curation.

**Classification Applied to 134 skills**:
- Core shelf: 7 skills (`.claude/skills/`)
- Runtime: ~35 skills in 17 task-type groups (documented in `.claude/skills-runtime/README.md`)
- Archived: ~55 skills (meta-infra, duplicate commit, superseded deploy, not-relevant-to-Animo — documented in `.claude/skills-runtime/README.md`)
- Remaining in `.agent/skills/`: All 134 preserved — migration source, not deleted

**Actions Taken**:
1. Created `.claude/rules/` — 9 scoped rule files
2. Created `.claude/skills/` — 7 curated SKILL.md files
3. Created `.claude/skills-runtime/README.md` — runtime catalog with archive list
4. Created `docs/ai/` — 7 governance documents
5. Replaced `AGENTS.md` with compact pointer contract

**Rationale for 7 (not 8) on core shelf**:
Animo has no Prisma (uses Supabase directly) and no `context-trim-flow` need given the smaller rule surface. 7 strong skills cover the full operation surface without overloading context.

**Rollback**:
`.claude/` is entirely additive. `.agent/skills/` untouched. AGENTS.md previous content available in `project-template/AGENTS.md`.
