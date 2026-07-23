# App AI Specs Index

Start here before creating or loading app-specific specs. Prefer also reading [`README.md`](README.md) (same folder) for the layer mental model.

## Pipeline (analysis → build)

```text
Sources → Analysis KBs              → Build specs              → Code
          brd/  design/  api/         features/<slug>/
                                      README.md + plan.md
```

| Layer | Path | Answers | Updated by |
|-------|------|---------|------------|
| Business truth | `brd/` | What are the product rules? | [`brd-analysis`](../../workflows/product-analysis/brd-analysis.md) |
| UI / nav truth | `design/` | What screens and flows exist? | [`figma-analysis`](../../workflows/product-analysis/figma-analysis.md) |
| Collection truth | `api/` | What does the API collection say? | [`api-analysis`](../../workflows/api-analysis/_index.md) |
| **Build (implementation)** | **`features/<slug>/`** | What are we building in Flutter, and what phase is done? | [`make-plan`](../../workflows/feature-delivery/make-plan.md) / [`implement-phase`](../../workflows/feature-delivery/implement-phase.md) |
| Bug investigation | `fixes/` | What bug are we fixing? | [`bugfix`](../../workflows/maintenance/bugfix.md) |

**Four folders named `features/` is intentional** — same slug, different ownership:

| Path | Owns |
|------|------|
| `brd/features/<slug>.md` | Business rules, eligibility |
| `design/features/<slug>.md` | Screens, flows, Figma pointers |
| `api/features/<slug>/` | Endpoints, gaps, collection edit-briefs |
| `features/<slug>/` | Flutter requirements (`README.md`) + execution (`plan.md`) |

Do **not** put `plan.md` under `brd/`, `design/`, or `api/`. Do **not** treat analysis KBs as substitutes for root `features/<slug>/`.

**Naming note:** toolkit `ai_toolkit/workflows/` = agent playbooks. `api/analysis/workflows.md` = **API journeys** (multi-step HTTP flows), not playbooks.

## Spec Areas

| Area | Purpose | Default shape |
|------|---------|---------------|
| `brd/` | Stable business truth from BRDs and product documents. | `brd/INDEX.md`, `analysis/`, `app_surfaces/`, `features/`, `source/` |
| `design/` | Stable UI/nav truth from Figma (screens, flows, graph). | `design/INDEX.md`, `analysis/`, `features/`, `flows/`, `screens/`, `app_surfaces/`, `source/` |
| `api/` | API collection truth (Postman/Apidog/OpenAPI), gaps, collection handoff. | `api/INDEX.md`, `COLLECTION_HANDOFF.md`, `analysis/`, `features/`, `source/`, `history/` |
| `features/` | **Build layer** — implementation requirements + phased plans. | `features/<feature>/README.md`, `features/<feature>/plan.md` |
| `fixes/` | Optional bug investigations (per app). | `fixes/YYYY-MM-DD-short-slug/README.md` |
| `integrations/` | Optional cross-feature external services. | `integrations/<service>/README.md` |
| `archive/` | Superseded specs. | `archive/<date-or-slug>/...` |

Refactors, theme work, and tooling changes use `ai_toolkit/workflows/maintenance/refactor.md` and `ai_docs/` — not a separate `changes/` spec area in the toolkit.

## Feature matrix

Keep one row per product feature slug. Link analysis KBs when they exist; leave `none` until analyzed. Status tracks the **build** folder only.

| Feature slug | BRD | Design | API | Implementation | Status |
|--------------|-----|--------|-----|----------------|--------|
| example | `brd/features/example.md` | `design/features/example.md` | `api/features/example/` | `features/example/` | draft \| in-progress \| done \| none |

## Feature Delivery Flow

1. **Analyze** (as needed) — BRD → design → API collection into their KBs.
2. **make-plan** — [`ai_toolkit/workflows/feature-delivery/make-plan.md`](../../workflows/feature-delivery/make-plan.md): write/update root `features/<slug>/README.md` (requirements) and `plan.md` (phases). Prefer linking existing BRD/design/api. On missing info or design↔api (or BRD) conflicts: **ask the user** — they decide now or choose `TBD(owner)`.
3. **implement-phase** — [`ai_toolkit/workflows/feature-delivery/implement-phase.md`](../../workflows/feature-delivery/implement-phase.md): implement one phase; update `plan.md` progress. Same ask-before-proceed gate for phase blockers.
4. **verify-and-pr** — when all phases are `done`.

## Standard Spec Header (`README.md`)

```md
Status: draft | approved | in-progress | done | superseded
Type: feature | fix | integration
Related BRD: `ai_specs/brd/features/<feature>.md` or `none`
Related design: `ai_specs/design/features/<feature>.md` or `none`
Related API: `ai_specs/api/features/<feature>/` or `none`
Surfaces: customer | provider | admin | core | tooling
Owner: product | design | backend | frontend | admin policy | legal/compliance
Last updated: YYYY-MM-DD
```

## Loading Rules

1. Feature work: this file → `brd/INDEX.md` (if present) → `design/INDEX.md` (if present, for UI) → `api/INDEX.md` (if present, for HTTP contracts) → **`features/<feature>/README.md`** → **`features/<feature>/plan.md`**.
2. Design-only UI intake: `design/INDEX.md` → glossary → feature design / screens / navigation-graph (see [`figma-analysis`](../../workflows/product-analysis/figma-analysis.md)).
3. API collection intake / handoff: `api/INDEX.md` → feature `edit-brief.md` → pack [`COLLECTION_HANDOFF.md`](../api/collection-handoff.md) (see [`api-analysis`](../../workflows/api-analysis/_index.md)).
4. Fixes (optional): `fixes/.../README.md` → related feature `README.md` + BRD + design when UI-related.
5. Mark unknowns as `TBD(owner): note` **only after the user chooses TBD** (see ask-before-proceed in make-plan / implement-phase). Do not invent or silently resolve design↔api conflicts.
6. Finished features stay under `features/` until superseded → then move to `archive/`.
