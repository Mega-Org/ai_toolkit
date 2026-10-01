# json_serializable models

## Purpose

Patterns for data models using `json_serializable`, generated `*.g.dart` files, and defaults—**not** Freezed unless you document an explicit exception under `rules/dart/` and here.

## Hand-written `fromJson` instead

If the DTO uses a **manual** `factory …fromJson` (no `.g.dart`), parse primitives with the shared rules in **[`manual-json-fromjson-primitives.md`](manual-json-fromjson-primitives.md)** (`int`, `String`, `double` / money).

## Fill when

- When serialization conventions or field naming rules change.

## References

- `rules/tooling/build-runner.md`
- Manual parsing: [`manual-json-fromjson-primitives.md`](manual-json-fromjson-primitives.md)

## Content

**Default:** hand-written `factory …fromJson` on feature DTOs — **not** `json_serializable` for new API models unless the feature already uses `.g.dart`. App exceptions belong in `ai_docs/conventions.md`.

Follow **[`manual-json-fromjson-primitives.md`](manual-json-fromjson-primitives.md)** (`int`/`String`/`double` via `.toString()` + `tryParse`).

When a model **does** use `@JsonSerializable`:

1. Keep annotations on the hand-written class file.
2. Run `dart run build_runner build --delete-conflicting-outputs`.
3. Commit `*.g.dart` with the model change; never edit generated parsing by hand.

Enums: wire parsing + l10n labels per [`../../rules/dart/enums-wire-parsing.md`](../../rules/dart/enums-wire-parsing.md) and [`../../rules/dart/enums-l10n.md`](../../rules/dart/enums-l10n.md).
