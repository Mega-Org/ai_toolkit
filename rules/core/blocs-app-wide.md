# App-wide blocs and cubits

## Purpose

Scope for app-level **auth**, **language**, and similar blocs/cubits versus feature-local state. **Theme** is handled by **`ThemeManager`** + **`ThemeBuilder`** — see [`theme.md`](theme.md).

## Fill when

- App-wide state ownership or registration changes.
- **`MyApp`** / **`_BuilderScreen`** root routing rules or **`AppAuthenticationBloc`** events change.

## References (this repo)

- `lib/core/blocs/app_auth_bloc/` (`AppAuthenticationBloc`, events, states)
- `lib/core/blocs/language_cubit/` (`app_language_cubit.dart`, …)
- `lib/core/configs/theme/manager/theme_manager.dart` — documented under [`theme.md`](theme.md)
- `lib/my_app.dart` (`MultiBlocProvider`, `_BuilderScreen`)

## Content

### Root shell (`MyApp` → `_BuilderScreen`)

- **`MyApp`** wraps the tree with **`ResponsiveBreakpoints`**, then **`MultiBlocProvider`** (currently registers **`AppLanguageCubit`** — add **`AppAuthenticationBloc`** here if it is not provided higher in the tree). **`MaterialApp.home`** is **`_BuilderScreen`** (see [`theme.md`](theme.md) for theme/locale keys on **`MaterialApp`**).
- **`_BuilderScreen`** is a **`BlocConsumer<AppAuthenticationBloc, AppAuthenticationState>`** that picks the **root page** (state drives a single child). **Ground truth today** in `my_app.dart` (commented placeholders may differ from your product shell):

| State | Root widget (current `my_app.dart`) | Typical product mapping |
|--------|-------------------------------------|---------------------------|
| **`AuthUninitialized`** | **`SizedBox()`** | Empty shell until startup finishes. |
| **`AuthUnauthenticated`** | **`SizedBox()`** (onboarding route commented out) | **`OnboardingPage`**; finish/skip → **`OnFinishWalkthroughEvent`**. |
| **`AuthLogInPageState`** or **`AuthLogOutState`** | **`SizedBox()`** (login route commented out) | Login/register shell. |
| **`AuthAuthenticatedState`**, **`GuestState`**, or other authenticated branches | **`MainPage`** | Logged-in or guest main shell. |

- **`AppAuthenticationBloc`** must exist above **`_BuilderScreen`** in the widget tree wherever **`BlocConsumer`** is used.

### `AppAuthenticationBloc`

- **Scope**: session lifecycle — **`AppStartedEvent`** restores auth from secure/cache use cases; **`AuthenticatedEvent`** reloads user from cache; **`LoggedOutEvent`** clears secure cache, emits **`AuthLogOutState`**; **`AuthRestartEvent`** emits **`AuthUninitialized`** (call **`AppStartedEvent`** again from splash/bootstrap when you need a full re-run); **`GuestEvent`** → **`GuestState`**; **`OnFinishWalkthroughEvent`** emits **`AuthLogInPageState`** (onboarding → login).
- **Dependencies**: **`GetIsUserAuthenticatedUseCase`**, **`DeleteAllSecureCacheUseCase`**, **`GetCachedUserUseCase`** (see bloc implementation for static **`getInstance`** vs injector usage).
- **Static helper**: **`AppAuthenticationBloc.of(context)`**.
- **Feature blocs** do not replace this; they compose under global auth state.

### Where events are typically fired (presentation)

- **`LoggedOutEvent`**: after successful logout API/cache clear — e.g. **`logout_bottom_sheet.dart`**, **`delete_account_bottom_sheet.dart`**, guest/unauthenticated sheets that sign out.
- **`AuthenticatedEvent`**: after OTP/login/register flows persist user — e.g. **`otp_page.dart`**, completion paths in register flows.
- **`OnFinishWalkthroughEvent`**: **`onboarding_page.dart`** (finish or skip).
- **`AuthRestartEvent`**: full auth + DI refresh when the app must re-resolve session after a global change — e.g. **`change_language_bottom_sheet.dart`** after language save (with **`AppLanguageCubit.changeLanguage`**).
- **`AppStartedEvent`**: typically from **`splash_page.dart`** or equivalent bootstrap — ensure something dispatches it after **`AuthRestartEvent`** if you rely on automatic re-init.

### `AppLanguageCubit`

- **Scope**: current **`AppLanguageEnum`**, RTL helpers (**`isArabic`**, **`isEnglish`**, **`isRtl`**), **`init()`** syncs from **`LocalizationContainer`** after **`init()`** on the container.
- **`changeLanguage`**: updates locale through **`LocalizationContainer.setLanguage`**, then **`resetDependenciesScope()`** (so scoped registrations match the new language), then emits — **single persistence path**; features must not write language prefs directly.
- **Emit safety**: override **`emit`** with **`if (!isClosed)`** (existing pattern in this cubit).
- **Strings / container**: see [`localization.md`](localization.md).

### Rules

- **Register app-wide blocs/cubits once** at the root (**`MultiBlocProvider`** in **`my_app.dart`**), not per-route unless the team explicitly scopes them.
- **Feature screens** read **`AppAuthenticationBloc` / `AppLanguageCubit`** via context — **do not duplicate** auth/language session logic in feature cubits.
