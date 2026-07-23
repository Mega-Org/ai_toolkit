# Test & Capture API Responses

## Purpose

Run collection endpoints against a **callable environment** (staging/dev preferred), capture the **real** responses for each status class (success + errors), and save them as named **examples / cases** back into the Apidog / Postman collection. Record a redacted capture log under the app's `ai_specs/api/`.

This closes **Response coverage** gaps found by [`analyze-collection.md`](analyze-collection.md) with *real* payloads instead of asking backend to hand-write examples. It also produces trustworthy sample bodies for building typed models during implementation.

Outputs live under `ai_specs/api/`. Saved examples live in the external collection. Playbooks stay in `ai_toolkit/`.

## Fill When

- Analyze / reanalyze reported missing or weak response examples **and** a callable environment exists.
- Backend says "endpoints are live — capture real examples."
- QA wants saved examples for success + error paths (400 / 401 / 404 / 422 / 500).
- Implementation needs real payloads to build `fromJson` models and error handling.

Do **not** run this before an API is actually callable. If there is no live/staging endpoint, stay on analyze → pack handoff (ask backend for examples) instead.

## Inputs

1. **Callable environment** — base URL + auth scheme (staging/dev preferred). Record the **env label and variable names only** in the KB — never token or secret values.
2. **Snapshot + inventory** — run [`ingest-collection.md`](ingest-collection.md) first if `source/snapshot.json` is missing or stale.
3. **Scope** — all callable endpoints, one feature/folder, or one endpoint.
4. **Tooling (MCP)** —
   - Apidog: `apidog_list` / `apidog_get` (endpoint detail), `apidog_export_curl` (runnable curl), `apidog_run_test` (CLI scenarios), `apidog_create_cases` (save usage examples), `apidog_update` (attach response to endpoint).
   - Postman: `getCollectionRequest` / `getCollection` (request detail), `createCollectionResponse` / `updateCollectionResponse` (save example per status), `runMonitor` (scheduled checks), `createMock` (mock from saved examples).
   - Terminal: `curl` (or Newman) for actual live execution when MCP does not send live traffic.
5. **Templates** — [`../../templates/api/response-capture-log.md`](../../templates/api/response-capture-log.md), [`../../templates/api/edit-brief.md`](../../templates/api/edit-brief.md).

## Output Shape

```text
ai_specs/api/
  features/<feature>/
    captured/
      responses.md          # per-endpoint captured status classes (redacted) + notes
  history/
    YYYY-MM-DD-capture.md    # env label, endpoints hit, statuses captured, failures
```

Saved examples also land in the **external collection**:

- Apidog: endpoint **cases** (`apidog_create_cases`) or attached responses (`apidog_update`).
- Postman: **saved responses** on the request (`createCollectionResponse`), named per status.

Update `INDEX.md` **Last capture** note when that file exists.

## Invocation Modes

| Mode | Scope |
|------|--------|
| Full | All callable endpoints in scope |
| `feature <name>` | One feature/folder only |
| `endpoint METHOD /path` | Single operation |
| `dry run` | Export curl + plan requests only — **no live calls, no writes** |

## Safety Preflight (required — do not skip)

Before any live call, run this gate and **stop to ask** on any red flag:

1. **Environment** — Confirm the base URL is **non-production**. Only call production if the user explicitly authorizes it in this session.
2. **Method risk** — Order **reads (GET) first**. For **write / destructive** methods (`POST` / `PUT` / `PATCH` / `DELETE`), **stop and ask** before executing. Use disposable test data. Never run bulk or destructive operations without explicit confirmation.
3. **Auth** — Obtain the token via the documented auth flow (e.g. login endpoint) at runtime. Do **not** hardcode or persist tokens.
4. **Secrets / PII** — Never store tokens, passwords, emails, phone numbers, or other PII in the KB or in saved examples. Redact with placeholders before saving.

Proceed only after the environment is confirmed and each write-endpoint has an explicit go / disposable-data decision.

## Steps

