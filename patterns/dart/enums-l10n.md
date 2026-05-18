# Enum display strings (`title`, `label`, …)

## When to use

Any enhanced **`enum`** that maps cases to **localized UI copy** (chips, tabs, sheet headers, filter labels, status pills).

## Preferred shape

1. Import **`package:tariq_alsamo/core/core.dart`** (for **`appLocalizer`**).
2. Add one **`String get …`** per semantic role (`label`, `title`, `tabTitle`, …).
3. **`switch (this)`** with an exhaustive case per enum value; each arm returns **`appLocalizer.<key>`**.
4. Add ARB keys under the feature section in **`app_en.arb`** / **`app_ar.arb`**; run gen-l10n — do not hand-edit generated l10n Dart.

```dart
import 'package:tariq_alsamo/core/core.dart';

enum StaticPageTypeEnum {
  aboutUs,
  termsAndConditions,
  privacyPolicy;

  /// Localized display title. Safe without [BuildContext] — uses [appLocalizer].
  String get title {
    switch (this) {
      case StaticPageTypeEnum.aboutUs:
        return appLocalizer.aboutUs;
      case StaticPageTypeEnum.termsAndConditions:
        return appLocalizer.termsAndConditions;
      case StaticPageTypeEnum.privacyPolicy:
        return appLocalizer.privacyPolicy;
    }
  }
}
```

```dart
enum OrderStatusEnum {
  pendingTransporterAcceptance('pending_transporter_acceptance'),
  // …
  unknown('unknown');

  const OrderStatusEnum(this.wireValue);
  final String wireValue;

  String get label {
    switch (this) {
      case OrderStatusEnum.pendingTransporterAcceptance:
        return appLocalizer.orderStatusPendingTransporterAcceptance;
      // …
      case OrderStatusEnum.unknown:
        return appLocalizer.orderStatusUnknown;
    }
  }
}
```

Call sites with **`BuildContext`** may still use **`AppLocalizations.of(context)`** directly on widgets; for enum-driven text, prefer **`myEnum.label`** / **`myEnum.title`** so the same string is available from cubits, formatters, and lists without threading context.

## Why `appLocalizer` on the enum

**`LocalizationContainer.setLocalizer`** runs from **`MaterialApp.builder`**, so **`appLocalizer`** tracks the active locale after language changes. That matches other context-less code (failures, toasts from services). See [`../../patterns/di/injectable-get-it.md`](../../patterns/di/injectable-get-it.md) ( **`TempLocalizationHolder`** / top-level getter).

## Do not

| Avoid | Prefer |
|--------|--------|
| `extension FooEnumL10n on FooEnum { String get label … }` | `String get label` on **`enum FooEnum`** |
| `String label(AppLocalizations l10n)` | `String get label` → **`appLocalizer.…`** |
| `String label(BuildContext context)` | **`appLocalizer`** (or **`AppLocalizations.of(context)`** only at the widget, not on the enum) |
| `String tabTitle()` method | `String get tabTitle` |
| Hardcoded Arabic/English in the switch | ARB keys via **`appLocalizer`** |

## Extensions (allowed elsewhere)

Use **`extension`** only for **non-copy** concerns, e.g. SVG paths or widget builders — see `lib/core/utils/popular_sites/popular_sites_enum.dart` (**`svgPath`**, **`iconWidget`**). Keep **titles/labels** on the enum.

## Wire parsing

API / persistence mapping (**`fromApi`**, **`wireValue`**, **`unknown`**) is separate — follow [`enums-wire-parsing.md`](enums-wire-parsing.md). The same enum file may define **both** wire factories and l10n getters.

## In-repo examples

- `lib/src/features/_common/domain/entity/menu/static_page_type_enum.dart` — **`title`**
- `lib/src/features/orders/domain/entity/order_status_enum.dart` — **`label`**
- `lib/src/features/complaints/domain/entity/complain_status_enum.dart` — **`tabTitle()`** (legacy method shape; new enums use a **getter**)

## References

- Rule: [`../../rules/dart/enums-l10n.md`](../../rules/dart/enums-l10n.md)
- Localization (when to use **`appLocalizer`** vs context): [`../../rules/core/localization.md`](../../rules/core/localization.md)
