# Auto-detection

Resume is decided by reading the plan file. Do not create a hidden state file, a sidecar JSON, or a git ref to remember the run. The plan is the record.

## Signals

Read both shapes when the file has them.

**YAML todos** (Cursor plans and similar):

```yaml
todos:
  - id: phase1
    status: completed
  - id: phase2
    status: pending
```

**Feature build plans** (`ai_specs/features/<feature>/plan.md`): a phase **Status** of `pending`, `in-progress`, or `done`.

Treat the run as already in progress when either is true:

- Statuses are mixed: at least one phase is `completed` or `done`, and at least one is `pending`, `in_progress`, or `in-progress`.
- Any phase is marked `in_progress` or `in-progress`, even if none are completed yet.

Supporting signal: a dirty working tree. Use it to describe the situation (Direct often leaves one). Do not treat a dirty tree alone as an autopilot run. The user may have unrelated edits. Do not start, resume, or commit based only on `git status`.

`autopilot_mode` and `autopilot_base_branch` in the plan, when present, say how the previous run was configured. They do not by themselves prove phases finished. Statuses do.

## What to do

1. List phases that are `completed` / `done` and phases that are not.
2. Tell the user which prefix is already done and which phase is next. The next phase is the first `in_progress` / `in-progress` phase, or else the first `pending` phase.
3. Ask whether to continue that phase in the **same mode**, or restart. Wait.
4. **Continue:** do not re-run completed phases. An in-progress phase is unfinished; continuing means finish it, not skip it. Use the mode already recorded in the plan. If no mode is recorded, ask which mode was used. Do not guess Safe or Cloud. Until they answer, follow Direct's rule: do not commit.
5. **Restart:** only after the user explicitly chooses restart. Do not flip completed statuses back yourself unless they asked. Confirm before re-implementing phases that are already done.

If every phase is `completed` or `done`, say the plan is finished. Do not run it again unless the user asks.

If every phase is `pending` and none are `in_progress`, this is a new run. Use the menu when the user did not name a mode. See [interactive-menu.md](interactive-menu.md).

## Same mode on resume

| Recorded mode | Continue means |
|---------------|----------------|
| `direct` | Stay on the current branch. `--no-commits`. Do not commit the existing dirty tree. |
| `safe` | Use the existing `autopilot/<plan-slug>` branch if it exists. Do not open a second temp branch. Still no commit until the whole remaining run succeeds and the user confirms. |
| `cloud` | Do not redo a phase branch that already has its commit. Create the next phase branch from the latest completed phase branch. Ask before committing the current phase. |

If the recorded mode and the checkout disagree (for example the plan says `safe` but the temp branch is missing), stop and tell the user. Do not silently fall back to implementing on the current branch.

## Dirty tree

- **Direct resume:** a dirty tree is expected. Leave it. Do not stash, reset, or commit it as part of detection.
- **Safe resume:** uncommitted phase work on the temp branch is expected until the batch commit. Do not commit it just because you resumed.
- **Cloud resume:** a dirty tree on a phase branch means that phase was not committed. Treat that phase as unfinished. Do not start the next branch.

## What not to invent

- No `.autopilot/` directory, no status json, no extra commit to "save progress."
- No assumption that `in_progress` means the phase succeeded.
- No restart just because the menu would have been shown on a new run.
