# Enum wire parsing

## Rule

- Map wire strings into enhanced **`enum`**s with a **named `factory`** (e.g. `fromApi`), not a freestanding `static` helper or a manual `for` loop over `values`.
- **Preferred (JSON / DTO):** `values.firstWhere` with a **block-bodied** predicate and **`orElse`** when the enum has an **`unknown`** (or equivalent) sentinel — same shape as `fromJson` tolerance.
- **Multi-wire aliases:** hold tokens in **`List<String> apiValues`** and match with **trim + case-insensitive** compare inside the predicate (e.g. `element.apiValues.any((e) => e.toLowerCase() == raw.trim().toLowerCase())`).
- **Strict (rare):** `firstWhere` **without** `orElse` only when an invalid wire is a programmer error and the enum has **no** safe fallback constant.
- **Do not** use imperative `for` loops with `continue` on `unknown` — use `firstWhere` + `orElse` instead.

## References

- Pattern and examples: [`../../patterns/dart/enums-wire-parsing.md`](../../patterns/dart/enums-wire-parsing.md)
- Enum UI strings (`label`, `title`): [`enums-l10n.md`](enums-l10n.md)
