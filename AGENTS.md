# AGENTS.md — Animo

## Implementation Plan Contract

For any project startup, complex change, or multi-step implementation, the agent must follow `PLANS.md`.

`PLANS.md` is the active implementation plan and progress tracker.

Rules:
- Read `PLANS.md` before starting complex work.
- Follow `PLANS.md` for complex multi-step work.
- Follow `PLANS.md` plus the user's latest instruction.
- Follow the approved implementation plan and the user's latest instruction.
- Do not perform work outside the current plan unless explicitly instructed.
- If the user's latest instruction conflicts with `PLANS.md`, stop and report the conflict.
- Update task status after each completed phase.
- Mark completed tasks with `[x]`.
- Keep progress understandable for any agent joining later.
- Do not remove historical progress unless explicitly instructed.
- Do not rewrite the entire plan for small updates.
- Use minimal diffs when updating `PLANS.md`.

Status markers:
- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [?] Needs decision

## Skill Directory Policy

- `.agent/skills` is canonical.
- `.agents/skills` is compatibility only and must remain a symlink.
- `.claude/skills` may exist for Claude-specific or legacy compatibility and must not be treated as the canonical source unless explicitly instructed.
- Do not bulk-load all skills.
- Load full `SKILL.md` only when task-relevant.
- Do not run `skillport doc` without explicit approval.
- Do not rely on global `~/.cursor` as the project source of truth.

## Core Execution Contract
- Only perform work explicitly requested by the master.
- Do not expand scope.
- If anything outside the stated scope may be affected, stop and ask the master for approval.
- Only modify files explicitly listed in the master-approved plan.
- Minimal diff only.
- No unrelated refactoring.
- Required outputs may be created or updated only when explicitly included in the master-approved plan.
- Approval is required before touching shared components, UI/UX outside the explicitly approved task scope, DB, env, config, auth, routing, dependencies, or creating new files (excluding test files required for validation).
- If requirements are unclear or conflicting, stop and ask.
- For non-trivial tasks: plan first, list target files and risks, then wait for approval.
- Separate implementation and review roles.

## Daily Log Workflow
- Before starting Animo work, read the latest 2 entries in `/daily_log.md` if the file exists.
- If `/daily_log.md` has fewer than 2 entries, read all existing entries.
- After completing Animo work, append one concise entry to `/daily_log.md` with date, scope, files changed, validation, and remaining risks.
- Do not store secrets or PII in `/daily_log.md`.

## Project Non-Negotiables
- Do not bypass Supabase RLS or weaken authorization rules.
- Do not run Three.js or browser-only code directly in SSR/server render paths; use safe client-only patterns.
- Public-facing submission or contact flows must not be implemented without rate limiting.
- Public-facing forms must not be implemented without bot protection such as Turnstile where applicable.
- Never expose secrets.
- Never send PII to AI systems.
- No unsafe AI endpoints.
- If framework/runtime version is referenced, verify it against `package.json`.

## Project Rules
- Use pnpm only.
- PPR must remain enabled.
- No `any` in TypeScript.
- Follow established project architecture and existing module boundaries.

## UI Protection
- Do not change layout, spacing, typography, animations, or interactions without explicit instruction.
- Never break existing navigation (sidebar, layout, routing).

## Git Safety
- No direct commits to `main`.
- Use conventional commits.

## Validation
- For code changes, `pnpm lint` and `pnpm build` must pass before commit.
- For docs-only changes, validate only the changed markdown content and scope.

## Stop Conditions
- Unclear requirements.
- UI risk.
- DB/auth/env/config impact uncertainty.
- Cross-module side effects.
- Unable to verify safely.

## Learned User Preferences
- Prefer Japanese for explanations when the user asks for Japanese responses on Animo work.

## Learned Workspace Facts
- Run `pnpm dev` from the repository root so `.env.local` loads; starting dev from another working directory can skip env and break `/admin/*` behavior.
- Avoid multiple `next dev` processes on the same checkout; they compete for `.next/dev/lock`.
- In App Router page components, treat `searchParams` as a `Promise` and await before reading (matches Next.js patterns used in this repo).

## Figma Design System Rules

These rules apply when implementing or reviewing Figma-driven UI changes in Animo.
They do not override the Core Execution Contract, UI Protection, or Stop Conditions above.

### Required Figma Flow

- Use the Figma MCP flow before implementation: get structured design context, get a screenshot for visual reference, then download required assets.
- Treat Figma MCP output as design evidence, not final code style.
- Match the approved Figma node visually, but translate it into this repository's existing Next.js, React, TypeScript, and Tailwind CSS patterns.
- If a Figma request would change shared layout, navigation, routing, typography, spacing, animation, or public-page behavior beyond the approved scope, stop and ask for approval.

### Project Structure

- Reuse existing components before creating new ones.
- Shared UI primitives live in `components/ui`.
- Feature-specific UI lives under `components/features/<area>`.
- Layout shells live in `components/layouts`.
- Motion helpers live in `components/motion`.
- SEO/schema helpers live in `components/seo`.
- App routes live under `app`; preserve existing route contracts unless explicitly instructed.

### Styling and Tokens

- Use Tailwind CSS v4 utilities and existing project tokens from `app/globals.css`.
- Prefer existing tokenized colors such as `--color-background`, `--color-foreground`, `--color-gold`, `--color-air-gray`, `--color-ink-black`, and shadcn-compatible `:root` variables.
- Do not introduce a new theme system, Tailwind config, CSS framework, or global reset for a Figma task.
- Preserve existing luxury brand styling: restrained black/white base, champagne-gold accents, serif display typography, and careful spacing.
- Do not hardcode new hex colors when an existing token or local component pattern already covers the design intent.
- Keep responsive behavior explicit with Tailwind breakpoints used in the existing codebase.

### Typography

- Use existing font roles from `app/globals.css`: `font-sans`, `font-serif`, `font-heading`, `font-body`, `font-ui`, `font-heading-en`, and `font-heading-jp`.
- Public luxury pages may use heading serif/display treatment; admin and operational UI should stay dense, legible, and task-focused.
- Do not change global font loading or `next/font` setup for a Figma implementation unless explicitly approved.

### Components and Code

- Use TypeScript with explicit prop types. Do not use `any`.
- Keep components small and scoped to the approved feature or route.
- Use `className` composition with existing helpers such as `cn` where appropriate.
- Prefer `lucide-react` icons already used in the project. Do not add a new icon package.
- Use existing `components/ui/Button.tsx`, `components/ui/card.tsx`, tabs, toasts, and admin feature components where they fit.
- Do not duplicate an existing component just to match Figma; extend or compose existing components within scope.

### Assets

- Store project assets under `public` using the existing directory patterns, such as `public/images` or `public/videos`.
- If Figma MCP provides a localhost asset URL, use that asset source rather than creating a placeholder.
- Do not create placeholder images when a real Figma asset is available.
- Use `next/image` for normal images unless the existing local pattern intentionally uses another approach.
- Do not commit large or redundant exported assets without approval.

### Validation

- For code changes from Figma, run `pnpm lint` and `pnpm build` before commit.
- For visual or responsive changes, verify the affected route in a browser at the relevant desktop and mobile widths.
- Report any visual deviations from Figma as known differences, not silent assumptions.


<claude-mem-context>
# Memory Context

# [Animo] recent context, 2026-05-03 1:18am GMT+9

No previous sessions found.
</claude-mem-context>
