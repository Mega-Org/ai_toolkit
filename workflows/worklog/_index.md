# Workflows: Worklog (`workflows/worklog/`)

**How to use:** [`README.md`](README.md)

## Purpose

**Daily execution tracking**: setup per-project `ai_worklog/`, record completed work and TODOs, generate management reports (English or Arabic).

## Contents

| File | Topic |
|------|--------|
| [`setup-worklog.md`](setup-worklog.md) | Generate `ai_worklog/` from templates |
| [`update-worklog.md`](update-worklog.md) | One append to today's daily file; no reads |
| [`daily-report.md`](daily-report.md) | Generate chat or saved reports (EN / AR) |
| [`todo-list.md`](todo-list.md) | List and triage open TODOs |

## Integration

- **make-plan** / **implement-phase** / **bugfix** — append-only step in those checklists

## Templates

[`../../templates/worklog/_index.md`](../../templates/worklog/_index.md)

## App paths (per repo)

```text
ai_worklog/
  README.md
  INDEX.md
  TODOS.md
  SUMMARY.md
  daily/YYYY-MM-DD.md
  reports/YYYY-MM-DD-<lang>.md
```
