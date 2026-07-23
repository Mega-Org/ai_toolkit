# Screen Data Analysis Workflow

## Purpose

Bridge **design → API**. For each screen in the design KB, describe **what data it displays**, **what actions send data**, and the **expected API operations** that would power it. The output is a set of per-screen requirement files under the app repo's `ai_specs/api/screen-requirements/`, while this reusable workflow and its template stay in `ai_toolkit/`.

These files are **expected / derived needs**, not confirmed contracts. They are especially useful **before an API collection exists**: they tell the backend what each page needs, and they let [`../api-analysis/analyze-collection.md`](../api-analysis/analyze-collection.md) detect **"Service not found"** gaps (a screen needs data no endpoint provides).

## Separation of concerns (read this first)

| Layer | Owns | Loaded during |
|-------|------|---------------|
| `design/screens/<slug>.md` | UI, navigation, components, states | **UI implementation** |
| `api/screen-requirements/<slug>.md` (this workflow) | Expected data + expected endpoints per screen | **API planning only** |
| `api/features/<slug>/` | Real endpoints, gaps, edits | **Data/integration implementation** |

**Rule:** keep design files pure UI/navigation (no API opinions). Keep this workflow's output under `api/screen-requirements/`. **Implementation agents do not load `screen-requirements/`** — they load `design/` for UI and `api/features/` for real HTTP contracts. This prevents an agent from treating a *guessed* endpoint as real.

## Fill When

- Design KB (`ai_specs/design/`) exists and you want to know what each screen needs from the API.
- No API collection exists yet and you need a requirements document to send to backend.
- Before API analysis, to seed "expected vs actual" gap detection.

## Inputs

1. **Design KB** — `ai_specs/design/INDEX.md`, `design/screens/*.md`, `design/features/*.md`, `analysis/glossary.md`.
2. **BRD** — `ai_specs/brd/features/*.md` for business rules behind actions (when present).
3. **Figma (optional)** — load screen-node Figma URLs via MCP to confirm displayed fields.
4. **API KB (if any)** — `ai_specs/api/INDEX.md` to reuse feature slugs.
5. **Template** — [`../../templates/api/screen-requirement.md`](../../templates/api/screen-requirement.md).

## Output Shape

```text
ai_specs/api/
  screen-requirements/
    _index.md              # screen → feature map + status
    <screen-slug>.md       # one per navigable screen (matches design/screens/<slug>)
```

Use glossary-stable slugs that match `design/screens/<slug>.md` exactly.

## Invocation Modes

| Mode | Scope |
|------|--------|
| Full | All MVP screens in the design KB |
| `feature <name>` | Screens for one feature only |
| `screen <slug>` | One screen |
| Refresh | Re-derive after design changed for a screen/feature |

## Steps

1. **Resolve scope** — List target screens from `design/INDEX.md` feature routing (MVP first). Reuse existing feature slugs.
2. **Read the screen** — Load `design/screens/<slug>.md` (and its Figma node via MCP when confirmation is needed). Identify every displayed element and every interactive action.
3. **Data displayed (reads)** — For each element, list the fields it shows and the expected source. Do not invent field names the design does not imply — mark unknowns `TBD`.
4. **User actions (writes)** — For each action, describe the expected operation and payload/params. Cross-check business rules in the BRD feature file; do not invent validation.
5. **Expected API operations** — Suggest method + path + read/write, marked **guess**. These are hints for backend and for gap analysis, never implementation truth.
6. **States needing data** — Note loading / empty / error data conditions (design often omits these — record as `TBD(design)`).
7. **Write the file** — Use `screen-requirement.md`. Keep the "expected / not confirmed" banner intact.
8. **Index** — Update `screen-requirements/_index.md` (screen → feature → status). Do **not** modify `design/` files.
9. **Report** — Screens covered, features touched, and the list of `TBD(backend/product/design)` items worth sending to backend.

## Quality Rules

- **Do not invent endpoints, field names, or validation.** Everything here is `expected` and labeled as such; unknowns are `TBD(owner)`.
- Keep the output out of `design/` (design stays pure UI) and out of the implementation load path.
- One file per screen; slug matches the design screen node exactly.
- Prefer reusing BRD/design/API feature slugs from the glossary.
- These files are consumed by API planning and `analyze-collection` (Service-not-found detection) — they are **not** a substitute for `api/features/` real contracts.
- When `api/features/<feature>/` later documents the real endpoints, treat this file as superseded for that feature (archive or mark `covered`).

## AI Decision Cases

| Case | Behavior |
|------|----------|
| Element shows data with no obvious source | Record field; mark expected source `TBD(backend)` |
| Action implies a business rule | Link BRD; if absent, `TBD(product)` — do not invent the rule |
| Design shows no empty/error state | Record `TBD(design)`; still note the data condition |
| Screen already has `api/features/` real endpoints | Note "covered by api/features/<feature>"; do not duplicate as real |
| Two screens share the same data | Reference the shared expected operation; avoid conflicting guesses |

## Handoff

1. Send the derived needs to backend (they can also come through [`../api-analysis/pack-collection-handoff.md`](../api-analysis/pack-collection-handoff.md) once a collection exists — as `Service not found` questions).
2. When a collection exists, run [`../api-analysis/analyze-collection.md`](../api-analysis/analyze-collection.md); it uses these files to flag screens with no backing endpoint.
3. At build time, [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md) reconciles design + real API; its ask-before-proceed gate handles any mismatch.

See the end-to-end guide: [`../full-pipeline.md`](../full-pipeline.md).
