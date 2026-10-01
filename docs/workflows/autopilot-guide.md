# Autopilot

Cursor command: `/autopilot-plan`. Checklist: [`autopilot-phases.md`](../../workflows/feature-delivery/autopilot-phases.md). Skill: `ai_toolkit/templates/cursor-skills/autopilot-plan/SKILL.md.template` (installed as `.cursor/skills/autopilot-plan/SKILL.md`). Modes: [`autopilot-execution-modes.md`](../../rules/feature-delivery/autopilot-execution-modes.md).

## What the parent loads

The parent skill is about 4 KB. It loads **the chosen mode file only**. Safe and Cloud also load `features/commit-strategies.md`. Merge and conflict files load only if you later ask to merge, and only in those modes.

It does not load `TEAM_GUIDE.md` or `examples/`.

Pending work comes from grepping `^Status:` in the plan. It does not read the whole plan to find progress. Primary plans are `ai_specs/features/<feature>/plan.md`.

## Phase child

Each launch gets a context pack: phase number, `Load`, `Inputs` (including reply `#ID`s), `Touches`, and the feature `memory.md` path. The child uses the lean implement-phase loader with `--no-commits`, runs the analyzer on `Touches`, and returns 10 lines or fewer: status, files, analyzer, new memory facts, blockers.

The parent is the only writer of `memory.md` and `ai_docs/memory.md`. It merges those facts between phases (replace the matching row; do not append).

Up to 3 consecutive `Effort: light` phases share one subagent in Direct and Safe. `standard`, `deep`, and every Cloud phase each get their own subagent.

## Paused

A child that cannot continue returns `paused` with blockers. The parent asks you, then re-runs that phase with your answer. If the blocker is a missing contract, it suggests `/backend-contract request` and waits. It does not invent the contract or start later phases.

## Models

Once per plan, the parent proposes an Effort-to-model map (light → fastest, standard → session default, deep → strongest) and waits for you to approve or replace it. `default` keeps the session default for every phase. The approved line is `autopilot_models` on the plan.

## Verification and git

The child analyzes touched files. The parent runs `make analyze` once at the end of the run.

Direct never commits. Safe and Cloud ask before committing. Nothing is pushed or merged during the run.

```text
/autopilot-plan ai_specs/features/orders/plan.md
/autopilot-plan ai_specs/features/orders/plan.md direct
/autopilot-plan ai_specs/features/orders/plan.md safe
/autopilot-plan ai_specs/features/orders/plan.md cloud
```
