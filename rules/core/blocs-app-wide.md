# App-wide blocs and cubits

## Purpose

Scope for app-level **auth**, **language**, and similar blocs/cubits versus feature-local state. **Theme** is handled by **`ThemeNotifier`** — see [`theme.md`](theme.md).

## Fill when

- App-wide state ownership or registration changes.
- **`MyApp`** / **`BuilderScreen`** root routing rules or **`AppAuthenticationBloc`** events change.

## References (this repo)

- `lib/core/blocs/app_auth_bloc/` (`AppAuthenticationBloc`, events, states)
- `lib/core/blocs/language_cubit/` (`app_language_cubit.dart`, …)
- `lib/core/blocs/theme_notifier/` — documented under [`theme.md`](theme.md)
- `lib/my_app.dart` (`MultiBlocProvider`, `BuilderScreen`)

## Content

### Root shell (`MyApp` → `BuilderScreen`)

- **`MyApp`** registers app-wide providers (**`AppLanguageCubit`**, **`AppAuthenticationBloc`**, …) and builds **`MaterialApp`** with **`home: BuilderScreen`** (see [`theme.md`](theme.md) for theme/locale keys on **`MaterialApp`**).
- **`BuilderScreen`** is a **`BlocConsumer<AppAuthenticationBloc, AppAuthenticationState>`** that picks the **root page** (no named auth stack — state drives a single child):

| State | Root widget | Notes |
|--------|--------------|--------|
| **`AuthUninitialized`** | **`SizedBox()`** | Startup / **`AuthRestartEvent`** path until **`_startMainApp`** finishes. |
| **`AuthUnauthenticated`** | **`OnboardingPage`** | Walkthrough; completing or skipping fires **`OnFinishWalkThrowEvent`**. |
| **`AuthLogInPageState`** or **`AuthLogOutState`** | **`LoginPage`** | Login/register/OTP flows live under navigation from here. |
| **`AuthAuthenticatedState`** or **`GuestState`** (else branch) | **`MainPage`** | Logged-in or guest main shell. |

- **Listener**: on **`AuthLogOutState`**, **`AppStepsManager.getInstance.dispose()`** runs (cleanup when session ends from logout flow).

### `AppAuthenticationBloc`

- **Scope**: session lifecycle — **`AppStartedEvent`** restores auth from secure/cache use cases; **`AuthenticatedEvent`** reloads user from cache; **`LoggedOutEvent`** clears secure cache, clears FCM token helper, emits **`AuthLogOutState`**; **`AuthRestartEvent`** emits **`AuthUninitialized`** then re-runs the same startup path as app start; **`GuestEvent`** briefly uninitialized then **`GuestState`**; **`OnFinishWalkThrowEvent`** emits **`AuthLogInPageState`** (onboarding → login).
- **Dependencies**: **`GetIsUserAuthenticatedUseCase`**, **`DeleteAllSecureCacheUseCase`**, **`GetCachedUserUseCase`** (see bloc implementation for static **`getInstance`** vs injector usage).
- **Static helper**: **`AppAuthenticationBloc.of(context)`**.
- **Feature blocs** do not replace this; they compose under global auth state.

### Where events are typically fired (presentation)

- **`LoggedOutEvent`**: after successful logout API/cache clear — e.g. **`logout_bottom_sheet.dart`**, **`delete_account_bottom_sheet.dart`**, guest/unauthenticated sheets that sign out.
- **`AuthenticatedEvent`**: after OTP/login/register flows persist user — e.g. **`otp_page.dart`**, completion paths in register flows.
- **`OnFinishWalkThrowEvent`**: **`onboarding_page.dart`** (finish or skip).
- **`AuthRestartEvent`**: full auth + DI refresh when the app must re-resolve session after a global change — e.g. **`change_language_bottom_sheet.dart`** after language save (with **`AppLanguageCubit.changeLanguage`**).
- **`AppStartedEvent`**: from **`MyApp`** bloc creation and optionally **`splash_page.dart`** if used.

### `AppLanguageCubit`

- **Scope**: current **`AppLanguageEnum`**, RTL helpers (**`isArabic`**, **`isEnglish`**, **`isRtl`**), **`init()`** syncs from **`LocalizationContainer`** after **`init()`** on the container.
- **`changeLanguage`**: updates locale through **`LocalizationContainer.setLanguage`**, then **`resetDependenciesScope()`** (so scoped registrations match the new language), then emits — **single persistence path**; features must not write language prefs directly.
- **Emit safety**: override **`emit`** with **`if (!isClosed)`** (existing pattern in this cubit).
- **Strings / container**: see [`localization.md`](localization.md).

### Rules

- **Register app-wide blocs/cubits once** at the root (**`MultiBlocProvider`** in **`my_app.dart`**), not per-route unless the team explicitly scopes them.
- **Feature screens** read **`AppAuthenticationBloc` / `AppLanguageCubit`** via context — **do not duplicate** auth/language session logic in feature cubits.
