# App config: values, dimensions, typography, assets, constants

## Purpose

Shared **non-router** presentation constants: spacing and radii (**`Dimensions`**), typography (**`TextStyles`**, **`AppFonts`**), **semantic colors via `AppColors`** (theme-backed), **flutter_gen** asset accessors, and **`AppConstants`**. **`ThemeData`** construction and **`ThemeManager`** are in [`theme.md`](theme.md).

## Fill when

- `Dimensions`, `TextStyles`, `fonts.dart`, or token naming changes.
- `pubspec.yaml` asset globs or **`flutter_gen:`** output settings change.
- `assets_getters.dart` or generated **`assets.gen.dart`** conventions change.
- `AppConstants` (or equivalent) entries change.

## References (this repo)

- `lib/core/configs/values/dimensions.dart`
- `lib/core/configs/values/text_styles.dart`
- `lib/core/configs/values/fonts.dart` (`AppFonts`)
- `lib/core/configs/values/colors.dart` — **`AppColors`** getter (see [`theme.md`](theme.md) for meaning and when to use **`AppTheme`** helpers)
- `lib/core/configs/values/assets_getters.dart` — **`AppIcons`**, **`AppImages`**, **`AppIllustrations`**, etc., aliasing **`flutter_gen`** classes
- `lib/core/configs/values/assets.gen.dart` — **generated**; do not edit by hand
- `pubspec.yaml` — **`flutter_gen:`** block (`output: lib/core/configs/values/`)
- `lib/core/constants/app_constants.dart` — store URLs, defaults, timing, feature-ish literals that are not API models

## Content

### Importing from `core`

These files are typically **`part of core`** or exported through **`lib/core/core.dart`**. Prefer **`import 'package:flutter_base/core/core.dart';`** (or the project’s barrel) so **`Dimensions`**, **`TextStyles`**, **`AppColors`**, **`AppIcons`**, and **`AppConstants`** resolve consistently.

### `Dimensions` (spacing, radii, insets)

- **`Dimensions`** is a **`const` constructor–hidden** class with **`static const`** doubles and composed **`EdgeInsets`** (e.g. **`Dimensions.pageMargins`**).
- Use **`Dimensions.p16`**, **`Dimensions.r12`**, **`Dimensions.ic24`**, etc., for **padding, corner radius, icon box sizes**, and fixed heights (e.g. **`buttonHeight`**) instead of scattering raw numbers in widgets.
- When **`responsive_framework`** is used, prefer breakpoint-driven layout at the **widget** level; keep **`Dimensions`** for token values that stay stable across breakpoints unless you introduce responsive-specific tokens elsewhere.

### `TextStyles` and `AppFonts`

- **`TextStyles`** exposes pre-built **`TextStyle`** instances (light / regular / medium / bold families at sizes 8–24+). Combine with **`.copyWith(color: AppColors.text)`** (or other **`AppColors`** fields) so color stays theme-aware — see [`theme.md`](theme.md).
- **`AppFonts`** (in **`fonts.dart`**) holds **font family** names used by **`TextStyles`** and **`ThemeData`**; keep **`pubspec.yaml` `fonts:`** entries in sync when adding families.

### `AppColors` (getter)

- **`AppColors`** in **`colors.dart`** is **`ThemeManager.instance.theme`** — the live **`AppTheme`** token object for the current light/dark palette.
- Use **`AppColors`** for **semantic UI color** (text, primary, surfaces, errors). Do not reimplement the same getters on random widgets; if a new token is needed, add it on **`AppTheme`** in **`configs/theme/values/app_theme.dart`** (see [`theme.md`](theme.md)).
- **Do not** read colors by importing **`LightTheme` / `DarkTheme`** or raw **`ThemeData`** fields in feature widgets when **`AppColors`** already exposes the token — keep one indirection through the getter pattern this app uses.

### Asset getters (`AppIcons`, `AppImages`, …) — not generated classes

- **Feature and material code must use only the getters/constants defined in `assets_getters.dart`** (**`AppIcons`**, **`AppImages`**, **`AppIllustrations`**, **`AssetsPopularSitesIcons`**, etc.). Those aliases wrap **`flutter_gen`** output.
- **Do not** use the **generated** API directly in app code: no **`$AssetsIconsGen`**, **`$AssetsImagesGen`**, or other **`$Assets…Gen`** types, and no direct **`Assets.…`** (or equivalent) paths from **`assets.gen.dart`** in widgets, cubits, or routes. If a new asset is needed, add it under **`assets/`**, run codegen, then **expose a named getter or const on `assets_getters.dart`** and use that everywhere.
- **`assets.gen.dart`** exists for codegen and for **`assets_getters.dart`** to bind to — it is not an import target for features.

### flutter_gen (behind `assets_getters.dart`)

- **Config** (this repo): **`pubspec.yaml`** → **`flutter_gen:`** with **`output: lib/core/configs/values/`** so codegen writes **`assets.gen.dart`** next to **`assets_getters.dart`**.
- **Adding an asset**: place the file under **`assets/`** (or the tree your **`pubspec` `flutter: assets:`** globs include), ensure the glob covers it, then **regenerate** — do not paste new classes into **`assets.gen.dart`**.
- After codegen, **wire the new symbol only through `assets_getters.dart`** (new getter, const, or field on **`AppIcons` / `AppImages` / …**) so the rest of the app never imports **`assets.gen.dart`** directly.
- **Regenerate after asset or `flutter_gen` config changes**:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Equivalent if your toolchain still documents the older form:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Run from the **app repo root** (where **`pubspec.yaml`** lives). Fix **`pubspec`** / **`flutter_gen`** errors if codegen fails, then re-run.

### `AppConstants`

- Use **`AppConstants`** for **URLs**, shared **string defaults**, store links, and similar **non-theme** literals that many features need. Keep secrets and environment-specific values out of committed constants unless the repo already standardizes that elsewhere.

### Rules

- **Do not** hand-edit **`assets.gen.dart`**.
- **Do not** use raw asset path **strings** in UI when an **`assets_getters.dart`** entry exists or should be added for that file.
- **Do not** import or reference **generated** asset classes from **`assets.gen.dart`** in feature code — only **`assets_getters.dart`** getters (**`AppIcons`**, **`AppImages`**, …).
- Prefer **tokens** (**`Dimensions`**, **`TextStyles`**, **`AppColors`**) over magic numbers and inline **`TextStyle(...)`** duplicates.
