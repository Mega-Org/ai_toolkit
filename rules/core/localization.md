# Localization in core

## Purpose

Define how this template app wires **Flutter gen-l10n**, a **DI-backed `LocalizationContainer`**, **`AppLanguageCubit`**, and the **language cache stack** (repository + data source + use cases) so locale and strings stay consistent. Use this doc when adding strings, changing how language is **stored**, or touching `MaterialApp` / root `builder`.

## When to update this rule

- Localization pipeline, `l10n.yaml`, ARB layout, or language persistence changes.
- `LocalizationContainer`, `AppLanguageCubit`, or root `MaterialApp` integration changes.

## Key paths

| Area | Path |
|------|------|
| Container, top-level getters, `part of core` | `lib/core/localization/localization_container.dart` |
| Language enum | `lib/core/localization/app_language_enum.dart` |
| ARBs + generated l10n | `lib/core/localization/l10n/` (`app_en.arb`, `app_ar.arb`, generated `app_localizations*.dart`) |
| App-wide language cubit | `lib/core/blocs/language_cubit/` (`app_language_cubit.dart`) |
| `MaterialApp`, `setLocalizer`, cubit wiring | `lib/my_app.dart` |
| Change-language UI (optional API + restart) | `lib/src/features/_common/presentation/change_language/` (`change_language_bottom_sheet.dart`, `change_language_cubit.dart`) |
| Backend language use case (when enabled) | `lib/src/features/_common/domain/use_cases/language/change_langauge_use_case.dart` (file name retains the `langauge` typo; class: **`ChangeLanguageUseCase`**) |
| DI before `runApp` | `lib/main.dart`, `lib/core/di/di.dart` |
| Gen-l10n config | `l10n.yaml` (repo root) |
| Language use cases (get/set/clear/device) | `lib/core/domain/use_cases/language/` |
| Language cache repository (contract) | `lib/core/domain/repository/language_cache_repository.dart` |
| Language cache repository (impl) | `lib/core/data/repository/language_cache_repository_impl.dart` |
| Language cache data source (prefs + device) | `lib/core/data/data_source/language_cache_data_source.dart` |

App-wide auth routing tied to restarts is documented in [`blocs-app-wide.md`](blocs-app-wide.md).

## Architecture (startup → UI)

1. **`main`** calls **`initializeDependencies()`** so **`injector.init()`** runs and registers core services, including **`LocalizationContainer`**. **`@PostConstruct init()`** on the container loads the cached language via **`GetCachedLanguageUseCase`**.
2. **`MyApp`** provides **`AppLanguageCubit`** and calls **`init()`** so **`MaterialApp.locale`** matches **`LocalizationContainer.getLang`**.
3. **`MaterialApp`** sets **`localizationsDelegates`**, **`supportedLocales`**, and **`locale`** from cubit state (`AppLanguageEnum` → `Locale` via **`local`**). **`navigatorKey`** is the app global key from **`AppRouter`** so **`getLocale`** can resolve when a context exists. A **`ValueKey`** on **`MaterialApp`** (combined with theme hash in this app) forces a clean rebuild when locale/theme change.
4. **`MaterialApp.builder`** calls **`injector<LocalizationContainer>().setLocalizer(context)`** on every rebuild. That assigns **`AppLocalizations.of(context)`** into the container so **`appLocalizer`** stays aligned with the active locale (including after language changes). **Hot reload / hot restart** with **`flutter gen-l10n`** follow normal Flutter tooling behavior; fix ARBs if codegen or analysis fails after edits.

## How to access translations and locale

| Situation | Use |
|-----------|-----|
| Widget or method with **`BuildContext`** under `MaterialApp` | **`AppLocalizations.of(context).yourKey`** — call **inline** at each use site (default). |
| No **`BuildContext`** (getters, services, static helpers, deep non-UI code) | **`appLocalizer.yourKey`** — top-level getter in **`core`**, backed by **`injector<LocalizationContainer>().appLocalizations`** |
| Current **`Locale`** (navigator context if mounted, else cached language, else safe default) | **`getLocale`** |
| Map resolved locale to **`AppLanguageEnum`** | **`getLocaleTypeEnum`** |

