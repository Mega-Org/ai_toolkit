# Commit after phase

## Purpose

After **completing** work for a plan phase, create a **conventional commit** so history stays readable and reviews stay scoped. This is separate from **commit-before-work**, which runs **before** you start planning or implementing.

## Fill when

- When commit message conventions or phase boundaries change.

## References

- **Before** plan/phase work (dirty tree): [`commit-before-work.md`](commit-before-work.md)
- Git rules: [`../../rules/git/_index.md`](../../rules/git/_index.md)
- Phase workflow: [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md)

## Content

1. Ensure the phase’s verification steps have passed (tests, analyzer, manual checks as defined in the plan).
2. Stage only files that belong to this phase when possible; avoid mixing unrelated changes.
3. Use a **conventional** message, scoped to the phase, for example:
   - `feat(checkout): add cart repository and use cases`
   - `feat(checkout): wire payment phase presentation`
4. If the working tree still contains unrelated edits, prefer splitting commits or finishing [`commit-before-work.md`](commit-before-work.md) hygiene before merging the phase commit.
