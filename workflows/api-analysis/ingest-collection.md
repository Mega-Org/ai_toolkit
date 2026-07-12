# Ingest API Collection

## Purpose

Pull the current API collection (or OpenAPI) into a durable local snapshot under the app repo so analysis does not depend on live MCP every time. Prefer **OpenAPI snapshot first**; use Postman/Apidog MCP as adapters.

## Fill When

- First API analysis for an app.
- Before reanalyze when the remote collection may have changed.
- Offline / local AI needs a file reference without MCP.

## Inputs

1. **Source pointer** — from `ai_specs/api/INDEX.md` when present: Apidog project/module, Postman workspace/collection UID, or path to a local export.
2. **Tooling** — Apidog MCP, Postman MCP, or a user-provided OpenAPI / Postman Collection v2.1 file.
3. **Templates** — [`../../templates/api/snapshot-meta.md`](../../templates/api/snapshot-meta.md), [`../../templates/api/inventory.md`](../../templates/api/inventory.md).

## Output Shape

```text
ai_specs/api/
  source/
    snapshot.json          # OpenAPI preferred; else Postman Collection v2.1
    snapshot.meta.md       # source tool, IDs, hash, timestamp
  analysis/
    inventory.md           # optional seed; full analyze may rewrite
```

Do not commit secrets, tokens, or environment credential values. Redact or replace with placeholders.

## Adapter Steps

### A — Apidog MCP

1. `apidog_modules` — resolve project + module names.
2. `apidog_export` — write OpenAPI to `source/snapshot.json` (or save export content there).
3. Optional: `apidog_folders` / `apidog_list` to note folder tree in `snapshot.meta.md`.
4. Optional: `apidog_analyze` results can be attached later during analyze (not required for ingest).

### B — Postman MCP

1. Resolve workspace + collection (`getWorkspaces` / `getCollections` / `searchPostmanElements` as needed).
2. Prefer generating OpenAPI via `generateSpecFromCollection` when available; poll task status; save definition to `source/snapshot.json`.
3. Fallback: `getCollection` map + request details, or export Collection v2.1 into `source/snapshot.json` and note format in meta.
4. Do not put API keys in the snapshot.

### C — Local file

1. Copy user-provided OpenAPI or Postman JSON to `source/snapshot.json`.
2. Record original filename and who provided it in `snapshot.meta.md`.

## Always Do After Any Adapter

1. Compute a content hash of `snapshot.json` (e.g. sha256) and store in `snapshot.meta.md`.
2. Record: tool, project/module or collection UID, export time, format (`openapi-3.x` | `postman-2.1`).
3. If a previous `snapshot.json` exists, move it aside only if reanalyze needs it — prefer keeping previous hash in meta / history rather than deleting blindly.
4. Update `INDEX.md` **Last ingest** fields when that file exists.

## Quality Rules

- One canonical snapshot path: `source/snapshot.json`.
- Prefer OpenAPI over Postman JSON when both are available.
- Never invent endpoints during ingest; only persist what the source returns.
- If MCP auth fails, stop and ask the user; do not fabricate a snapshot.

## Done When

- `source/snapshot.json` and `source/snapshot.meta.md` exist and hash is recorded.
- Agent reports source tool + hash to the user.
