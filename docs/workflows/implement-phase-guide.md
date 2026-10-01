# Implement phase

Cursor command: `/feature-implement-phase`. Checklist: [`implement-phase.md`](../../workflows/feature-delivery/implement-phase.md). Shared rules: [working-rules](working-rules.md). Among the four workflows: [overview](overview.md).

## What it does

Implements **one** phase from `ai_specs/features/<feature>/plan.md` in **Agent mode** (never a Cursor plan).

It loads only:

- the live part of `plan.md` (this phase’s `Load`, `Inputs`, `Touches`, `Effort`, deliverables, verification);
- feature `memory.md` when it exists;
- the README **Contract** section;
- files and contract reply `#ID`s listed in `Inputs`;
- LOADMAP **cards** for the phase tags (`+tag` / `-tag` / `--load=` / `--full`).

Then it implements `Touches`, runs the analyzer on those files, writes status back, replaces rows in feature `memory.md` (3 KB) and shared facts in `ai_docs/memory.md` (4 KB) — no append — splits `plan.md` into `history.md` if over 8 KB, and hands off in about ten lines (including **Context used**). An autopilot phase child lists memory facts and does not write those files.

It **skips Tests fields and test steps** in older plans unless you ask. **Commit:** false (default). `--commit` shows files + message and waits for yes. `--no-commits` is an alias for the default.

The ask gate is **this phase’s Inputs only**. Once those suffice, prefer uninterrupted implementation. Missing backend contract → `/backend-contract request` rather than inventing a shape.

## When to use it

A `plan.md` already exists and you want one named phase or `next`. If `plan.md` is missing, run [make-plan](make-plan-guide.md) first. For every unfinished phase in order, use [autopilot](autopilot-guide.md).

## Command syntax

```text
/feature-implement-phase <feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]
```

Examples:

```text
/feature-implement-phase courses next +pagination
/feature-implement-phase ai_specs/features/courses/plan.md 4 --full
Implement phase 2 for authentication
```

`--no-commits` is an alias for the default (no commit).

## Best practices

- Name the phase when it matters; otherwise `next` is the first `pending` row.
- Do not open `INDEX.md` or spec indexes during the phase.
- Read `design/screens/<slug>.md` before Figma; call Figma MCP per node.
- Send broad searches to an `explore` subagent; read each file once.
- Update `README.md` only when the Contract changed.
- New strings: one `l10n-add` dry-run preview per phase, then `--apply` after yes ([l10n-add](../tooling/l10n-add.md)).
