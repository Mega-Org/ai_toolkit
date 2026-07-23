# Verify work and open PR

## Purpose

After all phases in `ai_specs/features/<feature>/plan.md` are `done` (or after a scoped fix/refactor the user wants reviewed): run verification, self-review against toolkit rules, and draft PR material. Does **not** invent missing product/API/design contracts — open blockers use the same decide-now vs TBD policy as make-plan / implement-phase.

## Fill when

- CI gates, PR checklist expectations, or handoff format change.

## References

- Plan / phases: [`implement-phase.md`](implement-phase.md), [`make-plan.md`](make-plan.md)
- Commit after phase: [`../git/commit-after-phase.md`](../git/commit-after-phase.md)
- Git rules: [`../../rules/git/_index.md`](../../rules/git/_index.md)
- Bootstrap: [`../session/bootstrap-session.md`](../session/bootstrap-session.md)
- Worklog: [`../worklog/update-worklog.md`](../worklog/update-worklog.md)
- Layer map: [`../../templates/specs/spec-index.md`](../../templates/specs/spec-index.md)

## When to use

- User says `verify and pr`, `draft PR for <feature>`, or all phases are `done` and they want a review package.
- Optional after a multi-phase feature, or after a substantial bugfix the user wants PR-ready.

## Preflight

1. Load `ai_specs/features/<feature>/plan.md` and `README.md` (build layer).
2. Confirm plan **Status** is `done`, or the user explicitly wants a partial PR (document remaining `pending` phases).
3. List open `TBD(owner)` that still block merge. If any are merge-blockers and unresolved: **ask-before-proceed** (decide now or accept TBD in PR description / follow-up). Do not invent resolutions.

## Steps

1. **Verification** — Run checks from the plan and app conventions:
   - Analyzer clean on touched files (`dart analyze` / IDE diagnostics as the app uses).
   - Tests listed in `plan.md` or project defaults (`flutter test` scoped when possible).
   - Manual / flavor checks noted in the plan (locales, stub vs real API).
   - Record results in `plan.md` **Done** / verification notes if not already filled.
2. **Self-review** — Diff against toolkit + app docs:
   - Rules/patterns cited in completed phases.
   - No secrets in specs or code.
   - Build contracts still link BRD / design / API when those KBs exist.
   - No leftover `assumed` / `broken` design edges implemented without user acceptance.
3. **Open TBDs** — Summarize accepted TBDs and owners. Move product/backend/design follow-ups to `ai_worklog/TODOS.md` when worklog exists.
4. **Draft PR** — Provide (do not push unless the user asks):
   - **Title** — conventional, feature-scoped (e.g. `feat(auth): complete login phases`).
   - **Summary** — 1–3 bullets of what shipped.
   - **Test plan** — checklist from verification above.
   - **Spec links** — `ai_specs/features/<feature>/README.md`, `plan.md`, related BRD/design/api paths.
   - **Follow-ups** — open TBDs / TODOs.
5. **Update worklog** — If `ai_worklog/` exists, record verification outcome and PR draft handoff.
6. **Handoff** — Tell the user the draft is ready; wait for push / `gh pr create` unless they already asked to open the PR.

## Outputs

- Updated verification notes on `plan.md` when needed.
- PR title, body, and test plan in chat (or files only if the user asks).
- Optional worklog entries.

## Done when

Verification recorded, self-review done, PR draft delivered, and merge-blocking gaps either resolved by the user or explicitly TBD’d with owners.
