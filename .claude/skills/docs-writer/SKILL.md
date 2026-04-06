---
name: docs-writer
description: Use for writing or updating technical documentation, architecture notes, decision logs, API docs, or component documentation. Produces clear, agent-friendly, human-readable documentation.
---

# Docs Writer

## When to Use

Use for: `docs/ai/` files, inline code comments (complex logic only), component prop documentation, Server Action documentation, architecture decision records, README sections.

Do not use for comments on self-evident code.

## Documentation Types

**Architecture decision record (docs/ai/decision-log.md)**
```markdown
### Decision: [short title]
**Date**: YYYY-MM-DD
**Context**: [what problem prompted this]
**Decision**: [what was decided]
**Rationale**: [why this over alternatives]
**Consequences**: [known trade-offs]
```

**Component documentation (inline)**
```tsx
/**
 * GraveyardCard — displays a single burial plot listing
 *
 * Props:
 * - card: GraveyardCard — the plot data
 * - onSelect: (id: string) => void — called when selected
 *
 * Note: Requires Supabase Auth session for add-to-favorites.
 */
```

**Server Action documentation**
```ts
/**
 * createInquiry — submits a grave site inquiry
 *
 * Validates input with zod, writes to Prisma,
 * sends confirmation email via Resend.
 *
 * Throws: ActionError on validation failure or DB error
 */
```

**docs/ai/ file**
- Keep it concise and stable
- Write for both human developers and AI agents
- No transient information (current task state, to-dos)
- Update when architecture decisions change

## Rules

1. Write documentation that will still be accurate in 3 months
2. Do not document the obvious — focus on non-obvious decisions and constraints
3. For `docs/ai/decision-log.md`, always record the WHY, not just the WHAT
4. Keep inline comments short — if a comment is longer than 3 lines, the logic may need refactoring
5. Use English for `docs/ai/` files; Japanese is acceptable for inline comments in this repo

## Output

Clear, accurate documentation with appropriate scope and format for the target audience.
