# Workflows: Worklog (`workflows/worklog/`)

**How to use:** [`README.md`](README.md)

## Purpose

**Daily execution tracking**: setup per-project `ai_worklog/`, record completed work and TODOs, generate management reports (English or Arabic).

## Contents

| File | Topic |
|------|--------|
| [`setup-worklog.md`](setup-worklog.md) | Generate `ai_worklog/` from templates |
| [`update-worklog.md`](update-worklog.md) | Record done work, TODOs, blockers after sessions |
| [`daily-report.md`](daily-report.md) | Generate chat or saved reports (EN / AR) |
| [`todo-list.md`](todo-list.md) | List and triage open TODOs |

## Integration

- **make-plan** — step 7 in [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md)
- **implement-phase** — step 7 in [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md)

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
