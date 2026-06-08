# Worklog workflows

Daily execution tracking: setup per-project `ai_worklog/`, record completed work and TODOs, generate management reports (English or Arabic).

**Agent routing index:** [`_index.md`](_index.md)

## Quick start

1. Say **`setup-worklog`** once to scaffold `ai_worklog/` in the app repo.
2. After coding sessions, say **`update worklog`**.
3. For standups or Slack, say **`generate today report`** (or an Arabic / save variant below).

App data lives in `ai_worklog/`. Files in this folder are **agent workflows** — follow them when the user triggers a command.

## Workflows

| Workflow | File | Trigger phrases |
|----------|------|-----------------|
| Setup | [`setup-worklog.md`](setup-worklog.md) | `setup-worklog`, `setup ai worklog for this project` |
| Update | [`update-worklog.md`](update-worklog.md) | `update worklog`, `record TODO for …`, `close TODO-…` |
| Daily report | [`daily-report.md`](daily-report.md) | `generate today report`, `export today report`, `Slack report for today` |
| TODO list | [`todo-list.md`](todo-list.md) | `show open TODOs`, `list backend TODOs`, `what is blocked?` |

## Commands (user → agent)

Ask the agent naturally:

| Command | Behavior |
|---------|----------|
| `setup-worklog` | Create `ai_worklog/` from [templates](../../templates/worklog/_index.md) |
| `update worklog` | Append **Done**, **TODO**, and **Blockers** to today's daily file; sync `TODOS.md` |
| `record TODO for backend: …` | Add `TODO-YYYY-MM-DD-###` to daily file and global index |
| `close TODO-YYYY-MM-DD-001` | Mark a TODO done in daily file and `TODOS.md` |
| `show open TODOs` | List open items grouped by owner |
| `generate today report` | English report in chat only |
| `generate today report in Arabic` | Arabic report in chat only |
| `generate today report and save it` | English report saved to `reports/YYYY-MM-DD-en.md` |
| `generate today report in Arabic and save it` | Arabic report saved to `reports/YYYY-MM-DD-ar.md` |

Attach tomorrow's plan to a report command:

```text
generate today report in Arabic and save it, tomorrow I will work on OTP resend integration
```

The report includes it under **Tomorrow** / **ما سيتم العمل عليه غدًا**.

## Rules

- Stored worklog content is **English** — translate user input before saving.
- Arabic reports do **not** modify English source files.
- Save to `ai_worklog/reports/` only when the user says **save**, **export**, **store**, or **and save it**.
- If `ai_worklog/` is missing, run [setup-worklog.md](setup-worklog.md) first.
- Do not auto-update in Ask mode, Plan mode, read-only Q&A, or after shell/status checks.
- Worklog updates are **explicit only** — no automatic hooks unless a project adds its own rule.

## Integration

- **make-plan** — step 7 in [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md)
- **implement-phase** — step 7 in [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md)
- Toolkit routing: [`INDEX.md`](../../INDEX.md)

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

Specs capture **what to build** (`ai_specs/`). The worklog captures **what was done today** and **what is still pending**.

User-facing command copy (generated per app): `ai_worklog/README.md` from [`templates/worklog/README.md`](../../templates/worklog/README.md).

## Templates

[`../../templates/worklog/_index.md`](../../templates/worklog/_index.md)
