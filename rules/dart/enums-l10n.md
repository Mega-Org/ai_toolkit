## Agent card

**LOADMAP tags:** `l10n`, `enums`
**Read rest of this file:** no — this file is the full rule (card covers it). Open the pattern only if you need copy-paste examples.

### Must
- Put user-facing enum strings (`title`, `label`, `tabTitle`, …) on the **enum body** as `String get …` switches.
- Read copy with `appLocalizer.yourKey` (core barrel). Prefer getters over zero-arg methods.
- Keep wire parsing (`fromApi`) orthogonal — see `enums-wire-parsing` card (`enums` tag).

### Must not
- Put localized copy on a separate `extension`.
- Take `AppLocalizations` or `BuildContext` as parameters on enum label APIs.
- Use `AppLocalizations.of(context)` inside enum definitions.
- Use `String tabTitle()` when `String get tabTitle` works.

### When to load the rest
- Almost never. Remaining lines are references only.

### Related (cards first)
- Pattern examples (untagged): `patterns/dart/enums-l10n.md` — load only if examples needed.
- `rules/dart/enums-wire-parsing.md` for JSON/`fromApi`.
- `rules/core/localization.md` for ARB and `appLocalizer`.

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

# Enum display strings (l10n)

## Rule

- Put **user-facing** enum strings (`title`, `label`, `tabTitle`, …) on the **enum body** as **`String get …`** switches — **not** on a separate **`extension`**.
- Read strings with **`appLocalizer.yourKey`** (from `package:tariq_alsamo/core/core.dart`). **Do not** take **`AppLocalizations`** or **`BuildContext`** as parameters on enum APIs for labels.
- **Do not** use **`AppLocalizations.of(context)`** inside enum definitions; enums are context-less domain/presentation helpers.
- Prefer **getters** over zero-arg methods (`String get tabTitle`, not `String tabTitle()`).
- **`extension`** on an enum is still fine for **non-l10n** behavior (assets, colors, wire helpers) when it keeps the enum file small — **not** for localized copy.

## References

- Pattern and examples: [`../../patterns/dart/enums-l10n.md`](../../patterns/dart/enums-l10n.md)
- Context-less `appLocalizer`: [`../core/localization.md`](../core/localization.md)
- Enum wire parsing (orthogonal): [`enums-wire-parsing.md`](enums-wire-parsing.md)
