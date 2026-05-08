# Animo Daily Log

AI agents working on Animo must read the latest 2 entries before starting work. If fewer than 2 entries exist, read all entries. After completing work, append one concise entry with scope, files changed, validation, and remaining risks. Do not include secrets or PII.
Context rule: before starting work, read `CURRENT_STATE.md` plus only the latest 2 entries from `PLANS.md` and `daily_log.md`. Do not load full logs unless explicitly instructed.

## Entries

### 2026-05-07 (highest design-change rule)

- scope: Added the highest-priority agent rule that no design changes may be made unless the master explicitly requests the specific design change.
- files changed: `AGENTS.md`, `daily_log.md`.
- validation: Markdown diff reviewed; no code validation required for docs-only rule update.
- remaining risks: Existing unrelated dirty working-tree files remain outside this docs-only scope.

### 2026-05-06 (credit-card fee emphasis)

- scope: Prominently surfaced the no-extra-credit-card-fee policy on the public pricing system and simulator surfaces.
- files changed: `components/features/system/SystemPriceGrid.tsx`, `components/features/system/PriceSimulator.tsx`, `daily_log.md`.
- validation: targeted eslint passed; `./node_modules/.bin/tsc --noEmit` passed; `git diff --check` passed; `PATH=/opt/homebrew/bin:$PATH ./node_modules/.bin/next build` passed; local `next start` smoke confirmed `/system` 200, `/` 200, and rendered the credit-card no-fee copy in HTML.
- remaining risks: Visual browser review on production/preview is still recommended.

### 2026-05-06 (PR #54 audit follow-up)

- scope: Addressed Antigravity PR #54 findings and the store pricing clarification: removed the oversized `DashboardTodayOps` link wrapper, corrected tax/service example amounts, changed public simulators to 500円以下切り下げ / 501円以上切り上げ, added no-extra-credit-card-fee copy, and documented the check-in approval-reset guard.
- files changed: `PLANS.md`, `components/features/admin/dashboard/DashboardTodayOps.tsx`, `app/(public)/page.tsx`, `app/(public)/guide/page.tsx`, `components/features/system/PriceSimulator.tsx`, `components/features/system/SystemPriceGrid.tsx`, `components/features/shift/ShiftTable.tsx`, `lib/actions/today.ts`, `daily_log.md`.
- validation: targeted eslint passed with 0 errors and one existing `guide/page.tsx` warning; `./node_modules/.bin/tsc --noEmit` passed; `git diff --check` passed; `pnpm lint` passed with existing warnings only; `PATH=/opt/homebrew/bin:$PATH ./node_modules/.bin/next build` passed; local `next start` smoke confirmed `/` 200, `/system` 200, `/guide` 200, `/admin/dashboard` 307 to `/admin/login`, `/shift` 308 to `/#today-cast`, unauthenticated `/api/line` 401, and rendered pricing/credit-fee copy.
- remaining risks: Authenticated admin browser click smoke is still pending.

### 2026-05-06 (final stabilization P0/P1 batches)

- scope: Closed the unauthenticated LINE group test endpoint, fixed critical admin dashboard/link route issues, aligned dashboard operational data to manager-approved submissions, and corrected public pricing/CTA consistency for the business rule `subtotal × 1.1 × 1.2`.
- files changed: `PLANS.md`, `app/api/line/route.ts`, `app/admin/(protected)/staffs/[id]/page.tsx`, `app/admin/(protected)/customers/[id]/edit/page.tsx`, `components/features/admin/staffs/StaffForm.tsx`, `components/features/admin/dashboard/DashboardKPIs.tsx`, `components/features/admin/dashboard/DashboardTodayOps.tsx`, `lib/actions/dashboard.ts`, `lib/actions/today.ts`, `app/(public)/page.tsx`, `app/(public)/guide/page.tsx`, `components/features/system/PriceSimulator.tsx`, `components/features/system/SystemPriceGrid.tsx`, `components/features/shift/ShiftTable.tsx`, `daily_log.md`.
- source of truth: LINE test GET now requires `CRON_SECRET`; staff/customer edit hrefs are preserved by adding matching routes; `体入・応募` dashboard KPI now opens applications; `本日の営業状況` dashboard card opens `/admin/today`; dashboard reservations count/display only `approval_status = approved`; rejected check-in resubmission returns to `pending`; cast post dashboard metrics use `published`; public price copy reflects消費税10%加算後サービス料20%.
- validation: targeted eslint passed for changed files; `pnpm lint` passed with existing warnings only; `git diff --check` passed; `.next` was cleared and `./node_modules/.bin/tsc --noEmit` passed; `PATH=/opt/homebrew/bin:$PATH ./node_modules/.bin/next build` passed after local SWC recovery and network-enabled Google Fonts fetch; local `next start` smoke confirmed `/` 200, `/system` 200, `/shift` 308 to `/#today-cast`, unauthenticated `/api/line` 401, and protected admin routes redirect to `/admin/login`.
- remaining risks: Authenticated protected browser click smoke is still pending; working tree still contains pre-existing unrelated dirty files and worktrees.

