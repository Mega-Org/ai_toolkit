# Typography (`TextStyles`)

## Purpose

Define how this app uses **`TextStyles`** in **`lib/core/configs/values/text_styles.dart`** (`part of core`): the shared **font family**, **size**, and **weight** scale for UI copy. Use this file when adding tokens, styling **`Text`**, or aligning typography with **`ThemeData`**.

**Spacing and dimensions** — [`config.md`](config.md). **Semantic colors** — [`theme.md`](theme.md), [`app-theme-color-tokens.md`](app-theme-color-tokens.md).

## Key paths

| Area | Path |
|------|------|
| Typography tokens | `lib/core/configs/values/text_styles.dart` — **`abstract class TextStyles`** |
| Barrel import | `lib/core/core.dart` — prefer **`import 'package:flutter_base/core/core.dart';`** (or this repo’s package name) |
| Font family constant | `AppFonts` (typically `fonts.dart`, **`part of core`**) |
| Theme wiring | `lib/core/configs/theme/values/light_theme.dart`, `dark_theme.dart` — **`InputDecorationTheme`**, **`AppBarTheme.titleTextStyle`**, **`TooltipTheme`**, etc. |

## Why prefer `TextStyles`

1. **Single scale** — One named ladder (`regular14`, `medium16`, …) matches design reviews and refactors; avoids scattered magic **`fontSize`** / **`fontWeight`** pairs.
2. **Consistent font** — **`AppFonts.elMessiri`** is set on every token; **`copyWith`** should not re-specify **`fontFamily`** unless intentionally overriding.
3. **Aligned with theme** — **`LightTheme` / `DarkTheme`** build **`ThemeData`** fragments from **`TextStyles.*`** (hints, labels, app bar titles). Widgets that use the same tokens stay visually aligned with Material chrome.
4. **Shared widgets** — **`AppButton`**, **`AppTextFormField`**, and other **`material/`** defaults assume **`TextStyles`** as baselines.
5. **Maintainability** — Global typography tweaks stay in **`text_styles.dart`** (and theme files), not across hundreds of widgets.

Prefer **`TextStyles` + `copyWith(color: …)`** over ad-hoc **`TextStyle(fontSize: …)`** in feature and **`material/`** UI unless there is a documented exception (e.g. temporary debug).

## How to use

1. **Pick the nearest token** — Match Figma (or spec) **size + weight** to **`light*`** / **`regular*`** / **`medium*`** / **`semiBold*`** / **`bold*`**. Snap to the closest step; avoid one-off sizes unless adding a new stable token (see below).

2. **Apply color with `copyWith`** — Tokens do not encode semantic color:

   ```dart
   TextStyles.medium16.copyWith(color: AppColors.text)
   ```

   Use **`AppColors`** / **`AppTheme`** fields (via **`ThemeManager`**) so light/dark stays consistent — see [`theme.md`](theme.md).

3. **Do not duplicate `fontFamily`** on every **`Text`** unless overriding the family.

4. **`Theme.of(context).textTheme`** — Acceptable when inheriting Material component defaults (e.g. some built-in titles). For **explicit** labels, buttons, hints, and marketing copy, use **`TextStyles`** so the app stays on one scale.

## Naming convention

Pattern: **`{weightLabel}{fontSize}`** (e.g. **`medium16`** → **`FontWeight.w500`**, size **16**).

| Prefix | Typical `FontWeight` |
|--------|----------------------|
| **`light`** | `w300` |
| **`regular`** | `w400` |
| **`medium`** | `w500` |
| **`semiBold`**, **`bold`** | `w700` in code (naming is product-facing; see **`text_styles.dart`** for exact weights) |

New tokens must follow the same scheme and live only in **`text_styles.dart`**.

## When to add a new entry vs reuse

- **Reuse** if an existing size/weight is within about **1 logical step** of the design — snap to the scale.
- **Add** only when design introduces a **reusable** step used in multiple places. Avoid promoting one-off sizes into **`TextStyles`** until they repeat.

When adding a token, consider updating **`LightTheme` / `DarkTheme`** if it replaces duplicated **`TextStyle`** construction there.

## Integration checklist

- [ ] No stray **`fontSize:`** / **`fontWeight:`** in UI without mapping to a **`TextStyles`** token or a documented exception.
- [ ] Colors applied via **`copyWith(color: …)`**, not a full new **`TextStyle(...)`** from scratch (unless Material demands it).
- [ ] **`pubspec.yaml`** **`fonts:`** stays in sync when **`AppFonts`** changes — see [`config.md`](config.md).

## References

- [`config.md`](config.md) — **`Dimensions`**, **`AppFonts`**, import surface.
- [`theme.md`](theme.md) — **`ThemeManager`**, **`AppColors`**, **`ThemeData`**.
- [`localization.md`](localization.md) — strings from **`AppLocalizations`** / **`appLocalizer`**; **`TextStyles`** handle geometry only.
