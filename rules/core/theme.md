# Theme (tokens, manager, root wiring)

## Purpose

Document how this app resolves **light/dark `ThemeData`**, persists preference, exposes **semantic colors** via **`AppTheme`**, and rebuilds **`MaterialApp`** when theme or locale keys change. Use this file when changing **`ThemeManager`**, **`AppTheme`** implementations, **`AppColors`**, **`ThemeBuilder`**, or root theme wiring in **`MyApp`**.

**Navigation** is covered in [`router.md`](router.md). **Spacing, typography helpers, flutter_gen aliases, and `AppConstants`** are covered in [`config.md`](config.md).

## Fill when

- `ThemeManager`, `ThemeRepository` / impl, `LightTheme` / `DarkTheme`, or `app_theme.dart` token surface changes.
- Root `MaterialApp` theme props or `ValueKey` strategy changes.
- **`AppTheme`** color/token surface or **`AppColors`** access pattern changes (the getter lives in **`configs/values/colors.dart`** — see [`config.md`](config.md) for how the rest of the app imports it).
- User-facing **theme switch** flow changes (pop-to-root, **`AuthRestartEvent`** / guest handling) — align with [`blocs-app-wide.md`](blocs-app-wide.md); this repo may add dialogs under `material/` or `src/` as needed.

## References (this repo)

- `lib/core/configs/theme/manager/theme_manager.dart` — **`ThemeManager`** singleton (`ChangeNotifier`, implements **`ValueListenable<AppTheme>`**)
- `lib/core/configs/theme/widgets/theme_builder.dart` — **`ThemeBuilder`** / **`ThemeCheckerWidget`**
- `lib/core/configs/theme/values/` — `app_theme.dart`, `light_theme.dart`, `dark_theme.dart`
- `lib/core/configs/theme/utils/theme_utils.dart` — helpers keyed off **`ThemeManager.instance.themeMode`**
- `lib/core/domain/repository/theme_repository.dart`, `lib/core/data/repository/theme_repository_impl.dart`
- `lib/core/configs/values/colors.dart` — **`AppColors`** top-level getter → **`ThemeManager.instance.theme`**
- `lib/my_app.dart` — **`ThemeBuilder`** wrapping **`MaterialApp`**; **`theme` / `darkTheme`** from **`LightTheme` / `DarkTheme`**

## Content

### `ThemeManager` (global UI state, not Bloc)

- **Singleton** **`ChangeNotifier`** — **`ThemeManager.instance`** (also **`ThemeManager()`** factory).
- **Persistence**: **`ThemeRepository`** / **`ThemeRepositoryImpl`**; **`initialize()`** loads saved theme (on failure the implementation keeps a default — see **`theme_manager.dart`**).
- **`changeTheme`**: toggles light/dark or accepts an explicit **`AppTheme`**, persists, updates **`SystemChrome`** overlay style, then **`notifyListeners`**.
- **Startup**: if you need persisted theme before first frame, **`await ThemeManager.instance.initialize()`** from **`main.dart`** (after **`WidgetsFlutterBinding.ensureInitialized()`**) before **`runApp`**. Wire this when product requires it; the manager already exposes **`initialize()`**.

### `ThemeBuilder`

- Wraps subtree with **`ValueListenableBuilder`** listening to **`ThemeManager.instance`** so **`MaterialApp`** (or children) rebuild when theme changes.
- **`MyApp`** uses **`ThemeBuilder`** around **`MaterialApp`** (together with language **`BlocBuilder`**).

### Theme change and navigation (product rule)

When the user **commits** a theme change from in-app UI, follow the same discipline as language change: **pop to root** where overlays would otherwise keep stale context, then session/DI refresh if your flow uses **`AuthRestartEvent`** (see [`blocs-app-wide.md`](blocs-app-wide.md)). This repo does not ship a canonical **`change_theme_dialog.dart`** in core; mirror patterns from **`change_language_bottom_sheet.dart`** when adding theme UI.

### `AppTheme` and tokens

- **`AppTheme`** (in **`configs/theme/values/app_theme.dart`**) defines semantic colors and related surface for **`ThemeData`**.
- **`LightTheme`** / **`DarkTheme`** supply concrete **`ThemeData`** instances passed to **`MaterialApp.theme`** / **`darkTheme`**.

### `AppColors`

- **`lib/core/configs/values/colors.dart`** (**`part of core`**) exposes **`AppColors`** as **`ThemeManager.instance.theme`**.
- Prefer **`AppColors.someToken`** over hard-coded **`Color(0x…)`** in UI that must respect light/dark. For **`Dimensions`**, **`TextStyles`**, and asset accessors, see [`config.md`](config.md).

### Root wiring (`MyApp`)

- **`ResponsiveBreakpoints.builder`** wraps the tree (see [`router.md`](router.md) for **`AppRouter`** / navigator).
- **`MaterialApp`**: **`navigatorKey`** is **`appNavigatorKey`** from **`AppRouter`**; **`themeMode`**, **`theme`**, **`darkTheme`** follow **`ThemeManager`** + **`LightTheme`/`DarkTheme`**; **`key`** combines language code and theme hash so a **full subtree reset** happens when locale or theme change (see [`localization.md`](localization.md) for locale).

### Rules

- **One** place to persist theme preference: **`ThemeRepository`** through **`ThemeManager`**.
- **Do not** fork light/dark **`ThemeData`** construction outside **`configs/theme/values/`** unless migrating the whole pattern.
- **Do not** fork **`AppColors`** / token reads in feature widgets when the token already exists on **`AppTheme`**.
