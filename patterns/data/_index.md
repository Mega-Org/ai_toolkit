# Patterns: Data (`patterns/data/`)

## Purpose

**Data layer examples**: `json_serializable` models, Dio repositories, **`Either<Failure, T>`**, and domain **`IUseCase`** / **`DomainServiceType`** aligned with shared core patterns.

## Contents (this repo)

| File | Topic |
|------|--------|
| [`use-case-and-domain-service-type.md`](use-case-and-domain-service-type.md) | `IUseCase`, param structure, sealed variants, query getters, `DomainServiceType` |

**Planned leaf docs** (paths reserved; follow [`../../README.md`](../../README.md) until added): `json-models-json-serializable.md`, `dio-and-repositories.md`, `either-and-failures.md`. Task routing also lists them from [`../../INDEX.md`](../../INDEX.md) when present.

## References

- Network and failure rules: [`../../rules/core/network.md`](../../rules/core/network.md)
- Tooling / `build_runner`: [`../../rules/tooling/build-runner.md`](../../rules/tooling/build-runner.md) (if missing locally, see toolkit [`../../README.md`](../../README.md))
- Patterns overview: [`../_index.md`](../_index.md)
