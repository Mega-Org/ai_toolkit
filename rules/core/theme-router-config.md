# Theme, router, and config

## Purpose

Theme notifier, router, app values, and generated assets conventions in core config.

## Fill when

- When theming, routing, or global config patterns change.

## References

- `lib/core/config/router/`, `lib/core/config/theme/`, `lib/core/config/values/`

## Content

### Router

- **Global key**: exposed on **`AppRouter`** (e.g. **`navigatorKey`**) — **`GlobalKey<NavigatorState>`** for imperative navigation without context when needed.
- **`AppRouter`**: static helpers **`push`**, **`pushNamed`**, **`pop`**, **`popUntil`**, **`getCurrentRoute`** — use the accessors defined in **this** app’s router module.
- **Animated routes**: shared transition helpers live next to **`app_router.dart`** (`animated_routes.dart`).

### Theme

- **`AppTheme`** abstract type with **`LightTheme`** / **`DarkTheme`** concrete implementations under **`config/theme/`** / **`values/`** or sibling files.
- **Persistence**: **`ThemeRepository`** + **`ThemeRepositoryImp`** reads/writes preference; **`ThemeNotifier`** loads on **`initialize()`** and persists on theme change.
- **Widgets**: **`ThemeBuilder`** / **`theme_checker_widget`** (names vary) wrap subtree rebuilds when theme toggles.

### Values

- **`colors.dart`**, **`text_styles.dart`**, **`dimensions.dart`**, **`fonts.dart`** — design tokens; **`assets_getters.dart`** wraps **`Assets`** from codegen.
- **Responsive**: this app uses **`responsive_framework`** at the app root (e.g. **`ResponsiveBreakpoints.builder`**) per existing **`MaterialApp`** setup.

### Generated assets

- **`flutter_gen`** output: **`assets.gen.dart`** — **import generated symbols** (`Assets.*`) instead of raw path strings where the project already uses codegen.

### Constants

- **`AppConstants`** for non-API app-wide constants (feature flags, timing, UX).
