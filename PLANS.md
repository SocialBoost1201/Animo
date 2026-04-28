# Implementation Plan

PLANS.md is used only for complex multi-step changes.
This file is the active implementation plan and progress tracker.

Agents must follow this plan and the user's latest instruction.
Do not perform work outside this plan unless explicitly instructed.

## Approved implementation plans

### Cast register: error-handling, contract file, role split (2026-04-28)

- **Plan document:** [docs/superpowers/plans/2026-04-28-cast-register-error-handling-implementation.md](docs/superpowers/plans/2026-04-28-cast-register-error-handling-implementation.md)
- **Approval:** [x] Approved (master, 2026-04-28)
- **Execution order:** M1 → M2 → M3 → M4 → M5 as defined in that document. **Out of scope there:** 14-day SMS-less re-login (separate plan).
- **M1:** [x] Contract doc [docs/agent-system/cast-register-errors.md](docs/agent-system/cast-register-errors.md) + shared [lib/cast-register-error-titles.ts](lib/cast-register-error-titles.ts); PC/mobile register pages use shared map (`AUTH_RECOVERY_FAILED` / `AUTH_MULTIPLE_USERS` など欠け解消).
- **Emergency fix:** [x] `castRegister` now matches the cast form's 源氏名 against `casts.stage_name` when `nameKana` is not submitted; regression covered by `lib/validators/cast-profile.test.ts`.
## Status Legend

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [?] Needs decision

## Project Objective

Describe the goal of this project or implementation.

## Current Scope

In scope:
- ...

Out of scope:
- ...

## Constraints

- Prefer minimal diffs.
- Preserve existing architecture.
- Do not modify unrelated files.
- Do not change database schema, auth, permissions, payments, secrets, or production settings without explicit approval.
- Do not change public URLs, SEO-critical metadata, sitemap, robots, canonical, or structured data without explicit approval.

## Impacted Areas

Files:
- ...

Folders:
- ...

External services:
- ...

## Implementation Phases

### Phase 1: Investigation and Structure Check

Status: [ ]

Tasks:
- [ ] Read AGENTS.md
- [ ] Read this PLANS.md
- [ ] Identify impacted files
- [ ] Confirm existing architecture
- [ ] Report risks before implementation

Validation:
- [ ] No files changed unless explicitly needed
- [ ] Scope confirmed

Rollback notes:
- No rollback required for read-only investigation

### Phase 2: Minimal Implementation

Status: [ ]

Tasks:
- [ ] Implement the smallest safe change
- [ ] Preserve existing behavior outside the requested scope
- [ ] Avoid unrelated refactors

Validation:
- [ ] Typecheck if available
- [ ] Lint if available
- [ ] Build if safe and relevant

Rollback notes:
- Revert changed files from this phase if validation fails

### Phase 3: UI / Behavior Verification

Status: [ ]

Tasks:
- [ ] Verify affected UI or behavior
- [ ] Check responsive impact if UI changed
- [ ] Check public route impact if public pages changed

Validation:
- [ ] Manual verification notes added
- [ ] Known risks documented

Rollback notes:
- Revert UI-specific files if layout or behavior breaks

### Phase 4: Final Review and Cleanup

Status: [ ]

Tasks:
- [ ] Remove temporary code
- [ ] Confirm no unrelated files changed
- [ ] Confirm no secrets or sensitive data added
- [ ] Prepare final report

Validation:
- [ ] git status reviewed
- [ ] changed files reviewed
- [ ] final commands recorded

Rollback notes:
- Revert final diff if unacceptable

## Progress Log

Use this required report format for implementation updates:

### YYYY-MM-DD

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
