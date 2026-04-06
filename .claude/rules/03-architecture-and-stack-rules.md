# 03 — Architecture and Stack Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity
> Stack: Next.js 16 / React 19 / TypeScript 5 / Tailwind v4 / GSAP 3 / Three.js / Vercel AI SDK v6 / Supabase Auth / TipTap v3 / DnD Kit / web-push / pnpm

## Component Rules

- Server Component by default. `"use client"` only when needed.
- Three.js canvas must use dynamic import + `ssr: false` + Suspense wrapper.
- TipTap editor always requires `"use client"`.
- DnD Kit requires `KeyboardSensor` accessibility setup.
- Framer Motion requires `"use client"` and `key` prop on `AnimatePresence`.

## AI SDK v6 Pattern

```ts
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
// OR
import { google } from "@ai-sdk/google"

// All AI endpoints must have Upstash Rate Limit applied
```

## TypeScript Rules

- `any` type is forbidden. Use `unknown` and narrow.
- All functions must have explicit return types.
- No implicit `any` from third-party imports — add types.

## PPR and Image Optimization

```ts
// next.config.ts
experimental: { ppr: true }
images: { formats: ["image/avif", "image/webp"] }
```

## Package Manager

pnpm. Do not use npm or yarn commands in this repo.

## Key Error Resolutions

- AI SDK streaming error → add `"use client"` + check `useChat` hook
- web-push VAPID error → set `NEXT_PUBLIC_VAPID_KEY` + `VAPID_PRIVATE_KEY` in `.env.local`
- TipTap SSR error → use `dynamic import + ssr: false`
