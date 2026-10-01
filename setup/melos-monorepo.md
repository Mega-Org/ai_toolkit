# Melos monorepo

## Purpose

Document when Melos applies — a single Flutter app is not a Melos workspace.

## Fill when

This org adds a Melos monorepo that shares `ai_toolkit/`.

## References

- [`per-app-integration.md`](per-app-integration.md)

## Content

- **Single app:** one `pubspec.yaml` at repo root and no `melos.yaml`. Skip Melos. Confirm in `ai_docs/conventions.md` when the app differs.
- **Future monorepo:** pin one `ai_toolkit/` at repo root; run `install.sh` from each app package or centralize `.cursor/` at root per team policy.
- Submodule `toolkit` CLI still manages `ai_toolkit/` pointer from the app that owns the submodule.
