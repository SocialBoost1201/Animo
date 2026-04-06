# Handoff Protocol

> For the handoff workflow, use `.claude/skills/handoff-flow/SKILL.md`

## Standard Handoff Checklist

Before handing off:
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes (or failures documented)
- [ ] No uncommitted changes that should be committed
- [ ] Active skills listed
- [ ] Next steps documented

## Re-entry Protocol

1. Read handoff note
2. Run `pnpm lint && pnpm build`
3. Check `git status`
4. Load core skills only to start
5. Verify state independently — do not assume previous agent's context