### 2026-05-05 (cast LINE direct check-in redirect)

- scope: Added safe redirect handling for direct LINE links to `/cast/today?from=line`, preserving query parameters through cast login and SMS verification while keeping existing auth checks intact.
- files changed: `lib/supabase/middleware.ts`, `lib/cast-auth-utils.ts`, `lib/actions/cast-auth.ts`, `app/(cast)/cast/login/page.tsx`, `app/(cast)/cast/m/login/page.tsx`, `app/(cast)/cast/verify/page.tsx`, `app/(cast)/cast/m/verify/page.tsx`, `app/(cast)/cast/today/page.tsx`, `components/features/cast/OtpVerifyForm.tsx`, `daily_log.md`.
- validation: targeted eslint passed; `pnpm lint` passed with existing warnings only; `pnpm run build` passed with existing middleware deprecation warning.
- remaining risks: Browser login-flow smoke was not run because no cast OTP was available in this turn.

### 2026-05-05 (/admin/settings admin UI alignment)

- scope: Refactored the admin settings/design page surface to match existing admin UI patterns for headers, spacing, cards, form controls, buttons, and LINE notification empty state without changing business logic, API routes, database schema, or notification behavior.
- files changed: `app/admin/(protected)/settings/page.tsx`, `components/features/admin/SettingsForm.tsx`, `components/features/admin/LineNotificationManager.tsx`, `daily_log.md`.
- validation: targeted eslint passed; `pnpm lint` passed with existing warnings only; `pnpm run build` passed with existing middleware deprecation warning.
- remaining risks: Protected browser visual smoke not run in this turn.

### 2026-05-05 (/admin/shift-requests unnamed cast row)

- scope: Prevented blank-looking rows in the unsubmitted cast list by showing `名前未設定` when an active cast has an empty stage name.
- files changed: `components/features/admin/UnsubmittedCastsList.tsx`, `daily_log.md`.
- validation: `pnpm exec eslint "components/features/admin/UnsubmittedCastsList.tsx"` passed.
- remaining risks: Browser visual smoke not run in this turn; underlying cast name data should be corrected in HR if this appears.

### 2026-05-05 (/admin/shift-requests unsubmitted account label)

- scope: Replaced the English `NO ACCOUNT` chip in the unsubmitted cast list with production-facing `ログイン未登録` wording and clarified that login-unregistered casts require individual handling outside auto reminder email.
- files changed: `components/features/admin/UnsubmittedCastsList.tsx`, `daily_log.md`.
- validation: `pnpm exec eslint "components/features/admin/UnsubmittedCastsList.tsx"` passed.
- remaining risks: Browser visual smoke not run in this turn.

### 2026-05-05 (/admin/dashboard empty-state card height)

- scope: Aligned empty-state card height between `OVERVIEW` and `MANAGEMENT MEMO` on the admin dashboard.
- files changed: `components/features/admin/dashboard/DashboardTodayOps.tsx`, `daily_log.md`.
- validation: `pnpm exec eslint "components/features/admin/dashboard/DashboardTodayOps.tsx"` passed.
- remaining risks: Browser visual smoke not run in this turn.

### 2026-05-05 (admin sidebar nav operational grouping)

- scope: Confirmed operational sidebar section order/group labels in `AdminLayout`; LINE deep-link label aligned to spec (`LINE自動投稿`, href unchanged `/admin/settings#line-notifications`). No new routes; `/admin/casts` does not exist — cast admin remains `/admin/human-resources`.
- files changed: `components/layouts/AdminLayout.tsx`, `daily_log.md`.
- validation: `pnpm exec eslint "components/layouts/AdminLayout.tsx"` OK; `pnpm lint` 0 errors (existing warnings only).

### 2026-05-05 (/admin/dashboard Phase 2 plan execution)

- scope: Executed attached Phase 2 dashboard plan with minimal diff and no DB/auth/RLS/SEO changes.
- files changed: `components/features/admin/dashboard/DashboardKPIs.tsx`, `components/features/admin/dashboard/DashboardReservations.tsx`, `daily_log.md`.
- source of truth: Kept time policy (`19:00〜2:00`, no `24/25/26` display), confirmed memo placeholder removal, retained `/admin/today` as deep-operation entry by restoring dashboard KPI/reservation links to `/admin/today`.
- validation: targeted eslint passed for Phase 2 files; `pnpm lint` passed with existing warnings only; `pnpm build` passed (existing non-blocking middleware deprecation + Supabase DNS warnings).
- remaining risks: Working tree contains unrelated pre-existing local changes outside this plan scope; not modified by this task.

### 2026-05-04 (/admin/approvals deadline urgency UI)

- scope: Added deadline-based urgency labels/badges to approvals cards without changing layout, sorting, or server actions.
- files changed: `app/admin/(protected)/approvals/page.tsx`, `daily_log.md`.
- source of truth: Lane 1 (`出勤承認待ち`/`来店予定承認待ち`) uses today 18:45 deadline; shift lane uses next Saturday 21:00; statuses are `期限超過` (overdue) and `締切間近` (within 2h), otherwise no badge.
- validation: `pnpm exec eslint "app/admin/(protected)/approvals/page.tsx"` passed.
- remaining risks: Deadline evaluation is shared per lane (not per item timestamp) by requirement; no backend deadline persistence was introduced.

### 2026-05-03 (Phase 2 complete — merged to main)

- Merged `hotfix/admin-sidebar-staff-registration` into `main` (Phase 2 admin dashboard, operation-hours, Today flows, cast-auth normalizer); pushed to `origin/main` for Vercel production alignment; merge conflicts resolved in cast-auth, today revalidation, cast profile, design page, shifts `searchParams`; `pnpm lint` 0 errors (existing warnings only).

### 2026-05-03 (/admin/today Phase 1 complete)

- scope: Completed `/admin/today` Phase 1 operation-time foundation before Phase 2 planning.
- implementation files changed: `lib/operation-hours.ts`, `components/features/admin/today/OperationTimeSelect.tsx`, `components/features/admin/today/OperationPhaseCard.tsx`, `components/features/admin/today/TodayDesktopView.tsx`.
- log files changed after implementation: `PLANS.md`, `daily_log.md`.
- source of truth: Added unified protected operation-time parsing/display for `19:00〜2:00`; replaced `/admin/today` time inputs with selector options from `getOperationTimeOptions`; kept dashboard counts/cards backed by existing `getTodayDashboard`, `getDashboardKPIs`, and `getDashboardTodayOps` data.
- validation: Commit `5756806`; targeted eslint passed; `pnpm lint` passed with existing warnings; grep checks passed; `git diff --check` passed; `pnpm build` blocked by existing unrelated `components/features/admin/UnsubmittedCastsList.tsx` type error.
- remaining risks: Browser smoke test pending; admin credential required for protected click-flow verification; build issue remains outside Phase 1 scope; `/admin/dashboard` Card Map required before Phase 2.

### 2026-05-02 (start context)

- scope: Started strict re-sequenced execution for admin operations request with mandatory order Scope A → B → C.
- files changed: `PLANS.md`, `daily_log.md`.
- source of truth: Applied protocol-first update before continuing implementation; paused non-Scope-A work.
- validation: Planning/log scaffold updated; implementation validation pending per scope.
- remaining risks: Scope A bug fixes must be fully validated before any Scope B redesign work resumes.

### 2026-05-02 (Scope A complete)

