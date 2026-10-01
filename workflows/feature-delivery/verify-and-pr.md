# Verify and open PR / MR

**Commit:** false (default). Do not commit, push, or open a remote PR/MR unless the user asks. `--commit` → [`../git/commit-after-phase.md`](../git/commit-after-phase.md): show files + message, wait for yes. `--no-commits` = default.

## Purpose

After all phases in `ai_specs/features/<feature>/plan.md` are `done` (or after a scoped fix the user wants reviewed): run verification, self-review against toolkit rules, and draft PR/MR material. Does **not** invent missing product/API/design contracts.

## Fill when

CI gates, MR checklist expectations, or handoff format change.

## References

- Skill: `/feature-verify-pr` (thin entry — this file is authoritative)
- Plan / phases: [`implement-phase.md`](implement-phase.md)
- Git: [`../../rules/git/_index.md`](../../rules/git/_index.md)
- Contracts register: `ai_specs/api/contracts/INDEX.md`

## When to use

- User says `verify and pr`, `/feature-verify-pr <feature>`, or all phases are `done` and they want a review package.

## Preflight

1. Load feature `plan.md`, `README.md` (**Contract** section), and `memory.md` when present.
2. Confirm plan **Status** is `done`, or document partial scope explicitly.
3. List merge-blocking `TBD(owner)` — ask if unresolved.

## Steps

1. **Verification**
   - **Analyzer:** use the app's command from `ai_docs/conventions.md` (for example `make analyze`). Scope to touched paths when the user named a partial verify.
   - **Tests:** run only if the user asked or the plan explicitly requires them (default: skip).
   - **Manual verify** — record checklist the user can run on device/simulator:
     - Success path for the feature surface
     - Empty state (if applicable)
     - Error/offline handling (if applicable)
     - RTL Arabic + English locale spot-check when UI changed
   - Link **contracts** used: rows from `ai_specs/api/contracts/INDEX.md` referenced in README/plan `Inputs`.
2. **Self-review** — Diff vs loaded rules; no secrets; BRD/design/api links intact.
3. **Draft MR/PR** (chat only unless user asks to open):
   - **Title** — conventional, feature-scoped.
   - **Summary** — 1–3 bullets.
   - **Manual verify** — copy the checklist from step 1.
   - **Spec links** — README, plan, history, contracts.
   - **Follow-ups** — open TBDs.
4. **Git host** — read `ai_docs/conventions.md`. When the remote looks like GitLab **and** `glab` is available, offer **`glab mr create`** only after the user confirms title/body. Do not push unless asked.
5. **Worklog** — optional line in `ai_worklog/` when present.

## Done when

Verification + manual checklist recorded, draft delivered, merge blockers resolved or explicitly TBD’d.
