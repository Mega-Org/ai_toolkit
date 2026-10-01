# Backend contract reply: `<feature>` — `<topic>`

Copy to: `ai_specs/api/contracts/YYYY-MM-DD-<feature>-<topic>/reply.md` (follow-up: `reply-2.md`, …)

Request: [`request.md`](request.md)  
Every request ID must appear in the answer matrix.

<!-- Section order is locked. Do not reorder. -->

## Meta

| Field | Value |
|-------|--------|
| Status | answered \| partially-answered |
| Request ID | `YYYY-MM-DD-<feature>-<topic>` |
| Reply file | `reply.md` \| `reply-N.md` |
| Date | YYYY-MM-DD |
| Author | backend |
| Collection examples | updated \| partial \| not yet |

---

## Answer matrix

Verdict: `Accepted` | `Different` | `Not supported` | `Need info`.  
`Different` requires real JSON (`JSON-n`) with no `…`.

| ID | Verdict | Note |
|----|---------|------|
| CH1 | | |
| L1 | | |
| D1 | | |
| SM1 | | |
| SV1 | | |
| F1 | | |
| SC1 | | |
| N1 | | |
| E1 | | |
| Q1 | | |

<!-- List every CH / L / D / SM / SV / F / SC / N / E / Q from the request. Missing ID = incomplete reply. -->

---

## Envelope

Confirm or replace. `Lang` selects `msg` and enum `label`.

```json
{
  "key": "success",
  "msg": "",
  "code": 200,
  "response_status": { "error": false, "validation_errors": null },
  "data": {}
}
```

---

## Enums

`{value, name, label}` — `label` in Arabic and English (or `label` follows `Lang` plus an `en`/`ar` pair if you ship both).

| Enum | value | name | label (ar) | label (en) |
|------|-------|------|------------|------------|
| | | | | |

---

## Services as shipped

| ID | Method | Path | Auth | Request | `200` `data` | Errors |
|----|--------|------|------|---------|--------------|--------|
| SV1 | | | | | | |

---

## Real JSON

`JSON-n` only. No `…`. Named fields. Include a `Different` payload for every ID whose verdict is `Different`.

### JSON-1 — `<name>`

```json
{}
```

---

## Notifications as shipped

| ID | When | Not when | FCM `data` (strings) | DB row |
|----|------|----------|----------------------|--------|
| N1 | | | | |

---

## Errors

| ID | HTTP | `key` / `response_status` | When |
|----|------|---------------------------|------|
| E1 | | | |

---

## Extra behavior

Anything shipped that was not in the request IDs. If it needs a new ID, say so — do not leave it only in prose.

-

---

## Collection examples updated

| Operation | Example | File / collection path | Related IDs |
|-----------|---------|------------------------|-------------|
| `METHOD /path` | success \| error \| empty | | |