- scope: Completed Priority 1 bug fixes (customer edit 404, cast SMS re-auth inactivity semantics, cast blog post failure layer fix).
- files changed: `app/admin/(protected)/customers/page.tsx`, `app/admin/(protected)/customers/[id]/edit/page.tsx`, `lib/actions/cast-auth.ts`, `lib/supabase/middleware.ts`, `lib/actions/cast-posts.ts`, `PLANS.md`, `daily_log.md`.
- source of truth: Kept trusted-device behavior via `cast_reauth_until` cookie; shifted re-auth gate to inactivity window semantics and preserved post ownership checks.
- validation: `pnpm exec eslint "app/admin/(protected)/customers/page.tsx" "app/admin/(protected)/customers/[id]/edit/page.tsx" "lib/actions/cast-auth.ts" "lib/supabase/middleware.ts" "lib/actions/cast-posts.ts"` passed.
- remaining risks: Need browser smoke verification for customer edit transition, cast re-auth redirect flow, and cast post submit on real RLS environment before production rollout.

### 2026-05-02 (Scope B complete)

- scope: Completed admin operations redesign Scope B (left menu split, approval hub creation, shift-control page UI reset).
- files changed: `components/layouts/AdminLayout.tsx`, `app/admin/(protected)/approvals/page.tsx`, `app/admin/(protected)/shift-requests/page.tsx`, `PLANS.md`, `daily_log.md`.
- source of truth: Kept existing approval/action data sources; only reorganized navigation and page composition.
- validation: `pnpm exec eslint "components/layouts/AdminLayout.tsx" "app/admin/(protected)/approvals/page.tsx" "app/admin/(protected)/shift-requests/page.tsx"` passed.
- remaining risks: Approval hub profile-image category is placeholder until a dedicated request model exists; browser UX checks for new nav paths are still needed.

### 2026-05-02 (Scope C complete)

- scope: Completed layout consistency scope (admin fixed-background/content-scroll structure and design/settings card alignment normalization).
- files changed: `components/layouts/AdminLayout.tsx`, `app/admin/(protected)/design/page.tsx`, `PLANS.md`, `daily_log.md`.
- source of truth: Reused existing admin layout shell and design page components; no route/data logic changes.
- validation: `pnpm exec eslint "components/layouts/AdminLayout.tsx" "app/admin/(protected)/design/page.tsx"` passed.
- remaining risks: Needs browser visual check across desktop/mobile to confirm sticky/sidebar and card heights in real rendering conditions.

### 2026-05-02 (final validation)

- scope: Completed strict A→B→C execution with final repository validation and plan/log closure.
- files changed: `PLANS.md`, `daily_log.md`.
- source of truth: Scope order and per-scope evidence recorded in `PLANS.md` progress blocks.
- validation: `pnpm lint` passed with existing warnings only; `pnpm build` passed (Next.js middleware deprecation warning + non-blocking Supabase DNS warnings in static generation logs).
- remaining risks: End-to-end browser smoke not executed in this run; verify customer edit redirect, cast re-auth transitions, cast post submit/approval flow, and new approval hub navigation manually.

### 2026-05-02 (revalidation handoff)

- scope: Revalidated strict Scope A→B→C deliverables and prepared parent handoff summary.
- files changed: `PLANS.md`, `daily_log.md`.
- source of truth: Priority 1 bug memos and Priority 2/3 redesign outcomes remain recorded in `PLANS.md` progress entries.
- validation: `pnpm lint` passed with existing warnings only; `pnpm build` passed (middleware deprecation warning + non-blocking Supabase DNS warnings in static generation logs).
- remaining risks: Browser smoke still required for customer edit transition, cast re-auth flow boundaries, cast blog submit path, and approvals hub navigation UX.

### 2026-05-01

- scope: Added same-day 出勤 / 休み controls to the admin cast-management list using existing `daily_cast_attendance` records.
- files changed: `AGENTS.md`, `PLANS.md`, `daily_log.md`, `app/admin/(protected)/human-resources/page.tsx`, `components/features/admin/human-resources/DraggableCastList.tsx`, `lib/actions/today.ts`, `lib/actions/public/data.ts`.
- source of truth: Reused `daily_cast_attendance` via `updateDailyCastAttendance`; no duplicate today-status table or model was added.
- validation: `./node_modules/.bin/eslint` passed with existing warnings only; `PATH=/opt/homebrew/bin:$PATH ./node_modules/.bin/next build` passed after network access allowed Google Fonts fetch.
- remaining risks: Browser interaction smoke was not run in this turn; verify admin list button clicks against live data before production operation.

