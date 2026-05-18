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
