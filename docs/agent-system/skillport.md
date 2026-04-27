# SkillPort Policy

## Purpose
Define repository-local policy for using SkillPort as a management, validation, search/discovery, lifecycle, and MCP delivery layer.
SkillPort is not the source of truth for skills.

## Placement
This policy belongs in `docs/agent-system/` inside each project repository.
Do not use global `~/.cursor` as the project source of truth.

## Responsibility
- `.agent/skills` remains canonical.
- `.agents/skills` is compatibility only and must be a symlink to `.agent/skills`.
- SkillPort manages discovery/validation/lifecycle/delivery workflows, not canonical skill ownership.

## When To Read
Read before:
- validating or importing skills,
- changing skill directories or compatibility links,
- enabling SkillPort MCP delivery,
- updating skill metadata or lifecycle state.

## Token Efficiency
- Use metadata-first discovery (`skillport list`, `skillport meta`, `skillport show <id>`).
- Load full `SKILL.md` only when task-relevant.
- Do not bulk-load all skills.
- Do not treat Shared Vault as always-loaded context.

## Directory Strategy
- Keep canonical skill content in `.agent/skills`.
- Keep `.agents/skills` as symlink compatibility only.
- Do not create `.agents/skills` as a real directory.
- Do not maintain parallel skill trees with duplicated content.

## Safe Commands
Read-only commands that are generally safe:

```bash
skillport --help
skillport list
skillport show <id>
skillport meta
skillport validate
```

## Commands Requiring Approval
Commands that can change repository state or sources:

```bash
skillport add ...
skillport remove ...
skillport update ...
skillport init ...
```

Also requires explicit approval:
- installing SkillPort tools,
- installing third-party skills from external sources.

Install commands (when approved):

```bash
uv tool install skillport
uv tool install skillport-mcp
```

## Forbidden Commands/Actions
- Do not use `npx` for SkillPort.
- Do not run `skillport doc` without explicit approval.
- Do not create `.agents/skills` as a real directory.
- Do not treat SkillPort as skill source-of-truth.
- Do not assume Shared Vault content is always loaded.

## Cursor MCP Example
Example launch flow (after approved install):

```bash
uvx skillport-mcp
```

SkillPort MCP should be used as a delivery/access layer, while canonical skill files stay in `.agent/skills`.

## Symlink Policy
- Required compatibility mapping: `.agents/skills -> ../.agent/skills` (or equivalent path from `.agents`).
- If `.agents/skills` exists and is not a symlink, stop and request migration approval.
- If symlink creation fails, stop and report.

## Stop Conditions
Stop and request explicit approval when:
- a command may write or restructure files unexpectedly,
- skill source ownership may shift away from `.agent/skills`,
- `.agents/skills` exists as a real directory,
- installing third-party skills is requested without approval,
- `skillport doc` is requested without approval,
- command behavior is unclear from help output.
