# General Spec Templates

Reusable templates for app-specific `ai_specs/` folders. Copy into each app repo and fill with project facts.

## Templates

| Template | Use for |
|----------|---------|
| [`spec-index.md`](spec-index.md) | Root `ai_specs/INDEX.md` routing map |
| [`feature-implementation-spec.md`](feature-implementation-spec.md) | `ai_specs/features/<feature>/README.md` — requirements, logic, services, UI, Figma |
| [`feature-plan.md`](feature-plan.md) | `ai_specs/features/<feature>/plan.md` — phases, progress, verification |
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

- BRD business truth stays in `ai_specs/brd/`.
- Design / UI / nav truth stays in `ai_specs/design/` (see [`../design/_index.md`](../design/_index.md)).
- Feature **`README.md`** = what to build; **`plan.md`** = how and progress (updated by make-plan and implement-phase).
- Fix **`request.md`** = requester command and stated requirements; fix **`README.md`** = investigation and verification (updated by bugfix workflow).
- Mark unknowns as `TBD(owner): note`.
- No secrets in specs.
