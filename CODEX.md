# CODEX.md — Animo Project Source of Truth

## 1. Project Mission
**"Digitalizing the Luxury Nightlife Experience"**
A high-end marketing and management platform for "CLUB Animo" (Yokohama-based luxury lounge). Focuses on brand prestige, operational transparency, and real-time cast-guest engagement.

## 2. Domain Model (Core Entities)
- **Cast**: Profiles (slug-based), attributes (age, height), and personality metadata.
- **Shift (Real-time)**: Critical dynamic data. High-frequency updates required for "Is she here now?".
- **Timeline (Cast Posts)**: Primary SEO/AEO engine. Requires valid validation of post-age (e.g., "Updated within 72h").
- **System/Price**: Price simulation logic to ensure transparency and trust for high-net-worth guests.

## 3. Technical Constraints & Architectural Pillars
- **Next.js 16 (App Router) + PPR**: Static layouts (Nav/Shell) + Dynamic islands (Shift/Posts/AI) via `Suspense`.
- **Supabase SSR & RLS**: Strict security. Casts/Staff must only access authorized records.
- **Brand Consistency**: Heavy reliance on `.card-premium-skin` and specific gold/black hex codes defined in `globals.css`.
- **Optimization**: `next/dynamic` for heavy UI (Simulators, Quizzes). All media must be optimized (`.webp`, `.mp4` posters).

## 4. Operational Guardrails for Agents
- **Context Preservation**: Always reference `globals.css` before styling. Do not re-define theme variables.
- **Privacy First**: No PII (Personal Identifiable Information) in AI prompts or public logs. Use stage names only.
- **Data Integrity**: Ensure "Today's Cast" logic accounts for time-zone/operating hours of the physical venue.
- **Surgical Edits**: Follow the `Analysis → Plan → Approval` flow as defined in `AGENTS.md`.
