---
name: cross-feature-safety-check
description: Use BEFORE modifying any feature that touches shared state (cast attendance, shifts, check-in, approvals, notifications, public site sync, cache, RBAC, cron, webhooks). Enumerates cross-feature side effects and detects state duplication, sync gaps, and silent regressions before they ship.
---

# Cross-Feature Safety Check

## When to Use

Use BEFORE editing code that touches any of:

- cast attendance / `casts.is_today`
- shift submission / approval (`shift_submissions`, `cast_schedules`)
- daily check-in (`today.ts`)
- reservation reporting
- approval workflow (any pending → approved transition)
- LINE notification senders
- public site data (`lib/actions/public/`)
- cache / `revalidatePath` / `revalidateTag`
- RBAC (RLS + service client + admin override)
- cron jobs (`/api/cron/*`)
- webhook handlers (`/api/line/webhook`, etc.)
- analytics / view tracking

If the change is a pure UI tweak with **no** data touching the above, skip this skill.

## Why This Exists

This codebase has multiple features with shared state and asynchronous side effects. A correct-looking local change can silently break cross-feature behavior:

- DB updated, public site reads stale denormalized field → ghost "出勤" status
- Shift approved, notification not sent → cast not informed
- Manual override saved, cache not invalidated → admin sees correct, public sees old
- New role check added, cron job bypasses it → unauthorized writes
- Two sources of truth for one fact → drift

This skill prevents those by forcing explicit enumeration before editing.

## Workflow

### Step 1 — Locate every source of truth for the affected fact

For the data being changed, list:

| Question | Example for cast attendance |
|----------|----------------------------|
| Which DB tables/columns hold this fact? | `casts.is_today`, `cast_schedules`, `shift_submissions`, `daily_attendance_overrides` |
| Which is the canonical source? | `cast_schedules` (truth) vs `casts.is_today` (denormalized) |
| Who writes to each? | `approveShiftSubmission`, `today.ts`, manual override |
| Who reads from each? | public site, admin dashboard, LINE notifier, cron |

If two writers write to different sources for the same fact, **state duplication exists**. Sync writes or eliminate one source.

### Step 2 — Map the sync chain

For every write path, trace the chain:

```
Admin action
  → Server Action
    → DB write
      → revalidatePath / revalidateTag
        → notification trigger (LINE / web-push)
          → audit log / analytics
```

If any link is missing, the change is unsafe.

Required questions:
- Does this write trigger every consumer that depends on the fact?
- Is `revalidatePath` called for every page that reads this fact?
- Is the notification fired exactly once (not zero, not twice)?
- Is the cron job's view of state identical to the admin's?

### Step 3 — Verify permission flow

For every write path:

- RLS policy permits this caller? (or service client used intentionally?)
- Service client used → caller authenticated as admin via `getUser()` first?
- Manual override path checked separately from API/cron path?
- Cron job auth (`CRON_SECRET` / signed request) verified?
- Webhook signature verified?

Service client + missing `getUser()` = silent privilege escalation.

### Step 4 — Approval queue integrity

If the feature involves approval:

- Is the queue created when expected, and only then?
- Does approval clear the queue entry?
- Does rejection clear it (or keep it for re-review)?
- Does deletion of the source record clean up dangling queue entries?

### Step 5 — List the regression boundary

Before editing, list every file you will NOT edit but that reads the affected fact. Spot-check at least one of them after your change.

```
Affected fact: casts.is_today
Editing: lib/actions/admin-shifts.ts
Regression boundary (do not edit but verify after):
  - lib/actions/public/data.ts        ← public site reads is_today
  - components/features/admin/dashboard/DashboardTodayShifts.tsx
  - lib/actions/today.ts              ← also writes is_today
  - api/cron/shift-reminders/...      ← reads to send reminders
```

### Step 6 — Risk classification

| Risk | Indicator | Required action |
|------|-----------|-----------------|
| Low | Single source, single writer, no notifications, no cache | Proceed with `implementation-flow` |
| Medium | Multiple readers, has notification or cache | Add explicit verification list to plan |
| High | Multiple writers to same fact, or denormalized field | Stop. Propose state model fix first. |

### Step 7 — Output

Before writing any code, produce:

```
## Safety check
- Sources of truth: [...]
- Sync chain: [...]
- Missing links: [...] (or "none")
- Permission flow: [...]
- Regression boundary: [...]
- Risk: low / medium / high
- Mitigation: [...]
```

This block goes into the implementation plan. Do not start editing without it.

## Hard Rules

1. **Never write to a denormalized field without updating the canonical source in the same transaction**, or vice versa.
2. **Never add a service-client write path without a `getUser()` check above it** (unless the path is cron/webhook with verified auth).
3. **Never modify a writer of shared state without listing all readers of that state.**
4. **If two paths write the same fact, fix the duplication before adding a third.**
5. **`revalidatePath` is part of the write, not an optional follow-up.**

## Companion Skills

- After this check passes → `implementation-flow`
- For DB-specific concerns → `db-safe-update`
- After implementation → `ui-qa-check`
- At session end → `handoff-flow`
