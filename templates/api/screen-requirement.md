# Screen data requirement: `<screen-slug>`

Copy to: `ai_specs/api/screen-requirements/<screen-slug>.md`

Produced by [`../../workflows/product-analysis/screen-data-analysis.md`](../../workflows/product-analysis/screen-data-analysis.md).

> **These are EXPECTED / derived API needs read from the design + BRD — not confirmed endpoints.**
> They feed API planning and gap analysis. **Implementation agents must NOT load this file** — they use
> `ai_specs/design/` for UI and `ai_specs/api/features/` for real endpoints. See the loading rules in the workflow.

## Meta

| Field | Value |
|-------|--------|
| Screen slug | (matches `design/screens/<slug>.md`) |
| Feature | |
| Surface | customer \| provider \| admin \| … |
| Design node | `ai_specs/design/screens/<slug>.md` |
| BRD feature | `ai_specs/brd/features/<feature>.md` or none |
| Status | expected (pre-API) |
| Last updated | YYYY-MM-DD |

## Data displayed (reads)

| UI element | Fields the screen shows | Expected source | Notes |
|------------|-------------------------|-----------------|-------|
| | | | |

## User actions (writes / calls)

| Action | Trigger | Expected operation | Payload / params | Notes |
|--------|---------|--------------------|------------------|-------|
| | | | | |

## Expected API operations

> Suggested only. Real method/path/shape is decided by the collection (`api/features/`), not here.

| Need | Suggested method | Suggested path | Read/Write | Confidence |
|------|------------------|----------------|------------|------------|
| | GET/POST/… | /… | read/write | guess |

## States needing data

| State | Data condition |
|-------|----------------|
| Loading | request in flight |
| Empty | list returns 0 items |
| Error | 4xx / 5xx handling |

## Open

- `TBD(backend): …` (pagination style, field names, auth)
- `TBD(product): …` (business rule behind an action)
- `TBD(design): …` (element with unclear data)
