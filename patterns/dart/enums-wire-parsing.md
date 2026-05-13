# Enum wire parsing (`String` ↔ enhanced `enum`)

## Purpose

Keep **API and persistence tokens** mapped into enhanced `enum` values in one **fixed shape**: wire field on constants, named **`factory`**, and **`values.firstWhere`** with a **block-bodied** predicate.

## Canonical factory (this repo)

**Always** use this structure for `fromApi` (and analogous factories): `firstWhere` with a block lambda comparing `element.<wireField>` to the input — **no `orElse`** on the enum so invalid tokens surface as **`StateError`** when a non-null, non-empty wire string is passed.

```dart
factory UserTypeEnum.fromApi(final String? platformRole) {
  return UserTypeEnum.values.firstWhere((element) {
    return element.value == platformRole;
  });
}
```

Optional: use **`final`** on the callback parameter (`(final UserTypeEnum element)`) when you want stricter style; both match this convention.

## Where defaults go

`firstWhere` without `orElse` throws for **`null`**, **empty string**, and **unknown** wire values. When a DTO or cache layer must tolerate missing keys or empty strings (for example legacy cache JSON), **normalize at that boundary** (guard with `if (raw == null || raw.isEmpty) return Enum.defaultCase`) and only then call **`EnumName.fromApi(nonEmptyRaw)`**.

Do **not** push `orElse` into the enum factory unless a product decision explicitly requires hiding `StateError` inside the enum.

## Naming

- **`fromApi`** — JSON / DTO fields (`platform_role`, …).
- A second **`fromString`** factory on the same enum is **optional** only when it adds a distinct contract; otherwise use a **private top-level** or **model-local** helper next to `fromJson` for cache/query-param shapes (see `lib/core/data/models/cache_user_model.dart`).

## Language note

Dart **enum factories cannot return** `UserTypeEnum?`. For “parse or null” semantics, use a **`static`** method (e.g. `tryParse`) **beside** the strict `factory`, not instead of it.

## References

- Rule (short): [`../../rules/dart/enums-wire-parsing.md`](../../rules/dart/enums-wire-parsing.md)
- In-repo examples: `lib/src/features/authentication/domain/enitiies/user_type_enum.dart`, `lib/config/environment_config.dart`, `lib/core/localization/app_language_enum.dart`
- Patterns index: [`_index.md`](_index.md)
