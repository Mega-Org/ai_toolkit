# Feature data layer layout

## Purpose

Keep **feature** `data/` folders aligned with clean architecture: API paths, remote/local IO, DTOs, and repository implementations stay discoverable and consistent across phases (`implement-phase`, `make-plan`).

## Standard folders

Under `lib/src/<feature>/data/`:

| Folder | Role |
|--------|------|
| **`api/`** | Relative URL builders / path constants only (e.g. `auth_api_paths.dart`). **Remote datasources** import this; presentation does not. |
| **`datasources/`** | Remote and/or local data access. **While the feature has only remote calls**, place implementations **directly** under `datasources/` (flat). When **local** persistence is added for this feature, introduce **`datasources/remote/`** and **`datasources/local/`** and move implementations accordingly. |
| **`models/`** | Feature DTOs, JSON models, mappers — not domain entities. |
| **`repository/`** | `*RepositoryImpl` implementing the feature domain repository. |

### Abstract datasource + implementation (same file)

For each datasource module, prefer:

1. An **`abstract class`** naming the capability (e.g. `ClientAuthenticationRemoteDataSource`) with **only** method signatures and doc comments.
2. A concrete **`…Impl`** class in the **same file**, implementing that abstract class.
3. **`@Injectable(as: TheAbstractClass)`** on the implementation so repositories and tests depend on the abstract type.

This matches core patterns (e.g. `SecureStorageDataSource` / `SecureStorageDataSourceImpl`) and keeps swap-friendly stubs or real HTTP implementations next to the contract. Regenerate DI after adding or renaming `@injectable` bindings.

### Formal parameters: `final` where applicable

In datasource (and similar IO) method signatures, prefer **`final`** on formal parameters when the binding is not reassigned in the body. Apply the same in private helpers (`_stub`, `_fetch`, …).

### Use-case params at the datasource boundary (not raw maps)

When the corresponding use case takes a **`NoParams` subclass** (feature params with a `toMap`), remote datasource methods should accept **that param type** — e.g. `Future<void> login(final LoginParams params)` — and call **`params.toMap`** only inside the datasource (or pass fields into Dio). Use cases whose repository API is **`NoParams`** literally (`logout`, `getProfile`, …) stay **parameterless** on the datasource. The repository then forwards **`params` objects** without building maps for HTTP.

### Inline HTTP and response parsing (no single-use private helpers)

Each public datasource method should contain the **`DioHelper` call and all JSON shaping for that endpoint** in one place. Do not extract `_paginatedPayload`, `_unwrap*`, or similar private methods used by only one public method. See [`../../rules/flutter/remote-data-sources.md`](../../rules/flutter/remote-data-sources.md) and [`remote-data-source-inline.md`](remote-data-source-inline.md).

## Rules of thumb

- **No observer hubs** in `data/` or `domain/` — broadcast observers and `*ObserverUpdater.notify…` belong in presentation only ([`../../rules/architecture/observer-presentation-only.md`](../../rules/architecture/observer-presentation-only.md)).
- **One import surface for HTTP paths** per feature: `api/` (or a single module there), not duplicated in cubits or pages.
- **Repository** orchestrates datasources and maps to domain entities; it does not own raw path strings.
- Regenerate DI (`build_runner`) after renaming or moving `@injectable` datasources or repository impls.

## References

- Network: [`../../rules/core/network.md`](../../rules/core/network.md)
- Phase workflow: [`../../workflows/feature-delivery/implement-phase.md`](../../workflows/feature-delivery/implement-phase.md)
