---
name: commit-writer
description: Use for any commit task. Creates conventional commits with correct type, scope, subject, body, and AI attribution. Checks branch safety before committing.
---

# Commit Writer

## When to Use

Use whenever creating a git commit. Always apply before running `git commit`.

## Workflow

**Step 1 — Check branch**
```bash
git branch --show-current
```
If on `main` or `master`, create a feature branch first.

**Step 2 — Verify**
```bash
pnpm lint
pnpm build
```
Fix all errors before proceeding.

**Step 3 — Stage and commit**
```
<type>(<scope>): <subject>

<body — why, not what>

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `ref`, `perf`, `docs`, `test`, `build`, `ci`, `chore`

**Step 4 — Confirm**
```bash
git log -1
```

## Do / Don't

✅ Verify before committing
✅ Check branch first
✅ Include Co-Authored-By
❌ Never commit to `main` without instruction
❌ Never use `--no-verify`
