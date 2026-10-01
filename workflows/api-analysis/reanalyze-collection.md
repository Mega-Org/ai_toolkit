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
4. `ai_specs/api/contracts/INDEX.md` when present (agreed replies for changed features).
5. Templates: [`../../templates/api/reanalysis-delta.md`](../../templates/api/reanalysis-delta.md).

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
6. **Update only affected features** — Rewrite `endpoints.md`, `gaps.md`, `edit-brief.md` for those features. Preserve stable question IDs when the same question remains open; drop resolved ones; add new IDs for new questions. **Never reopen** a gap marked `answered by contract`.
7. **Contracts** — Read `ai_specs/api/contracts/INDEX.md` rows for features that changed (skip if the register is missing). For each agreed reply:
   - **Collection matches the agreed reply:** set register **Collection synced** to `yes`. Close matching gaps only with an append note (already answered by contract — do not reopen).
   - **Collection differs from the agreed reply:** add a **Collection lags reply** table to that feature’s `edit-brief.md` (operation, collection today, agreed reply, contract). This is **not** a new gap or question; it goes into the next collection handoff.
   - Check the reply’s **Collection examples updated** list against the snapshot diff.
8. **Refresh rollups** — `analysis/inventory.md`, `analysis/gaps-index.md`, `analysis/workflows.md` if journeys changed.
9. **History** — `history/YYYY-MM-DD-reanalysis.md` from reanalysis-delta template (added/removed/changed + features touched).
10. **Pack** — Run [`pack-collection-handoff.md`](pack-collection-handoff.md) unless user asked analysis-only.
11. **Report** — List changed features, remaining blockers/questions, path to the dated handoff archive (pointer in `COLLECTION_HANDOFF.md`).

## Quality Rules

- Do not rewrite untouched feature files.
- Do not silently clear open questions unless evidence shows they are resolved.
- Gaps marked answered by a contract are never reopened.
- If diff is huge (>~40% operations changed) or feature map breaks, recommend or run full analyze.
- Same no-invention rule as full analyze.

## Done When

- New snapshot hash stored.
- Delta history written (or explicit no-op).
- Touched edit-briefs and gaps-index are current.
- Handoff packed when requested/default.
