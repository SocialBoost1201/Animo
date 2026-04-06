# Skills Runtime Shelf — Animo

This directory is the runtime (task-scoped) skill staging area. Skills here are loaded on-demand for specific task types.

## Context Overload Note

Animo previously had 134 skills in `.agent/skills/`. This caused severe context bloat. The `.agent/skills/` directory is preserved as a reference vault — do NOT bulk-load it. The canonical active shelf is `.claude/skills/` (7 skills).

## Runtime Skill Groups

Skills below are available in `.agent/skills/` as the source. Load only what the current task requires.

| Task Type | Skills to load |
|-----------|---------------|
| GSAP animation sprint | `gsap-core`, `gsap-react`, `gsap-scrolltrigger` |
| Advanced GSAP | `gsap-plugins`, `gsap-performance`, `gsap-timeline`, `gsap-utils`, `gsap-frameworks` |
| SEO / schema audit | `schema-markup`, `seo-checklist`, `seo-audit`, `homepage-audit` |
| Supabase schema design | `supabase-schema-designer`, `supabase-query-builder`, `supabase-postgres-best-practices` |
| Supabase storage/realtime | `supabase-storage-manager`, `supabase-realtime-handler` |
| Design implementation | `figma`, `figma-implement-design` |
| Performance sprint | `vercel-performance-optimizer`, `next-cache-components` |
| Security review | `security-audit`, `security-best-practices` |
| Test sprint | `playwright`, `test-driven-development`, `unit-test-generator`, `webapp-testing` |
| Code review | `code-review-automation`, `lint-and-validate`, `refactor-engine` |
| React patterns | `react-best-practices`, `react-patterns`, `composition-patterns`, `typescript-expert` |
| AI / GEO | `geo-fundamentals`, `gemini-api-dev` |
| PR / GitHub CI | `pull-request-manager`, `gh-fix-ci`, `gh-address-comments`, `github-actions-builder` |
| Document processing | `docx`, `pdf`, `xlsx`, `pptx` |
| Mobile | `mobile-first-design-rules`, `tailwind-master` |
| Next.js upgrade | `next-upgrade` |
| LP / landing page | `lp-build-flow` |

## Archived Skills (from original 134 — not relevant to Animo)

The following skills from `.agent/skills/` are documented as archived. They remain in the directory but should not be loaded during Animo sessions:

**Meta-infra (not task-relevant):**
agent-loop-controller, context-manager, dynamic-skill-loader, skill-router, meta-skill-manager, find-skills, skill-creator, skill-manager, skill-marketplace, skill-pack-generator, audit-skills, task-router

**Superseded commit skills:**
conventional-commits, git-commit-generator, commit-analyzer (→ use commit-writer)

**Superseded deploy:**
yeet, deployment-manager, vercel-deployment-manager (→ use vercel-deployment)

**Not relevant to Animo:**
wordpress, go2gg, web-scraper, exa-search, excalidraw-diagrams, vertex-ai-api-dev, humanizer, de-ai-ify, marketing-principles, customer-journey-map, business-health-diagnostic, case-study-builder, jobs-to-be-done, positioning-basics, positioning-statement, problem-statement, prioritization-frameworks, stakeholder-map, user-stories, user-story, voice-extractor, copywriting, summarize, create-prd

**Vague / generic:**
float-ui, using-superpowers, screenshot, debugger, code-generator, script-runner, cli-automation, api-integrator, markdown-generator, json-transformer, data-parser, log-analyzer, web-design-guidelines, env-config-manager

**Niche GitHub:**
github-automation, github-workflow-automation, github-issue-creator, github-repo-manager, ci-cd-helper, vercel-domain-manager, vercel-env-manager

## Context Budget

Core shelf: 7 skills
Runtime max per task: 3 additional
Total active: ≤10 skills
