# Theme (tokens, notifier, root wiring)

## Purpose

Document how this app resolves **light/dark `ThemeData`**, persists preference, exposes **semantic colors** via **`AppTheme`**, and rebuilds **`MaterialApp`** when theme or locale keys change. Use this file when changing **`ThemeNotifier`**, **`AppTheme`** implementations, **`AppColors`**, or root theme wiring in **`MyApp`**.

## Fill when

- `ThemeNotifier`, `ThemeRepository` / impl, `LightTheme` / `DarkTheme`, or `app_theme.dart` token surface changes.
- Root `MaterialApp` theme props or `ValueKey` strategy changes.
- `AppColors` or design-token access pattern changes.

## References (this repo)

- `lib/core/blocs/theme_notifier/theme_notifier.dart`
- `lib/core/config/theme/` (`app_theme.dart`, `light_theme.dart`, `dark_theme.dart`, `change_theme_dialog.dart`, `theme_checker_widget.dart` as applicable)
- `lib/core/domain/repository/theme_repository.dart`, `lib/core/data/repository/theme_repository_imp.dart`
- `lib/core/config/values/colors.dart` (`AppColors` getter)
- `lib/my_app.dart` (`ValueListenableBuilder` + `MaterialApp` theme fields)
- `lib/app_config.dart` (`ThemeNotifier.instance.initialize()` before `runApp`)

## Content

### `ThemeNotifier` (global UI state, not Bloc)

- **Singleton** `ChangeNotifier` implementing **`ValueListenable<AppTheme>`** — **`ThemeNotifier.instance`** (also callable as **`ThemeNotifier()`**).
- **Persistence**: **`ThemeRepository`** / **`ThemeRepositoryImp`**; **`initialize()`** loads saved theme (on failure keeps default **`DarkTheme`**).
- **`changeTheme`**: toggles light/dark or accepts an explicit **`AppTheme`**, persists, updates **`SystemChrome`** overlay style via **`_manageSystemUIOverlayStyle`**, then **`notifyListeners`**.
- **UI entry points**: e.g. **`change_theme_dialog.dart`** calls **`ThemeNotifier.instance.changeTheme`**; feature code should not duplicate persistence logic.

### `AppTheme` and tokens

- **`AppTheme`** (in **`config/theme/app_theme.dart`**) defines **`ThemeData`**, semantic colors (text, primary, surfaces, etc.), and related getters used across the app.
- **`LightTheme`** / **`DarkTheme`** supply concrete **`ThemeData`** instances passed to **`MaterialApp.theme`** / **`darkTheme`**.
- Helpers **`getThemeColor`** / **`getGenericTheme`** in **`app_theme.dart`** branch on **`ThemeNotifier.instance.themeMode`** (including system brightness when relevant).

### `AppColors`

- **`lib/core/config/values/colors.dart`** ( **`part of core`** ) exposes **`AppColors`** as **`ThemeNotifier.instance.theme`** — i.e. the current **`AppTheme`** token object.
- Prefer **`AppColors.someToken`** (and theme-aware helpers above) over hard-coded **`Color(0x…)`** in UI that must respect light/dark.

### Root wiring (`MyApp`)

- **`ResponsiveBreakpoints.builder`** wraps the tree; inside, **`ValueListenableBuilder`** listens to **`ThemeNotifier.instance`** and rebuilds when the theme changes.
- **`MaterialApp`**: **`themeMode`**, **`theme`**, **`darkTheme`** come from notifier + **`LightTheme`/`DarkTheme`**; **`key`** combines language code and theme hash so a **full subtree reset** happens when locale or theme changes (see also [`localization.md`](localization.md) for locale).
- Theme is **orthogonal** to **`AppAuthenticationBloc`**, except where product flows explicitly restart auth (e.g. some settings dialogs) — see [`blocs-app-wide.md`](blocs-app-wide.md).

### Rules

- **One** place to persist theme preference: **`ThemeRepository`** through **`ThemeNotifier`**.
- **Do not** fork light/dark **`ThemeData`** construction outside **`config/theme/`** unless migrating the whole pattern.
- Initialize theme **before** showing the app UI: **`app_config.dart`** awaits **`ThemeNotifier.instance.initialize()`**.
