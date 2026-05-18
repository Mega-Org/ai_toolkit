# Dio and repositories

## Purpose
Example-shaped guidance for Dio usage in repositories, aligning with `rules/core/network.md`.

## Fill when
- When repository patterns or API client layering changes.

## References
- `patterns/data/either-and-failures.md`

## Content

- **Remote datasources** call `DioHelper` and parse JSON **inside each public method** — no private helpers used by a single endpoint. Rule: [`../../rules/flutter/remote-data-sources.md`](../../rules/flutter/remote-data-sources.md). Examples: [`remote-data-source-inline.md`](remote-data-source-inline.md).
- **Repositories** wrap datasource calls with **`collectFailure`** and return **`DomainServiceType`** / **`Either<Failure, T>`** — see [`either-and-failures.md`](either-and-failures.md).
- **Paths** live in feature **`data/api/`**; datasources import paths only, not cubits/pages.
