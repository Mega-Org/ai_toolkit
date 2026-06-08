# Worklog Templates

Reusable templates for app-specific `ai_worklog/` folders. Copy into each app repo via [`../../workflows/worklog/setup-worklog.md`](../../workflows/worklog/setup-worklog.md).

## Templates

| Template | Use for |
|----------|---------|
| [`README.md`](README.md) | Root `ai_worklog/README.md` — usage, language policy, report commands |
| [`INDEX.md`](INDEX.md) | Root `ai_worklog/INDEX.md` — routing map |
| [`TODOS.md`](TODOS.md) | Global open TODO index |
| [`SUMMARY.md`](SUMMARY.md) | Rolling summary across days |
| [`daily-log.md`](daily-log.md) | `ai_worklog/daily/YYYY-MM-DD.md` |
| [`report-saved.md`](report-saved.md) | `ai_worklog/reports/YYYY-MM-DD-<lang>.md` |
| [`reports-readme.md`](reports-readme.md) | `ai_worklog/reports/README.md` |

## Workflows

- Setup: [`../../workflows/worklog/setup-worklog.md`](../../workflows/worklog/setup-worklog.md)
- Update: [`../../workflows/worklog/update-worklog.md`](../../workflows/worklog/update-worklog.md)
- Daily report: [`../../workflows/worklog/daily-report.md`](../../workflows/worklog/daily-report.md)
- TODO list: [`../../workflows/worklog/todo-list.md`](../../workflows/worklog/todo-list.md)

## Rules

- Stored worklog content is **English** by default.
- Arabic reports are generated on demand only; they do not replace English source files.
- Reports are saved to `ai_worklog/reports/` only when the user explicitly asks to save/export/store.
