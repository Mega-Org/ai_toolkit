# Breaking changes notes

## Purpose

Track toolkit upgrades that affect Cursor skills, rules, or install scripts.

## Fill when

Shipping a toolkit release that overwrites `.cursor/` copies.

## References

- [`../CHANGELOG.md`](../CHANGELOG.md)
- [`../docs/migration/upgrading-ai-toolkit.md`](../docs/migration/upgrading-ai-toolkit.md)

## Content

### Lean loading (2026-10)

- **Always-on** rule is `core-digest.mdc` (replaces `ai-toolkit-seed`, `agent-decision-gates` as always-on).
- **LOADMAP** + phase `Load`/`Inputs`/`Touches` drive implement-phase/autopilot context.
- **`toolkit context <feature>`** prints resolved load sizes; **`verify-setup.sh`** warns on budget violations.
- Reinstall: `bash ai_toolkit/setup/install.sh` — review `git diff -- .cursor/skills .cursor/rules` before commit.

### 2.0.0

- Added autopilot skill, backend-contract skill, install scripts — see CHANGELOG `[2.0.0]`.
