## Agent card

**LOADMAP tags:** `data`
**Read rest of this file:** no, unless changing interceptors, `DioHelper` registration, or cancel tokens.

### Must
- HTTP goes through `DioHelper` (`get`/`post`/`put`/`delete`) which wraps `mapApiException`.
- Repositories return `Either<Failure, T>` and map exceptions via `collectFailure` / existing `Failure` types.
- Caller-driven query/page/sort values come from domain `*Params` (`queryParameters` getters), not literals in datasources.
- Base URL and keys live in `ApiConstants`. Inline Dio + JSON in public datasource methods.

### Must not
- Add feature-specific interceptors to core unless they are truly global.
- Hardcode URLs in `DioHelper`. Commit secrets in public repos.
- Put `DioHelper` calls in use cases (use cases inject repositories).

### When to load the rest
- Interceptor order, `RegisterModule` Dio/CancelToken, or error file names.

### Related (cards first)
- `remote-data-sources.md`; `+domain` for param `queryParameters`; `+di` for `RegisterModule`.

### Card protocol
- Default: this card is enough. Use `limit: 60` so you do not ingest the full leaf.
- Read the rest of **this** file only when **Read rest** is yes, or **When to load the rest** matches.
- Do not open `INDEX.md`, `rules/_index.md`, or `patterns/_index.md` to rediscover this leaf.
- Related files: open their **Agent cards** first; skip them if the other tag was not requested.
- No `tests` tag. Do not write or run tests. Do not commit unless the user asks.
- Edit in place; do not rewrite the whole leaf to “clean it up.”
- If the body is a stub (`Fill in later`), stop after this card; do not invent policy.
- Indexes, templates, and untagged leaves are not part of this tag.
- Spec templates, skills, and backend-contract work belong to later plan todos — not this card.

# Core network (Dio)

## Purpose

Dio client setup, interceptors, and mapping exceptions to failures for repositories.

## Fill when

- When network stack, interceptors, or error mapping changes.

## References

- `lib/core/network/helper/dio_helper.dart`
- `lib/core/network/interceptors/api_request_header_interceptor.dart`, `lib/core/network/interceptors/un_authenticated_interceptor.dart`
- `lib/core/network/errors/` — `exceptions.dart`, `failures.dart`, `failure_collect.dart` (**`collectFailure`**), `exception_mapper.dart` (**`mapApiException`**), `status_code.dart`

## Content

### Dio instances

- **`RegisterModule` / `@module`**: a raw **`Dio`** with `BaseOptions` (base URL from **`ApiConstants`**, JSON headers, timeouts) may be registered for injectable-generated code.
- **`DioHelper`**: **`@Injectable()`** class that owns a **`Dio`** instance, applies interceptors in **`_init()`**, and exposes **`get` / `post` / `put` / `delete`** wrapping **`mapApiException`** from **`exception_mapper.dart`** (see **`network/errors/`** for related helpers).

### Interceptors (this app’s stack order)

1. **Headers**: **`ApiRequestHeaderInterceptor`** — API key / auth / timezone as implemented in that file.
2. **Logging**: **`PrettyDioLogger`**.
3. **Auth/session**: **`UnAuthenticatedInterceptor.instance`** — central handling for 401-style flows.

Do **not** add feature-specific interceptors in core unless they are truly global; prefer feature modules or named Dio instances if needed.

### Exception mapping

- **`mapApiException`** and **`collectFailure`** (note the legacy spelling **`execption`** in some parameter names in **`failure_collect.dart`**) map **`DioException`** / HTTP outcomes to typed domain exceptions and **`Failure`** — align new endpoints with the existing patterns in this app.

### Remote data sources

- **`DioHelper` calls and per-endpoint JSON unwrap** belong in the **public** datasource method body — not single-use private `_unwrap*` / `_paginatedPayload` helpers. See [`../flutter/remote-data-sources.md`](../flutter/remote-data-sources.md).

### Repository layer

- Repositories should return **`Either<Failure, T>`** and map **domain exceptions** to **`Failure`** subclasses defined under **`network/errors/`** (see `failures.dart`, `failure_collect.dart`).

### Query strings vs domain params

- HTTP **query** maps for filters, page/limit, sort, etc. should be built from **domain param objects** (getters on `*Params` or sealed variants), not hardcoded inside datasources for caller-driven values — see **`queryParameters`** / param getter rules in [`foundation.md`](foundation.md) and [`../patterns/data/use-case-and-domain-service-type.md`](../patterns/data/use-case-and-domain-service-type.md).

### Constants

- **Base URL and keys** live in **`constants/api_constants.dart`**. Do not hardcode URLs in `DioHelper`. **Never commit real secrets** in public repos — use env/flavors as per project policy.

### Cancel tokens

- **`CancelToken`** is registered in **`RegisterModule`** (`lib/core/di/di.dart`) and can be passed into **`DioHelper`** HTTP methods for cancellable requests. Follow the same pattern when adding long-running calls.