1. **Preflight & scope** — Ingest if stale. Resolve the env label + auth. Run the **Safety Preflight** gate. Build the in-scope endpoint list from `analysis/inventory.md` (or a feature filter).
2. **Classify operations** — Tag each as **read** (safe) or **write** (gated). Sequence reads first; queue writes for explicit confirmation.
3. **Prepare requests** — For each endpoint, resolve path params, query, headers, and body from the collection + env. Fill required params with valid sample values. If a required value is unknown, record a **question** — do not invent business data. Prefer `apidog_export_curl` / `getCollectionRequest` to build the exact call.
4. **Capture success (2xx)** — Execute the request (curl from export, `apidog_run_test` scenario, or Postman monitor). Record status code, response shape, and key fields. Redact secrets/PII.
5. **Capture errors** — Deliberately and safely trigger error classes that apply: `400` (bad/missing param), `401` (no/invalid auth), `403` (forbidden), `404` (nonexistent id), `409` (conflict), `422` (business-rule violation), and `5xx` only when reproducible without harm. Capture only what the server **actually returns**; skip classes you cannot safely reproduce.
6. **Save examples to the collection** —
   - **Apidog:** `apidog_create_cases` to add named usage examples, or `apidog_update` to attach a response body to the endpoint.
   - **Postman:** `createCollectionResponse` (or `updateCollectionResponse`) named per status.
   - **Naming:** `200 OK — <case>`, `400 Bad Request — <case>`, `404 Not Found`, etc. Do not overwrite curated examples without noting it.
7. **Record the capture log** — Write `features/<feature>/captured/responses.md` from the template: endpoint, statuses captured, saved-to-collection?, field notes, redactions applied, and any `TBD`.
8. **Feed gaps & edit-brief** — Close resolved **Response coverage** items in `features/<feature>/gaps.md`. In `edit-brief.md`, mark examples added, or raise a **question** if an endpoint failed, was unreachable, or returned something ambiguous. Preserve stable question IDs.
9. **History** — Write `history/YYYY-MM-DD-capture.md`: env label (no secrets), endpoints hit, status classes captured, and failures.
10. **Report to user** — Captured count, saved-to-collection count, failures/blockers, and remaining questions.

## Quality Rules

- **Never invent responses.** Save only what the server actually returned. An unreachable endpoint becomes a **question**, not a fake example.
- **Non-production by default.** Explicit user authorization required for production; extra caution on write methods.
- **Redact** tokens, secrets, and PII in both saved examples and the KB; use placeholders.
- Record **one canonical env label** and variable **names** only — never secret values.
- Prefer completing **all applicable status classes** per endpoint before moving to the next.
- Do not overwrite existing curated examples without noting the change in `edit-brief.md`.
- Destructive operations require explicit confirmation **and** disposable data.
- These captured examples describe the **real** API; they do not replace analysis truth — keep gaps/questions in the feature files.

## AI Decision Cases

| Case | Behavior |
|------|----------|
| Endpoint needs auth but no token | Obtain via documented login flow; if unavailable, raise a question (unreachable) — do not fake |
| Write endpoint with no safe test data | Ask the user; skip until data provided |
| Production-only environment | Confirm with user before any call; reads may be allowed, writes stay gated |
| Server returns 500 on a valid request | Capture as-is; flag a question (possible real bug) |
| Response contains PII / secrets | Redact before saving; note the redaction in the log |
| An error class cannot be reproduced safely | Note "not captured"; do not fabricate |
| Example already exists in collection | Add a variant or update; note the change in `edit-brief.md` |
| MCP auth fails | Stop and ask the user to authenticate; do not fabricate a response |

## Done When

- Each in-scope callable endpoint has a captured **success** (or a documented reason) plus attempted **error** classes.
- Saved examples exist in the collection (or reasons are noted).
- `features/<feature>/captured/responses.md` and `history/YYYY-MM-DD-capture.md` are written; `gaps.md` and `edit-brief.md` are updated.
- User has capture counts and a list of failures / open questions.

## Where This Fits

Runs **after** the API is callable and gaps are mostly closed:

```text
analyze-collection → pack-collection-handoff → (backend fixes) → reanalyze-collection
                                                                        │
                                                                        ▼
                                                              test-and-capture  ← you are here
                                                                        │
                                                                        ▼
                                                        make-plan → implement-phase
```

See the end-to-end guide: [`../full-pipeline.md`](../full-pipeline.md).
