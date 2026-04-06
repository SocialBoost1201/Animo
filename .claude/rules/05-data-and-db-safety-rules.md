# 05 — Data and DB Safety Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity
> DB stack: Supabase Auth (SSR), Upstash Redis

## Supabase Auth Rules

1. Use `getUser()` — never `getSession()`.
2. Use `createServerClient` from `@supabase/ssr` with correct `cookieStore`.
3. RLS (Row Level Security) must be enabled on all user-data tables.
4. Never grant `anon` role excessive permissions.
5. Never expose the Supabase service role key to the client.

## Rate Limiting

- Upstash Rate Limit must be applied to ALL AI API endpoints.
- Never expose a raw AI endpoint without rate limiting.

## Security Rules

1. `.env.local` holds all secrets. Never commit.
2. XSS: sanitize all user input with the `xss` package before sending to AI.
3. Cloudflare Turnstile: required on user registration and contact forms.
4. `CLOUDFLARE_TURNSTILE_SECRET_KEY` validated server-side.

## Structured Data

1. JSON-LD only.
2. Schema must exactly match displayed content.
3. Run Rich Results Test before release.
4. Required base fields: `@context`, `@id`, `url`, `name`, `description`, `image`, `inLanguage`.
