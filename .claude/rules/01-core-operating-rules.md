# 01 — Core Operating Rules

> Repo: Animo | Applies to: Claude Code, Codex, Antigravity

## Operating Principles

1. Read the file before editing it. Never infer contents.
2. Make the smallest correct diff. Do not clean up surrounding code unless asked.
3. Verify output before claiming completion. File existence + correct content = done.
4. Stop and report when instructions are unclear, materials are missing, or an error blocks progress. Do not guess.
5. Preserve existing structure. Improve without breaking conventions.
6. No scope drift.

## Implementation Flow

```
Analysis → Plan → Approval → Execution → Verification
```

Execution is locked until the user provides explicit approval.
Valid: "Proceed", "OK", "Go ahead", "承認", "実行して", "進めて"

## Completion Requirements

A task is complete only when:
- Full paths of modified files are listed
- Actual diff is shown (before/after or patch format)
- Verification commands were run and output is shown
- Scope compliance is confirmed

## Failure Conditions

- Completion without verification evidence
- Scope exceeded without approval
- User-specified materials not used
- Skill usage report omitted
- Implementation started before approval
