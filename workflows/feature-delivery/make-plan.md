# Make plan

Checklist. Guide: [`../../docs/workflows/make-plan-guide.md`](../../docs/workflows/make-plan-guide.md). Rules: [`../../docs/workflows/working-rules.md`](../../docs/workflows/working-rules.md). Templates: [`../../templates/specs/feature-implementation-spec.md`](../../templates/specs/feature-implementation-spec.md), [`feature-plan.md`](../../templates/specs/feature-plan.md), [`feature-history.md`](../../templates/specs/feature-history.md), [`feature-memory.md`](../../templates/specs/feature-memory.md).

**Commit:** false (default). `--commit` asks first. `--no-commits` = default. **Specs only** — no app code, no Cursor plan.

## Args

`<feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]`

`phase` / `next` unused. Tags optional when sequencing phases.

## Load (once each; skip missing; no indexes)

1. This file. LOADMAP cards for given tags (or `--full`).
2. By path convention:
   - `ai_specs/brd/features/<feature>.md`
   - `ai_specs/design/features/<feature>.md` + screen files it names
   - `ai_specs/api/features/<feature>/` (folder files, not `api/INDEX.md`)
   - `ai_specs/api/contracts/INDEX.md` **rows for this slug only**
   - `ai_docs/architecture.md`, `ai_docs/conventions.md` when present
3. Existing `ai_specs/features/<feature>/README.md` if any.

Writes only under `ai_specs/features/<feature>/`. Do not invent endpoints. Missing contract → suggest `/backend-contract request <feature> [topic]`.

## Ask gate

Blockers from **loaded** files: missing info, BRD/design/API conflict, assumed/broken edges. Numbered list. Decide now or `TBD(owner)`.

## Steps

1. Mode A: README exists → refresh `plan.md` unless the user asked to change requirements.
   Mode B: write/update README (`## Contract` first, 6 KB) then `plan.md`.
2. Every phase: `Load`, `Inputs`, `Touches`, `Effort` (`light|standard|deep`), `Verification` (analyzer + manual). **No Tests field.**
3. **Coverage:** every requirement, endpoint, and screen maps to a phase. Leftovers = blocker or TBD.
4. Alignment = links only. Add `history.md` from template if missing. Create `memory.md` from [`feature-memory.md`](../../templates/specs/feature-memory.md) when missing (empty sections only, ≤ 3 KB). If it already exists, leave it — do not append and do not refill rows.
5. New feature: update `ai_specs/INDEX.md` matrix row.
6. Worklog append if `ai_worklog/` exists.
7. If `--commit`: [`../git/commit-after-phase.md`](../git/commit-after-phase.md) — show files + message, wait for yes. `--no-commits` skips (default). Do not run commit-before-work unless the user asked to save a dirty tree first.
8. Handoff ≤10 lines. Exact next command:

```text
/feature-implement-phase <feature> next
```

## Outputs

`README.md` (Mode B), `plan.md` (always, 8 KB budget), `history.md` when needed, `memory.md` when it was missing (empty, 3 KB budget).
