# Workflows: Feature delivery (`workflows/feature-delivery/`)

## Purpose

**Spec-driven feature work**: planning from a spec, implementing phased checklists, verifying and drafting PR material.

## Contents

| File | Topic |
|------|--------|
| [`make-plan.md`](make-plan.md) | Build a phased plan from a spec; use app `ai_docs/` when present |
| [`implement-phase.md`](implement-phase.md) | Execute one checklist phase |
| [`verify-and-pr.md`](verify-and-pr.md) | Tests, checks, PR description |

## Git preflight

Before planning or starting a phase, see [`../git/commit-before-work.md`](../git/commit-before-work.md) (`make-plan --no-commits`, `implement-phase --no-commits` to skip).

## References

- App specs live under each repo’s `ai_specs/` (not in this toolkit).
- Reference checklists: [`../../reference/_index.md`](../../reference/_index.md)
- Workflow layout: [`../README.md`](../README.md)
