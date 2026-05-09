# Shared `lib/core` rules index

## Purpose
Maps sections of the app core (barrel, foundation, network, DI, etc.) to enforceable rules. Agents must follow **this app’s** `ai_docs/architecture.md` when folder names differ (e.g. `base/` vs `foundation/`, `config/` vs `configs/`).

## Fill when
- When `lib/core` layout or cross-cutting boundaries change in reference apps.

## References
- Primary reference app: `flutter_base/lib/core/` (`core.dart`, `di/di.dart`).
- Secondary variants: `vorma/lib/core/` (e.g. `base/`, `config/`, pagination, deep links).

## Content

### Layout naming (same ideas, different folders)

| Concern | flutter_base | vorma (example) |
|--------|--------------|-----------------|
| Barrel | `lib/core/core.dart` | `lib/core/core.dart` |
| Foundation-style types | `foundation/` | `base/` |
| Theme, router, dimensions | `configs/` | `config/` |
| Network helper | `network/helper/dio_helper.dart` | `network/dio_helper.dart` |

Always resolve **file paths from the app’s actual tree**; do not assume `foundation/` vs `base/` without checking.

### What lives under core (both apps)

- **Foundation**: use-case contract (`IUseCase`), `DomainServiceType` → `Either<Failure, T>`, `Async` state wrapper, `SafeEmitMixin`, shared typedefs.
- **Network**: Dio wiring, interceptors, HTTP/domain exceptions, `Failure` types, status codes, exception→response mapping helpers (`mapApiException` vs collection helpers).
- **DI**: `GetIt` singleton `injector`, `@InjectableInit`, `@module` for third-party types (Dio, storage), `@injectable` / `@singleton` for app types.
- **Domain & data (cross-cutting)**: secure storage and language theme flows — repositories, data sources, entities/models, use cases that **many features** need (auth/session, locale).
- **Blocs/cubits (app-wide)**: authentication flow, language; optional theme as `ChangeNotifier` / notifier class.
- **Configs**: router helpers, theme values, generated assets, responsive helpers, app constants.
- **Localization**: generated l10n, language enum, container holding current locale/strings.
- **Services**: thin static or injectable wrappers (share, launcher, rate, vibration) where used.
- **Utils**: extensions, validators, file helpers — **no** feature business rules.

### Vorma-only patterns (when working in that codebase)

- **Pagination** under `base/pagination/` (`PaginatedData`, `PaginatedInput`, controllers).
- **Deep linking** under `utils/deep_link/`.
- Theme may be **`ThemeNotifier`** instead of **`ThemeManager`**; behavior matches (singleton `ChangeNotifier`, `AppTheme`, persisted via repository).

### Rules documents in this folder

| File | Topic |
|------|--------|
| `barrel-and-parts.md` | `core.dart` library, `part` files, exports |
| `foundation.md` | `IUseCase`, `Async`, mixins, typedefs |
| `network.md` | Dio, interceptors, errors |
| `di.md` | injectable, `injector`, scopes |
| `domain-data-in-core.md` | repos/use cases in core vs features |
| `blocs-app-wide.md` | auth bloc, language cubit |
| `theme-router-config.md` | router, theme, values, assets |
| `localization.md` | `LocalizationContainer`, l10n |
| `services.md` | share, launcher, app rate, vibrator |
| `utils.md` | extensions, validators |
