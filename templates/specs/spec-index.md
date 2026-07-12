# App AI Specs Index

Start here before creating or loading app-specific specs.

## Spec Areas

| Area | Purpose | Default shape |
|------|---------|---------------|
| `brd/` | Stable business truth from BRDs and product documents. | `brd/INDEX.md`, `analysis/`, `app_surfaces/`, `features/`, `source/` |
| `design/` | Stable UI/nav truth from Figma (screens, flows, graph). | `design/INDEX.md`, `analysis/`, `features/`, `flows/`, `screens/`, `app_surfaces/`, `source/` |
| `api/` | API collection truth (Postman/Apidog/OpenAPI), gaps, collection handoff. | `api/INDEX.md`, `COLLECTION_HANDOFF.md`, `analysis/`, `features/`, `source/`, `history/` |
| `features/` | Feature requirements + execution plans. | `features/<feature>/README.md`, `features/<feature>/plan.md` |
| `fixes/` | Optional bug investigations (per app). | `fixes/YYYY-MM-DD-short-slug/README.md` |
| `integrations/` | Optional cross-feature external services. | `integrations/<service>/README.md` |
| `archive/` | Superseded specs. | `archive/<date-or-slug>/...` |

Refactors, theme work, and tooling changes use `ai_toolkit/workflows/maintenance/refactor.md` and `ai_docs/` — not a separate `changes/` spec area in the toolkit.

## Feature Delivery Flow

1. **make-plan** — [`ai_toolkit/workflows/feature-delivery/make-plan.md`](../../workflows/feature-delivery/make-plan.md): write/update `README.md` (requirements) and `plan.md` (phases).
2. **implement-phase** — [`ai_toolkit/workflows/feature-delivery/implement-phase.md`](../../workflows/feature-delivery/implement-phase.md): implement one phase; update `plan.md` progress.
3. **verify-and-pr** — when all phases are `done`.

## Standard Spec Header (`README.md`)

```md
Status: draft | approved | in-progress | done | superseded
Type: feature | fix | integration
Related BRD: `ai_specs/brd/features/<feature>.md` or `none`
Related design: `ai_specs/design/features/<feature>.md` or `none`
Surfaces: customer | provider | admin | core | tooling
Owner: product | design | backend | frontend | admin policy | legal/compliance
Last updated: YYYY-MM-DD
```

## Loading Rules

1. Feature work: this file → `brd/INDEX.md` (if present) → `design/INDEX.md` (if present, for UI) → `api/INDEX.md` (if present, for HTTP contracts) → `features/<feature>/README.md` → `features/<feature>/plan.md`.
2. Design-only UI intake: `design/INDEX.md` → glossary → feature design / screens / navigation-graph (see [`figma-analysis`](../../workflows/product-analysis/figma-analysis.md)).
3. API collection intake / handoff: `api/INDEX.md` → feature `edit-brief.md` → pack [`COLLECTION_HANDOFF.md`](../api/collection-handoff.md) (see [`api-analysis`](../../workflows/api-analysis/_index.md)).
4. Fixes (optional): `fixes/.../README.md` → related feature `README.md` + BRD + design when UI-related.
5. Mark unknowns as `TBD(owner): note`.
