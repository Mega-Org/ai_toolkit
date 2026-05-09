# Domain and data in core

## Purpose

Which cross-cutting repositories and use cases live under core versus feature folders.

## Fill when

- When boundaries between core and features shift.

## References

- `lib/core/domain/`, `lib/core/data/`, `lib/core/constants/`

## Content

### Belongs in core (cross-cutting)

- **Authentication/session**: secure token read/write, cached user entity, “is user authenticated” aggregation, logout clearing secure cache — **`SecureStorageRepository`**, **`LanguageCacheRepository`**, **`ThemeRepository`** when theme persistence is global.
- **Language**: get/set/clear cached language, device language fallback — language **use cases** and **data sources** tied to **`LocalizationContainer`**.
- **Shared entities/models** used by auth or multiple features (e.g. **`Token`**, **`CachedUser`**, **`Phone`**) — keep **serializable models** in **`data/models/`**, **equatable/domain entities** in **`domain/entities/`**.

### Naming conventions

- Repository **implementations** in this repo use the **`*_repository_impl.dart`** suffix (e.g. **`theme_repository_impl.dart`**, **`language_cache_repository_impl.dart`**).

### Feature-specific domain/data

- **Product flows** (orders, maps, chat): repositories, use cases, DTOs live under **`lib/src/<feature>/`** (or equivalent). Do not move feature-only repos into **`core`** “for convenience.”

### Use cases

- **`IUseCase` + `Either<Failure, T>`** for commands/queries that persist or load cross-cutting state.
- Some use cases expose **`getInstance()`** for legacy/static entry points — prefer **`injector<T>()`** for new code.

### Data sources

- **`SecureStorageDataSource`**, language cache data sources (names may vary) — **thin IO**, no UI strings except through failures/localizer mapping upstream.

### Constants

- **`ApiConstants`**, **`AppConstants`** — API routes, timeouts, static app config. **No secrets** in public repos.
