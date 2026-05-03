# Current State

- **Project goal:** Rebuild admin operations UI and cast dashboard around real daily Club Animo workflows.
- **Current phase:** `/admin/today` Phase 1 completed and logged.
- **Next phase:** Map `/admin/dashboard` cards before Phase 2 implementation.
- **Non-negotiables:** No mock/placeholder/fake operational UI; every visible count/card/badge/button must use existing production data/actions/routes; no DB/auth/RLS/SEO/schema changes without approval; protected time UI must display `19:00〜2:00` and never `24:00` / `25:00` / `26:00`.
- **Completed items:** Operation time utility, `/admin/today` time selector replacement, phase cards, pre-opening risk badge, Phase 1 commit `5756806`.
- **Open blockers:** Admin credential required for protected browser smoke; `pnpm build` blocked by unrelated `components/features/admin/UnsubmittedCastsList.tsx` type error; `/admin/dashboard` Card Map required before Phase 2.
- **Active branch/commit:** `hotfix/admin-sidebar-staff-registration` / `5756806`.

## Context Rule

Before starting work, read this file plus only the latest 2 entries from `PLANS.md` and `daily_log.md`. Do not load full logs unless explicitly instructed.

## Priority Rule

If CURRENT_STATE.md conflicts with PLANS.md or daily_log.md,
CURRENT_STATE.md must be treated as the single source of truth.
