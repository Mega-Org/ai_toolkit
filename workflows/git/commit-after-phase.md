# Commit after phase (opt-in)

**Commit:** false (default). Run only when the user passed `--commit` on this run, or asked to commit after the work. `--no-commits` skips (same as default).

## Purpose

Optional conventional commit of **this run’s** files after make-plan, implement-phase, bugfix, verify-and-pr, or backend-contract. Never implied by those checklists.

## Fill when

- When commit message conventions or phase boundaries change.

## References

- Before work (dirty tree, only if asked): [`commit-before-work.md`](commit-before-work.md)
- Git rules: [`../../rules/git/_index.md`](../../rules/git/_index.md)
- Phase workflow: [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md)

## Agent steps

1. If `--commit` was not passed and the user did not ask to commit → **stop**. Leave the working tree dirty.
2. Show the files that would be staged and **one** proposed conventional message (scoped to this phase or task).
3. Ask. **Commit only after an explicit yes.** On no: leave dirty; do not retry unless they ask again.
4. Stage only this work. Do not mix unrelated edits. No secrets (`.env`, credentials, keystores). Hooks run. Do not push.
5. Do not amend unless the user asked and the commit is local, agent-authored, and unpushed. If a hook rejects, fix and make a **new** commit.

Examples:

- `feat(checkout): add cart repository and use cases`
- `docs(ai_specs): plan authentication phases`
- `fix(login): restore OTP route after blank screen`
