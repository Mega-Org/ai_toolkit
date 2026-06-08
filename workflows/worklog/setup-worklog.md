# Setup worklog

## Purpose

Generate or refresh app-local `ai_worklog/` from reusable toolkit templates. Optionally install Cursor automation (rule + stop hook).

## Fill when

- Template layout, generated paths, or automation files change.

## References

- Templates: [`../../templates/worklog/_index.md`](../../templates/worklog/_index.md)
- Update: [`update-worklog.md`](update-worklog.md)
- Reports: [`daily-report.md`](daily-report.md)

## Usage

**When to use** — First time in a project, or after toolkit template updates.

**What you say** — `setup-worklog` or `setup ai worklog for this project`.

## Steps

1. **Create folders** (if missing):

   ```text
   ai_worklog/
   ai_worklog/daily/
   ai_worklog/reports/
   ```

2. **Copy templates** from `ai_toolkit/templates/worklog/`:

   | Template | Destination |
   |----------|-------------|
   | `README.md` | `ai_worklog/README.md` |
   | `INDEX.md` | `ai_worklog/INDEX.md` |
   | `TODOS.md` | `ai_worklog/TODOS.md` (skip if exists and has open TODOs) |
   | `SUMMARY.md` | `ai_worklog/SUMMARY.md` (skip if exists with content) |
   | `reports-readme.md` | `ai_worklog/reports/README.md` |
   | `daily-log.md` | `ai_worklog/daily/YYYY-MM-DD.md` (today; skip if exists) |

3. **Replace placeholders** in today's daily file: `YYYY-MM-DD` → actual date.

4. **Install Cursor rule** — Copy [`cursor-rule.mdc`](../../templates/worklog/cursor-rule.mdc) to `.cursor/rules/worklog.mdc` (overwrite to refresh).

5. **Optional stop hook** — If `.cursor/hooks.json` does not list `worklog-stop.sh`, add:

   ```json
   {
     "version": 1,
     "hooks": {
       "stop": [
         {
           "command": ".cursor/hooks/worklog-stop.sh"
         }
       ]
     }
   }
   ```

   Merge with existing hooks; do not remove unrelated entries. Ensure `.cursor/hooks/worklog-stop.sh` exists and is executable.

6. **Handoff** — Tell the user commands from `ai_worklog/README.md`.

## Done when

`ai_worklog/` exists with README, INDEX, TODOS, SUMMARY, today's daily file, reports README, and `.cursor/rules/worklog.mdc`.
