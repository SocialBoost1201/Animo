# Club Animo Admin/Cast v2 Rebuild Plan (Read-only investigation)

## 0) Scope and hard constraints
- Keep existing `app/admin` and `app/(cast)/cast` untouched.
- Build parallel v2 routes: `app/admin-v2` and `app/cast-v2`.
- Reuse Supabase DB/Auth/env/Vercel.
- No public site changes.
- No data deletion.
- No route replacement until v2 completion review.

## 1) 現行機能棚卸し（実ファイルベース）
- Admin: dashboard/today/approvals/shift/customers/casts/staff/posts/settings/analytics/internal-notices.
- Cast: login/register/otp/dashboard/today/shift/monthly-shift/posts/notices/profile.
- Shared: `components/features/admin/**`, `components/features/cast/**`, `lib/actions/**`, `app/api/**`.

## 2) v2で残す機能
- Auth and role gates.
- Today operation + approvals + shift lifecycle.
- Profile change request workflow.
- Posts submit/moderation/publish flow.
- Notices and notification systems.
- Core cast/customer/staff operations.

## 3) v2で捨てる機能
- Duplicate UX paths with same business result.
- Non-operational/debug exposure in normal UI.
- UI-only placeholders and disconnected actions.

## 4) v2で新規作成する機能
- Isolated route shells for `admin-v2` / `cast-v2`.
- `lib/actions-v2/*` facade layer for v2-specific action ownership.
- Mandatory mutation audit log wrapper for DB updates.
- Button contract registry (1 button = 1 purpose = 1 endpoint).

## 5) DB接続マップ
- Session client: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`.
- Privileged/system: `lib/supabase/service.ts` + cron/webhook/api routes.
- LINE integration: `lib/line.ts`, `app/api/line/webhook/route.ts`, `app/api/line/route.ts`, `app/api/cron/line-notifications/route.ts`.

## 6) 画面遷移マップ
- Admin v2: login -> dashboard -> today/approvals/shift-requests/human-resources/customers/posts/settings/analytics.
- Cast v2: login -> dashboard -> today/shift/monthly-shift/posts/notices/profile.

## 7) ボタン接続マップ
- Every button must have: purpose ID, exactly one action/API target, success/fail feedback, and mutation log on write.
- No decorative action buttons.

## 8) 推奨ディレクトリ構成
- `app/admin-v2/(auth)/*`, `app/admin-v2/(protected)/*`
- `app/cast-v2/(auth)/*`, `app/cast-v2/(protected)/*`
- `components/features/admin-v2/*`, `components/features/cast-v2/*`
- `lib/actions-v2/admin/*`, `lib/actions-v2/cast/*`, `lib/actions-v2/shared/*`

## 9) 実装フェーズ分け
1. Read-only inventory finalize.
2. Keep/drop/new decision + button contracts.
3. v2 route/auth/layout scaffolding.
4. Admin domain migration.
5. Cast domain migration.
6. Integration and side-effect verification.
7. Parallel-run QA.
8. Cutover decision (no replacement yet).

## 10) リスクと検証項目
- Risks: hidden coupling, RLS-sensitive writes, notification side effects, route confusion during parallel run.
- Verification: per-route role checks, per-button connection checks, per-mutation audit log checks, `pnpm lint`/`pnpm build` per milestone.
- Note: `prisma/schema.prisma` is not present in this repository; DB reference is Supabase migrations + existing actions.
