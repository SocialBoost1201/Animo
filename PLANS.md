# Implementation Plan

PLANS.md is used only for complex multi-step changes.
This file is the active implementation plan and progress tracker.

Agents must follow this plan and the user's latest instruction.
Do not perform work outside this plan unless explicitly instructed.
Before starting work, read `CURRENT_STATE.md` plus only the latest 2 entries from `PLANS.md` and `daily_log.md`.
Do not load full logs unless explicitly instructed.

## Approved implementation plans

### Final stabilization for Animo restart (2026-05-06)

- **Approval:** [x] Approved (master, 2026-05-06)
- **Objective:** Fix release-blocking operational errors before the next business restart day while preserving UI/SEO/auth/RLS contracts.
- **In scope:** P0 LINE test endpoint exposure, P1 admin broken links/routes, P1 dashboard approval-state truthfulness, public CTA anchor, and pricing display consistency for `subtotal × 1.1 × 1.2 = 1.32`.
- **Out of scope:** DB schema changes, RLS/auth redesign, layout redesign, SEO/canonical/sitemap changes, deployment from dirty worktree, and broad copy/theme refactors.
- **Batch 1 security:** [x] Close unauthenticated LINE group send endpoint.
- **Batch 2 admin operations:** [x] Fix dashboard KPI/card destinations and missing admin edit routes.
- **Batch 3 data truthfulness:** [x] Ensure dashboard operational numbers reflect approved cast submissions/reservations and current published post status.
- **Batch 4 public CTA/pricing:** [x] Fix `#today-cast` target and align pricing copy to tax/service business rule.
- **Batch 5 validation/logging:** [x] `pnpm lint`, targeted eslint, `tsc --noEmit`, `git diff --check`, and `next build` passed after local SWC recovery and network-enabled Google Fonts fetch.

### /admin/today Phase 1 operation time foundation (2026-05-03)

- **Approval:** [x] Approved (master, 2026-05-03)
- **Status:** [x] Completed
- **Commit:** `5756806`
- **Objective:** Introduce protected operation-time handling for `/admin/today` and remove unsafe string/time-input handling before Phase 2.
- **Completed scope:**
  - [x] `lib/operation-hours.ts`
  - [x] `components/features/admin/today/OperationTimeSelect.tsx`
  - [x] `components/features/admin/today/OperationPhaseCard.tsx`
  - [x] `components/features/admin/today/TodayDesktopView.tsx`
- **Validation:**
  - [x] Targeted eslint passed for Phase 1 files.
  - [x] `pnpm lint` passed with existing warnings.
  - [x] `git diff --check` passed.
  - [x] Grep checks passed for removed `substring(0, 5)`, `type="time"`, string time sorting, and forbidden `24:00` / `25:00` / `26:00` UI strings in Phase 1 scope.
  - [!] `pnpm build` blocked by existing unrelated `components/features/admin/UnsubmittedCastsList.tsx` type error (`D.gradients.gold`).
- **Remaining tasks before Phase 2:**
  - [x] Browser smoke test completed on production mobile viewport (`390x844`).
  - [x] Admin credential verified for protected `/admin/today` click-flow verification.
  - [ ] Build issue remains outside Phase 1 scope.
  - [x] `/admin/dashboard` Card Map captured for main mobile links before Phase 2.
  - [ ] Mobile production dashboard has non-navigating cards/links (`本日の営業状況`, `キャスト管理`, `体入・応募運用開始待ち—`) that require a separate fix plan before Phase 2.

### Admin operations flow reorganization + critical regressions (2026-05-02)

- **Approval:** [x] Approved (master, 2026-05-02)
- **Objective:** Fix Priority 1 regressions first, then split/admin approval flow redesign, then finalize admin layout consistency fixes.
- **In scope:** `PLANS.md`, `/daily_log.md`, admin customers/cast-auth/cast-posts bug paths, admin menu + shift/approval pages, admin layout scroll behavior, admin design card alignment.
- **Out of scope:** DB schema migration, auth model redesign beyond regression fix, public SEO/routing behavior changes.
- **Phase A (Priority 1 bugs):** [x] Completed
  - [x] Fix customer edit CTA 404 path mismatch
  - [x] Restore cast SMS re-auth to trusted-device + inactivity semantics (14 days)
  - [x] Fix cast blog post failure after identifying exact failing layer
  - [x] Add root-cause memo for each Priority 1 bug in progress log
