---
name: bugfix-flow
description: Use for any bug, error, test failure, or unexpected behavior. Mandates root cause investigation before any fix. Covers Next.js 16, Vercel AI SDK v6, Supabase Auth, TipTap, DnD Kit, and Three.js patterns.
---

# Bugfix Flow

## When to Use

Use for: runtime errors, build failures, unexpected behavior, streaming issues, animation bugs. Iron Law: no fix without root cause.

## Workflow

**Phase 1 — Reproduce**: Identify exact error, affected file, reproduction steps.

**Phase 2 — Investigate**: Read affected files. Check types. Run:
```bash
pnpm lint
pnpm build
```

**Phase 3 — Hypothesis**: Form specific cause statement before touching code.

**Phase 4 — Fix**: Smallest change that resolves the root cause.

**Phase 5 — Verify**:
```bash
pnpm lint && pnpm build
```

## Common Patterns

**AI SDK v6**
- Streaming error → add `"use client"` + check `useChat` hook setup
- Rate limit error → verify Upstash middleware is applied

**TipTap**
- SSR error → `dynamic import + ssr: false`
- Must have `"use client"` directive

**DnD Kit**
- Accessibility warning → add `KeyboardSensor` setup

**Three.js / R3F**
- SSR error → `dynamic import + ssr: false + <Suspense>`
- Memory leak → dispose geometry/material/texture in useEffect cleanup

**Supabase Auth**
- Session not found → use `getUser()` not `getSession()`

**Framer Motion**
- `AnimatePresence` not animating → add `key` prop to child
