# Core foundation

## Purpose

Overview rules for foundational `lib/core/foundation/` types. Keep detailed
`Async<T>` usage in [`async.md`](async.md). For **use case classes, param
objects, and `DomainServiceType` usage**, also load
[`../../patterns/data/use-case-and-domain-service-type.md`](../../patterns/data/use-case-and-domain-service-type.md).

## Fill when

- When foundation APIs or cross-cutting base types change.

## References

- `lib/core/foundation/` (`i_use_case.dart`, `typedef.dart`, `async.dart`, `safe_emit_mixin.dart`)
- `rules/core/async.md`
- `patterns/data/use-case-and-domain-service-type.md`

## Content

### `IUseCase<Output, Params>`

- **Generics (this repo):** first type is the **success value** `Output` (entity, `void`, `List<…>`, `CachedUser`, etc.); second is the **single `call` argument** `Params`.
- **Contract:** **`DomainServiceType<Output> call(Params params)`**. Implementations must return the same as **`Future<Either<Failure, Output>>`** (i.e. `DomainServiceType<Output>`). Do not swap the two type parameters.
- **One argument only:** the abstract `call` always takes a **single** `Params` value. Multiple inputs belong **inside** a params class (or use **`NoParams`** / a **single primitive** only when the use case is truly a one-value pass-through — see pattern doc).

### Param objects (`Params`)

- **Structure:** one **immutable** `*Params` class per use case (unless the argument is literally **`NoParams`**), **`extends NoParams`** (which **`extends Equatable`**), **`const` constructor** when possible, **`@override`** **`props`** lists **every** field that affects equality; **`@override`** **`toMap`** when the data layer serializes a body. **Naming** matches the use case (`LoginUseCase` → `LoginParams`). **Prefer defining `XxxUseCase` first, then `XxxParams` below**, in the **same file** (repository may import that library for types). Use a separate **`*_params.dart`** only when several teams share one param type across features. Presentation builds `Params` from UI/forms; keep domain-only data here.
- **Several disjoint shapes** (register vs login vs forgot-password flows, etc.): model them as a **`sealed` class** hierarchy in the domain (each variant a **`final class`** with its own fields). The outer **`*Params`** **holds** that sealed type (e.g. `VerifyOtpParams` + `VerifyOtpInput`). Use **`switch`** / exhaustive handling in repository or remote service when mapping to HTTP — avoid stringly-typed mode flags when variants carry different fields.
- **Remote/API body:** add **`Map<String, dynamic> get toMap`** (or `Future<Map<…>>` only when async tokens/locale must be resolved) on params or on a sealed variant; keep **domain types** out of raw maps until the data layer maps them.
- **Query parameters:** any filter, pagination, or search value that **comes from the caller** must be exposed from the **params** object — e.g. **`Map<String, dynamic> get queryParameters`** or small **`get …`** accessors composed into that map. **Do not** embed those keys/values as literals inside **remote services / datasources**; pass **`params.queryParameters`** (or equivalent) into **`DioHelper.get`** / **`queryParameters:`**. Truly **static** route-level constants stay in **`ApiConstants`** or path helpers, not duplicated per call site.
- **No parameters:** use **`const NoParams()`** as the `Params` type and the value passed at the call site — do not invent ad-hoc empty classes.

### `NoParams`

- From `lib/core/foundation/i_use_case.dart` (part of `core`). **Do not duplicate** a second empty params class in features.

### `DomainServiceType<T>` (default return type)

- **Definition** (do not re-alias elsewhere): `typedef DomainServiceType<T> = Future<Either<Failure, T>>;` in `lib/core/foundation/typedef.dart`.
- **Use it by default** for:
  - **Repository** abstract methods and their implementations.
  - **Use case** `call` return type in `@override` (can also write the expanded `Future<Either<Failure, T>>` but **must not** change the meaning).
- **Success with no payload:** use **`DomainServiceType<void>`** / `Either<Failure, void>` for new feature code **unless** an existing feature already standardizes on **`Unit`** (dartz) for that stream of APIs — do not mix `void` and `Unit` within the same feature without reason.
- **Injected use cases** get **`@Injectable()`** (or project-consistent scope) and delegate to a repository; the use case **does not** own Dio or HTTP.

### `IUseCase` — optional note

- Use cases that need **singleton access from static helpers** may expose **`getInstance()`** (see `GetCachedUserUseCase` pattern in app auth) — prefer **normal `@injectable` constructor injection** for new code unless there is a legacy reason.

### `Async<T>` (Equatable)

- Presentation-state helper from `lib/core/foundation/async.dart` (**`part of core`**).
- Use [`async.md`](async.md) for constructor rules, reset rules, and examples.
- Do not use `Async<T>` for repositories or use-case contracts; keep domain/data
  returns as `DomainServiceType<T>` / `Either<Failure, T>`.

### `SafeEmitMixin<State>`

- The mixin is declared with a type parameter, but in Cubits write **`with SafeEmitMixin`**
  **without** repeating the state type: Dart **infers** it from **`extends Cubit<…>`** (see
  **`RegisterCubit`** under `lib/src/authentication/presentation/register/manager/`). Use
  **`SafeEmitMixin<SomeState>`** only if the analyzer cannot infer (rare).
- New feature Cubits should prefer **`with SafeEmitMixin`** so **`emit`** is a
  no-op when the cubit is closed (see `safe_emit_mixin.dart`).
- Do **not** duplicate **`if (isClosed) return;`** before **`emit`** after **`await`**
  or inside **`.then`** when the cubit only **`emit`**s — the mixin already guards
  **`emit`**. Keep an early return only to skip **non-emit** side effects after await,
  or when the cubit does not use **`SafeEmitMixin`** (legacy).
- Legacy Cubits may inline `if (!isClosed) super.emit(...)`; do not copy that
  pattern into new Cubits unless the surrounding file already uses it.

### `part of core`

- These files are declared **`part of core`** and rely on the parent library imports (e.g. `Equatable`, `Failure`, `Cubit`). **Do not duplicate imports** inside parts unless the analyzer requires a local import for a narrow symbol.
