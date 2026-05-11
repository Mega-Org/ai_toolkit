# App config: values, dimensions, typography, assets, constants

## Purpose

Shared **non-router** presentation constants: spacing and radii (**`Dimensions`**), typography (**`TextStyles`**, **`AppFonts`**), **semantic colors via `AppColors`** (theme-backed), **flutter_gen** asset accessors, and **`AppConstants`**. **`ThemeData`** construction and **`ThemeManager`** are in [`theme.md`](theme.md). **`TextStyles`** usage rules — [`text-styles.md`](text-styles.md).

## Fill when

- `Dimensions`, `TextStyles`, `fonts.dart`, or token naming changes.
- `pubspec.yaml` asset globs or **`flutter_gen:`** output settings change.
- `assets_getters.dart` or generated **`assets.gen.dart`** conventions change.
- **`assets/icons/`** file naming conventions change (see [Icon files under `assets/icons/`](#icon-files-under-assetsicons)).
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
- `lib/core/constants/responsive_constants.dart` — **`AppResponsiveLayout`**: breakpoint widths and scaled-layout tiers for **`responsive_framework`** (see [Responsive layout](#responsive-layout-appresponsivelayout-responsive_framework))

## Content

### Importing from `core`

These files are typically **`part of core`** or exported through **`lib/core/core.dart`**. Prefer **`import 'package:tariq_alsamo/core/core.dart';`** (or the project’s barrel) so **`Dimensions`**, **`TextStyles`**, **`AppColors`**, **`AppIcons`**, and **`AppConstants`** resolve consistently.

### `Dimensions` (spacing, radii, insets)

- **`Dimensions`** is a **`const` constructor–hidden** class with **`static const`** doubles and composed **`EdgeInsets`** (e.g. **`Dimensions.pageMargins`**).
- Use **`Dimensions.p16`**, **`Dimensions.r12`**, **`Dimensions.ic24`**, etc., for **padding, corner radius, icon box sizes**, and fixed heights (e.g. **`buttonHeight`**) instead of scattering raw numbers in widgets.
- Use **`Dimensions`** for **design tokens** (spacing, radii, icon boxes). Use **`AppResponsiveLayout`** for **viewport breakpoints and scaled “design width” tiers** — not duplicate breakpoint numbers inside **`Dimensions`** unless you deliberately add responsive tokens there.

### Responsive layout (`AppResponsiveLayout`, `responsive_framework`)

- **`AppResponsiveLayout`** lives in **`lib/core/constants/responsive_constants.dart`** and is exported from **`lib/core/core.dart`**. It holds:
  - **`double`**s for **`Breakpoint`** ranges (mobile / tablet / desktop / 4K) wired in **`MyApp`** via **`ResponsiveBreakpoints.builder`**.
  - **`int`** tier edges for **`Condition.between`** (`start` / `end` must be **`int`** in this package) plus portrait/landscape **scaled widths** for **`AppScaledBox`** (**`ResponsiveScaledBox`** + **`ResponsiveValue`**).
- **Do not** paste raw breakpoint or scale literals into **`my_app.dart`** or **`app_scaled_box.dart`** — extend **`AppResponsiveLayout`** when tuning layout.
- **`Breakpoint`** uses **`double`**; **`Condition.between`** uses **`int`** for edges. When a boundary is the same value (e.g. `450`), keep the matching **`double`** and **`int`** constants numerically aligned (see comments in **`responsive_constants.dart`**).
- Feature UI should use **`ResponsiveBreakpoints.of(context)`** (and **`ResponsiveValue`** where appropriate) for adaptive layout; structure and file placement are described in [`patterns/flutter/responsive-and-layout.md`](../../patterns/flutter/responsive-and-layout.md).

### `TextStyles` and `AppFonts`

- **`TextStyles`** exposes pre-built **`TextStyle`** instances (light / regular / medium / bold families at sizes 8–40+). Combine with **`.copyWith(color: AppColors.text)`** (or other **`AppColors`** fields) so color stays theme-aware — see [`theme.md`](theme.md). Full usage rules, rationale, and naming — [`text-styles.md`](text-styles.md).
- **`AppFonts`** (in **`fonts.dart`**) holds **font family** names used by **`TextStyles`** and **`ThemeData`**; keep **`pubspec.yaml` `fonts:`** entries in sync when adding families.

### `AppColors` (getter)

- **`AppColors`** in **`colors.dart`** is **`ThemeManager.instance.theme`** — the live **`AppTheme`** token object for the current light/dark palette.
- Use **`AppColors`** for **semantic UI color** (text, primary, surfaces, errors). Do not reimplement the same getters on random widgets; if a new token is needed, add it on **`AppTheme`** in **`configs/theme/values/app_theme.dart`** (see [`theme.md`](theme.md)).
- **Do not** read colors by importing **`LightTheme` / `DarkTheme`** or raw **`ThemeData`** fields in feature widgets when **`AppColors`** already exposes the token — keep one indirection through the getter pattern this app uses.

### Asset getters (`AppIcons`, `AppImages`, …) — not generated classes

- **Feature and material code must use only the getters/constants defined in `assets_getters.dart`** (**`AppIcons`**, **`AppImages`**, **`AppIllustrations`**, **`AssetsPopularSitesIcons`**, etc.). Those aliases wrap **`flutter_gen`** output.
- **Do not** use the **generated** API directly in app code: no **`$AssetsIconsGen`**, **`$AssetsImagesGen`**, or other **`$Assets…Gen`** types, and no direct **`Assets.…`** (or equivalent) paths from **`assets.gen.dart`** in widgets, cubits, or routes. If a new asset is needed, add it under **`assets/`**, run codegen, then **expose a named getter or const on `assets_getters.dart`** and use that everywhere.
- **`assets.gen.dart`** exists for codegen and for **`assets_getters.dart`** to bind to — it is not an import target for features.

### Icon files under `assets/icons/`

These rules apply to **new** icons added under **`assets/icons/`** (vector or raster UI icons). Other trees (**`popular_sites_icons/`**, **`launcher_icon/`**, **`native_splash/`**, etc.) keep their own conventions unless this app standardizes them separately.

| Format | Filename rule |
|--------|----------------|
| **SVG** | **Must** be **`<name>_ic.svg`**: **`name`** is **snake_case**, ASCII **`a-z`**, **`0-9`**, **`_`** only (no spaces). Examples: **`home_ic.svg`**, **`chevron_right_ic.svg`**. |
| **PNG** | **Prefer** the same pattern: **`<name>_ic.png`** when the file is a **bitmap icon** (same role as an SVG icon). **May** use a different **snake_case** name only when it stays **clear and stable** (e.g. **`notification_badge_small.png`**) — avoid vague names like **`icon1.png`**. |

**Must-not**

- Do not omit the **`_ic`** suffix on **SVG** files in **`assets/icons/`**.
- Do not use **PascalCase**, **camelCase**, or **mixed-case** in filenames (flutter_gen and imports stay predictable with **snake_case**).

After adding or renaming files here, run codegen and expose symbols only through **`assets_getters.dart`** as usual.

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

### Splitting “magic numbers” across constant files

| Kind of number | Where it belongs |
|----------------|------------------|
| Padding, radius, icon size, fixed control heights | **`Dimensions`** |
| Semantic breakpoints + scaled layout tiers for **`responsive_framework`** | **`AppResponsiveLayout`** |
| URLs, store IDs, non-UI shared literals | **`AppConstants`** |
| API paths / keys | **`api_constants.dart`** (and related) |

### Rules

- **Do not** hand-edit **`assets.gen.dart`**.
- **Do not** use raw asset path **strings** in UI when an **`assets_getters.dart`** entry exists or should be added for that file.
- **Do not** import or reference **generated** asset classes from **`assets.gen.dart`** in feature code — only **`assets_getters.dart`** getters (**`AppIcons`**, **`AppImages`**, …).
- **New SVG icons** under **`assets/icons/`** must follow **`<name>_ic.svg`** (see [Icon files under `assets/icons/`](#icon-files-under-assetsicons)).
- Prefer **tokens** (**`Dimensions`**, **`TextStyles`**, **`AppColors`**) over magic numbers and inline **`TextStyle(...)`** duplicates.
