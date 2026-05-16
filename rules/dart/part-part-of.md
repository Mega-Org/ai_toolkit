# Rule: `part` / `part of` (feature UI libraries)

## Must

- **Library file** holds every `package:` **import** and every **`part '…';`** directive; part files declare only **`part of`** (relative path to that library).
- **`part of`** uses a **relative** path to the library file — **never** `part of 'package:…/foo_page.dart';`.
- Part files **must not** add their own `import` lines (they share the library’s import scope).
- New screen splits follow the **order details** layout: `widgets/` parts, tokens → formatters → primitives → sections (see pattern doc).

## Must not

- Use `package:` URIs in `part of` (reserved for normal `import` on the library file only).
- Put `part` directives mid-file or after class declarations — keep them grouped after imports.
- Turn reusable widgets into parts when another feature needs them — use a normal library + `package:` import instead.

## Default reference implementation

`lib/src/features/orders/presentation/details/order_details_page.dart` (+ `widgets/order_details_ui_formatters.dart`).

## References

- Pattern: [`../../patterns/dart/part-part-of-library.md`](../../patterns/dart/part-part-of-library.md)
- Imports: [`../../patterns/dart/absolute-imports.md`](../../patterns/dart/absolute-imports.md) — relative paths allowed **only** for `part` / `part of`.
