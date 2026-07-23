# Analyze API Collection (Full)

## Purpose

Create an app-specific API knowledge base from a collection/OpenAPI source: feature map, inventory, gap reports, per-feature edit briefs (**collection** edits + questions), and readiness for collection handoff packing.

Outputs live under `ai_specs/api/`. Playbooks stay in `ai_toolkit/`.

## Fill When

- First analysis of a project's API collection.
- Major collection reorg (new folders/tags) where incremental reanalyze is insufficient.
- User asks for full API analysis / Postman / Apidog audit.

## Inputs

1. **Snapshot** — run [`ingest-collection.md`](ingest-collection.md) first if `source/snapshot.json` is missing or stale.
2. **App context** — `ai_docs/`, `ai_specs/INDEX.md`, `ai_specs/brd/`, `ai_specs/design/` when present, and root `ai_specs/features/` when present (for “service not found” vs product / build specs).
3. **Templates** — [`../../templates/api/`](../../templates/api/_index.md).

## Output Shape

```text
ai_specs/api/
  README.md
  INDEX.md
  COLLECTION_HANDOFF.md       # create/update via pack workflow; optional at end of full analyze
  source/
    snapshot.json
    snapshot.meta.md
  analysis/
    inventory.md
    workflows.md
    gaps-index.md
  features/
    <feature>/
      overview.md
      endpoints.md
      gaps.md
      edit-brief.md           # Collection edits + Questions
    _orphan/
      ...
  history/
    YYYY-MM-DD-full-analysis.md
```

When the app has root `ai_specs/INDEX.md`, add/update an **API** area entry pointing at `api/INDEX.md`.

## Invocation Modes

| Mode | Scope |
|------|--------|
| Full (this file) | All features |
| Feature | Use [`feature-api-report.md`](feature-api-report.md) |
| Reanalyze | Use [`reanalyze-collection.md`](reanalyze-collection.md) |
| Pack only | Use [`pack-collection-handoff.md`](pack-collection-handoff.md) |

## Steps

1. **Ingest if needed** — Ensure fresh `source/snapshot.*` via ingest workflow.
2. **Scaffold** — Create `README.md` and `INDEX.md` from templates if missing. Fill source IDs and last-run dates.
3. **Build inventory** — Flatten every operation into `analysis/inventory.md` (method, path, id, summary, folder/tag, auth, request schema?, success response?, error responses?, examples?).
4. **Feature map** — Assign each operation to a stable feature key:
   - Prefer Apidog/Postman **folders** or OpenAPI **tags**.
   - Else path prefix conventions.
   - Else override table in `INDEX.md`.
   - Unmapped → `_orphan`.
   Align feature keys with BRD / `ai_specs/features/` names when possible (glossary-stable English slugs).
5. **Automated checks (when MCP available)** —
   - Apidog: `apidog_analyze` (`coverage`, `validate`); optional `apidog_diff` only if comparing to a prior export.
   - Map tool findings into gap types below; do not stop at tool output alone.
6. **Gap pass (every operation)** — Classify into:

   | Gap type | Meaning |
   |----------|---------|
   | Documentation | Empty/weak summary, description, param docs |
   | Response coverage | Missing success body, missing 4xx/5xx examples/schemas |
   | Request completeness | Missing body/schema, undocumented required params |
   | Workflow / journey | Incomplete flow (e.g. login without refresh/logout) |
   | Feature mapping | Orphan / unclear / hidden folder |
   | Service not found | BRD or feature spec expects an API; collection has none |
   | Ambiguity | Duplicates, conflicting schemas, unclear auth |
   | Unreachable | Auth/env not documented so client cannot call |

7. **Workflows file** — In `analysis/workflows.md`, list multi-step API journeys detected or expected from BRD; mark missing steps.
8. **Per-feature files** — For each feature (and `_orphan`):
   - `overview.md` — purpose, auth, related BRD/feature links
   - `endpoints.md` — table of operations
   - `gaps.md` — severity-tagged findings (`blocker` / `should-fix` / `nice`)
   - `edit-brief.md` — **Collection edits** (Apidog/Postman docs/examples/responses/folders) + **Questions** (stable IDs `Q-<feature>-NN`; note if follow-up is collection-only vs real API)
9. **Gaps index** — Roll up counts by feature and severity in `analysis/gaps-index.md`.
10. **History** — Write `history/YYYY-MM-DD-full-analysis.md` with snapshot hash and high-level counts.
11. **Pack (recommended)** — Run [`pack-collection-handoff.md`](pack-collection-handoff.md) so `COLLECTION_HANDOFF.md` is ready to send.
12. **Report to user** — Summarize feature count, blocker count, path to `COLLECTION_HANDOFF.md`, and open question count. Remind them edits are **collection-scoped**.

## Quality Rules

- Do **not** invent request/response shapes, status codes, or endpoints. Use `TBD(backend)` / `TBD(product)` / questions instead.
- Keep files small; agents should load one `features/<name>/` at a time.
- Prefer English feature slugs shared with BRD.
- Clear documentation gaps with known intent → **Collection edits**. Unknown contract → **Questions**.
- Severity: missing critical happy-path contract = `blocker`; incomplete errors/docs = `should-fix`; polish = `nice`.
- Secrets never appear in reports; use placeholders.
- Do not phrase collection edits as “implement backend handlers” unless the gap is a missing real endpoint (then use a Question with follow-up `real API change`).

## AI Decision Cases

| Case | Behavior |
|------|----------|
| Endpoint with no folder/tag | Put in `_orphan`; add mapping question if unclear |
| BRD feature with zero APIs | `Service not found` + question in that feature (or create stub feature) |
| Apidog analyze vs human judgment conflict | Prefer concrete snapshot evidence; note both |
| Duplicate paths | Ambiguity question: which is canonical? |
| Example exists but no schema | Edit: add schema; or question if example is untrusted |
| Auth global but undocumented on ops | Gap: unreachable / auth docs |

## Done When

- Inventory + feature map + gaps-index exist.
- Every feature with APIs (and `_orphan` if used) has `edit-brief.md` with Collection edits and/or Questions sections.
- User knows where `COLLECTION_HANDOFF.md` is (after pack) or is told to run pack next.
