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

<!-- Fill in later. Leave empty if unknown. -->
