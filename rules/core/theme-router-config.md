# Router and app config (non-theme)

## Purpose

Router helpers, app values (non-theme tokens), generated assets, and responsive root conventions. **Theming** (notifier, `AppTheme`, `AppColors`, `MaterialApp` theme wiring) lives in [`theme.md`](theme.md) — read that file for theme-only work.

## Fill when

- Routing APIs, `navigatorKey`, or transition helpers change.
- Non-theme values, assets getters, or `AppConstants` change.
- Responsive breakpoints at the app root change (see existing `MyApp` setup).

## References (this repo)

- `lib/core/config/router/` (`app_router.dart`, `animated_routes.dart`, …)
- `lib/core/config/values/` (`text_styles.dart`, `dimensions.dart`, `fonts.dart`, …) — **theme tokens and `AppColors`**: [`theme.md`](theme.md)
- Generated assets / `flutter_gen` as used by this project
- `lib/my_app.dart` (router key + responsive wrapper; theme details in [`theme.md`](theme.md))

## Content

### Router

- **Global key**: exposed on **`AppRouter`** (e.g. **`navigatorKey`**) — **`GlobalKey<NavigatorState>`** for navigation without a local **`BuildContext`** when needed.
- **`AppRouter`**: static helpers **`push`**, **`pushNamed`**, **`pop`**, **`popUntil`**, **`getCurrentRoute`** — use the accessors defined in this app’s router module.
- **Animated routes**: shared transition helpers live next to **`app_router.dart`** (`animated_routes.dart`).

### Values (non-theme)

- **`text_styles.dart`**, **`dimensions.dart`**, **`fonts.dart`**, etc. — shared layout and typography helpers; keep theme-dependent color usage aligned with **`AppColors`** / **`AppTheme`** per [`theme.md`](theme.md).
- **Responsive**: **`responsive_framework`** at the app root (`ResponsiveBreakpoints.builder` in **`my_app.dart`**).

### Generated assets

- **`flutter_gen`** output (e.g. **`assets.gen.dart`**) — import generated symbols (`Assets.*`) instead of raw path strings where the project uses codegen.

### Constants

- **`AppConstants`** (or equivalent) for non-API app-wide constants (feature flags, timing, UX).
