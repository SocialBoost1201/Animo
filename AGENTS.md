# AGENTS.md — Animo

## Execution Flow
Analysis → Plan → Explicit Approval → Execution → Verification
Execution requires explicit approval.

## Non-Negotiables
- pnpm only
- PPR must remain enabled
- No unsafe AI endpoints
- No `any` in TypeScript
- No DB/auth/env changes without approval

## UI Protection
- Do not change layout, spacing, typography, animations without explicit request

## Data / Security
- Never expose secrets
- Sanitize all user input before AI usage
- No PII in AI requests

## Git Safety
- No direct commits to `main`
- Use conventional commits

## Validation
- `pnpm lint` and `pnpm build` must pass before commit

## Stop Conditions
- Unclear requirements
- UI risk
- DB impact uncertainty
- Cross-module side effects
