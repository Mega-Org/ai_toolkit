# Update worklog

## Purpose

Record completed work, new TODOs, closed TODOs, and blockers in today's English worklog after meaningful sessions.

## Fill when

- Entry format, TODO ID rules, or integration points change.

## References

- App paths: `ai_worklog/daily/YYYY-MM-DD.md`, `ai_worklog/TODOS.md`, `ai_worklog/SUMMARY.md`
- Feature delivery: [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md), [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md)

## Usage

**When to use** — When the user asks, or when **make-plan** / **implement-phase** / **bugfix** reaches its worklog step. Also after refactors or any session with deliverables if the user requests an update at session end.

**What you say** — `update worklog`, `record this TODO for backend: …`, `close TODO-2026-06-08-001`, `reopen TODO-2026-06-08-001`, `archive done TODOs`.

Do not update the worklog automatically in Ask mode, Plan mode, read-only Q&A, or after shell/status checks.

If `ai_worklog/` is missing, run [`setup-worklog.md`](setup-worklog.md) first.

## Steps

1. **Open or create** `ai_worklog/daily/YYYY-MM-DD.md` (today's date, local).

2. **Update Summary** — One or two English sentences for the day so far.

3. **Append Done** — Add `- [✓]` items for completed work. Be specific (feature, layer, outcome). Link specs when relevant, e.g. `ai_specs/features/authentication-login/plan.md`.

4. **Add or update TODO** — For each open follow-up:
   - Assign `TODO-YYYY-MM-DD-###` (next sequential ID for that day).
   - Add under **TODO** in the daily file with Owner, Area, Status, Source.
   - Mirror in `ai_worklog/TODOS.md` under the matching active section:
     - `Status: blocked` → `## Active` / `### Blocked`
     - `Status: waiting` → `## Active` / `### Waiting`
     - `Status: open` or missing → `## Active` / `### Open`
   - Use the worklog checkbox convention: `[ ]` for active items and `[✓]` for done items.
   - Include stable metadata fields when known: Owner, Area, Status, Priority, Source, File.

5. **Close TODO** — Set `[✓]` in the daily file and `ai_worklog/TODOS.md`; set `Status: done`; add `Closed: YYYY-MM-DD`; move the item to `## Done`; add a brief **Done** note if closure is noteworthy.

6. **Reopen TODO** — Set `[ ]`; remove `Closed`; set `Status: open`, `waiting`, or `blocked`; move the item back under the matching `## Active` subsection; update the linked daily file if the original entry is still present there.

7. **Archive done TODOs** — Move old or noisy done items from `## Done` to `## Archive`; keep `[✓]`, `Status: archived`, `Closed`, `Source`, and `Done` metadata.

8. **Blockers** — List active blockers or `None.`

9. **Optional SUMMARY.md** — Update rolling week table when closing the day or on request.

## make-plan entries

When planning completes, record:

- Feature slug and spec paths created/updated
- Number of phases and first pending phase
- Backend/design/product TODOs discovered (`TBD(owner)` from spec)

## implement-phase entries

When a phase completes, record:

- Phase title and status (`done` / `in-progress`)
- Deliverables completed
- Verification outcome (analyzer, tests, manual)
- Next pending phase
- New or resolved TODOs

## Language

All stored content in **English**. Translate user input before saving.

## Done when

Today's daily file reflects the session; `TODOS.md` matches active and closed TODO state using the Active / Done / Archive format.
