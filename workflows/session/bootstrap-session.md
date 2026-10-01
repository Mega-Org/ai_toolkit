# Bootstrap session

**Default: lite.** Full only when the user asks or passes `--full` on a skill that has its own loader.

Guide: [`../../docs/workflows/overview.md`](../../docs/workflows/overview.md). LOADMAP: [`../../LOADMAP.md`](../../LOADMAP.md).

## Lite (default)

1. Do **not** open `INDEX.md` or section `_index.md` files.
2. Open the **task workflow checklist** named by the skill.
3. Open `LOADMAP.md` only to resolve tags.
4. App files only as that workflow’s load list (plan live part, README Contract, Inputs).
5. Aliases only when you will run matching shell commands.

## Full

Use when the user asks for a full session, or the task has no skill loader (unknown-scope debug, architecture change, PR prep).

1. [`INDEX.md`](../../INDEX.md) → task routing row → workflow checklist.
2. Needed section `_index.md` then **leaf** files (or LOADMAP `--full` cards).
3. `ai_docs/` when changing core vs feature boundaries or naming.
4. Spec **indexes** only when choosing a feature — never during implement-phase.

## Resume

Re-open the skill workflow and the active `plan.md` live part (or fix folder). Do not re-read INDEX.

## Autopilot

If `.cursor/skills/autopilot-plan/SKILL.md` exists, follow it. Else offer `bash ai_toolkit/setup/install-skills.sh`. Do not invent a parallel flow.

## Missing paths

Treat as the intended contract; continue with the nearest existing file. Do not browse indexes to “discover” it.

## Git

**Commit:** false (default). Do not run [`../git/commit-before-work.md`](../git/commit-before-work.md) or [`../git/commit-after-phase.md`](../git/commit-after-phase.md) unless the user asked. `--commit` on a skill means after the work: show files + message, wait for yes. `--no-commits` = default.
