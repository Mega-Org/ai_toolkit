# App-wide blocs and cubits

## Purpose

Scope for app-level auth, language, and similar blocs/cubits versus feature-local state.

## Fill when

- When app-wide state ownership or registration changes.

## References

- `lib/core/blocs/` (`app_auth_bloc/`, `language_cubit/`, `theme_notifier/`)

## Content

### App authentication (`AppAuthenticationBloc`)

- **Scope**: session lifecycle — startup restore from secure storage, authenticated vs guest vs walkthrough/login routes, logout clearing cache.
- **Dependencies**: resolves **`GetIsUserAuthenticatedUseCase`**, **`DeleteAllSecureCacheUseCase`**, **`GetCachedUserUseCase`** via **`injector`**.
- **Static helpers**: **`of(context)`** via **`BlocProvider`**, **`getCurrentUser()`** for non-widget code paths.
- **Feature blocs** (e.g. a single form or list) **do not** replace this; they compose under the global auth state.

### Language (`AppLanguageCubit`)

- **Scope**: current **`AppLanguageEnum`**, RTL helpers, **`changeLanguage`** / **`changeLanguageLocally`**, sync with **`LocalizationContainer`**.
- **Uses `injector<LocalizationContainer>()`** for persistence and **`AppLanguageState`** with **`Async`** for loading/error surfaces when changing locale.
- **Emit safety**: override **`emit`** or use **`SafeEmitMixin`** per existing cubits in this repo.

### Theme (app-wide but not always a Bloc)

- **`ThemeNotifier`** — singleton **`ChangeNotifier`**, theme mode / **`AppTheme`**, uses **`ThemeRepositoryImp`**, **`initialize()`** on startup, theme changes update **`SystemChrome`** overlay style where wired. Treat as **global UI state** alongside Bloc; register/listen in **`MaterialApp`** / root similarly.

### Rules

- **Register app-wide blocs/cubits once** at the root (e.g. **`MultiBlocProvider`**), not per-route unless the team explicitly scopes them.
- **Feature screens** should read **`AppAuthenticationBloc` / `AppLanguageCubit`** via context or injected abstractions — **do not duplicate** auth/language logic in feature cubits.
