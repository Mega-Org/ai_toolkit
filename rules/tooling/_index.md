# Tooling rules index

## Purpose

Codegen, Makefile helpers, and local scripts referenced from LOADMAP and workflows.

## Fill when

New Makefile targets or codegen packages land in the app.

## References

- [`build-runner.md`](build-runner.md) (`+codegen` tag)
- App Makefile and `ai_docs/conventions.md`

## Content

| Topic | Doc | App command |
|-------|-----|---------------------|
| Injectable / DI codegen | [`build-runner.md`](build-runner.md) | `dart run build_runner build --delete-conflicting-outputs` |
| Static analysis | `ai_docs/conventions.md` | app command from `conventions.md` (for example `make analyze`) |
| l10n keys | [`../../docs/tooling/l10n-add.md`](../../docs/tooling/l10n-add.md) | `make l10n-add` |
| Toolkit install | [`../../setup/install.sh`](../../setup/install.sh) | `bash ai_toolkit/setup/install.sh` |
