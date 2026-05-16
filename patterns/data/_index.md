# Patterns: Data (`patterns/data/`)

## Purpose

**Data layer examples**: `json_serializable` models, Dio repositories, **`Either<Failure, T>`**, and domain **`IUseCase`** / **`DomainServiceType`** aligned with shared core patterns.

## Contents (this repo)

| File | Topic |
|------|--------|
| [`use-case-and-domain-service-type.md`](use-case-and-domain-service-type.md) | `IUseCase`, param structure, sealed variants, query getters, `DomainServiceType` |
| [`either-and-failures.md`](either-and-failures.md) | `Either<Failure, T>`, `collectFailure`, exception mapping, `fold` → `Async` / pagination |
| [`feature-data-layer.md`](feature-data-layer.md) | Feature `data/` layout: `api/`, flat `datasources/` vs `remote`/`local`, `models/`, `repository/` |
| [`manual-json-fromjson-primitives.md`](manual-json-fromjson-primitives.md) | Hand-written `fromJson`: **`int`** IDs, **`String`** fields, **`double`** / decimal strings — **always** follow for non-codegen DTOs |

**Planned leaf doc** (path reserved): [`dio-and-repositories.md`](dio-and-repositories.md).

## References

- Network and failure rules: [`../../rules/core/network.md`](../../rules/core/network.md)
- Tooling / `build_runner`: [`../../rules/tooling/build-runner.md`](../../rules/tooling/build-runner.md) (if missing locally, see toolkit [`../../README.md`](../../README.md))
- Patterns overview: [`../_index.md`](../_index.md)
