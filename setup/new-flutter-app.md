# New Flutter app bootstrap

## Purpose

Checklist when creating a **new** app repo that will consume this toolkit.

## Fill when

App-seed templates or flavor scaffolding change.

## References

- Seed files: [`../templates/app-seed/`](../templates/app-seed/)
- Flavors: [`flavors.md`](flavors.md)

## Content

1. Add `ai_toolkit/` (submodule or vendored copy).
2. Copy [`../templates/app-seed/`](../templates/app-seed/) → app root (`AGENTS.md`, `CLAUDE.md`, `ai_docs/` stubs, `cursor-rules/core-digest.mdc` via install).
3. Run `bash ai_toolkit/setup/install.sh`. That install also sets up editor search exclusions in `.vscode/settings.json`.
4. Create `ai_specs/` from toolkit spec templates; wire Makefile snippet from app-seed.
5. Configure flavors (`lib/main_*.dart`, `lib/apps/`) per [`flavors.md`](flavors.md) and product matrix.
6. Set `ai_docs/conventions.md` shared widgets + verify command.
7. Run `bash ai_toolkit/setup/verify-setup.sh`.

When layout is unclear, follow `ai_docs/conventions.md` and mirror the existing `lib/core`, DI, and feature folder layout.
