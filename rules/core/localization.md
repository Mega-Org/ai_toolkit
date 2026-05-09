# Localization in core

## Purpose

Define how this template app wires **Flutter gen-l10n**, a **DI-backed `LocalizationContainer`**, and **`AppLanguageCubit`** so locale and strings stay consistent. Use this doc when adding strings, changing language persistence, or touching `MaterialApp` / root `builder`.

## When to update this rule

- Localization pipeline, `l10n.yaml`, ARB layout, or language persistence changes.
- `LocalizationContainer`, `AppLanguageCubit`, or root `MaterialApp` integration changes.

## Key paths

| Area | Path |
|------|------|
| Container, top-level getters, `part of core` | `lib/core/localization/localization_container.dart` |
| Language enum | `lib/core/localization/app_language_enum.dart` |
| ARBs + generated l10n | `lib/core/localization/l10n/` (`app_en.arb`, `app_ar.arb`, generated `app_localizations*.dart`) |
| App-wide language cubit | `lib/core/blocs/language_cubit/` (e.g. `app_language_cubit.dart`) |
| `MaterialApp`, `setLocalizer`, cubit wiring | `lib/my_app.dart` |
| DI before `runApp` | `lib/main.dart`, `lib/core/di/di.dart` |
| Gen-l10n config | `l10n.yaml` (repo root) |

## Architecture (startup → UI)

1. **`main`** calls **`initializeDependencies()`** so **`injector.init()`** runs and registers core services, including **`LocalizationContainer`** (`@singleton` / async registration with injectable). **`@PostConstruct init()`** on the container loads the cached language via **`GetCachedLanguageUseCase`**.
2. **`MyApp`** provides **`AppLanguageCubit`** and calls **`init()`** so **`MaterialApp.locale`** matches **`LocalizationContainer.getLang`**.
3. **`MaterialApp`** sets **`localizationsDelegates`**, **`supportedLocales`**, and **`locale`** from cubit state (`AppLanguageEnum` → `Locale` via **`local`** getter). **`navigatorKey`** should be the app’s global key (e.g. **`appNavigatorKey`**) so **`getLocale`** can resolve when a context exists.
4. **`MaterialApp.builder`** calls **`injector<LocalizationContainer>().setLocalizer(context)`** on every rebuild. That assigns **`AppLocalizations.of(context)`** into the container so **`appLocalizer`** stays aligned with the active locale (including after language changes and normal hot reload / hot restart with gen-l10n).

## How to access translations and locale

| Situation | Use |
|-----------|-----|
| Widget or method with **`BuildContext`** under `MaterialApp` | **`AppLocalizations.of(context).yourKey`** |
| No **`BuildContext`** (getters, services, static helpers, deep non-UI code) | **`appLocalizer.yourKey`** — top-level getter in **`core`**, backed by **`injector<LocalizationContainer>().appLocalizations`** |
| Current **`Locale`** (navigator context if mounted, else cached language, else safe default) | **`getLocale`** |
| Map resolved locale to **`AppLanguageEnum`** | **`getLocaleTypeEnum`** |

Prefer **`AppLocalizations.of(context)`** in UI; use **`appLocalizer`** only where passing context is awkward or wrong (e.g. layers that must not depend on a widget **`BuildContext`**).

## `LocalizationContainer`

- Holds **`AppLanguageEnum`** (`getLang` / **`setLanguage`**), persists via **`SetCachedLanguageUseCase`**, loads cache in **`init()`**.
- Holds **`AppLocalizations appLocalizations`** for **`appLocalizer`** without context. Initial value is a concrete delegate until **`setLocalizer`** runs under **`MaterialApp`**.
- **`setLocalizer(BuildContext context)`** must be invoked from a **`BuildContext`** that already has **`Localizations`** for the app locale (this template: **`MaterialApp.builder`** in **`my_app.dart`**).

## `AppLanguageCubit`

- **`changeLanguageLocally`** / language flows call **`LocalizationContainer.setLanguage`** then emit state — **single source of truth** for persisted language; avoid duplicate **`SharedPreferences`** (or other storage) writes from features.
- **`AppLanguageEnum`** (`ar` / `en`, **`local`** for **`Locale`**) is the app’s language model; extend the enum and ARBs together when adding locales.

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
