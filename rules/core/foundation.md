# Core foundation

## Purpose

Conventions for `IUseCase`, typedefs, async helpers, safe emit mixins, and other foundational types in core.

## Fill when

- When foundation APIs or cross-cutting base types change.

## References

- `lib/core/base/` (`i_use_case.dart`, `typedef.dart`, `async.dart`, `safe_emit_mixin.dart`)

## Content

### `IUseCase<Output, Params>`

- Contract: **`DomainServiceType<Output> call(Params params)`** where `DomainServiceType<T>` is **`Future<Either<Failure, T>>`** (dartz).
- **No-params** cases use **`NoParams`** (`Equatable`, empty `props`).
- Use cases that need **singleton access from static helpers** may expose **`getInstance()`** (see `GetCachedUserUseCase` pattern in app auth) — prefer **normal `@injectable` constructor injection** for new code unless there is a legacy reason.

### Typedef

- **`DomainServiceType<T> = Future<Either<Failure, T>>`** — repository and use-case returns should stay consistent with this for error handling.

### `Async<T>` (Equatable)

- UI/state helper for **loading / success / failure / initial** with optional `data` and `Failure`.
- Use **`Async.loading()`**, **`Async.success(data)`**, **`Async.failure(failure)`**, **`Async.initial()`**, **`Async.successWithoutData()`** as in existing cubits (e.g. language change flow).
- Do not replace `Either` in domain layer with `Async` unless the team extends the pattern; **`Async` is for presentation-friendly state**, not repository contracts.

### `SafeEmitMixin<State>`

- For **cubits** that override **`emit`**: only call **`super.emit`** when **`!isClosed`** to avoid emitting after dispose.
- **Alternative**: inline `if (!isClosed) super.emit(...)` (see **`AppLanguageCubit`** in this repo). Prefer **one consistent approach** across new cubits.

### `part of core`

- These files are declared **`part of core`** and rely on the parent library imports (e.g. `Equatable`, `Failure`, `Cubit`). **Do not duplicate imports** inside parts unless the analyzer requires a local import for a narrow symbol.
