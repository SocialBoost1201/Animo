# Execution Contract

> Local pointer. Full contract: `/Users/takumashinnyo/workspace/projects/docs/ai/execution-contract.md`

## Repo-Specific Additions

### AI Endpoint Safety Gate
Any Vercel AI SDK endpoint must have Upstash Rate Limit middleware applied. Never expose a raw streaming endpoint.

### Three.js Safety Gate
Three.js components must use `dynamic(import, { ssr: false })` + `<Suspense>`. SSR builds will fail without this.

### Context Overload History
This repo had a skill overload anomaly (134 skills). The canonical core shelf is `.claude/skills/` (7 skills). Never load `.agent/skills/` in bulk.
