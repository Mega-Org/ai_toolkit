# Implement one phase

## Purpose

Execute **one phase** from a feature plan produced by [`make-plan.md`](make-plan.md)—implementation steps, verification hooks, and handoff to the next phase or PR. Stay aligned with the spec’s **ordering** (e.g. stub HTTP / `Future.delayed` vs real Dio) and any **Next session** / API cutover checklist so this phase does not assume live endpoints or production JSON before the plan says so.

## Fill when

- When phase granularity or verification gates change.

## References

- Planning: [`make-plan.md`](make-plan.md) (inputs, phased steps, outputs, and **After the plan** chain)
- **Commit before starting this workflow:** [`../git/commit-before-work.md`](../git/commit-before-work.md)
- Commit after completing a phase: [`../git/commit-after-phase.md`](../git/commit-after-phase.md)
- When the feature is fully complete: [`verify-and-pr.md`](verify-and-pr.md)
- Optional paths in **your app repos**: e.g. `ai_specs/`, `ai_docs/architecture.md`, `ai_docs/conventions.md`

## How to invoke (users)

**When to use** — You already have a phased plan (from make-plan or equivalent) and want **one slice** implemented with verification and handoff.

**What you say** — Natural language is enough, for example: “Implement phase 2 from the checkout plan,” or “Run the current authentication phase.” You do **not** need a special command name.

- **Normal:** The agent runs **commit-before-work** first (same default as make-plan: check `git status`, propose a commit message, confirm before work). **You do not need to ask for commit-before-work every time.**
- **Skip Git preflight:** **`implement-phase --no-commits`** or **“implement this phase without committing first.”**

## Preflight

Before the steps below, follow **`../git/commit-before-work.md`**: check `git status`; if there are uncommitted changes, **default to committing** with an AI-generated message after quick confirmation—unless the user used **`--no-commits`**. Same default behavior as make-plan.

## Steps

1. **Confirm scope** — Which phase from `ai_specs/` (or the active plan); restate deliverables in one sentence. If the spec defines **current implementation scope** (stubs vs real API), confirm this phase matches that slice and any **Next session** / cutover items are not jumped ahead of unintentionally.
2. **Implement** — Data/domain, state, presentation, wiring per the plan and app rules (`ai_toolkit` `INDEX.md` → Defaults, Rule Routing, Pattern Routing). When this phase touches network configuration or paths, keep **feature-scoped API path constants** under the feature `data/` folder (single source for remote services; not in cubits)—as called out in make-plan when the feature has network calls.
3. **Verify** — Tests and checks listed for this phase in the plan; analyzer clean for touched files.
4. **Document** — Update `ai_specs/` and/or `ai_docs/` as agreed for this phase.
5. **Handoff** — Mark phase done in the spec; note follow-ups. Keep explicit pointers to which `rules/` and `patterns/` files mattered so the next phase stays consistent (mirror make-plan **Outputs**).

Optional: commit completed phase work per [`../git/commit-after-phase.md`](../git/commit-after-phase.md).

## After this phase

- Run **implement-phase** again for the next slice (each run starts with **`../git/commit-before-work.md`** unless `--no-commits`).
- Use **`../git/commit-after-phase.md`** when you commit per phase after completing work.
- When all phases are done, run **`verify-and-pr.md`**.

## Done when

Phase verification passes and the plan (or spec) reflects this phase as complete.
