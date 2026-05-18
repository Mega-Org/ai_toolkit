# Remote data sources (`*RemoteDataSourceImpl`)

## Purpose

Keep HTTP call sites and response shaping **visible in each public method** so reviews can trace URL, body, query, and JSON envelope without jumping through single-use private helpers.

## Must

- Call **`DioHelper`** (`get` / `post` / `put` / `delete`) **in the public method body** with paths from the feature **`api/`** module.
- Parse the response **in that same method** — field reads, nested `data` / `notifications` unwrap, `ApiPaginatedData.fromJson`, model `fromJson`, primitive coercion.
- Build request bodies from **`NoParams.toMap`** (or feature param `toMap`) when a param type exists — not ad-hoc maps when a param object is already defined.

## Must not

- Add a private method whose **only** caller is one public endpoint and whose **only** job is forwarding to `DioHelper` or unwrapping that endpoint’s JSON (e.g. `_paginatedPayload`, `_unwrapOrder`, `_fetchList`).
- Use `print` / `debugPrint` for requests or responses — `PrettyDioLogger` on `DioHelper` is enough ([`../../.cursor/rules/no-request-prints.mdc`](../../../.cursor/rules/no-request-prints.mdc) when present).

## Allowed private helpers

Only when **two or more** public methods share the **same** non-trivial wiring (identical envelope path, shared error extraction) and the helper is documented. Default: **inline**.

## References

- Pattern (paginated GET inline): [`../../patterns/data/remote-data-source-inline.md`](../../patterns/data/remote-data-source-inline.md)
- Feature `data/` layout: [`../../patterns/data/feature-data-layer.md`](../../patterns/data/feature-data-layer.md)
- Network / failures: [`../core/network.md`](../core/network.md)
- Cursor rule (globs): [`../../../.cursor/rules/flutter-remote-datasources.mdc`](../../../.cursor/rules/flutter-remote-datasources.mdc)