In UI with **`BuildContext`**, prefer **`AppLocalizations.of(context).key`** written **directly** on widgets and expressions. A local **`final l10n = AppLocalizations.of(context);`** is optional when one **`build`** reads **many** keys and repeating **`AppLocalizations.of(context)`** hurts readability.

Use **`appLocalizer`** when you would otherwise **thread `BuildContext` through constructors or services** only to read strings, or in non-widget code.

## `LocalizationContainer`

- Holds **`AppLanguageEnum`** (`getLang` / **`setLanguage`**), persists via **`SetCachedLanguageUseCase`**, loads cache in **`init()`**.
- Holds **`AppLocalizations appLocalizations`** for **`appLocalizer`** without context. Initial value is a concrete delegate until **`setLocalizer`** runs under **`MaterialApp`**.
- **`setLocalizer(BuildContext context)`** must be invoked from a **`BuildContext`** that already has **`Localizations`** for the app locale (this template: **`MaterialApp.builder`** in **`my_app.dart`**).

## Language persistence (cache) in core

**`LocalizationContainer`** and **`AppLanguageCubit`** do **not** read **`SharedPreferences`** directly. Persisted language flows through **use cases** → **`LanguageCacheRepository`** → **`LanguageCacheDataSource`**.

### Data flow (conceptual)

`LocalizationContainer` / `AppLanguageCubit` → **language use cases** → **`LanguageCacheRepository`** (domain contract) → **`LanguageCacheRepositoryImpl`** → **`LanguageCacheDataSource` / `LanguageCacheDataSourceImpl`** → **`SharedPreferences`** (string key for serialized **`AppLanguageEnum`**).

For how repositories and data sources fit **core vs features** in general, see [`domain-data-in-core.md`](domain-data-in-core.md).

### Use cases (`lib/core/domain/use_cases/language/`)

| Use case | Role |
|----------|------|
| **`GetCachedLanguageUseCase`** | Loads stored language; used by **`LocalizationContainer`** **`@PostConstruct init()`** after DI. |
| **`SetCachedLanguageUseCase`** | Persists language when **`LocalizationContainer.setLanguage`** runs (and thus when the cubit changes language through the container). |
| **`ClearLanguageCacheUseCase`** | Removes cached language (e.g. logout / reset); call from the appropriate flow and keep **cubit + `MaterialApp.locale`** in sync so the UI does not show a stale language. |
| **`GetDeviceLanguageUseCase`** | Maps **OS / platform** locale to **`AppLanguageEnum`** (first launch, suggestions, fallbacks — not the same as “last user choice”). |

### DI vs `getInstance()`

Use cases may expose **`getInstance()`** factories for legacy or static entry points. **Prefer `injector<GetCachedLanguageUseCase>()`** (and siblings) so tests and scopes use the same **`LanguageCacheRepository`** instance as the rest of the app.

### Where to change what

| Change | Touch |
|--------|--------|
| Storage key, lazy prefs access, read/write errors, migration of stored value | **`LanguageCacheDataSourceImpl`** in **`language_cache_data_source.dart`** |
| Default when nothing is cached (`getDefaultAppLanguage`) | **`LanguageCacheDataSource`** implementation (today defaults to **`AppLanguageEnum.ar`**) |
| New persistence behavior (e.g. encrypt, dual-write) | Extend **data source**; widen **`LanguageCacheRepository`** + **`LanguageCacheRepositoryImpl`** if the contract grows |
| New cross-cutting entry (e.g. background task reads language) | Add or reuse a **use case**; **do not** open **`SharedPreferences`** from feature modules for app language |
| Contract of “what the app can do with cached language” | **`language_cache_repository.dart`** + impl + use case(s) + injectable registration |

