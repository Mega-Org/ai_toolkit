# Imports and analyzer policy

## Purpose

How Dart imports and analyzer expectations work in apps using this toolkit.

## Fill when

`analysis_options.yaml`, barrel files, or import style changes.

## References

- Part files: [`part-part-of.md`](part-part-of.md), [`../../patterns/dart/part-part-of-library.md`](../../patterns/dart/part-part-of-library.md)
- App exceptions: `ai_docs/conventions.md`

## Content

### Imports

- Prefer **package imports** (`package:<package_name>/...`) for cross-library references under `lib/`.
- Use **`part` / `part of`** only for large presentation splits; **`part of` paths are relative**, library file uses package imports elsewhere.
- Do not add barrel re-exports unless the app already uses that pattern for the feature.

### Analyzer

- Default verify command: the app's command from `ai_docs/conventions.md` (for example `make analyze`).
- Fix new diagnostics on **touched files** before handoff; do not drive-by clean unrelated warnings unless asked.
- Generated files (`*.g.dart`, `*.config.dart`, `app_localizations*.dart`) are excluded from agent edits and often from Cursor index (`.cursorignore`).
