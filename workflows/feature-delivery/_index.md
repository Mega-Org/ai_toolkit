# Workflows: Feature delivery (`workflows/feature-delivery/`)

## Purpose

**Spec-driven feature work**. Checklists here; explanations in [`../../docs/workflows/`](../../docs/workflows/overview.md). Shared loader: [`../../docs/workflows/working-rules.md`](../../docs/workflows/working-rules.md).

Writes the **build** layer: `ai_specs/features/<feature>/` (`README.md` + `plan.md` + `history.md`). Analysis KBs stay in `brd/`, `design/`, `api/`.

## Contents

| File | Topic |
|------|--------|
| [`make-plan.md`](make-plan.md) | Specs only; Load/Inputs/Touches/Effort per phase; coverage check |
| [`implement-phase.md`](implement-phase.md) | One phase; Agent mode; LOADMAP + Inputs; skip tests |
| [`verify-and-pr.md`](verify-and-pr.md) | After phases `done`; surface open TBDs |

Args: `<feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]`

## Worklog

Append-only: [`../worklog/update-worklog.md`](../worklog/update-worklog.md).

## Git

**Commit:** false (default) on make-plan, implement-phase, bugfix, verify-and-pr, and autopilot Direct. `--commit` shows files + message, then waits. `--no-commits` = default. Opt-in playbooks: [`../git/commit-before-work.md`](../git/commit-before-work.md), [`../git/commit-after-phase.md`](../git/commit-after-phase.md).

## References

- Templates: [`../../templates/specs/_index.md`](../../templates/specs/_index.md)
- LOADMAP: [`../../LOADMAP.md`](../../LOADMAP.md)
