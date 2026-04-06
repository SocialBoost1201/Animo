# Workspace Overview

> Local pointer. Full overview: `/Users/takumashinnyo/workspace/projects/docs/ai/workspace-overview.md`

## This Repo's Place in the Workspace

**Repo**: `Animo`
**Family**: Product / Platform — web
**Role**: Complex platform with AI SDK, rich editor, DnD, web-push, Three.js

## Key Context

Animo is the most complex single-repo in the workspace. It uses Vercel AI SDK v6 with both OpenAI and Google providers, TipTap v3 for rich editing, DnD Kit for drag-and-drop, Embla Carousel, web-push notifications, and Three.js for 3D. All of these require `"use client"` directives.

## Skill Anomaly History

As of 2026-04-02, Animo had 134 skills in `.agent/skills/` — an accidental full vault copy. This was fixed by establishing `.claude/skills/` with a curated 7-skill core shelf. The `.agent/skills/` directory is preserved as a reference vault but must not be bulk-loaded.
