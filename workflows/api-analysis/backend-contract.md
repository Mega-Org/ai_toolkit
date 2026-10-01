# Backend contract

Checklist. Templates: [`../../templates/api/backend-request.md`](../../templates/api/backend-request.md), [`backend-reply.md`](../../templates/api/backend-reply.md), [`backend-gaps.md`](../../templates/api/backend-gaps.md), [`contracts-index.md`](../../templates/api/contracts-index.md). Register: `ai_specs/api/contracts/INDEX.md`.

**Commit:** false (default). `--commit` shows files + message, then waits. `--no-commits` = default. Never create a branch. Never push.

**Budget:** `request.md` ≤ 25 KB. Check reads the request ID list + reply answer matrix only (~2 KB), not the full reply until `apply`.

## Args

```text
request <feature> [topic] [+figma] [--commit]
check <contract-folder> [--commit]
apply <contract-folder> [--commit]
intake <file> [--commit]
```

`<contract-folder>` = `YYYY-MM-DD-<feature>-<topic>` or a path under `ai_specs/api/contracts/`. `topic` defaults to the feature slug. `+figma` is **request** only, and only for screens the user names.

## Load (once; skip missing; no toolkit INDEX.md)

**All modes:** this file; `ai_specs/api/contracts/INDEX.md` (create from the register template if missing).

**request:** feature `README.md` sections `Feature Logic`, `Navigation flow`, `UI And UX` only; `ai_specs/design/features/<feature>.md` + named `design/screens/*`; `ai_specs/api/features/<feature>/` headings if present. No new design analysis. Figma MCP only with `+figma` for named screens (read the screen file first).

**check:** request ID list (tables / headings `CH` `L` `D` `SM` `SV` `F` `SC` `N` `E` `Q`) + reply **Answer matrix** only. Do not load README, design, or snapshot.

**apply:** agreed reply IDs you will write (not the whole reply unless a listed ID needs its JSON); feature `README.md` **Contract** section; `plan.md` live phases; `ai_specs/api/features/<feature>/gaps.md`; feature `memory.md` **Agreed contract IDs** (read once).

**intake:** target file headings + endpoint paths only; `ai_specs/api/INDEX.md` **feature map** (headings and paths, not endpoint bodies).

Read-once. Broad search → `explore` subagent. Do not invent fields.

## Stable IDs

`CH` `L` `D` `SM` `SV` `F` `SC` `N` `E` `Q` — every request ID must appear in the reply matrix.

## request

1. Ask only for **scope / out of scope** and **open questions** if they are missing. Wait.
2. Create `ai_specs/api/contracts/YYYY-MM-DD-<feature>-<topic>/` and `request.md` from the request template. Paste **How you must reply** verbatim. Fill **ملخص للباكند** in full Arabic. Fill L from existing logic; D as screen-by-state tables (name + Figma only when undescribed; add `Q` when nothing exists).
3. Add a register row, status `draft`. Create `INDEX.md` from the template if needed.
4. Handoff ≤10 lines: path, ID count, budget (`wc -c`), next: send to backend, then `/backend-contract check <folder>` after a reply.

## check

1. Collect request IDs. Read the reply answer matrix.
2. Flag missing IDs; `Different` without real JSON or with `…`.
3. Write `gaps-N.md` in the same folder (next N). Same ID format.
4. Set request + register to `answered` or `partially-answered`. Incomplete → wait; do not `apply`. Chat is not a reply.
5. Handoff: missing count, gaps path, next command (`apply` or wait).

## apply

Writes:

1. Feature `README.md` **Contract** (endpoints, fields, rules, TBDs, `Contracts:` register link) from agreed facts.
2. Each phase `Inputs` in `plan.md` pointing at reply IDs (`contracts/<id>/reply.md#SV3`).
3. `ai_specs/api/features/<f>/gaps.md` — **append** `answered by contract <id> <reply ID>` on matching items. Never delete.
4. Request + register → `agreed`. `Need info` → `TBD(owner)` on Contract. Collection synced stays `no` until reanalyze.
5. Feature `memory.md`: replace the row for this contract folder (IDs just agreed, one-line note). Create the file from [`feature-memory.md`](../../templates/specs/feature-memory.md) if missing, and fill only that section. Do not append a second row for the same folder. Stay ≤ 3 KB. Do not fill the code map.

Do not rewrite handoff files.

Handoff: Contract updated, Inputs IDs, gaps appended, memory contract row, TBDs.

## intake

For any MD the backend sends:

1. Kind = `reply` if it is an answer matrix / request IDs; else `reference`. Features = endpoint paths matched to `api/INDEX.md` feature map (headings + paths only).
2. Add **one** header line only (do not rewrite the body):

```html
<!-- intake: kind=… | contract=… | features=… | received=YYYY-MM-DD | supersedes=… -->
```

3. Register row. Link the file from each related feature README (`Related Files` / Contract `Contracts:`).
4. If kind is `reply`, continue to **check** (same folder or the path you registered).

Do not rename, move, or rewrite existing backend files.

## Done when

The mode’s outputs exist; register row is current; no commit unless the user said yes after a file+message preview.