## `AppLanguageCubit`

- **`changeLanguage`**: persists via **`LocalizationContainer.setLanguage`**, then **`resetDependenciesScope()`**, then emits — **single source of truth** for stored language and aligned **`GetIt`** scopes; avoid duplicate **`SharedPreferences`** (or other storage) writes from features.
- **`AppLanguageEnum`** (`ar` / `en`, **`local`** for **`Locale`**) is the app’s language model; extend the enum and ARBs together when adding locales.

## Change-language UI (`ChangeLanguageBottomSheet`)

- **`ChangeLanguageBottomSheet.show(context, canSaveInBackend: …)`** hosts **`ChangeLanguageCubit`**. When **`canSaveInBackend`** is true, selecting a language runs **`ChangeLanguageUseCase`** from **`change_langauge_use_case.dart`** (loading/success/failure). When false, the cubit completes immediately without a network call.
- On successful completion, the sheet pops to the root route, calls **`AppLanguageCubit.of(context).changeLanguage(currentLang)`**, then **`AppAuthenticationBloc.of(context).add(const AuthRestartEvent())`** so session and scoped dependencies re-resolve — effectively a **controlled app restart** of the authenticated shell (see [`blocs-app-wide.md`](blocs-app-wide.md)).
- Onboarding and other screens may open the sheet with **`canSaveInBackend: false`** for local-only preview flows; align call sites with product rules for when the backend must store locale.

## Official gen-l10n (`l10n.yaml`)

- **Source of truth** for generated Dart is **`l10n.yaml`** + ARB files. **`flutter gen-l10n`** runs as part of **`flutter run`** / **`flutter build`** (and IDE analysis) per project setup — **do not** maintain **`app_localizations.dart`**, **`app_localizations_en.dart`**, **`app_localizations_ar.dart`**, or related generated files by hand, and **do not** use **`build_runner`** for this l10n output unless the project explicitly adds a separate codegen that requires it.
- After adding or renaming keys, rely on the tool to regenerate; fix ARB/metadata issues if codegen reports errors.

## ARB file organization

- Keep **`app_en.arb`** (template) and **`app_ar.arb`** (and any future locale ARBs) **in sync** for real message keys.
- Place **app-wide / common** strings **first** in each file (errors, shared labels, etc.).
- For each **feature or section**, add a **section header** entry: a key like **`"@-FEATURE_OR_AREA-"`** with an **`@…`** metadata object containing only **`description`** (and optional other allowed metadata). Example pattern:

```json
"@-BUTTONS-": {
  "description": "----------------- BUTTONS Localizations -----------------"
},
```

- List that feature’s message keys **immediately below** its header.
- When adding a feature, add a **new header** below existing sections, then new keys with **consistent, Dart-friendly names** (e.g. **`camelCase`**) matching Flutter l10n conventions.
- Preserve valid **JSON / ARB** structure and formatting (commas, quoting, plural/metadata blocks per Flutter docs).

## Integration checklist (for agents)

- New user-facing string: add to **all** locale ARBs under the correct section; run analyzer / app build so gen-l10n updates.
- New language: extend **`AppLanguageEnum`**, **`supportedLocales` / delegates** (via generated **`AppLocalizations`**), ARB + **`l10n.yaml`** if needed, and cubit/UI that switches language.
- Never read cached language only from cubit without ensuring DI **`LocalizationContainer.init()`** has completed where **`getLang`** is required before **`runApp`** (this template resolves that via **`initializeDependencies()`** in **`main`** before **`runApp`**).
- Clearing stored language (**`ClearLanguageCacheUseCase`**): also update **`LocalizationContainer`** / **`AppLanguageCubit`** state (or restart from a known default) so memory, prefs, and **`MaterialApp.locale`** stay aligned.
