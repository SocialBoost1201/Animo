# Animo Project Guide

## Overview
Next.js 16 (App Router) application using pnpm, React 19, Tailwind v4, and AI SDK v6 with Supabase SSR authentication.

## Non-Negotiables
- PPR is enabled and must not be disabled.
- All AI API endpoints must use Upstash Rate Limit.
- Supabase RLS must be enabled on all tables.
- All user input must be sanitized before sending to AI APIs.
- Three.js components must never run on SSR.

## Project-Specific Implementation Rules
- Use pnpm for all commands (npm is forbidden).
- Three.js components must use dynamic import with ssr: false and Suspense.
- AI streaming must use streamText from ai with @ai-sdk/openai or @ai-sdk/google.
- Cloudflare Turnstile is required for all public forms.
- TipTap must run in client components only.

## Stop Conditions
- If requirements are unclear, you must stop and ask for clarification.
- If a change may break existing UI or behavior, you must stop.
- If database schema impact is uncertain, you must stop.
- If the change affects multiple modules unexpectedly, you must stop.
- If you cannot verify the change, you must stop.

## Local Commands
- pnpm dev
- pnpm build
- pnpm start
- pnpm lint

## Troubleshooting
- AI streaming issues: verify "use client" and correct hook usage.
- TipTap SSR errors: enforce dynamic import with ssr: false.
- Web-Push issues: verify VAPID keys in environment variables.
