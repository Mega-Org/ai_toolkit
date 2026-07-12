# Feature API Report

## Purpose

Analyze or refresh **one** API feature folder under `ai_specs/api/features/<feature>/` without rewriting the whole API KB.

## Fill When

- Team is implementing or reviewing a single feature.
- User asks “analyze API feature auth” (or similar).
- Reanalyze scoped to one feature.

## Inputs

1. Feature key (slug). If unknown, resolve from `ai_specs/api/INDEX.md` or ask.
2. Current `source/snapshot.json` — ingest first if missing/stale when accuracy matters.
3. Related BRD/feature specs when present.
4. Templates under [`../../templates/api/`](../../templates/api/_index.md).

## Steps

1. Confirm feature key and folder list/tags from `INDEX.md`.
2. Filter inventory (or build a filtered list from snapshot) to this feature’s operations.
3. Run gap pass (same types as [`analyze-collection.md`](analyze-collection.md)).
4. Update `overview.md`, `endpoints.md`, `gaps.md`, `edit-brief.md` for that feature only.
5. Update rows for this feature in `analysis/gaps-index.md`.
6. Do **not** rewrite other features.
7. Optionally pack handoff if user wants to send collection owners an update (pack still merges **all** features unless pack mode is `feature <name>`).

## Done When

- That feature’s four files are current.
- User has paths to `edit-brief.md` and, if packed, `COLLECTION_HANDOFF.md`.
