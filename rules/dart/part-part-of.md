## Agent card

**LOADMAP tags:** `parts`
**Read rest of this file:** no — this file is the full rule. Load the pattern for the dummy walkthrough.

### Must
- Library file holds every `package:` import and every `part '…';`. Parts declare only `part of` with a **relative** path.
- Part files must not add `import` lines. Group `part` directives after imports, before declarations.
- New screen splits: `widgets/` folder; order tokens → formatters → primitives → composites → sections.

### Must not
- `part of 'package:…/foo_page.dart'` (package URIs are for `import` only).
- Put `part` directives mid-file or after classes.
- Turn reusable cross-feature widgets into parts — use a normal library + `package:` import.

### When to load the rest
- References only.

### Related (cards first)
- `patterns/dart/part-part-of-library.md`; `+stepped` for step-switcher hosts.

### Card protocol
- Default: this card is enough. Use `limit: 60` so you do not ingest the full leaf.
- Read the rest of **this** file only when **Read rest** is yes, or **When to load the rest** matches.
- Do not open `INDEX.md`, `rules/_index.md`, or `patterns/_index.md` to rediscover this leaf.
- Related files: open their **Agent cards** first; skip them if the other tag was not requested.
- No `tests` tag. Do not write or run tests. Do not commit unless the user asks.
- Edit in place; do not rewrite the whole leaf to “clean it up.”
- If the body is a stub (`Fill in later`), stop after this card; do not invent policy.
- Indexes, templates, and untagged leaves are not part of this tag.
- Spec templates, skills, and backend-contract work belong to later plan todos — not this card.

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
