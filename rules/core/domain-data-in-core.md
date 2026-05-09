# Domain and data in core

## Purpose
Which cross-cutting repositories and use cases live under core versus feature folders.

## Fill when
- When boundaries between core and features shift.

## References
- flutter_base: `lib/core/domain/`, `lib/core/data/`, `lib/core/constants/`
- vorma: same logical layout under `lib/core/domain/`, `lib/core/data/`

## Content

### Belongs in core (cross-cutting)

- **Authentication/session**: secure token read/write, cached user entity, “is user authenticated” aggregation, logout clearing secure cache — **`SecureStorageRepository`**, **`LanguageCacheRepository`**, **`ThemeRepository`** when theme persistence is global.
- **Language**: get/set/clear cached language, device language fallback — language **use cases** and **data sources** tied to **`LocalizationContainer`**.
- **Shared entities/models** used by auth or multiple features (e.g. **`Token`**, **`CachedUser`**, **`Phone`** in flutter_base) — keep **serializable models** in **`data/models/`**, **equatable/domain entities** in **`domain/entities/`**.

### Naming conventions

- Repository **implementations**: flutter_base uses **`*_repository_impl.dart`**; vorma uses **`*_repository_imp.dart`** suffix — **follow the active repo’s spelling**.

### Feature-specific domain/data

- **Product flows** (orders, maps, chat): repositories, use cases, DTOs live under **`lib/features/<feature>/`** (or equivalent). Do not move feature-only repos into **`core`** “for convenience.”

### Use cases

- **`IUseCase` + `Either<Failure, T>`** for commands/queries that persist or load cross-cutting state.
- Some use cases expose **`getInstance()`** for legacy/static entry points — prefer **`injector<T>()`** for new code.

### Data sources

- **`SecureStorageDataSource`**, **`LanguageCacheDataSource`** (name varies slightly per app) — **thin IO**, no UI strings except through failures/localizer mapping upstream.

### Constants

- **`ApiConstants`**, **`AppConstants`** — API routes, timeouts, static app config. **No secrets** in public repos.
