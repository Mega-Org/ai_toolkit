# Core foundation

## Purpose

Overview rules for foundational `lib/core/foundation/` types. Keep detailed
`Async<T>` usage in [`async.md`](async.md).

## Fill when

- When foundation APIs or cross-cutting base types change.

## References

- `lib/core/foundation/` (`i_use_case.dart`, `typedef.dart`, `async.dart`, `safe_emit_mixin.dart`)
- `rules/core/async.md`

## Content

### `IUseCase<Output, Params>`

- Contract: **`DomainServiceType<Output> call(Params params)`** where `DomainServiceType<T>` is **`Future<Either<Failure, T>>`** (dartz).
- **No-params** cases use **`NoParams`** (`Equatable`, empty `props`).
- Use cases that need **singleton access from static helpers** may expose **`getInstance()`** (see `GetCachedUserUseCase` pattern in app auth) — prefer **normal `@injectable` constructor injection** for new code unless there is a legacy reason.

### Typedef

- **`DomainServiceType<T> = Future<Either<Failure, T>>`** — repository and use-case returns should stay consistent with this for error handling.

### `Async<T>` (Equatable)

- Presentation-state helper from `lib/core/foundation/async.dart` (**`part of core`**).
- Use [`async.md`](async.md) for constructor rules, reset rules, and examples.
- Do not use `Async<T>` for repositories or use-case contracts; keep domain/data
  returns as `DomainServiceType<T>` / `Either<Failure, T>`.

### `SafeEmitMixin<State>`

- New feature Cubits should prefer **`with SafeEmitMixin`** to avoid emitting
  after dispose.
- Legacy Cubits may inline `if (!isClosed) super.emit(...)`; do not copy that
  pattern into new Cubits unless the surrounding file already uses it.

### `part of core`

- These files are declared **`part of core`** and rely on the parent library imports (e.g. `Equatable`, `Failure`, `Cubit`). **Do not duplicate imports** inside parts unless the analyzer requires a local import for a narrow symbol.
