# Collection handoff (Apidog / Postman)

Copy to: `ai_specs/api/COLLECTION_HANDOFF.md` (optional dated copy under `handoff/`).

**Send this file to the collection owners (usually backend).**  
It is a **collection** maintenance brief — not a generic “change the API code” ticket.

| Field | Value |
|-------|--------|
| App | |
| Generated | YYYY-MM-DD |
| Collection tool | Apidog \| Postman |
| Workspace / project | |
| **Collection / module name** | |
| **Collection / module ID** | |
| Snapshot hash | |
| Pack mode | all open \| feature \<name\> \| blockers only \| questions only |

## What this file is

| Section | Meaning |
|---------|---------|
| **Questions** | Things we need you to **decide or document** (missing contracts, unclear behavior, services not in the collection). Answers may require product or real API design — say so in the reply. |
| **Collection edits** | Concrete changes to apply **in the Apidog/Postman collection** (descriptions, examples, response samples, folders/tags, params docs). These are **collection/doc edits**, not instructions to rewrite server handlers unless a question says the endpoint itself is missing. |

Do **not** treat every line as “implement new backend code.” Prefer updating the **collection** so mobile/AI can consume a complete, understandable contract.

---

## 1. Summary

| Feature | Collection edits | Open questions | Blockers |
|---------|------------------|----------------|----------|
| | | | |
| **Total** | | | |

---

## 2. Questions for collection / API owners

> Reply with the question ID. If the answer requires a **new or changed real endpoint**, say so explicitly; otherwise we only need the **collection** updated to match truth.

### Q-<feature>-01 — `<title>`

- **Feature:**
- **Collection context:** (what exists / what is missing in the collection)
- **Ask:**
- **Blocks:** Flutter / QA / docs / …
- **Options:** A / B / other / none
- **Owner:** collection \| backend-api \| product \| both
- **Severity:** blocker | should-fix | nice
- **Likely follow-up:** collection-only update \| real API change \| product decision

### Q-<feature>-02 — …

---

## 3. Collection edits (apply in Apidog / Postman)

> Apply these **in the collection**. Scope: docs, examples, schemas, folders/tags, saved responses — **not** “ship new server code” unless noted.

### `<feature>`

1. `METHOD /path` — **Collection edit:** …
2. …

### `<feature>`

1. …

---

## 4. Assumptions we did not invent

- …

---

## 5. Out of scope / Flutter-only (ignore for collection)

- …

---

## Owner reply stub (optional)

| Question ID | Answer | Collection updated? | Real API change needed? | Date |
|-------------|--------|---------------------|-------------------------|------|
| Q-… | | yes/no | yes/no | |
