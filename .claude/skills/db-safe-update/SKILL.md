---
name: db-safe-update
description: Use for any Supabase Auth change, RLS policy change, or data model change. Ensures RLS is intact and auth patterns are correct.
---

# DB Safe Update

## When to Use

Use for: Supabase table changes, RLS policy updates, auth flow changes, rate limit changes.

## Workflow

**Step 1 — Understand current state**: Read affected tables and current RLS policies before changing.

**Step 2 — Implement changes**: Make the smallest correct change.

**Step 3 — Verify RLS**: After any table change:
- RLS enabled on the table
- `anon` role: minimum necessary permissions only
- `authenticated` role: correct CRUD for use case

**Step 4 — Verify auth**: For Supabase Auth changes:
- `getUser()` used, not `getSession()`
- `createServerClient` cookieStore config correct

**Step 5 — Verify rate limiting**: For AI endpoint changes:
- Upstash Rate Limit applied
- No AI endpoint exposed without rate limit

**Step 6 — Verify**:
```bash
pnpm lint && pnpm build
```

## Safety Rules

1. Never expose Supabase service role key to the client
2. Never disable RLS on a user-data table
3. All secrets in `.env.local`
4. XSS sanitization before any user input reaches AI
