# 02 — Git Safety Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity

## Commit Rules

1. Always check current branch before committing: `git branch --show-current`
2. Never commit directly to `main` unless explicitly instructed.
3. Create a feature branch for all non-trivial work.
4. Use conventional commit format: `<type>(<scope>): <subject>`
5. Include `Co-Authored-By: Claude <noreply@anthropic.com>` in AI-generated commits.
6. Keep commit messages under 100 characters per line.

## Verification Before Commit

```bash
pnpm lint        # ESLint
pnpm build       # confirm build passes
```

## Branch Safety

- `main` is protected. Never force-push.
- Before destructive git operations, confirm with the user.
- Never use `--no-verify`.
