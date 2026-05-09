# Core network (Dio)

## Purpose

Dio client setup, interceptors, and mapping exceptions to failures for repositories.

## Fill when

- When network stack, interceptors, or error mapping changes.

## References

- `lib/core/network/dio_helper.dart`, `header_interceptor.dart`, `un_authenticated_interceptor.dart`, `network/errors/`

## Content

### Dio instances

- **`RegisterModule` / `@module`**: a raw **`Dio`** with `BaseOptions` (base URL from **`ApiConstants`**, JSON headers, timeouts) may be registered for injectable-generated code.
- **`DioHelper`**: **`@Injectable()`** class that owns a **`Dio`** instance, applies interceptors in **`_init()`**, and exposes **`get` / `post` / `put` / `delete`** wrapping **`apiExecptionCollecter`** (and related helpers in **`network/errors/`**).

### Interceptors (typical stack order)

1. **Headers**: API key / auth / timezone — **`HeaderInterceptor`**.
2. **Logging**: **`PrettyDioLogger`** — gated by **`ApiConstants.canLog`** when applicable.
3. **Auth/session**: **`UnAuthenticatedInterceptor.instance`** — central handling for 401-style flows.

Do **not** add feature-specific interceptors in core unless they are truly global; prefer feature modules or named Dio instances if needed.

### Exception mapping

- **`apiExecptionCollecter`** (and related **`failure_collect` / `execption_collect`**) map **`DioException`** / HTTP outcomes to typed domain exceptions and **`Failure`** — align new endpoints with the existing collector pattern in this app.

### Repository layer

- Repositories should return **`Either<Failure, T>`** and map **domain exceptions** to **`Failure`** subclasses defined under **`network/errors/`** (see `failures.dart`, `failure_collect.dart`).

### Constants

- **Base URL and keys** live in **`constants/api_constants.dart`**. Do not hardcode URLs in `DioHelper`. **Never commit real secrets** in public repos — use env/flavors as per project policy.

### Cancel tokens

- **`CancelToken`** is registered in **`RegisterModule`** (`lib/core/di/di.dart`) and can be passed into **`DioHelper`** HTTP methods for cancellable requests. Follow the same pattern when adding long-running calls.
