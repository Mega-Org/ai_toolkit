# Workflows: Feature delivery (`workflows/feature-delivery/`)

## Purpose

**Spec-driven feature work**: planning from a spec, implementing phased checklists, verifying and drafting PR material.

These playbooks write to the app's **build** layer: `ai_specs/features/<feature>/` (`README.md` + `plan.md`). Analysis truth stays in `ai_specs/brd/`, `design/`, and `api/` — see [`../../templates/specs/spec-index.md`](../../templates/specs/spec-index.md).

## Contents

| File | Topic |
|------|--------|
| [`make-plan.md`](make-plan.md) | Write/update `features/<feature>/README.md` + `plan.md`; **ask-before-proceed** on missing/conflicts (user decides or TBD); phased plan from spec or user message |
| [`implement-phase.md`](implement-phase.md) | Execute one phase; **ask-before-proceed** on phase blockers; update `plan.md` progress |
| [`verify-and-pr.md`](verify-and-pr.md) | Tests, checks, PR draft after phases `done`; surface open TBDs |

## Worklog

After planning or each implemented phase, update `ai_worklog/` when present — see [`../worklog/update-worklog.md`](../worklog/update-worklog.md).

## Git preflight

Before planning or starting a phase, see [`../git/commit-before-work.md`](../git/commit-before-work.md) (`make-plan --no-commits`, `implement-phase --no-commits` to skip).

## References

- Per feature (build): `ai_specs/features/<feature>/README.md` + `plan.md` (not in this toolkit). Templates: [`../../templates/specs/_index.md`](../../templates/specs/_index.md).
- Layer map / feature matrix: [`../../templates/specs/spec-index.md`](../../templates/specs/spec-index.md), [`../../templates/specs/specs-readme.md`](../../templates/specs/specs-readme.md).
- Reference checklists: [`../../reference/_index.md`](../../reference/_index.md)
- Workflow layout: [`../README.md`](../README.md)
