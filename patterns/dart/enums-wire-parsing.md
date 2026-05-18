# Enum wire parsing (`String` ↔ enhanced `enum`)

## Purpose

Keep **API and persistence tokens** mapped into enhanced `enum` values in one **fixed shape**: wire data on constants, named **`factory`**, and **`values.firstWhere`** with a **block-bodied** predicate.

## Canonical factory (JSON / DTO — preferred)

Use this for enums parsed from JSON fields, push payloads, and similar — especially when the enum defines **`unknown`** (or another safe fallback).

**Always** use `firstWhere` + **`orElse`**; **never** a manual `for` over `values` with `continue` on `unknown`.

```dart
enum NotificationTypeEnum {
  public(['public_notification']),
  order(['order_notification', 'invoice_notification']),
  wallet(['wallet_notification']),
  admin(['admin_notification']),
  unknown([]);

  const NotificationTypeEnum(this.apiValues);

  final List<String> apiValues;

  factory NotificationTypeEnum.fromApi(final String raw) {
    return NotificationTypeEnum.values.firstWhere((element) {
      return element.apiValues.any(
        (e) => e.toLowerCase() == raw.trim().toLowerCase(),
      );
    }, orElse: () => NotificationTypeEnum.unknown);
  }
}
```

- **Trim + case-insensitive** compare on the wire input and each alias.
- **`apiValues`**: one enum case may accept **multiple** backend strings (legacy aliases).
- **Empty / unknown wire:** no match → `orElse` returns **`unknown`** (no separate empty guard required in the factory).

Single wire field per case — same shape, compare `element.value` (or `wire`) instead of `apiValues.any`:

```dart
factory ExampleEnum.fromApi(final String raw) {
  return ExampleEnum.values.firstWhere((element) {
    return element.value.toLowerCase() == raw.trim().toLowerCase();
  }, orElse: () => ExampleEnum.unknown);
}
```

Call from `fromJson` inline:

```dart
type: NotificationTypeEnum.fromApi((json['type'] ?? '').toString()),
```

## Strict factory (no safe fallback)

Use **`firstWhere` without `orElse`** only when invalid wire values must throw **`StateError`** (contract enforced by API, not user data).

```dart
factory UserTypeEnum.fromApi(final String? platformRole) {
  return UserTypeEnum.values.firstWhere((element) {
    return element.value == platformRole;
  });
}
```

When **`null` / empty** must map to a default without throwing, either guard **before** `fromApi` or use a dedicated factory with **`orElse`** (preferred for notification/order-style enums).

## Naming

- **`fromApi`** — JSON / DTO fields (`type`, `platform_role`, …).
- A second **`fromString`** factory on the same enum is **optional** only when it adds a distinct contract; otherwise use a **private top-level** or **model-local** helper next to `fromJson` for cache/query-param shapes.

## Language note

Dart **enum factories cannot return** `EnumName?`. For “parse or null” semantics, use a **`static`** method (e.g. `tryParse`) **beside** the `factory`, not instead of it.

## Anti-patterns

```dart
// wrong — manual loop; use firstWhere + orElse instead
for (final NotificationTypeEnum element in NotificationTypeEnum.values) {
  if (element == NotificationTypeEnum.unknown) continue;
  if (element.apiValues.contains(wire)) return element;
}
return NotificationTypeEnum.unknown;
```

## References

- Rule (short): [`../../rules/dart/enums-wire-parsing.md`](../../rules/dart/enums-wire-parsing.md)
- Enum UI strings: [`enums-l10n.md`](enums-l10n.md)
- In-repo examples: `lib/src/features/notifications/domain/enums/notification_type_enum.dart`, `lib/src/features/authentication/domain/enitiies/user_type_enum.dart` (strict)
- Patterns index: [`_index.md`](_index.md)
