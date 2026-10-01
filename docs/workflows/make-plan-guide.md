# Make plan

Cursor command: `/feature-make-plan`. Checklist: [`make-plan.md`](../../workflows/feature-delivery/make-plan.md). Shared rules: [working-rules](working-rules.md). Among the four workflows: [overview](overview.md).

## What it does

Writes **specs only** under `ai_specs/features/<feature>/`:

- `README.md` — `## Contract` first (6 KB budget)
- `plan.md` — phases with `Load`, `Inputs`, `Touches`, `Effort`, `Verification` (no Tests; 8 KB budget)
- `history.md` — created empty or used when splitting done phases
- `memory.md` — created empty from the feature-memory template when missing (3 KB; left alone if it already exists)

It does **not** implement code and does **not** create a Cursor plan. `plan.md` in that folder is the only plan.

Load by path convention (skip missing): slug BRD, design feature + named screens, API feature folder, **contracts register rows for the slug**, `ai_docs/architecture.md` and `conventions.md`. Do not browse BRD/design/API `INDEX.md` files after you have those paths.

**Coverage:** every requirement, endpoint, and screen maps to a phase. Leftovers are blockers or `TBD(owner)`.

**Missing contract:** suggest `/backend-contract request <feature> [topic]`. Do not invent the reply.

Default is no commit. `--commit` shows files + a proposed message and waits for yes. `--no-commits` is an alias for the default. Ends with the exact next command, for example `/feature-implement-phase <feature> next`.

## Modes

- **A** — README exists → refresh `plan.md` unless you asked to change requirements.
- **B** — requirements in the message → write/update both files.

Ask-before-proceed uses **loaded files only**: missing info, BRD/design/API conflict, assumed/broken edges. You choose decide-now or TBD.

## Command syntax

```text
/feature-make-plan <feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]
```

`phase` / `next` are unused. Tags are optional when you want LOADMAP cards while sequencing phases. `--no-commits` is an alias for the default (no commit).

```text
/feature-make-plan authentication
Plan from ai_specs/features/checkout/README.md
```

## Best practices

- Folder name = slug: `ai_specs/features/<feature>/`.
- Alignment sections in `plan.md` are **links**, not copied BRD/API prose.
- Stub-vs-live HTTP belongs in early phase `Inputs` when you chose stub-first.
- After the plan exists, run implement-phase — not a second planning pass.
