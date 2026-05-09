# Core network (Dio)

## Purpose
Dio client setup, interceptors, and mapping exceptions to failures for repositories.

## Fill when
- When network stack, interceptors, or error mapping changes.

## References
- flutter_base: `lib/core/network/helper/dio_helper.dart`, `network/interceptors/`, `network/errors/`, `network/errors/exception_mapper.dart`
- vorma: `lib/core/network/dio_helper.dart`, `header_interceptor.dart`, `un_authenticated_interceptor.dart`, `network/errors/`

## Content

### Dio instances

- **RegisterModule / `@module`**: a raw **`Dio`** with `BaseOptions` (base URL from **`ApiConstants`**, JSON headers, timeouts) may be registered for injectable-generated code.
- **`DioHelper`**: separate **`@injectable`** class that owns a **`Dio`** instance, applies interceptors in **`_init()`**, and exposes **`get` / `post` / `put` / `delete`** wrapping **`mapApiException`** (flutter_base) or **`apiExecptionCollecter`** (vorma spelling).

### Interceptors (typical stack order)

1. **Headers**: API key / auth / timezone — flutter_base uses **`ApiRequestHeaderInterceptor`**; vorma uses **`HeaderInterceptor`**.
2. **Logging**: **`PrettyDioLogger`** — in vorma gated by **`ApiConstants.canLog`** when applicable.
3. **Auth/session**: **`UnAuthenticatedInterceptor.instance`** — central handling for 401-style flows.

Do **not** add feature-specific interceptors in core unless they are truly global; prefer feature modules or named Dio instances if needed.

### Exception mapping

- **flutter_base**: **`mapApiException`** in `exception_mapper.dart` — maps HTTP status and **`DioException`** types to typed **`ServerException`**, **`ApiRequestException`**, **`UnauthorizedException`**, **`UnVerifiedUserException`**, **`UserNeedsSubscriptionException`**, etc., using **`appLocalizer`** for user-facing strings where applicable.
- **vorma**: **`apiExecptionCollecter`** (and related **`failure_collect` / `execption_collect`**) — same responsibility; align new endpoints with the existing collector pattern in that app.

### Repository layer

- Repositories should return **`Either<Failure, T>`** and map **domain exceptions** to **`Failure`** subclasses defined under **`network/errors/`** (see `failures.dart`, `failure_collect.dart`).

### Constants

- **Base URL and keys** live in **`constants/api_constants.dart`**. Do not hardcode URLs in `DioHelper`. **Never commit real secrets** in public repos — use env/flavors as per project policy.

### Cancel tokens (vorma)

- vorma registers **`CancelToken`** in **`RegisterModule`** and passes it into **`DioHelper`** HTTP methods for cancellable requests. Follow the same pattern when adding long-running calls.
