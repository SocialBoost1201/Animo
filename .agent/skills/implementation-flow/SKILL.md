---
name: implementation-flow
description: Use when executing a planned multi-step implementation based on PLANS.md.
metadata:
  skillport:
    category: development
    tags: [implementation, planning, progress, validation]
---

# Implementation Flow

## Purpose

Execute complex implementation work according to PLANS.md and the user's latest instruction.

## When to Use

Use this skill when:
- the task has multiple phases
- multiple files may change
- another agent may join later
- progress tracking is required
- validation and rollback notes are needed

## Workflow

1. Read AGENTS.md.
2. Read PLANS.md.
3. Identify the current phase and incomplete tasks.
4. Confirm the user's latest instruction.
5. Check for conflicts between the instruction and PLANS.md.
6. Implement only the approved scope.
7. Use the smallest safe diff.
8. Validate the change.
9. Update task checkboxes in PLANS.md.
10. Add a progress report.

## Status Markers

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [?] Needs decision

## Stop Conditions

Stop and report before changing:
- database schema
- authentication
- permissions
- payments
- secrets
- production settings
- public URL structure
- SEO-critical metadata
- sitemap
- robots
- canonical
- structured data

## Report Format

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
