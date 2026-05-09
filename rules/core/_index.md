# Shared `lib/core` rules index

## Purpose

Maps sections of the app core (barrel, foundation, network, DI, etc.) to enforceable rules. Agents must follow **`ai_docs/architecture.md`** when in doubt and resolve **paths from this repo’s** `lib/core/` tree (e.g. `base/` vs a hypothetical `foundation/`, `config/` vs `configs/`).

## Fill when

- When `lib/core` layout or cross-cutting boundaries change in this app.

## References

- `rules/_index.md` (all rule areas)
- This app: `lib/core/` (`core.dart`, `di/di.dart`, `base/`, `config/`, …)

## Content

### Layout naming (this repo)

| Concern | Location |
|--------|----------|
| Barrel | `lib/core/core.dart` |
| Foundation-style types | `lib/core/base/` |
| Router, dimensions, theme `ThemeData` classes | `lib/core/config/` |
| Theme runtime (`ThemeNotifier`) | `lib/core/blocs/theme_notifier/` (see [`theme.md`](theme.md)) |
| Network helper | `lib/core/network/dio_helper.dart` |

Always resolve **file paths from the actual tree**; do not assume folder names from other templates.

### What lives under core

- **Foundation (`base/`)**: use-case contract (`IUseCase`), `DomainServiceType` → `Either<Failure, T>`, `Async` state wrapper, `SafeEmitMixin`, shared typedefs.
- **Network**: Dio wiring, interceptors, HTTP/domain exceptions, `Failure` types, status codes, exception collection helpers (`apiExecptionCollecter` / related).
- **DI**: `GetIt` singleton `injector`, `@InjectableInit`, `@module` for third-party types (Dio, storage), `@injectable` / `@lazySingleton` for app types.
- **Domain & data (cross-cutting)**: secure storage and language flows — repositories, data sources, entities/models, use cases that **many features** need (auth/session, locale).
- **Blocs/cubits (app-wide)**: authentication flow, language; theme as `ChangeNotifier` where used.
- **Config**: router helpers, generated assets, responsive usage at app root, app constants; theme tokens in [`theme.md`](theme.md).
- **Localization**: generated l10n under `base/localization/`, language enum, container holding current locale/strings.
- **Services / platform helpers**: thin static or injectable wrappers (share, launcher, etc.) under the paths this repo uses (e.g. `utils/share_and_url_launch/`).
- **Utils**: extensions, validators, file helpers — **no** feature business rules.

### Patterns specific to this codebase

- **Pagination** under `base/pagination/` (`PaginatedData`, `PaginatedInput`, controllers).
- **Deep linking** under `utils/deep_link/`.
- **Theme**: `ThemeNotifier` (singleton `ChangeNotifier`, `AppTheme`, persisted via repository) — see [`theme.md`](theme.md); wired in `MaterialApp` in `my_app.dart`.

### Rules documents in this folder

| File | Topic |
|------|--------|
| `barrel-and-parts.md` | `core.dart` library, `part` files, exports |
| `foundation.md` | `IUseCase`, `Async`, mixins, typedefs |
| `network.md` | Dio, interceptors, errors |
| `di.md` | injectable, `injector`, scopes |
| `domain-data-in-core.md` | repos/use cases in core vs features |
| `blocs-app-wide.md` | auth bloc, language cubit, `BuilderScreen` root routing |
| `theme.md` | `ThemeNotifier`, `AppTheme`, `AppColors`, root theme wiring |
| `theme-router-config.md` | router, values, assets, constants (not theme tokens) |
| `localization.md` | `LocalizationContainer`, l10n, change-language sheet |
| `services.md` | share, launcher, app rate, vibrator |
| `utils.md` | extensions, validators |
