# Localization in core

## Purpose
l10n container, language enum, caching language selection, and integration with app-wide language cubit/bloc.

## Fill when
- When localization pipeline or language persistence changes.

## References
- flutter_base: `lib/core/localization/` (`app_language_enum.dart`, `localization_container.dart`, `l10n/*.arb`)
- vorma: `lib/core/base/localization/` (`app_language_code_enum.dart`, `localization_container.dart`, `l10n/*.arb`)

## Content

### `LocalizationContainer`

- Holds **current `AppLanguageEnum`**, **`AppLocalizations`** instance for **`appLocalizer`** access without context, and coordinates **get/set cached language** use cases.
- **flutter_base**: **`@singleton`**, constructor-injected **`GetCachedLanguageUseCase`** / **`SetCachedLanguageUseCase`**, **`@PostConstruct init()`** loads cached language after DI.
- **vorma**: registered manually in **`initializeDependencies()`**, uses **`GetCachedLanguageUseCase.getInstance()`** pattern inside the container; **`init()`** returns **`Future<Locale>`** for **`MaterialApp`** startup.

### Top-level accessors (`part of core`)

- **`appLocalizer`** → **`injector<LocalizationContainer>().appLocalizations`**
- **`getLocale`** → prefers **`NavigatorState.currentContext`** locale via **`appNavigatorKey`** (or **`AppRouter.navigatorKey`** in vorma), falls back to container / **`Locale('en')`**
- **`getLocaleTypeEnum`** → maps locale to **`AppLanguageEnum`**

### `setLocalizer(BuildContext context)`

- Syncs **`AppLocalizations.of(context)`** into the container when the widget tree provides full locale resolution — call from root **`MaterialApp`** / builder where the project already does.

### Language enum

- flutter_base: **`AppLanguageEnum`** with **`ar` / `en`** and **`local`** getter.
- vorma: **`AppLanguageEnum`** (or **`AppLanguageCodeEnum`** naming in path) — **use the enum exported by the active app**.

### ARB files

- **`app_en.arb`**, **`app_ar.arb`** — source for codegen; run **`flutter gen-l10n`** / build_runner per **`l10n.yaml`**.

### Integration with `AppLanguageCubit`

- **`changeLanguage`** persists via **`LocalizationContainer.setLanguage`** then emits new **`AppLanguageState`**. Keep **single source of truth** in the container + cubit — avoid parallel **`SharedPreferences`** writes from features.
