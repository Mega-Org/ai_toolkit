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

### Repository layer

- Repositories should return **`Either<Failure, T>`** and map **domain exceptions** to **`Failure`** subclasses defined under **`network/errors/`** (see `failures.dart`, `failure_collect.dart`).

### Query strings vs domain params

- HTTP **query** maps for filters, page/limit, sort, etc. should be built from **domain param objects** (getters on `*Params` or sealed variants), not hardcoded inside datasources for caller-driven values — see **`queryParameters`** / param getter rules in [`foundation.md`](foundation.md) and [`../patterns/data/use-case-and-domain-service-type.md`](../patterns/data/use-case-and-domain-service-type.md).

### Constants

- **Base URL and keys** live in **`constants/api_constants.dart`**. Do not hardcode URLs in `DioHelper`. **Never commit real secrets** in public repos — use env/flavors as per project policy.

### Cancel tokens

- **`CancelToken`** is registered in **`RegisterModule`** (`lib/core/di/di.dart`) and can be passed into **`DioHelper`** HTTP methods for cancellable requests. Follow the same pattern when adding long-running calls.
