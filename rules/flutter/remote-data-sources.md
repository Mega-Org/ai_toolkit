## Agent card

**LOADMAP tags:** `data`
**Read rest of this file:** no — this file is the full rule. Open the inline pattern only if you need a paginated GET sample.

### Must
- Call `DioHelper` in the **public** method body with paths from feature `api/`.
- Parse the response in that same method (envelope, `fromJson`, primitives, pagination model).
- Build bodies from `NoParams.toMap` / feature `toMap` when a param type exists.

### Must not
- Add a private helper whose only caller is one public endpoint and whose only job is Dio or unwrap (`_paginatedPayload`, `_unwrap*`, `_fetchList`).
- `print` / `debugPrint` requests or responses (`PrettyDioLogger` is enough).

### When to load the rest
- Shared helper allowed only when **two or more** public methods share the same non-trivial wiring.

### Related (cards first)
- Untagged pattern: `patterns/data/remote-data-source-inline.md` if you need the sample.
- `feature-data-layer.md`, `network.md`.

### Card protocol
- Default: this card is enough. Use `limit: 60` so you do not ingest the full leaf.
- Read the rest of **this** file only when **Read rest** is yes, or **When to load the rest** matches.
- Do not open `INDEX.md`, `rules/_index.md`, or `patterns/_index.md` to rediscover this leaf.
- Related files: open their **Agent cards** first; skip them if the other tag was not requested.
- No `tests` tag. Do not write or run tests. Do not commit unless the user asks.
- Edit in place; do not rewrite the whole leaf to “clean it up.”
- If the body is a stub (`Fill in later`), stop after this card; do not invent policy.
- Indexes, templates, and untagged leaves are not part of this tag.
- Spec templates, skills, and backend-contract work belong to later plan todos — not this card.

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
