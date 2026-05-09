# Theme (tokens, notifier, root wiring)

## Purpose

Document how this app resolves **light/dark `ThemeData`**, persists preference, exposes **semantic colors** via **`AppTheme`**, and rebuilds **`MaterialApp`** when theme or locale keys change. Use this file when changing **`ThemeNotifier`**, **`AppTheme`** implementations, **`AppColors`**, or root theme wiring in **`MyApp`**.

**Navigation** is covered in [`router.md`](router.md). **Spacing, typography helpers, flutter_gen aliases, and `AppConstants`** are covered in [`config.md`](config.md).

## Fill when

- `ThemeNotifier`, `ThemeRepository` / impl, `LightTheme` / `DarkTheme`, or `app_theme.dart` token surface changes.
- Root `MaterialApp` theme props or `ValueKey` strategy changes.
- **`AppTheme`** color/token surface or **`AppColors`** access pattern changes (the getter lives in **`config/values/colors.dart`** — see [`config.md`](config.md) for how the rest of the app imports it).
- User-facing **theme switch** flow changes (pop-to-root, **`AuthRestartEvent`** / guest handling) — see **`change_theme_dialog.dart`**.

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

### Theme change and navigation (product rule)

When the user **commits** a theme change from in-app UI (not startup **`initialize()`**), the stack should return to the **root route** so nested routes do not keep stale **`ThemeData`** / context-bound styling. The reference implementation is **`ChangeThemeDialog`** in **`change_theme_dialog.dart`**.

- **Same theme as current** (no-op): **`Navigator.of(context, rootNavigator: true).popUntil((route) => route.isFirst)`** — dismiss overlays/sheets and land on root without calling **`changeTheme`** again.
- **Theme actually changes** — after **`ThemeNotifier.instance.changeTheme`** completes and **`context.mounted`**:
  - **Guest** (**`GuestState`**): dispatch **`GuestEvent`** on **`AppAuthenticationBloc`** (guest shell refresh path used there).
  - **Otherwise**: **`popUntil((route) => route.isFirst)`** with **`rootNavigator: true`**, then **`AuthRestartEvent`** so session and tree align with the new theme (see [`blocs-app-wide.md`](blocs-app-wide.md)).
- New entry points that change theme (settings tiles, experiments) should **follow the same pattern** unless the team explicitly documents an exception: **pop to root** (or equivalent “clear overlay stack”) **+** the same **auth** side effects as **`ChangeThemeDialog`**, so behavior stays consistent with language change / auth restart expectations.

Imperative navigation details: [`router.md`](router.md).

### `AppTheme` and tokens

- **`AppTheme`** (in **`config/theme/app_theme.dart`**) defines **`ThemeData`**, semantic colors (text, primary, surfaces, etc.), and related getters used across the app.
- **`LightTheme`** / **`DarkTheme`** supply concrete **`ThemeData`** instances passed to **`MaterialApp.theme`** / **`darkTheme`**.
- Helpers **`getThemeColor`** / **`getGenericTheme`** in **`app_theme.dart`** branch on **`ThemeNotifier.instance.themeMode`** (including system brightness when relevant).

### `AppColors`

- **`lib/core/config/values/colors.dart`** ( **`part of core`** ) exposes **`AppColors`** as **`ThemeNotifier.instance.theme`** — i.e. the current **`AppTheme`** token object.
- Prefer **`AppColors.someToken`** (and theme-aware helpers above) over hard-coded **`Color(0x…)`** in UI that must respect light/dark. For **`Dimensions`**, **`TextStyles`**, and asset accessors used alongside colors, see [`config.md`](config.md).

### Root wiring (`MyApp`)

- **`ResponsiveBreakpoints.builder`** wraps the tree (see [`router.md`](router.md) for **`AppRouter`** / navigator); inside, **`ValueListenableBuilder`** listens to **`ThemeNotifier.instance`** and rebuilds when the theme changes.
- **`MaterialApp`**: **`navigatorKey`** is **`AppRouter.navigatorKey`**; **`themeMode`**, **`theme`**, **`darkTheme`** come from notifier + **`LightTheme`/`DarkTheme`**; **`key`** combines language code and theme hash so a **full subtree reset** happens when locale or theme changes (see also [`localization.md`](localization.md) for locale).
- Theme is **orthogonal** to **`AppAuthenticationBloc`**, except where product flows explicitly restart auth (e.g. some settings dialogs) — see [`blocs-app-wide.md`](blocs-app-wide.md).

### Rules

- **One** place to persist theme preference: **`ThemeRepository`** through **`ThemeNotifier`**.
- **Do not** fork light/dark **`ThemeData`** construction outside **`config/theme/`** unless migrating the whole pattern.
- Initialize theme **before** showing the app UI: **`app_config.dart`** awaits **`ThemeNotifier.instance.initialize()`**.
- **User-initiated theme change**: prefer **pop until root** (`rootNavigator: true`, **`route.isFirst`**) plus the **guest vs `AuthRestartEvent`** split above — do not leave a deep stack open across a full theme swap unless you have a reviewed alternative.
