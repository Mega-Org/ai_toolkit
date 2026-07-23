# Response capture log: `<feature>`

Copy to: `ai_specs/api/features/<feature>/captured/responses.md`

Produced by [`../../workflows/api-analysis/test-and-capture.md`](../../workflows/api-analysis/test-and-capture.md).
Records **real** captured responses (redacted) and whether they were saved into the collection.
**No secrets, tokens, or PII** — redact with placeholders.

| Field | Value |
|-------|--------|
| Feature | |
| Collection / module | |
| Environment label | staging \| dev \| … (names only, no secret values) |
| Snapshot hash | |
| Captured on | YYYY-MM-DD |

## Captured endpoints

### `METHOD /path` — `<op id / summary>`

| Status | Captured? | Saved to collection? | Notes (redacted) |
|--------|-----------|----------------------|------------------|
| 200 / 201 | yes/no | yes/no | key fields returned |
| 400 | yes/no | yes/no | trigger: bad/missing param |
| 401 | yes/no | yes/no | trigger: no/invalid auth |
| 403 | yes/no | yes/no | |
| 404 | yes/no | yes/no | trigger: nonexistent id |
| 409 / 422 | yes/no | yes/no | trigger: business rule |
| 5xx | yes/no | yes/no | reproducible? possible bug? |

- **Request notes:** required params / body used (sample values, redacted)
- **Redactions applied:** tokens / emails / phone / ids → placeholders
- **Open:** `TBD(backend-api): …` / `TBD(product): …`

### `METHOD /path` — `<op id / summary>`

| Status | Captured? | Saved to collection? | Notes (redacted) |
|--------|-----------|----------------------|------------------|
| | | | |

## Failures / not captured

| Endpoint | Reason | Follow-up |
|----------|--------|-----------|
| `METHOD /path` | unreachable / auth failed / no test data | question `Q-<feature>-NN` |

## Summary

- Endpoints in scope:
- Success captured:
- Error classes captured:
- Saved to collection:
- Open questions:
