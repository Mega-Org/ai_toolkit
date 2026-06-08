# TODO list

## Purpose

List, filter, and triage open TODOs from the global index and daily logs.

## Fill when

- Grouping, status values, or output format change.

## References

- `ai_worklog/TODOS.md`
- `ai_worklog/daily/YYYY-MM-DD.md`
- Update workflow: [`update-worklog.md`](update-worklog.md)

## Usage

**What you say** — `show open TODOs`, `list backend TODOs`, `what is blocked?`, `show TODOs for authentication`.

If `ai_worklog/` is missing, run [`setup-worklog.md`](setup-worklog.md) first.

## Steps

1. **Load** `ai_worklog/TODOS.md`.

2. **Collect** open items (`[ ]` only). Cross-check today's and recent daily files under `daily/` for items not yet mirrored globally.

3. **Group** by owner (Backend, Frontend, Design, Product, Unknown) unless the user asked for a filter.

4. **For each item**, show:
   - TODO ID
   - Description
   - Area
   - Status (`open` | `waiting` | `blocked`)
   - Source daily file path

5. **Summary line** — Total open count and count by owner/status.

6. **Close flow** — If the user asks to close an item, follow [`update-worklog.md`](update-worklog.md).

## Done when

User has a clear grouped list of open TODOs with IDs and sources.
