# Pack Collection Handoff

## Purpose

Merge all per-feature `edit-brief.md` files into **one** Markdown file for the **API collection owners** (usually backend): **questions** plus **collection edits** (Apidog/Postman), clearly labeled so recipients do not confuse them with “rewrite the server.”

## Fill When

- After full analyze, reanalyze, or feature report.
- User says: pack collection handoff / pack API collection handoff / export collection edit brief / prepare file for backend collection.

## Output (send this)

```text
ai_specs/api/COLLECTION_HANDOFF.md
```

Optional archive:

```text
ai_specs/api/handoff/COLLECTION_HANDOFF-YYYY-MM-DD.md
```

**Do not** send `source/snapshot.json` unless owners explicitly ask for raw OpenAPI.

## Inputs

1. `ai_specs/api/features/*/edit-brief.md`
2. `analysis/gaps-index.md` (summary counts)
3. `source/snapshot.meta.md` + `INDEX.md` (collection name, module/collection ID)
4. Template: [`../../templates/api/collection-handoff.md`](../../templates/api/collection-handoff.md)

## Modes

| Mode | Include |
|------|---------|
| Default (`all open`) | All features with open collection edits and/or questions |
| `feature <name>` | Only that feature’s section |
| `blockers only` | Blocker edits + blocker-tagged questions |
| `questions only` | Questions sections only |

## Steps

1. Read feature order from `INDEX.md` (`_orphan` last).
2. Fill header from `INDEX.md` / `snapshot.meta.md`: **collection/module name + ID**, tool, hash.
3. For each feature, read `edit-brief.md`. Skip empty open items (or one line “No open items”).
4. Build `COLLECTION_HANDOFF.md` with this **section order**:
   1. Header (app, date, **collection identity**, hash) + “what this file is” (collection edits vs questions)
   2. Summary table (feature → collection-edit count, question count, blockers)
   3. **Questions** (blockers first; stable `Q-<feature>-NN` IDs; note if follow-up is collection-only vs real API)
   4. **Collection edits** (Apidog/Postman only — label every item as a collection change)
   5. **Assumptions we did not invent**
   6. Optional Flutter-only out of scope
5. Optional dated copy under `handoff/`.
6. Tell the user: **Send `ai_specs/api/COLLECTION_HANDOFF.md` to collection owners.** Emphasize edits are **for the collection**, not a blanket API rewrite request.

## Question rules

Each question includes:

- Stable ID (`Q-payments-01`)
- Feature + collection context
- Ask (one decision)
- Why it blocks
- Options if any
- Owner: `collection` | `backend-api` | `product` | `both`
- Likely follow-up: `collection-only` | `real API change` | `product decision`

## Collection edit rules

- Phrase as **Collection edit:** … (docs, examples, responses, folders/tags, param descriptions).
- Never imply “implement handler” unless the question already flags a missing real endpoint.
- If the intended fix is unknown → **Question**, not an edit.
- Group by feature headings.

## Quality Rules

- Questions **before** collection edits.
- Preserve open question IDs across re-packs.
- No secrets.
- Filename and title must say **collection** so recipients know the scope.

## Done When

- `COLLECTION_HANDOFF.md` exists and names the target collection.
- User has the path and knows edits are collection-scoped.
