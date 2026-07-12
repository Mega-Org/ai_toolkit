# API specs — how to use and update

Copy to: `ai_specs/api/README.md`

## Purpose

This folder is the app's **API collection** knowledge base (Postman / Apidog / OpenAPI). Shared playbooks live in `ai_toolkit/workflows/api-analysis/`.

## Say this to the AI

| Intent | Phrase |
|--------|--------|
| First / full analysis | `API full analysis` or `Analyze API collection` |
| After collection changes | `API reanalyze` or `Reanalyze API collection` |
| One feature | `Analyze API feature <name>` |
| Refresh snapshot only | `Ingest API collection` |
| File for collection owners | `Pack collection handoff` |

## Where files live

```text
ai_specs/api/
  README.md                 ← this file
  INDEX.md                  ← collection IDs + feature map
  COLLECTION_HANDOFF.md     ← ★ send THIS (collection-scoped)
  source/snapshot.json      ← local OpenAPI/collection (usually not for owners)
  analysis/                 ← inventory, gaps-index, workflows
  features/<feature>/       ← team + AI; edit-brief.md feeds the pack
  history/                  ← reanalysis deltas
  handoff/                  ← optional dated copies of handoff
```

## Send to collection owners (usually backend)

1. Run analyze or reanalyze (as needed).
2. Run **Pack collection handoff**.
3. Send only:

```text
ai_specs/api/COLLECTION_HANDOFF.md
```

That file is **specific to your named collection** (module/collection ID in the header). It includes:

- **Questions** — decide/document (may need real API or product)
- **Collection edits** — apply in Apidog/Postman (docs, examples, responses, folders) — **not** “rewrite server code” by default
- What we did **not** invent

Optional: attach `analysis/gaps-index.md` for severity overview.

## Update loop

1. Owners update the **collection** / answer questions.
2. `API reanalyze` (or one feature).
3. `Pack collection handoff` again.
4. Send the new `COLLECTION_HANDOFF.md` (or confirm cleared items).

## Source (fill for this app)

- Tool: Apidog | Postman | Local OpenAPI
- Project / workspace:
- **Collection / module name:**
- **Collection / module ID:**
- Last ingest: see `source/snapshot.meta.md`
- Feature map: see `INDEX.md`

## Related toolkit paths

- [`ai_toolkit/workflows/api-analysis/_index.md`](../../ai_toolkit/workflows/api-analysis/_index.md)
- Templates: [`ai_toolkit/templates/api/_index.md`](../../ai_toolkit/templates/api/_index.md)
