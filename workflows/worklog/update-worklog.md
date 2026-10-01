# Update worklog

**One append. No reads.**

Skip if `ai_worklog/` is missing. Do not run setup unless the user asks.

## Steps

1. Append one English `- [✓]` bullet under **Done** in `ai_worklog/daily/YYYY-MM-DD.md` (today, local). If that file does not exist, **write** a stub (`# YYYY-MM-DD`, `## Done`) plus the bullet. Do **not** read yesterday, `INDEX.md`, `TODOS.md`, or `SUMMARY.md`.
2. Bullet: slug or phase title, status, analyzer one-liner, next command. No transcript.
3. Stop. Do not rewrite Summary, TODOs, or `SUMMARY.md`.

## What to put in the bullet

- **make-plan:** slug, phase count, first pending, TBD owners.
- **implement-phase:** phase title, `done`/`in-progress`, analyzer, next pending.
- **bugfix:** slug, root-cause one-liner, status.

Stored content is English.

TODO close / reopen / archive: [`todo-list.md`](todo-list.md). Setup: [`setup-worklog.md`](setup-worklog.md).