- **Phase B (Priority 2 redesign):** [x] Completed
  - [x] Split left nav 「出勤調整・承認」 into 「出勤調整」 and 「承認」
  - [x] Add approval hub page with category entry points (shift / today / reservation / blog / profile image / future)
  - [x] Reset shift control page to match current admin UI system
- **Phase C (Priority 3 consistency):** [x] Completed
  - [x] Fix admin scroll structure (fixed background + intended content area scroll only)
  - [x] Fix settings/design card alignment and inconsistent sizing
- **Phase D (Validation + logs):** [x] Completed
  - [x] Run targeted validations
  - [x] Run `pnpm lint`
  - [x] Run `pnpm build`
  - [x] Update `/daily_log.md` with scope/files/validation/risks
- **Execution protocol memo (strict order):**
  - [x] Record scaffold in `PLANS.md` before implementation
  - [x] Record start context in `/daily_log.md` before implementation
  - [x] Re-sequence to Scope A → Scope B → Scope C only
  - [x] Scope A complete + validated + risks logged
  - [x] Scope B complete + validated + risks logged
  - [x] Scope C complete + validated + risks logged

### 2026-05-02 (Final validation)

status:
- Completed final validation and logging after Scope A/B/C completion in required order.

files changed:
- `PLANS.md`
- `daily_log.md`

folders created:
- None

folders moved:
- None

files moved:
- None

files deleted:
- None

why:
- Captured final verification state and protocol completion evidence for strict scoped execution.

validation:
- `pnpm lint` passed (warnings only, no errors).
- `pnpm build` passed after minor type fixes in Scope B pages.

next step:
- Optional browser smoke checks on admin nav split, approval hub routes, and cast auth/blog submit flows before production deployment.

### 2026-05-02 (Revalidation + handoff)

status:
- Revalidated Scope A/B/C outputs and reconfirmed all required deliverables for parent handoff.

files changed:
- `PLANS.md`
- `daily_log.md`

folders created:
- None

folders moved:
- None

files moved:
- None

files deleted:
- None

why:
- Added explicit handoff evidence with fresh command results (`pnpm lint`, `pnpm build`) and reconfirmed bug memos remain reflected in Scope A notes.

validation:
- `pnpm lint` passed (warnings only, no errors).
- `pnpm build` passed (non-blocking middleware deprecation + external DNS warnings in static generation logs).

next step:
- Run manual browser smoke for customer edit flow, cast SMS re-auth transitions, cast post submit, and new approvals hub navigation before release.

### 2026-05-02 (Scope C)

status:
- Completed Priority 3 consistency scope with scroll-structure correction and settings/design card alignment fixes.

files changed:
- `components/layouts/AdminLayout.tsx`
- `app/admin/(protected)/design/page.tsx`

folders created:
- None

folders moved:
- None

files moved:
- None

files deleted:
- None

why:
- Scroll behavior was inconsistent because the full page could scroll; enforced fixed viewport shell and content-area scrolling in admin layout.
- Design/settings cards had uneven heights and visual anchors; standardized stretch behavior and CTA anchor placement.

validation:
- `pnpm exec eslint "components/layouts/AdminLayout.tsx" "app/admin/(protected)/design/page.tsx"` passed.

next step:
- Run final repo-level validation (`pnpm lint`, `pnpm build`), then finalize logs and risks.

### 2026-05-02 (Scope B)

status:
- Completed Priority 2 redesign scope with split navigation, new approval hub, and shift page restyle.

files changed:
- `components/layouts/AdminLayout.tsx`
- `app/admin/(protected)/approvals/page.tsx`
- `app/admin/(protected)/shift-requests/page.tsx`

folders created:
- None

folders moved:
- None

files moved:
- None

files deleted:
- None

why:
- Separated operations intent into two pages to reduce ambiguity between adjustment work and approvals.
- Added a central approval hub that aggregates current approval categories and preserves future expansion slots.
- Reworked shift-control shell to match existing admin UI tokens and card/tab system without changing backend flows.

validation:
- `pnpm exec eslint "components/layouts/AdminLayout.tsx" "app/admin/(protected)/approvals/page.tsx" "app/admin/(protected)/shift-requests/page.tsx"` passed.

next step:
- Start Scope C only (scroll structure + design/settings card consistency), then validate and log risks.

