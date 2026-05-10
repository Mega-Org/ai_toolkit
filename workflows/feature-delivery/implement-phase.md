# Implement one phase

## Purpose

Execute **one phase** from a feature plan—implementation steps, verification hooks, and handoff to the next phase or PR.

## Fill when

- When phase granularity or verification gates change.

## References

- Planning: [`make-plan.md`](make-plan.md)
- **Commit before starting this workflow:** [`../git/commit-before-work.md`](../git/commit-before-work.md)
- Commit after completing a phase: [`../git/commit-after-phase.md`](../git/commit-after-phase.md)

## How to invoke (users)

- **Normal:** Ask the AI to implement the current plan phase. The agent runs **commit-before-work** first unless you opt out.
- **Without commit-before-work:** Say **`implement-phase --no-commits`** or **“implement this phase without committing first.”**

## Preflight

Before the steps below, follow **`../git/commit-before-work.md`** (default: **commit** uncommitted work with an AI-generated message after confirmation), unless the user passed **`--no-commits`**.

## Steps

1. **Confirm scope** — Which phase from `ai_specs/` (or the active plan); restate deliverables in one sentence.
2. **Implement** — Data/domain, state, presentation, wiring per the plan and app rules (`ai_toolkit` rule/pattern routing).
3. **Verify** — Tests and checks listed for this phase; analyzer clean for touched files.
4. **Document** — Update `ai_specs/` and/or `ai_docs/` as agreed for this phase.
5. **Handoff** — Mark phase done in the spec; note follow-ups.

Optional: commit completed phase work per [`../git/commit-after-phase.md`](../git/commit-after-phase.md).

## Done when

Phase verification passes and the plan reflects this phase as complete.
