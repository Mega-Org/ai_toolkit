# Autopilot phases

**Commit:** false (default, Direct). Direct never commits. Safe and Cloud **ask** before any commit. Phase agents always get `--no-commits`. Never push. Never merge in this run.

Checklist for `/autopilot-plan`. Skill: `.cursor/skills/autopilot-plan/SKILL.md`. Guide: [`../../docs/workflows/autopilot-guide.md`](../../docs/workflows/autopilot-guide.md).

## Load

This file, then **one** mode file under the skill `modes/` directory. Do not load `TEAM_GUIDE.md`, `examples/`, auto-detection, or the interactive menu.

- **Direct:** `modes/direct-mode.md` only.
- **Safe or Cloud:** that mode file plus `features/commit-strategies.md`.
- Merge and conflict files only if the user later asks to merge, and only in Safe or Cloud.

Autopilot is for `ai_specs` feature plans only: `ai_specs/features/<feature>/plan.md`. Given a `~/.cursor/plans/*.plan.md`, stop and point to Cursor's Build button. Per-phase work: [`implement-phase.md`](implement-phase.md) with `--no-commits`. The phase child lists memory facts and does not write them.

## Parent

The parent never edits `lib/`, specs, or toolkit files. It only updates plan Status lines, `autopilot_*` lines, and `memory.md`.

Each phase or light batch must be run with the Task tool (`subagent_type` generalPurpose, model from `autopilot_models`). If Task is not loaded, discover it first. Never implement a phase inline.

## Steps

1. **Mode** — Use the named mode. If omitted, show Direct / Safe / Cloud and wait. Record `autopilot_mode` and `autopilot_base_branch` in the plan.
2. **Status** — Grep `^Status:`. Skip `done` / `completed`. Continue at the first `pending` or `in-progress`. Do not read the whole plan to find this.
3. **Models** — Once per plan, if `autopilot_models` is missing, propose light → fastest, standard → session default, deep → strongest, and wait. Write the approved line. `default` keeps the session default for every phase.
4. **Context pack** — For each pending phase, read only number, `Load`, `Inputs` (reply `#ID`s included), `Touches`, `Effort`, plus `ai_specs/features/<feature>/memory.md`.
5. **Run** — Task tool (`subagent_type` generalPurpose, model from `autopilot_models`). If Task is not loaded, discover it first. Never implement a phase inline. Up to 3 consecutive `Effort: light` phases in one subagent (Direct and Safe). `standard`, `deep`, and every Cloud phase are one each. Prompt carries the context pack and the memory path. Child returns ≤ 10 lines: status, files, analyzer, memory facts, blockers.
6. **Memory** — Parent merges those facts before the next phase. Replace matching rows. Feature file ≤ 3 KB; `ai_docs/memory.md` ≤ 4 KB. Do not append.
7. **Paused** — Child returns `paused` and blockers. Ask, then re-run that phase with the answer. Missing contract → suggest `/backend-contract request <feature> [topic]` and wait. Do not invent it. Do not start later phases.
8. **Failed** — Stop. No commit. No later phases.
9. **End** — `make analyze` once. Summarize. Direct stays dirty. Safe and Cloud commit only after yes.

## Done when

Every extracted phase is `done` or `completed`, or the run stopped on `paused` / failed with the next phase unstarted. `make analyze` has run once for this invocation.
