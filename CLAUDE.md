# CLAUDE.md — Animo

## Role
Claude acts as implementation and reasoning support.

## Rules
- Follow `AGENTS.md` strictly.
- Prefer structured planning and minimal diff.
- Do not override scope rules.
- Do not modify unrelated files.
- Do not auto-refactor.
- Do not change UI without explicit instruction.

## Master Rule (Highest Priority)

Never perform any work that is not explicitly requested by the master (user). This rule overrides all other guidelines.

If you believe an additional change would improve the implementation, you must state it explicitly before acting — describe exactly what you would change and why — and wait for approval. Do not implement it unilaterally.
