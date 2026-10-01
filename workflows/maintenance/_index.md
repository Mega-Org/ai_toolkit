# Workflows: Maintenance (`workflows/maintenance/`)

## Purpose

**Reactive work** on existing code: bugs, refactors, dependency upgrades, and selective asset normalization—not greenfield feature delivery.

## Contents

| File | Topic |
|------|--------|
| [`bugfix.md`](bugfix.md) | Lean loader + LOADMAP; persist `ai_specs/fixes/`; chat / QA / resume |
| [`refactor.md`](refactor.md) | Safe refactors with architecture context |
| [`dependency-upgrade.md`](dependency-upgrade.md) | Upgrade packages and resolve breakage |
| [`normalize-assets.md`](normalize-assets.md) | Rename scoped icons/images to app convention; write design `icons-catalog` / `images-catalog` |

## References

- Breaking-change notes: [`../../reference/breaking-changes-notes.md`](../../reference/breaking-changes-notes.md)
- Rules for touched domains: [`../../rules/_index.md`](../../rules/_index.md)
- Asset / flutter_gen rules: [`../../rules/core/config.md`](../../rules/core/config.md)
- Catalog templates: [`../../templates/design/icons-catalog.md`](../../templates/design/icons-catalog.md), [`../../templates/design/images-catalog.md`](../../templates/design/images-catalog.md)
- Workflow layout: [`../README.md`](../README.md)
