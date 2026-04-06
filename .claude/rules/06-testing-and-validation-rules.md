# 06 — Testing and Validation Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity

## Validation Before Any Commit

```bash
pnpm lint     # ESLint — fix first
pnpm build    # confirm build passes
```

## What "Verified" Means

A change is verified when:
1. `pnpm lint` passes (no ESLint errors)
2. `pnpm build` passes (no build errors)
3. For AI endpoint changes: rate limit behavior confirmed
4. For auth changes: login/logout flow manually tested
5. For schema changes: Rich Results Test passed
