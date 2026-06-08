# AI Worklog Index

Routing map for daily execution tracking. Start here when updating logs or generating reports.

## Areas

| Area | Purpose |
|------|---------|
| [`README.md`](README.md) | Usage, commands, language policy |
| [`TODOS.md`](TODOS.md) | Interactive TODO index for Active, Done, and Archive states |
| [`SUMMARY.md`](SUMMARY.md) | Rolling summary |
| [`daily/`](daily/) | Per-day English logs (`YYYY-MM-DD.md`) |
| [`reports/`](reports/README.md) | Saved management reports (on demand) |

## Workflows

| Task | Workflow |
|------|----------|
| First-time setup | [`ai_toolkit/workflows/worklog/setup-worklog.md`](../ai_toolkit/workflows/worklog/setup-worklog.md) |
| After work / implementation | [`ai_toolkit/workflows/worklog/update-worklog.md`](../ai_toolkit/workflows/worklog/update-worklog.md) |
| Daily report | [`ai_toolkit/workflows/worklog/daily-report.md`](../ai_toolkit/workflows/worklog/daily-report.md) |
| Filter / sort TODOs | [`ai_toolkit/workflows/worklog/todo-list.md`](../ai_toolkit/workflows/worklog/todo-list.md) |

## Integration

- **make-plan** — record new plans, phases, and discovered dependencies in today's daily log.
- **implement-phase** — record completed phase work, verification notes, and new/closed TODOs after each phase.

## Loading Rules

1. Report generation: `daily/YYYY-MM-DD.md` → `TODOS.md` → optional `SUMMARY.md`.
2. TODO triage: `TODOS.md` first, then linked daily entries; filter by `Status`, `Owner`, `Area`, or `Priority`.
3. Keep entries concise and management-readable.
