# Implement one phase

## Purpose

Execute **one phase** from `ai_specs/features/<feature>/plan.md` produced by [`make-plan.md`](make-plan.md). Read the feature contract from `README.md`, implement code, verify, then **update `plan.md`** with status and handoff.

## Fill when

- Phase granularity, verification gates, or spec/plan update rules change.

## References

- Bootstrap: [`../session/bootstrap-session.md`](../session/bootstrap-session.md)
- Planning: [`make-plan.md`](make-plan.md)
- Commit before work: [`../git/commit-before-work.md`](../git/commit-before-work.md)
- Commit after phase: [`../git/commit-after-phase.md`](../git/commit-after-phase.md)
- When complete: [`verify-and-pr.md`](verify-and-pr.md)
- App paths: `ai_specs/INDEX.md`, `ai_specs/features/<feature>/README.md`, `ai_specs/features/<feature>/plan.md`, `ai_docs/`

## How to invoke (users)

**When to use** — A `plan.md` exists and you want one phase implemented.

**What you say** — e.g. “Implement phase 2 for authentication,” or “Run the next pending authentication phase.”

- **Normal:** bootstrap session → commit-before-work → implement → **update `plan.md`**.
- **Skip Git:** `implement-phase --no-commits` or “without committing first.”

## Preflight

1. **Bootstrap session** — [`../session/bootstrap-session.md`](../session/bootstrap-session.md). For feature work load, in order:
   - `ai_specs/INDEX.md` (if present)
   - `ai_specs/features/<feature>/README.md`
   - `ai_specs/features/<feature>/plan.md`
   - Routed BRD files when the plan lists them
   - `ai_docs/` when present
2. **Commit before work** — [`../git/commit-before-work.md`](../git/commit-before-work.md) unless `--no-commits`.

If `plan.md` is missing, run [`make-plan.md`](make-plan.md) first (Mode A or B).

## Steps

1. **Confirm scope** — Identify the target phase in `plan.md` (first `pending` unless the user named a phase). Restate deliverables in one sentence. Confirm stub vs real API matches `README.md` and this phase — do not skip ahead of **Next session** / API cutover unless the plan says so.
2. **Implement** — Per `plan.md` deliverables and toolkit rules/patterns. Network: feature API constants under `data/api/` only ([`../../patterns/data/feature-data-layer.md`](../../patterns/data/feature-data-layer.md)). UI: use Figma MCP only when this phase includes UI and `README.md` lists Figma URLs.
3. **Verify** — Run checks listed for this phase in `plan.md`; keep analyzer clean for touched files.
4. **Update `plan.md` (required)** — For the completed phase set **Status** to `done` (or `in-progress` if partially complete). Fill **Verification** results, **Notes**, and update **Next** / **Done** sections. Set plan **Status** to `in-progress` until all phases are `done`.
5. **Update `README.md` when needed** — Only if this phase changed contracts (API shapes, cache rules, new TBDs resolved). Do not duplicate phase progress in `README.md` — that lives in `plan.md`.
6. **Handoff** — State the next `pending` phase and which rules/patterns apply.

Optional: commit per [`../git/commit-after-phase.md`](../git/commit-after-phase.md).

## After this phase

- Run **implement-phase** again for the next `pending` phase.
- When every phase is `done`, set plan **Status** to `done` and run **`verify-and-pr.md`**.

## Done when

Phase verification passes and `plan.md` shows this phase as `done` with verification notes recorded.
