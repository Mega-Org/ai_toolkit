# AI Worklog

Daily execution tracking for completed work, open TODOs, blockers, and management-ready reports.

## What This Folder Is

| Path | Purpose |
|------|---------|
| `INDEX.md` | Routing map |
| `TODOS.md` | Global open TODO index |
| `SUMMARY.md` | Rolling summary across days |
| `daily/YYYY-MM-DD.md` | English source of truth for one day |
| `reports/` | Saved reports (only when explicitly requested) |

This folder complements `ai_specs/`. Specs capture **what to build**; the worklog captures **what was done today** and **what is still pending**.

## Language Policy

- **Stored files** (`daily/`, `TODOS.md`, `SUMMARY.md`) are written in **English**.
- If you describe work in Arabic, the agent translates entries into clear English before saving.
- **Reports** can be generated in Arabic or English on demand. Arabic reports do not overwrite English source files.

## Commands

Ask the agent naturally:

| Command | Behavior |
|---------|----------|
| `setup-worklog` | Create or refresh this folder from toolkit templates |
| `update worklog` | Append today's completed work and TODOs |
| `record TODO for backend: …` | Add a tracked TODO |
| `show open TODOs` | List open items from `TODOS.md` |
| `close TODO-YYYY-MM-DD-001` | Mark a TODO done |
| `generate today report` | English report in chat only |
| `generate today report in Arabic` | Arabic report in chat only |
| `generate today report and save it` | English report saved to `reports/YYYY-MM-DD-en.md` |
| `generate today report in Arabic and save it` | Arabic report saved to `reports/YYYY-MM-DD-ar.md` |

You can attach tomorrow's plan to the report command:

```text
generate today report in Arabic and save it, tomorrow I will work on OTP resend integration
```

The report will include it under **Tomorrow** / **ما سيتم العمل عليه غدًا**.

## Slack / Management Use

Saved reports use a structured format suitable for Slack, email, or daily standups. Copy from chat or from `reports/YYYY-MM-DD-<lang>.md`.

## Automation

When present, `.cursor/rules/worklog.mdc` and the optional `stop` hook remind agents to update this folder after meaningful work, including after `make-plan` and `implement-phase`.

Workflow reference: `ai_toolkit/workflows/worklog/_index.md`.
