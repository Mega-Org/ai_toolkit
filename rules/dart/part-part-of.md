# Rule: `part` / `part of` (feature UI libraries)

## Must

- **Library file** holds every `package:` **import** and every **`part '…';`** directive; part files declare only **`part of`** (relative path to that library).
- **`part of`** uses a **relative** path to the library file — **never** `part of 'package:…/foo_page.dart';`.
- Part files **must not** add their own `import` lines (they share the library’s import scope).
- New screen splits use a **`widgets/`** folder and part order: **tokens → formatters → primitives → composites → sections** (see pattern doc for full dummy walkthrough).

## Must not

- Use `package:` URIs in `part of` (reserved for normal `import` on the library file only).
- Put `part` directives mid-file or after class declarations — keep them grouped after imports.
- Turn reusable widgets into parts when another feature needs them — use a normal library + `package:` import instead.

## References

- Pattern (self-contained examples): [`../../patterns/dart/part-part-of-library.md`](../../patterns/dart/part-part-of-library.md)
- Imports: [`../../patterns/dart/absolute-imports.md`](../../patterns/dart/absolute-imports.md) — relative paths allowed **only** for `part` / `part of`.
