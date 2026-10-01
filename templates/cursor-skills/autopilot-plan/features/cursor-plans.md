# Cursor plans

Load this file only when `/autopilot-plan` is pointed at a Cursor plan. A feature plan (`ai_specs/features/<feature>/plan.md`) keeps the skill's Status, phase, and memory rules and does not load this file.

## Recognize

A Cursor plan is a markdown file with YAML frontmatter and a `todos:` list, at either path:

- `~/.cursor/plans/*.plan.md`
- `.cursor/plans/*.plan.md`

Run it. The user already chose autopilot for this plan. Do not send them to Build, and do not stop because of plan length.

## Progress

Read `todos:` in the frontmatter. Do not grep `^Status:` on a Cursor plan.

Skip `status: completed`. The next to-do is the first `in_progress`, otherwise the first `pending` to-do that has no `[skip]` tag. Resume continues there. Leave `completed` to-dos as they are unless the user asks to redo them.

`in_progress` means unfinished. Continuing means finish that to-do.

## Modes and commits

Direct, Safe, and Cloud keep the same mode files and commit rules. Direct never commits. Children are told not to commit. Nothing in this run is pushed or merged.

A named mode skips the menu. Otherwise show the skill's mode menu and wait.

Write `autopilot_mode`, `autopilot_base_branch`, and `autopilot_models` in the frontmatter. Git steps stay in the one mode file. When `autopilot_models` is missing, propose the skill's three-model map once and wait, the same way as for a feature plan.

## What the parent may edit

The parent does not implement to-dos and does not edit `lib/`, specs, or toolkit files. On the plan file the parent edits only:

- the `status:` line of the to-do it just ran
- `autopilot_*` lines in the frontmatter

The child does not edit the plan file.

Cursor plans have no feature memory. Do not create or write a `memory.md`.

## To-do phases

Each pending to-do is one phase. Run it with the Task tool (`subagent_type` generalPurpose, model from `autopilot_models` for that effort). If Task is not loaded, discover it first. Do not implement a to-do in the parent.

| Effort in `content` | Model key | Subagent |
|---------------------|-----------|----------|
| `[light]` | `light` | Up to 3 consecutive `[light]` to-dos share one subagent (Direct and Safe) |
| `[standard]`, or no effort tag | `standard` | One subagent |
| `[deep]` | `deep` | One subagent |
| any effort, Cloud | from the tag; no tag → `standard` | One subagent per to-do |

Cloud stays one to-do per subagent so each commit prompt stays on that to-do. A fresh subagent starts after each return. Pass the approved model for that effort.

`[skip]` stays `pending`. Do not run it. Name it in the end summary so the user can do that check.

## Tags

Tags are optional and sit in the to-do `content`. Strip them before the child prompt. The child sees the remaining content.

```yaml
todos:
  - id: install-script
    content: "[deep] [load: data] [see: ## 2. New apps and reinstalls] Create setup/install-vscode-search.sh ..."
    status: pending
```

| Tag | Use |
|-----|-----|
| `[light]` `[standard]` `[deep]` | Effort. No tag counts as `standard`. |
| `[load: ui, nav]` | LOADMAP tags when the to-do touches `lib/`. No tag: the child loads no toolkit cards beyond the core digest. |
| `[see: ## heading]` | The plan section the child reads. Keep the `##` in the heading text. |
| `[skip]` | Leave this to-do for the user (a manual check, for example). |

### Section the child reads

- `[see: ## heading]` — that section.
- No `[see:]` — the Decisions section, plus the section that mentions this to-do id or its main file path. Read the plan with the frontmatter removed.
- Plan body over 8 KB — send only those sections. Do not send the whole plan.

## Child prompt

One block per to-do. A light batch repeats the block once per to-do in that batch.

```text
Autopilot to-do child. Do not commit, push, merge, or edit the plan file.
Plan: {path}
To-do: {id} — {content without tags}
Section: {see-heading or "find by id / file path"}
Load: {tags or none}
Previous to-dos (5 lines max): {files changed + notes}
Skip tests. Analyzer only on touched lib/ files.
Report, 10 lines or fewer:
Status: done | paused | failed
Files:
Checks:
Notes:
Blockers:
```

`Section` is the `[see:]` heading, or the words `find by id / file path` when there is no `[see:]` tag (the child then uses the Decisions rule above).

`Load` is the `[load:]` tag list, or `none`.

`Previous to-dos` is the parent's run notes. The first to-do gets `none`.

## After each child

| Report | YAML `status:` | Then |
|--------|----------------|------|
| `done` | `completed` | Next to-do |
| partway (work started, and the report is not `done`, `paused`, or `failed`) | `in_progress` | Ask before continuing that to-do. Do not start later to-dos. |
| `paused` | `in_progress` if any of that to-do's files changed; otherwise leave `pending` | Ask, then re-run this to-do with the answer. Do not start later to-dos. |
| `failed` | leave the status as it was | Stop. No commit. No later to-dos. |

Run notes replace feature memory. After each child (or after a light batch returns), keep at most 5 lines for the whole run: files changed and the child's Notes. When a sixth line would be added, drop the oldest. Pass that block as `Previous to-dos` on the next child. Do not write the notes into the plan.

Safe or Cloud commit only when that mode file says so, only after the to-do's YAML status is `completed`, and only after the user accepts the files and message. Direct never commits.

## End

After the last to-do, or when the run stops:

- Run `make analyze` when this run touched `lib/`.
- Run `bash ai_toolkit/setup/verify-setup.sh` when this run touched `ai_toolkit/` or `.cursor/`.

Skip a command when its tree was not touched. Do not analyze after every to-do.

Summary: to-dos completed, any `[skip]`, paused, or failed to-do, mode, and that nothing was pushed or merged. Direct leaves a dirty tree.
