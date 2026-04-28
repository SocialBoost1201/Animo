# Progress Report Policy

## Purpose
Ensure progress reports make the current project state understandable for any human or AI agent joining later.

## Placement
This policy belongs in the project repository under `docs/agent-system/`.
It governs progress reporting for work tracked in `PLANS.md`.

## Responsibility
- Agents are responsible for reporting phase and delivery progress.
- Reports must reflect actual changes and actual validation outcomes.
- Reports must remain factual and concise.

## When To Report
Agents must report after:
- Phase 1,
- Phase 4,
- final completion,
- blocked states,
- validation failures,
- scope conflicts.

## Required Report Format
Agents must use this exact structure:

status:
- ...

files changed:
- ...

folders created:
- ...

folders moved:
- ...

files moved:
- ...

files deleted:
- ...

why:
- ...

validation:
- ...

next step:
- ...

## Status Markers

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [?] Needs decision

## Reporting Rules
- Keep reports factual and concise.
- List changed files accurately.
- Report `none` when no files or folders changed.
- Do not hide failed validation.
- Do not claim completion unless validation was run, or explicitly skipped with a reason.

## Validation Reporting
- State what validation was run and the result.
- If validation was skipped, state that clearly and explain why.
- If validation failed, report the failure and current impact.

## Token Efficiency
- Use the exact report structure to keep updates compact and scannable.
- Include only task-relevant reporting detail; avoid unrelated narrative.
- Do not duplicate full policy text from `AGENTS.md`, `PLANS.md`, or implementation-plan policy docs.
