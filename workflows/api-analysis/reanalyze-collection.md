# Reanalyze API Collection

## Purpose

Update `ai_specs/api/` after the remote or local collection changes — **diff-driven**, not a blind full rewrite. Refresh only touched features' gaps and edit-briefs; write a delta history entry; optionally re-pack the **collection** handoff.

## Fill When

- User says collection updated / reanalyze API / refresh API analysis.
- After owners applied previous `COLLECTION_HANDOFF.md` collection fixes.
- Before a new handoff pack when snapshot may be stale.

## Inputs

1. Previous `source/snapshot.json` + `snapshot.meta.md` (hash).
2. Fresh ingest via [`ingest-collection.md`](ingest-collection.md).
3. Existing `analysis/inventory.md` and `features/*/`.
4. Templates: [`../../templates/api/reanalysis-delta.md`](../../templates/api/reanalysis-delta.md).

## Modes

| Mode | Behavior |
|------|----------|
| Default | Diff all; update changed features only |
| `feature <name>` | Ingest + reanalyze one feature (still refresh snapshot) |
| `gaps-only` | Prefer Apidog `apidog_analyze` / `apidog_diff` then map into existing features |
| Force full | If folder/tag layout collapsed or INDEX feature map invalid → switch to [`analyze-collection.md`](analyze-collection.md) |

## Steps

1. **Record old hash** — From current `snapshot.meta.md`.
2. **Ingest** — New snapshot + new hash.
3. **Short-circuit** — If new hash equals old hash: update “last checked” in `INDEX.md`, tell user nothing changed, stop (unless user forced full).
4. **Diff** —
   - Apidog: `apidog_diff` against previous OpenAPI if available.
   - Else: compare inventories (added / removed / method-path changed / schema or example materially changed).
5. **Map diff → features** — Using `INDEX.md` feature map; new unmapped ops → `_orphan`.
6. **Update only affected features** — Rewrite `endpoints.md`, `gaps.md`, `edit-brief.md` for those features. Preserve stable question IDs when the same question remains open; drop resolved ones; add new IDs for new questions.
7. **Refresh rollups** — `analysis/inventory.md`, `analysis/gaps-index.md`, `analysis/workflows.md` if journeys changed.
8. **History** — `history/YYYY-MM-DD-reanalysis.md` from reanalysis-delta template (added/removed/changed + features touched).
9. **Pack** — Run [`pack-collection-handoff.md`](pack-collection-handoff.md) unless user asked analysis-only.
10. **Report** — List changed features, remaining blockers/questions, path to `COLLECTION_HANDOFF.md`.

## Quality Rules

- Do not rewrite untouched feature files.
- Do not silently clear open questions unless evidence shows they are resolved.
- If diff is huge (>~40% operations changed) or feature map breaks, recommend or run full analyze.
- Same no-invention rule as full analyze.

## Done When

- New snapshot hash stored.
- Delta history written (or explicit no-op).
- Touched edit-briefs and gaps-index are current.
- Handoff packed when requested/default.