### 2026-05-02

status:
- Completed Scope A (Priority 1 bugs) with targeted validation and risk log.

files changed:
- `app/admin/(protected)/customers/page.tsx`
- `app/admin/(protected)/customers/[id]/edit/page.tsx`
- `lib/actions/cast-auth.ts`
- `lib/supabase/middleware.ts`
- `lib/actions/cast-posts.ts`

folders created:
- None

folders moved:
- None

files moved:
- None

files deleted:
- None

why:
- Bug memo (customer 404): edit CTA path expected `/edit` route after admin route reorganization while only `[id]` page existed; added redirect compatibility route and aligned edit CTA.
- Bug memo (cast re-auth): logic used both reauth cookie and `last_sms_verified_at` elapsed days, effectively tying re-auth to last verification timestamp rather than inactivity; switched to trusted-device cookie inactivity window semantics.
- Bug memo (cast blog posting): insert used user-scoped client against `cast_posts` where cast insert policy path was not guaranteed, causing RLS rejection in production flows; preserved ownership check then performed insert via service role.

validation:
- `pnpm exec eslint "app/admin/(protected)/customers/page.tsx" "app/admin/(protected)/customers/[id]/edit/page.tsx" "lib/actions/cast-auth.ts" "lib/supabase/middleware.ts" "lib/actions/cast-posts.ts"` passed.

next step:
- Start Scope B only (menu split + approval hub + shift page redesign), then validate and log before Scope C.

### Admin cast list same-day attendance controls (2026-05-01)

- **Approval:** [x] Approved (master, 2026-05-01)
- **Objective:** Add immediate 出勤 / 休み controls to each admin cast-management list item using the existing today-attendance source of truth.
- **In scope:** `/daily_log.md`, `AGENTS.md` daily-log workflow, `/admin/human-resources` cast list UI, and `daily_cast_attendance` read/write integration via existing attendance action.
- **Out of scope:** DB schema, auth/RLS changes, routing changes, dashboard redesign, duplicate attendance models, and broad UI refactors.
- **Phase 1 investigation:** [x] Confirm current source of truth is `daily_cast_attendance` with `updateDailyCastAttendance`, consumed by `/admin/dashboard` and `/admin/today`.
- **Phase 2 workflow docs:** [x] Create daily-log workflow and root log file.
- **Phase 3 implementation:** [x] Wire admin cast list initial status and immediate buttons.
- **Phase 4 validation:** [x] Run lint/build and review consistency points.

### Admin and cast dashboard responsiveness (2026-04-29)

- **Approval:** [x] Approved (master, 2026-04-29)
- **Objective:** Make admin management screens and cast dashboard feel responsive immediately after button/link taps.
- **In scope:** `/admin/today`, `/admin/shift-requests`, admin protected layout notification count path, `/cast/dashboard`, hot-path query slimming, and redundant refresh reduction.
- **Out of scope:** auth/RLS/middleware, DB schema or migrations, SEO/routing changes, dependency additions, and large UI redesigns.
- **Phase 1 admin/today:** [x] Remove client-side server-action coupling from LINE text generation, preserve optimistic updates, narrow hot queries.
- **Phase 2 admin/shift-requests:** [x] Fetch only active tab data where safe, narrow `select('*')` hot paths.
- **Phase 3 admin layout:** [x] Reduce duplicate notification count work without changing route protection.
- **Phase 4 cast dashboard:** [x] Slim initial dashboard reads, reduce duplicate waits, remove redundant refresh where safe.

### Cast register: error-handling, contract file, role split (2026-04-28)

- **Plan document:** [docs/superpowers/plans/2026-04-28-cast-register-error-handling-implementation.md](docs/superpowers/plans/2026-04-28-cast-register-error-handling-implementation.md)
- **Approval:** [x] Approved (master, 2026-04-28)
- **Execution order:** M1 → M2 → M3 → M4 → M5 as defined in that document. **Out of scope there:** 14-day SMS-less re-login (separate plan).
- **M1:** [x] Contract doc [docs/agent-system/cast-register-errors.md](docs/agent-system/cast-register-errors.md) + shared [lib/cast-register-error-titles.ts](lib/cast-register-error-titles.ts); PC/mobile register pages use shared map (`AUTH_RECOVERY_FAILED` / `AUTH_MULTIPLE_USERS` など欠け解消).
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
