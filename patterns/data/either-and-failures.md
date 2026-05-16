# Either and failures

## Purpose

How this app models **failed-or-success** domain results with **`dartz` `Either<Failure, T>`**, maps HTTP/storage errors through **`collectFailure`**, and surfaces outcomes in Cubits via **`fold`** and **`Async`**.

Pair with [`use-case-and-domain-service-type.md`](use-case-and-domain-service-type.md) (use-case contract) and [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md) (presentation `fold`).

## When to load

- Adding or changing **repository** methods, **failure types**, or **exception → failure** mapping.
- Wiring a Cubit or paginated list to handle **`DomainServiceType<T>`** results.
- Handling **auth / OTP / approval** flows that branch on a specific **`Failure`** subtype.

## Where it lives (core)

| Piece | Path |
|-------|------|
| `Failure` hierarchy | `lib/core/network/errors/failures.dart` (part of `core`) |
| Typed **exceptions** (thrown below repositories) | `lib/core/network/errors/exceptions.dart` |
| **`collectFailure`** — catch → `Left<Failure, …>` | `lib/core/network/errors/failure_collect.dart` |
| **`mapApiException`** — Dio/status → throw exception | `lib/core/network/errors/exception_mapper.dart` |
| **`DomainServiceType<T>`** typedef | `lib/core/foundation/typedef.dart` |
| **`Async<T>`** (presentation slice) | `lib/core/foundation/async.dart` |

Import **`package:tariq_alsamo/core/core.dart`** for `Failure`, `collectFailure`, `DomainServiceType`, and `Async`. Repositories that construct `Right`/`Left` also import **`package:dartz/dartz.dart`**.

---

## Mental model (layer flow)

```
Remote data source          Repository                    Use case                 Cubit / page
──────────────────          ───────────                   ────────                 ────────────
await DioHelper.*     →     collectFailure(() async {     return _repo.method(…)   result.fold(
  (mapApiException            await _remote…();                                      (f) → Async.failure(f),
   throws on error)           return Right(entity);                                 (d) → Async.success(d));
                            })
                         ← Future<Either<Failure, T>>
```

- **Data sources** return plain **`Future<T>`** and **throw** typed **`Exception`** subclasses — they do **not** return `Either`.
- **Repositories** are the **boundary** that converts success to **`Right`** and caught errors to **`Left`** via **`collectFailure`**.
- **Use cases** delegate to the repository and keep the same **`DomainServiceType<T>`** return type.
- **Presentation** **`await`s** the use case and **`fold`s** into **`Async`**, toast text, navigation, or pagination controller helpers.

---

## `DomainServiceType<T>`

```dart
typedef DomainServiceType<T> = Future<Either<Failure, T>>;
```

Use on **repository interfaces** and **`IUseCase.call`** overrides. Do not add a second typedef for the same meaning.

**Void success:** `DomainServiceType<void>` with `return const Right(null);` inside `collectFailure` (see `CommonRepositoryImp.switchNotificationEnabled`).

---

## Repository pattern: `collectFailure` + `Right`

Every typical repository method wraps work in **`collectFailure`** and returns **`Right`** on success:

```dart
@override
DomainServiceType<OrderEntity> getOrderDetails(
  final GetOrderDetailsParams params,
) {
  return collectFailure(() async {
    final ApiOrderModel model = await _remote.getOrderDetails(params);
    return Right(model); // model implements / maps to domain entity
  });
}
```

**Reference:** [`orders_repository_impl.dart`](../../../lib/src/features/orders/data/repository/orders_repository_impl.dart), [`common_repository_imp.dart`](../../../lib/src/features/_common/data/repository/common_repository_imp.dart).

### What `collectFailure` does

1. Runs the **`task`** callback.
2. On **any thrown object**, maps known **exceptions** to **`Left`**:
   - `ApiRequestException` → `RequestFailure`
   - `ServerException` → `ServerFailure` (optional `errorMap`)
   - `SecureStorageException` → `SecureStorageFailure`
   - `UnauthorizedException` → `UnAuthorizedFailure`
   - `UnVerifiedUserException` → `UnVerifiedUserFailure`
   - `WaitingApproveException` → `WaitingApproveFailure`
   - `UnexpectedException` → `UnexpectedFailure`
3. Anything else → `Left(ServerFailure(message: appLocalizer.somethingWentWrong))`.

Optional hooks **`catchExecption`** / **`catchError`** exist for custom mapping; this codebase rarely uses them — prefer throwing the typed exceptions above so the default mapping applies.

**Do not** return `Either` from remote data sources. **Do not** call `mapApiException` inside repositories when `DioHelper` already wraps calls.

**Inside `collectFailure`:** throw **`Exception`** subclasses from `exceptions.dart` (e.g. validation). Do **not** `throw` a **`Failure`** — `Failure` is not an `Exception`, so it would be treated as an unknown error and mapped to a generic `ServerFailure`.

---

## Failure types (domain)

All extend **`Failure`** (`message`, `Equatable`):

