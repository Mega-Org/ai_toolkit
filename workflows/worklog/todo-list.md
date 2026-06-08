# TODO list

## Purpose

List, filter, sort, and triage TODOs from the global index and daily logs.

## Fill when

- Grouping, status values, or output format change.

## References

- `ai_worklog/TODOS.md`
- `ai_worklog/daily/YYYY-MM-DD.md`
- Update workflow: [`update-worklog.md`](update-worklog.md)

## Usage

**What you say** — `show open TODOs`, `show blocked TODOs`, `show done TODOs`, `list backend TODOs`, `what is blocked?`, `show TODOs for authentication`, `sort TODOs by owner`, `archive done TODOs`.

If `ai_worklog/` is missing, run [`setup-worklog.md`](setup-worklog.md) first.

## Steps

1. **Load** `ai_worklog/TODOS.md`.

2. **Collect items** from the stable sections:
   - `## Active` / `### Blocked`
   - `## Active` / `### Waiting`
   - `## Active` / `### Open`
   - `## Done`
   - `## Archive`

3. **Filter** based on the user's wording:
   - `open` → `Status: open`
   - `blocked` / `what is blocked?` → `Status: blocked`
   - `waiting` → `Status: waiting`
   - `done` → `Status: done`
   - owner names (`backend`, `frontend`, `design`, `product`, `unknown`) → `Owner: ...`
   - feature or area text (`authentication`, `menu`, `profile`) → `Area: ...`
   - priority (`P0`, `P1`, `P2`, `P3`) → `Priority: ...`

4. **Sort** only when requested:
   - `sort TODOs by status` → blocked, waiting, open, done, archived.
   - `sort TODOs by owner` → Backend, Frontend, Design, Product, Unknown.
   - `sort TODOs by priority` → P0, P1, P2, P3, missing priority last.
   - `sort TODOs by area` → alphabetical by `Area`.

5. **Group output** by status first unless the user asked for a specific grouping. For open/blocked views, include only active items (`[ ]`). For done views, include done-marker items (`[✓]`) from `## Done` and optionally `## Archive`.

6. **For each item**, show:
   - TODO ID
   - Description
   - Owner
   - Area
   - Status (`open` | `waiting` | `blocked` | `done` | `archived`)
   - Priority, if present
   - Source daily file path
   - File path, if present

7. **Summary line** — Total count and count by status/owner for the current filter.

8. **State changes**:
   - Close or reopen → follow [`update-worklog.md`](update-worklog.md).
   - Archive → move old done items from `## Done` to `## Archive`; keep checkbox `[✓]`, `Status: archived`, `Closed`, `Source`, and `Done` metadata.

## Done when

User has a clear filtered or sorted list of TODOs with IDs, metadata, sources, and a summary line.