### 2026-05-05 (validation rerun for recent admin changes)

- scope: Re-ran validation to confirm recently adjusted admin sidebar/approvals/dashboard-related changes remain safe without new code edits.
- files changed: `daily_log.md`.
- validation: `pnpm lint` passed (0 errors, existing warnings only); `pnpm build` passed; known non-blocking warnings remained (Next middleware deprecation, Supabase DNS fetch warnings during static generation in this environment).
- remaining risks: No E2E/browser regression suite was run in this pass; recommend protected-route manual smoke for `/admin/dashboard`, `/admin/approvals`, and sidebar navigation.

### 2026-05-05 (mobile dashboard UX pass with design-taste frontend)

- scope: Applied a mobile-first dashboard UX pass to improve action discoverability and visual rhythm while preserving existing routes/tokens.
- files changed: `app/admin/(protected)/dashboard/page.tsx`, `components/features/admin/dashboard/DashboardQuickActions.tsx`, `components/features/admin/dashboard/DashboardCastRanking.tsx`, `daily_log.md`.
- validation: `pnpm exec eslint "app/admin/(protected)/dashboard/page.tsx" "components/features/admin/dashboard/DashboardQuickActions.tsx" "components/features/admin/dashboard/DashboardCastRanking.tsx"` passed.
- remaining risks: Protected-route visual smoke still needed on real mobile widths for final fit/feel confirmation.

### 2026-05-05 (/admin/dashboard mobile usability improvements)

- scope: Improved mobile-first usability/readability on admin dashboard header and KPI area without changing routes, backend logic, or data flows; ensured first-screen block is explicitly non-fixed on mobile and preserves sticky behavior from `md` upward.
- files changed: `app/admin/(protected)/dashboard/page.tsx`, `components/features/admin/dashboard/DashboardKPIs.tsx`, `daily_log.md`.
- validation: `pnpm exec eslint "app/admin/(protected)/dashboard/page.tsx" "components/features/admin/dashboard/DashboardKPIs.tsx"` passed; `pnpm lint` passed with existing warnings only; `pnpm build` passed (existing middleware deprecation + non-blocking Supabase DNS warnings).
- remaining risks: Manual mobile browser smoke is still recommended to confirm touch ergonomics and perceived readability on actual devices.

### 2026-05-05 (cast mobile notice bell correction)

- scope: Corrected the cast mobile shared notice bell so the unread dot is shown only when dashboard unread data actually exists, without changing cast auth semantics or route behavior.
- files changed: `components/features/cast/CastMobileShell.tsx`, `app/(cast)/cast/dashboard/page.tsx`, `daily_log.md`.
- validation: `pnpm lint` passed with existing warnings only; `pnpm build` failed in existing repo state with `TypeError: generate is not a function` during `next build`.
- remaining risks: Shared header bell now defaults to no unread dot outside dashboard until other pages explicitly pass unread state; broader "logged-out within 14 days skips SMS" behavior was not implemented because current auth model requires a trusted session/cookie.

### 2026-05-05 (admin mobile production click-flow audit)

- scope: Verified protected admin mobile click flows on production for `/admin/dashboard` cards and major links using real login, without code changes.
- files changed: `PLANS.md`, `daily_log.md`.
- validation: Production login succeeded with mobile viewport `390x844`; `/admin/today` links `来店予定を追加` / `詳細を表示` / `今日` navigated correctly; `本日の営業状況`, `キャスト管理`, and `体入・応募運用開始待ち—` did not navigate within timeout and stayed on `/admin/dashboard`; mobile menu button showed no change in visible admin link count before/after click.
- remaining risks: Broken mobile dashboard links remain on production and need a separate minimal fix plan; no source validation commands were run because this turn was verification-only.

### 2026-05-07 (staff create RLS fix)

- scope: Fixed staff creation RLS failure by requiring admin login in `createStaff` and performing the `staffs` insert through the server-only service client after authorization.
- files changed: `lib/actions/staffs.ts`, `daily_log.md`.
- validation: Targeted eslint passed; `tsc --noEmit` passed; `git diff --check` passed; `pnpm lint` passed with existing warnings only; `next build` passed; authenticated browser smoke created a temporary `CodexRlsTest-*` staff row and deleted it successfully.
- remaining risks: `staffs` RLS policy still only checks `user_roles`; code now preserves security by authorizing via the app admin model before the service-role insert, but a future migration may be needed if direct client-side `staffs` writes are ever required.

