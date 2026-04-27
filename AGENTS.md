# AGENTS.md — Animo

## Implementation Plan Contract

For any project startup, complex change, or multi-step implementation, the agent must follow `PLANS.md`.

`PLANS.md` is the active implementation plan and progress tracker.

Rules:
- Read `PLANS.md` before starting complex work.
- Follow `PLANS.md` for complex multi-step work.
- Follow `PLANS.md` plus the user's latest instruction.
- Follow the approved implementation plan and the user's latest instruction.
- Do not perform work outside the current plan unless explicitly instructed.
- If the user's latest instruction conflicts with `PLANS.md`, stop and report the conflict.
- Update task status after each completed phase.
- Mark completed tasks with `[x]`.
- Keep progress understandable for any agent joining later.
- Do not remove historical progress unless explicitly instructed.
- Do not rewrite the entire plan for small updates.
- Use minimal diffs when updating `PLANS.md`.

Status markers:
- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [?] Needs decision

## Skill Directory Policy

- `.agent/skills` is canonical.
- `.agents/skills` is compatibility only and must remain a symlink.
- `.claude/skills` may exist for Claude-specific or legacy compatibility and must not be treated as the canonical source unless explicitly instructed.
- Do not bulk-load all skills.
- Load full `SKILL.md` only when task-relevant.
- Do not run `skillport doc` without explicit approval.
- Do not rely on global `~/.cursor` as the project source of truth.

## Core Execution Contract
- Only perform work explicitly requested by the master.
- Do not expand scope.
- If anything outside the stated scope may be affected, stop and ask the master for approval.
- Only modify files explicitly listed in the master-approved plan.
- Minimal diff only.
- No unrelated refactoring.
- Required outputs may be created or updated only when explicitly included in the master-approved plan.
- Approval is required before touching shared components, UI/UX outside the explicitly approved task scope, DB, env, config, auth, routing, dependencies, or creating new files (excluding test files required for validation).
- If requirements are unclear or conflicting, stop and ask.
- For non-trivial tasks: plan first, list target files and risks, then wait for approval.
- Separate implementation and review roles.

## Project Non-Negotiables
- Do not bypass Supabase RLS or weaken authorization rules.
- Do not run Three.js or browser-only code directly in SSR/server render paths; use safe client-only patterns.
- Public-facing submission or contact flows must not be implemented without rate limiting.
- Public-facing forms must not be implemented without bot protection such as Turnstile where applicable.
- Never expose secrets.
- Never send PII to AI systems.
- No unsafe AI endpoints.
- If framework/runtime version is referenced, verify it against `package.json`.

## Project Rules
- Use pnpm only.
- PPR must remain enabled.
- No `any` in TypeScript.
- Follow established project architecture and existing module boundaries.

## UI Protection
- Do not change layout, spacing, typography, animations, or interactions without explicit instruction.
- Never break existing navigation (sidebar, layout, routing).

## Git Safety
- No direct commits to `main`.
- Use conventional commits.

## Validation
- For code changes, `pnpm lint` and `pnpm build` must pass before commit.
- For docs-only changes, validate only the changed markdown content and scope.

## Stop Conditions
- Unclear requirements.
- UI risk.
- DB/auth/env/config impact uncertainty.
- Cross-module side effects.
- Unable to verify safely.
