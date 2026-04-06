---
name: implementation-flow
description: Use for any feature implementation. Enforces Analysis → Plan → Approval → Execution → Verification. Covers Next.js 16 App Router, Vercel AI SDK, TipTap, DnD Kit, and Three.js patterns.
---

# Implementation Flow

## When to Use

Use for: new routes, new components, new Server Actions, new AI endpoints, TipTap extensions, DnD features, Three.js scenes, web-push notifications.

## Workflow

**Phase 1 — Analysis**: Read all relevant existing files first.

**Phase 2 — Plan**: Present to the user:
- Files to modify / create
- Step-by-step changes
- Skills to use
- Out-of-scope items

**Phase 3 — Approval**: Wait. Valid: "Proceed", "OK", "承認", "実行して"

**Phase 4 — Execute**:
- Server Component by default
- `"use client"` for: TipTap, DnD Kit, Three.js, Framer Motion, Lenis, AI hooks
- Three.js: `dynamic(import, { ssr: false })` + `<Suspense>`
- AI endpoints: Upstash Rate Limit applied
- No `any` types; explicit return types

**Phase 5 — Verify**:
```bash
pnpm lint && pnpm build
```
