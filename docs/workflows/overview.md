# Workflows

Four playbooks cover feature planning, one-phase implementation, sequential phase runs, and bug fixes. The files under [`../../workflows/`](../../workflows/) are the source of truth. Cursor commands come from the installed skills (see [Installation](../installation/new-project-setup.md)).

| Workflow | Use it when | Canonical file |
|----------|-------------|----------------|
| Make plan | You need a feature spec and a phased plan | [`make-plan.md`](../../workflows/feature-delivery/make-plan.md) |
| Implement phase | A `plan.md` exists and you want one phase done | [`implement-phase.md`](../../workflows/feature-delivery/implement-phase.md) |
| Autopilot | Pending phases in a plan should run in order | [`autopilot-phases.md`](../../workflows/feature-delivery/autopilot-phases.md) |
| Bugfix | Something is broken and you need a fix, not a feature plan | [`bugfix.md`](../../workflows/maintenance/bugfix.md) |

Guides: [make-plan](make-plan-guide.md), [implement-phase](implement-phase-guide.md), [autopilot](autopilot-guide.md), [bugfix](bugfix-guide.md). Shared loader and handoff: [working-rules](working-rules.md). Checklists stay under [`../../workflows/`](../../workflows/); this folder holds explanations.

## When to use each

**Make plan** when the feature still needs requirements and an ordered phase list. Specs only (`README.md` + `plan.md`). Same argument format as implement-phase. Coverage check; missing contract → `/backend-contract request`.

**Implement phase** when `plan.md` already exists. Agent mode only. Lean load (plan live part, Contract, Inputs, LOADMAP). Repeat per phase.

**Autopilot** when the remaining phases should run one after another. Direct is the default and does not commit. Safe and Cloud ask before committing.

**Bugfix** when the work is a crash, wrong UI, bad API handling, a regression, an analyzer error tied to behavior, or a QA report. It lives under maintenance and does not create a feature `plan.md`.

## How they relate

Make-plan produces `ai_specs/features/<feature>/plan.md` (and, for a new feature, `README.md`). Implement-phase runs one phase from that plan and writes the phase status back into `plan.md`. Autopilot runs unfinished phases by calling implement-phase. Up to three light phases can share one child; the parent writes memory between launches so the next phase sees the previous files. Bugfix is a separate maintenance path: it persists a fix folder under `ai_specs/fixes/` and does not walk the feature plan.

After every feature phase is `done`, feature delivery continues with [`verify-and-pr.md`](../../workflows/feature-delivery/verify-and-pr.md) (**Commit:** false by default). Bugfix does not open that flow on its own.

```text
make-plan  →  plan.md
                 │
                 ├─ implement-phase  (one phase, then update plan.md)
                 │
                 └─ autopilot  (pending phases, in order, each via implement-phase)

bugfix  →  ai_specs/fixes/   (separate from the plan)
```
