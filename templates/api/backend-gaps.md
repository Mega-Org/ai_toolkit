# Backend contract gaps: `<feature>` — `<topic>` (`gaps-N`)

Copy to: `ai_specs/api/contracts/YYYY-MM-DD-<feature>-<topic>/gaps-1.md` (next check: `gaps-2.md`, …)

Request: [`request.md`](request.md)  
Reply: [`reply.md`](reply.md) (or `reply-N.md`)  
Same ID format as the request: `CH` `L` `D` `SM` `SV` `F` `SC` `N` `E` `Q`.

| Field | Value |
|-------|--------|
| Gaps file | `gaps-N.md` |
| Date | YYYY-MM-DD |
| Reply checked | `reply.md` \| `reply-N.md` |

## Missing IDs

Request IDs with no row in the reply answer matrix.

| ID | Section | Notes |
|----|---------|-------|
| | | |

## Incomplete `Different`

Verdict `Different` without real JSON, or JSON that uses `…` / unnamed fields.

| ID | Problem | Notes |
|----|---------|-------|
| | | |

## Other

| ID | Problem | Notes |
|----|---------|-------|
| | | |

Incomplete reply → request status `partially-answered`. Do not `apply` until every ID is answered and `Different` rows have real JSON.
