# General Spec Templates

Reusable templates for app-specific `ai_specs/` folders. Copy into each app repo and fill with project facts.

## Templates

| Template | Use for |
|----------|---------|
| [`specs-readme.md`](specs-readme.md) | Root `ai_specs/README.md` — layer mental model (analysis vs build) |
| [`spec-index.md`](spec-index.md) | Root `ai_specs/INDEX.md` — compact feature matrix only |
| [`feature-implementation-spec.md`](feature-implementation-spec.md) | `ai_specs/features/<feature>/README.md` — Contract first (6 KB), then background |
| [`feature-plan.md`](feature-plan.md) | `ai_specs/features/<feature>/plan.md` — Load / Inputs / Touches / Effort / Verification (8 KB) |
| [`feature-history.md`](feature-history.md) | `ai_specs/features/<feature>/history.md` — completed phases split out of `plan.md` |
| [`feature-memory.md`](feature-memory.md) | `ai_specs/features/<feature>/memory.md` — code map, symbols, l10n, gotchas, contract IDs (3 KB; replace, do not append) |
| [`fix-spec.md`](fix-spec.md) | `ai_specs/fixes/YYYY-MM-DD-short-slug/README.md` |
| [`bugfix-request.md`](bugfix-request.md) | `ai_specs/fixes/YYYY-MM-DD-short-slug/request.md` — requester command and chat requirements |
| [`tester-bug-report.md`](tester-bug-report.md) | `ai_specs/fixes/YYYY-MM-DD-short-slug/intake.md` — normalized external QA report |
| [`integration-spec.md`](integration-spec.md) | Optional `ai_specs/integrations/<service>/README.md` |
| [`integration-remote-config-store-ops.md`](integration-remote-config-store-ops.md) | Optional `ai_specs/features/remote-config-store-ops/` |

## Workflows

- Plan: [`../../workflows/feature-delivery/make-plan.md`](../../workflows/feature-delivery/make-plan.md)
- Implement phase: [`../../workflows/feature-delivery/implement-phase.md`](../../workflows/feature-delivery/implement-phase.md)
- Bugfix: [`../../workflows/maintenance/bugfix.md`](../../workflows/maintenance/bugfix.md)

## Rules

- **Analysis vs build:** BRD / design / API are truth KBs; root `features/<slug>/` is the Flutter **build** layer (`README.md` + `plan.md` + `history.md` + `memory.md`). Same slug may appear in four trees — do not merge them.
- BRD business truth stays in `ai_specs/brd/`.
- Design / UI / nav truth stays in `ai_specs/design/` (see [`../design/_index.md`](../design/_index.md)).
- API collection truth stays in `ai_specs/api/` (see [`../api/_index.md`](../api/_index.md)).
- Feature **`README.md`** = what to build (`## Contract` first); **`plan.md`** = live phases; **`history.md`** = done phases; **`memory.md`** = code map and agreed facts (3 KB, replace not append). No `Tests` field on phases.
- **Ask-before-proceed:** on missing info or BRD/design/api conflicts, agents ask; user decides now or chooses `TBD(owner)` — no silent invent / no auto-TBD.
- Fix **`request.md`** = requester command and stated requirements; fix **`README.md`** = investigation and verification (updated by bugfix workflow).
- Mark unknowns as `TBD(owner): note` only after the user chooses TBD.
- No secrets in specs.
- Toolkit `workflows/` = agent playbooks; `api/analysis/workflows.md` = API journeys (not playbooks).