### 2026-05-07 (settings sidebar link restore)

- scope: Restored the `設定・デザイン` sidebar link for all authenticated admin roles so staff-role admin sessions can access settings and LINE automatic notification settings from the menu.
- files changed: `components/layouts/AdminLayout.tsx`, `daily_log.md`.
- validation: Targeted eslint passed for `AdminLayout.tsx`; `tsc --noEmit` passed; `git diff --check` passed; `pnpm lint` passed with existing warnings only; `next build` passed.
- remaining risks: Browser smoke on a staff-role admin session is recommended after preview deploy.

### 2026-05-07 (admin login roles alignment)

- scope: Removed `staff` from the admin-login role set because staff users are not expected to log into the admin screen; admin access is now limited to `owner` and `manager`.
- files changed: `lib/auth/admin-roles.ts`, `daily_log.md`.
- validation: Targeted eslint passed for `lib/auth/admin-roles.ts` and `AdminLayout.tsx`; `tsc --noEmit` passed; `git diff --check` passed; `pnpm lint` passed with existing warnings only; `next build` passed.
- remaining risks: Existing database roles and RLS policies still mention `staff`; no DB migration was applied in this minimal app-auth alignment.

### 2026-05-09 (admin dashboard accessibility fixes)

- scope: Fixed confirmed admin dashboard/sidebar accessibility issues without changing UI layout or component hierarchy.
- files changed: `components/layouts/AdminLayout.tsx`, `app/admin/(protected)/dashboard/page.tsx`, `daily_log.md`.
- validation: Targeted eslint passed; focused static accessibility checks passed for hidden mobile sidebar focus removal and dashboard description contrast; `pnpm lint` passed with existing warnings only; `pnpm build` passed.
- remaining risks: Protected-route browser axe scan was not run in this turn; authenticated browser smoke is still recommended after preview deploy.

### 2026-05-09 (cast profile/login feedback responsiveness)

- scope: Improved immediate feedback for cast SMS login/verify and cast profile-edit submissions without changing auth behavior, data flow, layout hierarchy, or route contracts.
- files changed: `app/(cast)/cast/login/page.tsx`, `app/(cast)/cast/m/login/page.tsx`, `components/features/cast/OtpVerifyForm.tsx`, `components/features/cast/ProfileImageChangeForm.tsx`, `components/features/cast/ProfileTextChangeForm.tsx`, `daily_log.md`.
- validation: Targeted eslint passed; contrast spot-check for updated helper text passed; `pnpm lint` passed with existing warnings only; `pnpm build` passed.
- remaining risks: Live SMS provider latency may still take several seconds; authenticated browser smoke with a real cast phone/OTP is recommended before production rollout confirmation.

### 2026-05-09 (cast SMS login server wait reduction)

- scope: Reduced actual SMS login wait by skipping the unused `auth.getUser()` round trip unless a valid cast reauth cookie makes session reuse possible.
- files changed: `lib/actions/cast-auth.ts`, `daily_log.md`.
- validation: Targeted eslint passed for `lib/actions/cast-auth.ts`; `git diff --check` passed; `pnpm lint` passed with existing warnings only; `pnpm build` passed.
- remaining risks: Supabase OTP/SMS provider latency remains external; live timing should be checked with a real cast login attempt.

### 2026-05-09 (cast trusted-device exit split)

- scope: Split cast profile session controls into normal app exit, which preserves the trusted-device cookie, and explicit device-auth removal logout, which clears trusted state and signs out.
- files changed: `lib/actions/cast-auth.ts`, `app/(cast)/cast/profile/page.tsx`, `daily_log.md`.
- validation: Targeted eslint passed for `lib/actions/cast-auth.ts` and `app/(cast)/cast/profile/page.tsx`; `git diff --check` passed; `pnpm lint` passed with existing warnings only; `pnpm build` passed.
- remaining risks: Live browser verification is needed to confirm the next `/cast/login` visit redirects without SMS after using `アプリを終了`.
