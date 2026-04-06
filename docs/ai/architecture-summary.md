# Architecture Summary — Animo

## Application Type

A creative platform application. Likely a portfolio/content platform with AI-assisted content generation, rich text editing, drag-and-drop UI, 3D scenes, web push notifications, and Supabase Auth.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, PPR enabled) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12, GSAP 3, Lenis |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| UI / Carousel | Embla Carousel |
| Editor | TipTap v3 |
| DnD | @dnd-kit/core |
| Push | web-push |
| AI | Vercel AI SDK v6 (@ai-sdk/openai + @ai-sdk/google) |
| Auth | Supabase Auth (SSR) |
| Rate Limit | Upstash Redis + Ratelimit |
| Package Manager | pnpm |
| Node | ≥18.0.0 |

## Key Architectural Notes

- **Dual AI providers**: OpenAI + Google (Gemini) via Vercel AI SDK v6
- **All interactive features require `"use client"`**: TipTap, DnD Kit, Three.js, Framer Motion, Lenis
- **Three.js**: Dynamic import + `ssr: false` + Suspense is mandatory
- **Rate limiting**: All AI endpoints must have Upstash Rate Limit
- **No Prisma**: Auth is Supabase-native; no ORM for database access

## Security Architecture

- Upstash Rate Limit on all AI API routes
- Supabase RLS on all tables
- Cloudflare Turnstile on user-facing forms
- XSS sanitization before AI input
