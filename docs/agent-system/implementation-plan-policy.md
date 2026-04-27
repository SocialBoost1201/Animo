# Implementation Plan Policy

## Purpose
Define the repository-local policy for implementation-plan-based execution so multi-step delivery remains predictable, auditable, and safe.

## Placement
This policy belongs in the project repository under `docs/agent-system/`.
Do not treat global `~/.cursor` as the project source of truth.

## Responsibility
- `PLANS.md` is the active implementation plan and progress tracker.
- `AGENTS.md` should keep only top-level execution contract rules, including following `PLANS.md` for complex work.
- Agents execute the plan; users approve scope changes.

## When To Read
Read this policy before:
- starting complex multi-step work,
- updating implementation phases,
- handing off work to another agent,
- posting progress reports.

## Execution Rules
- Follow `PLANS.md` plus the user's latest instruction.
- Stay within approved scope unless explicitly instructed otherwise.
- Update task status after each completed phase.
- Mark completed tasks with `[x]`.
- Preserve historical progress for continuity and auditability.
- Do not rewrite the full plan for small updates; apply minimal, targeted edits.
- Do not work outside the approved plan unless explicitly instructed.
- Do not rely on global `~/.cursor` as the project source of truth.

Status markers:
- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [?] Needs decision

## Conflict Handling
- If `PLANS.md` conflicts with the user's latest instruction, stop and report before implementation.
- Surface the exact conflict, impacted phase/task, and required decision.
- Resume only after explicit direction resolves the conflict.

## Progress Tracking
- Treat phases as execution checkpoints with status, tasks, validation, and rollback notes.
- Record progress after meaningful completion points so another agent can continue without context loss.
- Keep reports factual, scoped, and aligned with actual file changes.

## Stop Conditions
Stop and report before changing:
- database schema,
- authentication or permissions,
- payments,
- secrets or production settings,
- public URL structure,
- SEO-critical metadata,
- sitemap, robots, canonical, or structured data.

## Token Efficiency
- Keep top-level rules in `AGENTS.md` concise.
- Keep detailed execution guidance in this policy and active tasks in `PLANS.md`.
- Use metadata/structure first; read only the sections needed for the current phase.
- Avoid loading unrelated historical plan detail into active context.
