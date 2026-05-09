# Core barrel and part files

## Purpose

When `core.dart` uses `part` directives and exports; what belongs in the barrel versus feature modules.

## Fill when

- When barrel structure or export policy for core changes.

## References

- `lib/core/core.dart`

## Content

### Library shape

- **`core.dart` is a single `library core`** that aggregates most cross-cutting code via **`part '…'`** files, not only `export`s.
- **Selective `export`**: use explicit `export` only for types that must be visible **without** importing the part file path (e.g. `export 'localization/app_language_enum.dart'` so enums stay addressable from outside the barrel’s `part` graph if needed).

### What is a `part of core`

- **Foundation-style (`foundation/`)**: `async.dart`, `i_use_case.dart`, `safe_emit_mixin.dart`, `typedef.dart`.
- **Network**: dio helper, interceptors, errors, mappers — all `part of core` so they share private imports from the library directive block.
- **Blocs/cubits**: app auth, language — typically `part of core` for access to `injector`, `appLocalizer`, shared types.
- **Configs**: theme pieces, router, dimensions — often `part of core` when they reference navigator keys, theme classes, or core types inline.

### What stays outside `part` (separate libraries)

- **`di/di.dart`**: standalone import; initializes GetIt / injectable. Not usually a `part of core` so startup can import DI without pulling the entire core surface.
- **Generated code**: `di.config.dart`, `assets.gen.dart`, `*.g.dart` — imported where needed; do not hand-edit generated files.

### Rules for agents

- **New cross-cutting type that must see `injector`, `Failure`, `AppLocalizations`**: prefer adding a **`part`** under `core.dart` and listing it in the barrel’s ordered `part` list (match existing grouping comments).
- **Feature-only UI or domain**: keep under **`lib/src/...`** (or the app’s feature layout) — do not grow `core.dart` for one screen.
- **Avoid circular imports**: if a file cannot be `part of core` without cycles, extract an interface to `domain/` or use **injectable + constructor injection** instead of importing heavy `core.dart` from a leaf feature.

### Barrel organization

- Group related **`part`** files with section comments (`// Foundation`, `// Network`, …) and follow **this app’s** ordering when adding new parts.
