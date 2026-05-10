# Shared `lib/core` rules index

## Purpose

Maps sections of the app core (barrel, foundation, network, DI, etc.) to enforceable rules. Agents must follow **`ai_docs/architecture.md`** when in doubt and resolve **paths from this repo’s** `lib/core/` tree. In **this** app, cross-cutting primitives live under **`foundation/`**, and shared UI tokens / router / theme live under **`configs/`** (not `base/` or singular `config/`).

## Fill when

- When `lib/core` layout or cross-cutting boundaries change in this app.

## References

- `rules/_index.md` (all rule areas)
- This app: `lib/core/` (`core.dart`, `di/di.dart`, `foundation/`, `configs/`, `localization/`, …)

## Content

### Layout naming (this repo)

| Concern | Location |
|--------|----------|
| Barrel | `lib/core/core.dart` |
| Foundation-style types | `lib/core/foundation/` (`Async`, `SafeEmitMixin`, `IUseCase`, typedefs) |
| Router module | `lib/core/configs/router/` (see [`router.md`](router.md)) |
| Values, dimensions, fonts, generated assets, constants | `lib/core/configs/values/`, `lib/core/constants/` (see [`config.md`](config.md)); responsive breakpoints / scaled tiers: [`responsive_constants.dart`](../../../lib/core/constants/responsive_constants.dart) (`AppResponsiveLayout`) |
| Theme `ThemeData` classes | `lib/core/configs/theme/values/` (`app_theme.dart`, `light_theme.dart`, `dark_theme.dart`) |
| Theme runtime | `lib/core/configs/theme/manager/theme_manager.dart` (see [`theme.md`](theme.md)); UI bridge: `configs/theme/widgets/theme_builder.dart` |
| Network helper | `lib/core/network/helper/dio_helper.dart` |

Always resolve **file paths from the actual tree**; do not assume folder names from other templates.

### What lives under core

- **Foundation (`foundation/`)**: use-case contract (`IUseCase`), `DomainServiceType` → `Either<Failure, T>`, `Async` state wrapper, `SafeEmitMixin`, shared typedefs.
- **Network**: Dio wiring, interceptors, HTTP/domain exceptions, `Failure` types, status codes, **`mapApiException`** / **`collectFailure`** (see [`network.md`](network.md)).
- **DI**: `GetIt` singleton `injector`, `@InjectableInit`, `@module` for third-party types (Dio, storage), `@injectable` / `@lazySingleton` for app types.
- **Domain & data (cross-cutting)**: secure storage and language flows — repositories, data sources, entities/models, use cases that **many features** need (auth/session, locale).
- **Blocs/cubits (app-wide)**: authentication flow, language; theme runtime via **`ThemeManager`** (`ChangeNotifier`) — see [`theme.md`](theme.md).
- **Router**: [`router.md`](router.md). **Values / assets / constants**: [`config.md`](config.md). **Theme tokens + manager**: [`theme.md`](theme.md).
- **Localization**: ARBs + generated l10n under `localization/l10n/`, language enum, `localization_container.dart`.
- **Services / platform helpers**: thin wrappers under `lib/core/services/` (e.g. `share/`, `launcher/`, `app_rate/`, `vibrator/`).
- **Utils**: extensions, validators, file helpers — **no** feature business rules.

### Patterns specific to this codebase

- **Theme**: `ThemeManager` (singleton `ChangeNotifier`, `AppTheme`, `ThemeRepository` / impl) — see [`theme.md`](theme.md); `ThemeBuilder` + `MaterialApp` in `my_app.dart`.

### Rules documents in this folder

| File | Topic |
|------|--------|
| `barrel-and-parts.md` | `core.dart` library, `part` files, exports |
| `foundation.md` | `IUseCase`, `Async`, mixins, typedefs |
| `async.md` | `Async<T>` state rules and examples |
| `network.md` | Dio, interceptors, errors |
| `di.md` | injectable, `injector`, scopes |
| `domain-data-in-core.md` | repos/use cases in core vs features |
| `blocs-app-wide.md` | auth bloc, language cubit, `_BuilderScreen` root routing |
| `theme.md` | `ThemeManager`, `ThemeBuilder`, `AppTheme`, `AppColors`, root theme wiring |
| `router.md` | `AppRouter`, navigator key, animated routes |
| `config.md` | `Dimensions`, `TextStyles`, `AppColors` import surface, flutter_gen / `Assets`, `AppConstants`, **`AppResponsiveLayout`** vs other constant files |
| `localization.md` | `LocalizationContainer`, l10n, change-language sheet |
| `services.md` | share, launcher, app rate, vibrator |
| `utils.md` | extensions, validators |
