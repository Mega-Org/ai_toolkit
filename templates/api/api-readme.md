# API specs — how to use and update

Copy to: `ai_specs/api/README.md`

## Purpose

This folder is the app's **API collection** knowledge base (Postman / Apidog / OpenAPI). Shared playbooks live in `ai_toolkit/workflows/api-analysis/`.

**Source order:** agreed contract reply > backend reference doc > collection snapshot; newer date wins within the same kind. Register: `contracts/INDEX.md`.

## Say this to the AI

| Intent | Phrase |
|--------|--------|
| First / full analysis | `API full analysis` or `Analyze API collection` |
| After collection changes | `API reanalyze` or `Reanalyze API collection` |
| One feature | `Analyze API feature <name>` |
| Refresh snapshot only | `Ingest API collection` |
| File for collection owners | `Pack collection handoff` |
| Backend contract | `/backend-contract request <feature> [topic]` (check / apply / intake) |

## Where files live

```text
ai_specs/api/
  README.md                 ← this file
  INDEX.md                  ← collection IDs + feature map
  COLLECTION_HANDOFF.md     ← 3-line pointer to the latest dated archive
  contracts/                ← register + per-contract request/reply/gaps
  source/snapshot.json      ← local OpenAPI/collection (usually not for owners)
  source/handoff/           ← backend reference docs (intake header only)
  analysis/                 ← inventory, gaps-index, journeys (`workflows.md` = API journeys, not agent playbooks)
  features/<feature>/       ← collection KB for this slug (not root `ai_specs/features/` build specs)
  history/                  ← reanalysis deltas
  handoff/                  ← dated collection handoff archives (send the latest)
```

## Send to collection owners (usually backend)

1. Run analyze or reanalyze (as needed).
2. Run **Pack collection handoff**.
3. Send the dated archive named in `COLLECTION_HANDOFF.md` (that file is a pointer, not a full copy):

```text
ai_specs/api/handoff/COLLECTION_HANDOFF-YYYY-MM-DD.md
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
4. Send the new dated archive named in `COLLECTION_HANDOFF.md` (or confirm cleared items).

## Source (fill for this app)

- Tool: Apidog | Postman | Local OpenAPI
- Project / workspace:
- **Collection / module name:**
- **Collection / module ID:**
- Last ingest: see `source/snapshot.meta.md`
- Feature map: see `INDEX.md`

## Related toolkit paths

- [`ai_toolkit/workflows/api-analysis/_index.md`](../../ai_toolkit/workflows/api-analysis/_index.md)
- Backend contract: [`ai_toolkit/workflows/api-analysis/backend-contract.md`](../../ai_toolkit/workflows/api-analysis/backend-contract.md)
- Templates: [`ai_toolkit/templates/api/_index.md`](../../ai_toolkit/templates/api/_index.md)
