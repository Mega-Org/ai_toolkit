# Theme, router, and config

## Purpose
Theme manager, router, app values, and generated assets conventions in core configs.

## Fill when
- When theming, routing, or global config patterns change.

## References
- flutter_base: `lib/core/configs/` (`router/`, `theme/`, `values/`, `responsive/`)
- vorma: `lib/core/config/router/`, `lib/core/config/theme/`, `lib/core/config/values/`

## Content

### Router

- **Global key**: **`appNavigatorKey`** (flutter_base) — **`GlobalKey<NavigatorState>`** for imperative navigation without context when needed.
- **`AppRouter`**: static helpers **`push`**, **`pushNamed`**, **`pop`**, **`popUntil`**, **`getCurrentRoute`**. **vorma** may expose **`navigatorKey`** on **`AppRouter`** — use the static accessors provided by **that** app.
- **Animated routes**: shared transition helpers live next to **`app_router.dart`** (`animated_routes.dart`).

### Theme

- **`AppTheme`** abstract type with **`LightTheme`** / **`DarkTheme`** concrete implementations under **`config(s)/theme/values/`** or sibling files.
- **Persistence**: **`ThemeRepository`** + impl reads/writes preference; **`ThemeManager`** / **`ThemeNotifier`** loads on **`initialize()`** and persists on **`changeTheme()`**.
- **Widgets**: **`ThemeBuilder`** / **`theme_checker_widget`** (varies) wrap subtree rebuilds when theme toggles.

### Values

- **`colors.dart`**, **`text_styles.dart`**, **`dimensions.dart`**, **`fonts.dart`** — design tokens; **`assets_getters.dart`** wraps **`Assets`** from codegen.
- **Responsive**: flutter_base includes **`AppScaledBox`** under **`configs/responsive/`** — use with **`responsive_framework`** at app root per existing setup.

### Generated assets

- **`flutter_gen`** output: **`assets.gen.dart`** — **import generated symbols** (`Assets.*`) instead of raw path strings where the project already uses codegen.

### Constants

- **`AppConstants`** for non-API app-wide constants (feature flags, timing, UX).