| Class | Typical source | Notes |
|-------|----------------|-------|
| `RequestFailure` | 400/422, client errors, connectivity messages via `ApiRequestException` | User-facing `message` |
| `ServerFailure` | `ServerException`, unknown catch-all | May carry `errorMap` for field errors |
| `UnexpectedFailure` | 500 / unexpected paths | |
| `UnAuthorizedFailure` | 401 / `UnauthorizedException` | Session / auth |
| `UnVerifiedUserFailure` | HTTP 423 / `UnVerifiedUserException` | OTP / verify flows |
| `WaitingApproveFailure` | Precondition / `waitingApprove` key | Treated as success in some OTP cubits |
| `SecureStorageFailure` | Local secure storage errors | |

Use **`failure is SomeSpecificFailure`** in Cubits or page listeners when the product needs a branch (navigation, alternate success), not only `failure.message`.

**Examples:**

- Login page → `UnVerifiedUserFailure` → push verify OTP ([`login_page.dart`](../../../lib/src/features/authentication/presentation/login/login_page.dart)).
- Verify OTP cubit → `WaitingApproveFailure` → emit success without navigation ([`verify_otp_cubit.dart`](../../../lib/src/features/authentication/presentation/verify_otp/verify_otp_cubit.dart)).

---

## Use case layer

Thin delegate — no extra `Either` wrapping:

```dart
@override
DomainServiceType<PaginatedData<OrderEntity>> call(final GetOrdersParams params) =>
    _repository.getOrders(params);
```

Params and query maps: [`use-case-and-domain-service-type.md`](use-case-and-domain-service-type.md).

---

## Presentation: `fold` → `Async`

Standard Cubit flow (with **`SafeEmitMixin`**):

```dart
emit(const Async.loading());
final result = await _getClientWalletUseCase(const NoParams());
result.fold(
  (final Failure failure) {
    emit(state.copyWith(balanceLoad: Async.failure(failure)));
  },
  (final data) {
    emit(state.copyWith(balanceLoad: Async.success(data)));
  },
);
```

- **`Async.failure(failure)`** stores the **`Failure`**; UI reads **`failure.message`** (and optionally runtime type).
- **`Async.successWithoutData()`** when `Output` is `void` and the operation succeeded.
- Many auth/list cubits emit **`Async.initial()`** again after the terminal fold so listeners do not keep stale success/failure flags — see [`cubit-and-use-case.md`](../state/cubit-and-use-case.md).

**Reference:** [`client_wallet_cubit.dart`](../../../lib/src/features/client/wallet/presentation/wallet/client_wallet_cubit.dart), [`login_cubit.dart`](../../../lib/src/features/authentication/presentation/login/login_cubit.dart).

### Paginated lists

When the list owns the controller, **`fold`** on the page (or cubit method returning `DomainServiceType`) and push into pagination:

```dart
result.fold(
  (failure) => _paginationController.setError(failure),
  (data) => _paginationController.addItems(data),
);
```

See [`../flutter/pagination-paginated-list-view.md`](../flutter/pagination-paginated-list-view.md).

Legacy/alternate: Cubit emits **`Async<PaginatedData<T>>`** and a **`BlocListener`** calls `addItems` / `setError` ([`orders_list_cubit.dart`](../../../lib/src/features/orders/presentation/orders_list/orders_list_cubit.dart)).

---

## Streams: `Stream<Either<Failure, T>>`

Realtime uses **`Either`** on **streams**, not only futures:

- `RealtimeRepository.watch` → `Stream<Either<Failure, RealtimeEnvelope>>`
- Gate failures with **`Left`** on the first event; successful events map with **`Right`**

**Reference:** [`realtime_repository_impl.dart`](../../../lib/src/_app_realtime/domain/realtime_repository_impl.dart).

For **`Future`** connectivity checks in the same module, repositories may return **`Left`/`Right` directly** without `collectFailure` when errors are local (Pusher/socket), still using the same **`Failure`** types.

---

## Checklist (new endpoint)

1. **Remote data source:** `await _dioHelper.get/post/...` — exceptions bubble from `mapApiException`.
2. **Repository interface:** `DomainServiceType<MyEntity> method(MyParams params);`
3. **Repository impl:** `return collectFailure(() async { … return Right(mapped); });`
4. **Use case:** `extends IUseCase<MyEntity, MyParams>` → delegate to repository.
5. **Cubit / page:** `await` + `fold` → `Async` or pagination `setError` / `addItems`.
6. If the product needs special handling, throw or map to the **correct exception** so `collectFailure` produces the right **`Failure`** subtype.

---

## References

- Rules: [`../../rules/core/network.md`](../../rules/core/network.md), [`../../rules/core/foundation.md`](../../rules/core/foundation.md)
- Use cases / params: [`use-case-and-domain-service-type.md`](use-case-and-domain-service-type.md)
- Cubit wiring: [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md)
- Feature `data/` layout: [`feature-data-layer.md`](feature-data-layer.md)
