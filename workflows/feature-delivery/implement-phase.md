# Implement one phase

## Purpose

Execute **one phase** from the **build** plan at `ai_specs/features/<feature>/plan.md` produced by [`make-plan.md`](make-plan.md). Read the feature contract from `README.md` in that same folder (not from `brd/features/` or `api/features/`), implement code, verify, then **update `plan.md`** with status and handoff.

## Fill when

- Phase granularity, verification gates, or spec/plan update rules change.

## References

- Bootstrap: [`../session/bootstrap-session.md`](../session/bootstrap-session.md)
- Planning: [`make-plan.md`](make-plan.md)
- Commit before work: [`../git/commit-before-work.md`](../git/commit-before-work.md)
- Commit after phase: [`../git/commit-after-phase.md`](../git/commit-after-phase.md)
- When complete: [`verify-and-pr.md`](verify-and-pr.md)
- App paths: `ai_specs/INDEX.md`, `ai_specs/features/<feature>/README.md`, `ai_specs/features/<feature>/plan.md`, `ai_specs/brd/` / `ai_specs/design/` / `ai_specs/api/` when the plan or phase references them, `ai_docs/`
- Worklog: [`../worklog/update-worklog.md`](../worklog/update-worklog.md)
- Design analysis: [`../product-analysis/figma-analysis.md`](../product-analysis/figma-analysis.md)
- Layer map: [`../../templates/specs/spec-index.md`](../../templates/specs/spec-index.md)

## How to invoke (users)

**When to use** — A `plan.md` exists and you want one phase implemented.

**What you say** — e.g. “Implement phase 2 for authentication,” or “Run the next pending authentication phase.”

- **Normal:** bootstrap session → commit-before-work → implement → **update `plan.md`**.
- **Skip Git:** `implement-phase --no-commits` or “without committing first.”

## Ask-before-proceed gate (required)

Before implementing the target phase, scan `README.md`, `plan.md`, and linked BRD / design / API for **blockers that affect this phase**:

| Trigger | Examples |
|---------|----------|
| Missing needed info | Phase needs an endpoint, field, or rule not in the build spec or KBs |
| Conflict / mismatch | Design and API disagree for this phase; BRD contradicts UI or HTTP contract |
| Unresolved TBD | Existing `TBD(...)` blocks deliverables and was never accepted as “implement around TBD” |
| Ambiguous edge | Design edge `assumed` / `broken` required by this phase |

**Required behavior:**

1. **Stop and ask the user** with a numbered list. Do **not** invent contracts. Do **not** silently pick design over API (or the reverse).
2. For each item, user chooses:
   - **Decide now** — agent applies the decision (update `README.md` / `plan.md` notes if the contract changed), then implement, or
   - **Add TBD** — agent records `TBD(owner): …` and only continues if the phase can still be completed without inventing that contract (e.g. stub); otherwise leave phase `pending` / `in-progress` and hand off.
3. Proceed with code changes only after each listed item has a decision or an explicit TBD the user accepted for this phase.

**Ask format (copy shape):**

```text
Needs your call before implement-phase continues:
1. <issue> — Sources: design `…`, api `…` — Decide now, or add TBD(<owner>)?
2. …
```

## Preflight

1. **Bootstrap session** — [`../session/bootstrap-session.md`](../session/bootstrap-session.md). For feature work load, in order:
   - `ai_specs/INDEX.md` (if present; feature matrix)
   - **Build:** `ai_specs/features/<feature>/README.md`
   - **Build:** `ai_specs/features/<feature>/plan.md`
   - Routed BRD files when the plan lists them (`brd/features/` is business truth, not the build plan)
   - Routed design KB files when the phase includes UI and `ai_specs/design/` exists (`design/INDEX.md` → feature design → screen nodes → navigation-graph as needed)
   - Routed API feature folder when the phase touches HTTP and `ai_specs/api/features/<feature>/` exists
   - `ai_docs/` when present
   - When the target phase includes UI/Figma: [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md) and [`../../rules/core/localization.md`](../../rules/core/localization.md)
2. **Ask-before-proceed** — Run the gate above for the target phase; wait for decide-now or TBD.
3. **Commit before work** — [`../git/commit-before-work.md`](../git/commit-before-work.md) unless `--no-commits`.

If `plan.md` is missing, run [`make-plan.md`](make-plan.md) first (Mode A or B).

## Steps

1. **Confirm scope** — Identify the target phase in `plan.md` (first `pending` unless the user named a phase). Restate deliverables in one sentence. Confirm stub vs real API matches `README.md` and this phase — do not skip ahead of **Next session** / API cutover unless the plan says so. If unclear, use the ask-before-proceed gate.
2. **Implement** — Per `plan.md` deliverables and toolkit rules/patterns. Network: feature API constants under `data/api/` only ([`../../patterns/data/feature-data-layer.md`](../../patterns/data/feature-data-layer.md)). **UI / Figma:** load design via Figma MCP when this phase includes UI and screen URLs are listed in `README.md` or `ai_specs/design/screens/` ; then:
   - Prefer screen slugs and edges from `ai_specs/design/`; do not implement `assumed` / `broken` graph edges unless the user accepted them (decide-now) or explicitly TBD’d them out of scope for this phase.
   - Detect and apply **design direction** per [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md) (defaults first — do not hardcode `TextAlign.right`, `Alignment.centerRight`, or `EdgeInsets.only(left/right)` to match Arabic screenshots).
   - Map all user-visible copy to **l10n** keys ([`../../rules/core/localization.md`](../../rules/core/localization.md)).
   - Verify layout in both supported locales when the app supports Arabic and English.
3. **Verify** — Run checks listed for this phase in `plan.md`; keep analyzer clean for touched files.
4. **Update `plan.md` (required)** — For the completed phase set **Status** to `done` (or `in-progress` if partially complete). Fill **Verification** results, **Notes**, and update **Next** / **Done** sections. Record any new user-accepted TBDs. Set plan **Status** to `in-progress` until all phases are `done`.
5. **Update `README.md` when needed** — Only if this phase changed contracts (API shapes, cache rules, new TBDs resolved or added by user). Do not duplicate phase progress in `README.md` — that lives in `plan.md`.
6. **Handoff** — State the next `pending` phase and which rules/patterns apply.
7. **Update worklog (required)** — If `ai_worklog/` exists, follow [`../worklog/update-worklog.md`](../worklog/update-worklog.md): record completed phase work, verification outcome, next pending phase, and new or closed TODOs. Stored entries in English.

Optional: commit per [`../git/commit-after-phase.md`](../git/commit-after-phase.md).

## After this phase

- Run **implement-phase** again for the next `pending` phase.
- When every phase is `done`, set plan **Status** to `done` and run **`verify-and-pr.md`**.

## Done when

Phase verification passes and `plan.md` shows this phase as `done` with verification notes recorded.
