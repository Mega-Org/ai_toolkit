# Implement one phase

Checklist. Guide: [`../../docs/workflows/implement-phase-guide.md`](../../docs/workflows/implement-phase-guide.md). Rules: [`../../docs/workflows/working-rules.md`](../../docs/workflows/working-rules.md).

**Commit:** false (default). `--commit` shows files + message, then waits. `--no-commits` = default.

**Mode:** Agent mode only. Never create a Cursor plan. Prefer uninterrupted implementation after this phase’s `Inputs` suffice.

## Args

`<feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]`

`next` = first `Status: pending` phase.

## Load (once each; do not open INDEX.md)

1. This file.
2. [`../../LOADMAP.md`](../../LOADMAP.md) cards for phase `Load:` plus `+tag` / minus `-tag` / `--load=` / `--full`.
3. Live `ai_specs/features/<feature>/plan.md` (this phase: Load, Inputs, Touches, Effort, Deliverables, Verification). If `plan.md` > 8 KB, move `done` phases to `history.md` first.
4. Feature `memory.md` when present ([`feature-memory.md`](../../templates/specs/feature-memory.md), ≤ 3 KB). `ai_docs/memory.md` when `app-memory` is in `Load` or you will record a shared widget / cross-feature gotcha (≤ 4 KB).
5. Feature `README.md` **Contract** section only.
6. Phase `Inputs` only. For `contracts/.../reply.md#ID`, read that ID — not the whole reply.
7. `design/screens/<slug>.md` before any Figma MCP. Figma **per node** in Inputs.

Do not load spec indexes, BRD/design/API indexes, or untagged leaves. **Skip Tests / test steps** in old plans unless the user asked.

No `plan.md` → tell the user to run `/feature-make-plan <feature>`.

## Working rules

- Read each file once. Broad search → `explore` subagent.
- Ask gate **only** on this phase’s `Inputs` (missing contract, conflict, blocking TBD, assumed/broken edge). One list. Do not invent.

## Steps

1. Confirm phase (named or `next`). One-sentence deliverables.
2. Implement `Touches` only. Match loaded cards. No tests. New l10n: dry-run `make l10n-add`, one preview, `--apply` after yes.
3. Analyzer on touched files. No test run.
4. Write back: Status `done` or `in-progress`; Verification; Notes; Next. README only if Contract changed. Split `plan.md` if still over 8 KB.
5. Memory at handoff (unless this run is an autopilot phase child — then list new facts in the handoff and do not write). Replace matching rows; do not append. Feature `memory.md` ≤ 3 KB: code map, symbols, l10n section and keys, feature gotchas, contract IDs this phase used. Shared widgets or cross-feature gotchas → `ai_docs/memory.md` ≤ 4 KB. Create a missing feature file from [`feature-memory.md`](../../templates/specs/feature-memory.md). If a write would pass the budget, drop the oldest row in that section first.
6. If `ai_worklog/` exists: [`../worklog/update-worklog.md`](../worklog/update-worklog.md).
7. If `--commit`: [`../git/commit-after-phase.md`](../git/commit-after-phase.md) — show files + message, wait for yes. `--no-commits` skips (default). Do not run commit-before-work unless asked to save a dirty tree first.
8. Handoff (≤10 lines): Done; files changed; analyzer; memory facts; open items; exact next command; Context used (tags, Inputs, cards).

## Done when

Analyzer + listed manual checks recorded, Status `done`, or a blocker with a next command.
