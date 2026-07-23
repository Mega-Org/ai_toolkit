# Alias: API analysis phrases

## Purpose

Short intents to route agents into `ai_toolkit/workflows/api-analysis/`. These are **chat phrases**, not shell aliases.

## Phrases

| Phrase | Workflow |
|--------|----------|
| `API full analysis` / `Analyze API collection` | [`../workflows/api-analysis/analyze-collection.md`](../workflows/api-analysis/analyze-collection.md) |
| `API reanalyze` / `Reanalyze API collection` | [`../workflows/api-analysis/reanalyze-collection.md`](../workflows/api-analysis/reanalyze-collection.md) |
| `Analyze API feature <name>` | [`../workflows/api-analysis/feature-api-report.md`](../workflows/api-analysis/feature-api-report.md) |
| `Ingest API collection` | [`../workflows/api-analysis/ingest-collection.md`](../workflows/api-analysis/ingest-collection.md) |
| `Pack collection handoff` / `Export collection handoff` | [`../workflows/api-analysis/pack-collection-handoff.md`](../workflows/api-analysis/pack-collection-handoff.md) |
| `Test and capture API responses` / `Capture API responses` | [`../workflows/api-analysis/test-and-capture.md`](../workflows/api-analysis/test-and-capture.md) |
| `Screen data analysis` / `What APIs does each screen need` | [`../workflows/product-analysis/screen-data-analysis.md`](../workflows/product-analysis/screen-data-analysis.md) |

Full end-to-end order (sources → build): [`../workflows/full-pipeline.md`](../workflows/full-pipeline.md).

## Collection handoff file

After pack, send:

```text
ai_specs/api/COLLECTION_HANDOFF.md
```

Edits in that file are **for the Apidog/Postman collection** (docs, examples, responses, folders) — not a blanket server-code rewrite. Questions may still need real API or product answers.

## References

- Overview: [`../workflows/api-analysis/_index.md`](../workflows/api-analysis/_index.md)
- Templates: [`../templates/api/_index.md`](../templates/api/_index.md)
