# Workflows: API analysis (`workflows/api-analysis/`)

## Purpose

**API collection analysis and handoff**: ingest Postman, Apidog, or local OpenAPI/collection snapshots; analyze gaps per feature; reanalyze when collections change; pack one **collection handoff** file (questions + **collection edits**).

Reusable playbooks and templates stay in `ai_toolkit/`. Project facts live in each app's `ai_specs/api/`.

## How to use (team)

| Say to the AI / intent | Workflow |
|------------------------|----------|
| First-time or full API analysis | [`analyze-collection.md`](analyze-collection.md) |
| Collection changed / update analysis | [`reanalyze-collection.md`](reanalyze-collection.md) |
| One feature only | [`feature-api-report.md`](feature-api-report.md) |
| Ingest / refresh snapshot only | [`ingest-collection.md`](ingest-collection.md) |
| Build file to send to collection owners | [`pack-collection-handoff.md`](pack-collection-handoff.md) |

### Typical loop

1. **Ingest** (or skip if analyze does it) → `ai_specs/api/source/`
2. **Analyze** or **reanalyze** → `features/*/gaps.md` + `edit-brief.md`
3. **Pack** → `ai_specs/api/COLLECTION_HANDOFF.md` ← **send this one file**
4. Owners answer questions + apply **collection** edits in Apidog/Postman
5. **Reanalyze** → pack again to confirm gaps closed

### Where the handoff file is

```text
<app-repo>/ai_specs/api/COLLECTION_HANDOFF.md
```

Optional dated copy: `ai_specs/api/handoff/COLLECTION_HANDOFF-YYYY-MM-DD.md`

That file is **collection-specific** (names the Apidog module / Postman collection). Listed edits are **collection/doc changes**, not a blanket “change API server code” request. Questions may still need real API or product answers — each question says so.

Per-feature drafts (team/AI; usually do not send alone):

```text
ai_specs/api/features/<feature>/edit-brief.md
```

## Contents

| File | Topic |
|------|--------|
| [`ingest-collection.md`](ingest-collection.md) | MCP or local file → durable snapshot + inventory seed |
| [`analyze-collection.md`](analyze-collection.md) | Full analysis, feature map, gaps, edit-briefs |
| [`reanalyze-collection.md`](reanalyze-collection.md) | Diff-driven update when the collection changes |
| [`feature-api-report.md`](feature-api-report.md) | Deep dive / refresh for one feature |
| [`pack-collection-handoff.md`](pack-collection-handoff.md) | Merge edit-briefs into `COLLECTION_HANDOFF.md` |

## References

- Templates: [`../../templates/api/`](../../templates/api/_index.md)
- App README skeleton: [`../../templates/api/api-readme.md`](../../templates/api/api-readme.md)
- BRD cross-check: [`../product-analysis/brd-analysis.md`](../product-analysis/brd-analysis.md)
- Workflow layout: [`../README.md`](../README.md)
