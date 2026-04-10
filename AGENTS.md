# Animo Execution Contract

This file defines the project-specific execution contract for all AI agents working in this repository. 
It merges existing operational rules with comprehensive multi-agent protocols to ensure production-grade stability and clarity.

## 1. Purpose

This project exists to support the public site, cast-facing flows, and admin-side operations of Animo. It must be treated as a production-grade business system.
- Stable public-facing experience.
- Reliable cast and admin workflows.
- Safe and maintainable implementation.
- Operational clarity for future updates.

**Do not optimize for demo quality over operational quality.**

## 2. Authority Order

When instructions conflict, use the following priority order:
1. Laws, contracts, real data, existing system facts, and existing files.
2. GEMINI.md
3. This AGENTS.md
4. Files under `.agent/rules/` (Multi-agent operational rules).
5. Files under `.claude/rules/` (Legacy or Claude Code specific rules).
6. Approved design documents, specifications, and operational documents.
7. The latest explicit user instruction.
8. General best practices.

## 3. Project Mission

Always optimize for operational stability, maintainability, correct role separation, safe admin and cast flows, and production readiness. Prefer operational clarity over visual novelty.

## 4. Definition of Done

Work is not done unless:
- The intended file changes actually exist in the repository.
- The changed files can be identified explicitly.
- The impact scope is understood.
- Required validation (Code/UI/Auth/Flow) has been performed.
- Unverified items and remaining risks are explicitly listed.

## 5. Required Reporting Language

All progress reports, summaries, change reports, and validation reports must be written in **Japanese (日本語)**.
English is allowed only for code, commands, logs, identifiers, library names, API names, file names, and branch names.

## 6. Project Overview

- **Project Name:** Animo
- **Type:** Business website plus admin and cast operational system.
- **Audience:** Public visitors, Cast users, Internal Admin users.

## 7. Tech Stack

- **Core:** Next.js, TypeScript, Tailwind CSS.
- **Backend/Storage:** Supabase, Vercel.
Do not replace core technology choices without explicit justification.

## 8. Repository Structure and Responsibilities

- `app/` = Routes and page-level structure.
- `components/` = Reusable UI components.
- `lib/` = Business logic and integrations.
- `.agent/` = Multi-agent rules and workflows (New).
- `.claude/` = Legacy configuration and Claude specific rules.

## 9. Non-Negotiable Constraints

- URL structure and public/cast/admin role boundaries.
- Access control and authentication-related behavior.
- **Existing Rules:**
    - **Plan-first:** Propose a plan and wait for explicit approval ("Proceed"/"承認") before any repo-tracked edits.
    - **Minimal diff:** Smallest safe change; keep existing architecture and conventions.
    - **No unrelated refactor:** No formatting-only edits, renames, or file moves unless required.

## 10. UI and UX Rules

Prioritize clarity over decorative effects. CTA and important states must remain visible.
- **Existing Rule:** UI preservation (Do not change UI/animations/visual design unless explicitly requested).

## 11. Copy and Content Rules

All copy must be operationally credible and business-natural. Avoid vague abstractions or overstatement.

## 12. SEO and AI Search Rules

Headings must follow a logical structure. H1 must clearly describe the page topic. Avoid unnatural SEO text.

## 13. Data Design Rules

Display content should be manageable from proper data/admin sources. Preserve stable identifiers.

## 14. Implementation Style

- Use the smallest safe diff.
- Avoid `any` unless unavoidable.
- Do not leave temporary implementations or placeholder comments.
- Follow the **Plan-first** protocol for non-trivial changes.

## 15. Validation Rules

- **Code:** Type check, lint, and diff review.
- **UI:** Desktop/Mobile check, spacing/layout check, navigation check.
- **Existing Rule:** **Evidence** (Verify with commands/tests; report exact commands + touched file paths).

## 16. Required Artifacts

Use the following for non-trivial tasks:
- `task.md`, `implementation_plan.md`, `walkthrough.md`, `handover.md`, `audit.md`.

## 17. Completion Report Requirements

Include: Conclusion (結論), Changed files, Validation results, Unvalidated items, Remaining risks, and Next action.

## 18. Skill Usage Policy

Use only relevant skills. Treat Shared Vault as storage, not default active context. Prefer workflows for repeatable procedures.

## 19. Local Pointers

- **Multi-agent rules:** `.agent/rules/`
- **Multi-agent workflows:** `.agent/workflows/`
- **Legacy rules/skills:** `.claude/rules/`, `.claude/skills/`

## 20. Forbidden Behaviors

- Claiming verification that did not happen.
- Making silent breaking changes.
- Guessing role/auth behavior or inventing outcomes.
- Prioritizing visual novelty over operational clarity.

## 21. Review and Maintenance

This file should be reviewed when major architecture, routing, or mission changes occur. Keep it strong and operational.

## 22. Final Principle

If a rule does not help execution quality, operational safety, maintainability, or reporting accuracy, do not add it.
