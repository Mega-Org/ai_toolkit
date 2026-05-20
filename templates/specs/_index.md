# General Spec Templates

Reusable templates for app-specific `ai_specs/` folders. Copy into each app repo and fill with project facts.

## Templates

| Template | Use for |
|----------|---------|
| [`spec-index.md`](spec-index.md) | Root `ai_specs/INDEX.md` routing map |
| [`feature-implementation-spec.md`](feature-implementation-spec.md) | `ai_specs/features/<feature>/README.md` — requirements, logic, services, UI, Figma |
| [`feature-plan.md`](feature-plan.md) | `ai_specs/features/<feature>/plan.md` — phases, progress, verification |
| [`fix-spec.md`](fix-spec.md) | Optional `ai_specs/fixes/YYYY-MM-DD-short-slug/README.md` |
| [`integration-spec.md`](integration-spec.md) | Optional `ai_specs/integrations/<service>/README.md` |

## Workflows

- Plan: [`../../workflows/feature-delivery/make-plan.md`](../../workflows/feature-delivery/make-plan.md)
- Implement phase: [`../../workflows/feature-delivery/implement-phase.md`](../../workflows/feature-delivery/implement-phase.md)

## Rules

- BRD business truth stays in `ai_specs/brd/`.
- Feature **`README.md`** = what to build; **`plan.md`** = how and progress (updated by make-plan and implement-phase).
- Mark unknowns as `TBD(owner): note`.
- No secrets in specs.
