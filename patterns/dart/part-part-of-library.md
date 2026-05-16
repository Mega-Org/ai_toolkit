# Dart `part` / `part of` library (feature UI)

## Purpose

Split a **large presentation surface** (route page, main tab shell) into multiple files while keeping **one import surface** and **shared private symbols** across parts. Canonical example: [`order_details_page.dart`](../../../../lib/src/features/orders/presentation/details/order_details_page.dart).

## When to use

| Use `part` libraries | Prefer separate libraries instead |
|----------------------|-----------------------------------|
| One route with many private widgets/helpers tied to that screen | Reusable widgets imported by multiple features |
| Screen-local formatters, tokens, row primitives | Domain/data/cubit layers (unless cubit+state pair — see below) |
| Keeping `_PrivateView` and section widgets in one private scope | `core.dart`-style app barrels (use a **named library** — different doc) |

## Library file (the `part` host)

1. **All `package:` imports** live only on the library file (see [`absolute-imports.md`](absolute-imports.md)).
2. Declare **`part` directives** immediately after imports, before the first declaration.
3. Use **relative paths** from the library file to each part file (same as `order_details_page.dart` lines 19–31).

```dart
import 'package:flutter/material.dart';
// … all package imports …

part 'widgets/order_details_design_tokens.dart';
part 'widgets/order_details_ui_formatters.dart';
part 'widgets/order_details_section_shell.dart';
// … more parts …

class OrderDetailsPage extends StatelessWidget { /* … */ }
```

## Part files (`part of`)

1. First line only: **`part of`** back to the library, with a **relative path** (not `package:`).

```dart
part of '../order_details_page.dart';
```

2. **No `import` lines** in part files — they inherit the library’s imports.
3. Prefer a **`widgets/`** subfolder under the screen folder for part files (keeps the library file readable).

### `part of` path cheat sheet

| Part file location | `part of` line |
|--------------------|----------------|
| `details/widgets/foo.dart` → `details/order_details_page.dart` | `part of '../order_details_page.dart';` |
| `menu/client_menu_scroll_body.dart` → `menu/client_menu_page.dart` (sibling) | `part of 'client_menu_page.dart';` |
| `main_page/widgets/bar.dart` → `main_page/client_main_page.dart` | `part of '../client_main_page.dart';` |

## Recommended part order

Order `part` directives on the library file **bottom-up** (dependencies first):

1. **Design tokens** — colors, radii used only on this screen (`order_details_design_tokens.dart`).
2. **UI formatters** — `intl`, date/money/label helpers (`order_details_ui_formatters.dart`).
3. **Primitives** — rows, shells, small stateless building blocks.
4. **Composites** — cards that compose primitives.
5. **Sections** — larger screen sections.

Parts may call top-level functions and constants from earlier parts in the same library (e.g. sections calling `formatOrderPlacedAt` from the formatters part).

## UI formatters part (default)

Extract **screen-local formatting** into a dedicated part file (not inline in the page or scattered in widgets):

```dart
part of '../order_details_page.dart';

String formatOrderPlacedAt(final DateTime at) {
  final String date = intl.DateFormat('d/M/yyyy', getLocale.languageCode).format(at);
  return '$date   ${at.toHHMMa}';
}
```

- Top-level functions (no class wrapper unless many related helpers).
- Use **`getLocale`** / **`appLocalizer`** from the library imports — do not re-import `intl` in every part unless the library already imports it once.

## Naming

- Library file: `<feature>_<screen>_page.dart` or `<feature>_main_page.dart`.
- Parts: `<screen>_<role>.dart` under `widgets/` (e.g. `order_details_prices_section.dart`).
- Prefix public widgets with the screen name when they are only used inside this library (`OrderDetailsPricesSection`).

## Related patterns (exceptions)

| Pattern | `part of` style |
|---------|-----------------|
| Cubit + state/event parts | `part of 'feature_cubit.dart';` (sibling file, same folder) |
| `core.dart` / `app_pagination.dart` | `part of core;` / `part of app_pagination;` (library **name**, not a path) |
| Generated `*.g.dart` / `*.freezed.dart` | Follow generator output |

## References

- Rule: [`../../rules/dart/part-part-of.md`](../../rules/dart/part-part-of.md)
- Imports: [`absolute-imports.md`](absolute-imports.md)
- Page shell: [`../flutter/page-bloc-provider.md`](../flutter/page-bloc-provider.md)
