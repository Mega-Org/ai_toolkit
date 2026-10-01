## Agent card

**LOADMAP tags:** `enums`
**Read rest of this file:** no — this file is the full rule. Open the pattern only for extra samples.

### Must
- Map wire strings with a named `factory` (e.g. `fromApi`) on the enum — not a freestanding static helper.
- Preferred: `values.firstWhere` with a **block-bodied** predicate and `orElse` → `unknown` (or equivalent).
- Multi-wire aliases: `List<String> apiValues`; trim + case-insensitive match in the predicate.

### Must not
- Imperative `for` + `continue` over `values` to skip `unknown`.
- Strict `firstWhere` without `orElse` unless invalid wire is a programmer error and there is no fallback.
- Mix l10n getters into this rule — labels are `enums-l10n`.

### When to load the rest
- References only.

### Related (cards first)
- Untagged: `patterns/dart/enums-wire-parsing.md` for samples.
- `rules/dart/enums-l10n.md` for UI strings.

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
