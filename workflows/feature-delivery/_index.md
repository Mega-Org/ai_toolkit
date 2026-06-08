# Workflows: Feature delivery (`workflows/feature-delivery/`)

## Purpose

**Spec-driven feature work**: planning from a spec, implementing phased checklists, verifying and drafting PR material.

## Contents

| File | Topic |
|------|--------|
| [`make-plan.md`](make-plan.md) | Write/update `features/<feature>/README.md` + `plan.md`; phased plan from spec or user message |
| [`implement-phase.md`](implement-phase.md) | Execute one phase; update `plan.md` progress |
| [`verify-and-pr.md`](verify-and-pr.md) | Tests, checks, PR description |

## Worklog

After planning or each implemented phase, update `ai_worklog/` when present — see [`../worklog/update-worklog.md`](../worklog/update-worklog.md).

## Git preflight

Before planning or starting a phase, see [`../git/commit-before-work.md`](../git/commit-before-work.md) (`make-plan --no-commits`, `implement-phase --no-commits` to skip).

## References

- Per feature: `ai_specs/features/<feature>/README.md` + `plan.md` (not in this toolkit). Templates: [`../../templates/specs/_index.md`](../../templates/specs/_index.md).
- Reference checklists: [`../../reference/_index.md`](../../reference/_index.md)
- Workflow layout: [`../README.md`](../README.md)
