---
name: handoff-flow
description: Use when ending a session, switching between agents, or handing off work to the next session. Produces a structured handoff note that enables the next agent to resume without re-reading everything.
---

# Handoff Flow

## When to Use

Use at the end of a work session, when switching between Claude Code and Antigravity, or when a task spans multiple sessions.

## Workflow

**Step 1 — Session summary**
Briefly state what was accomplished:
- Features/fixes completed
- Files modified (full paths)
- Tests run and their results

**Step 2 — Current state**
Describe the current state of the codebase:
- Is the build passing? (`npm run verify`)
- Are there any uncommitted changes?
- Are there any pending migrations?

**Step 3 — Next steps**
List what remains:
- What should the next agent do first?
- Any known issues or edge cases to watch for?
- Any decisions that need user input?

**Step 4 — Skills active this session**
List which skills were used, so the next agent can reference the same context.

**Step 5 — Open questions**
Any questions that came up but weren't resolved. Flag clearly.

## Handoff Note Format

```markdown
## Session Handoff — [date]

### Completed
- [item 1]
- [item 2]

### Files Modified
- /full/path/to/file1.ts
- /full/path/to/file2.tsx

### Current State
- Build: PASSING / FAILING
- Uncommitted changes: yes/no
- Pending migrations: yes/no

### Next Steps
1. [first thing to do]
2. [second thing to do]

### Skills Used This Session
- [skill-name]: [brief note on what it was used for]

### Open Questions
- [question requiring human or next-agent input]
```

## Output

A handoff note that enables the next agent to orient in under 2 minutes without reading the full conversation history.
