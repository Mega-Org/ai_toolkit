# Bugfix

Checklist. Guide: [`../../docs/workflows/bugfix-guide.md`](../../docs/workflows/bugfix-guide.md). Rules: [`../../docs/workflows/working-rules.md`](../../docs/workflows/working-rules.md). Templates: [`../../templates/specs/bugfix-request.md`](../../templates/specs/bugfix-request.md), [`tester-bug-report.md`](../../templates/specs/tester-bug-report.md), [`fix-spec.md`](../../templates/specs/fix-spec.md).

**Commit:** false (default). `--commit` asks first. `--no-persist` skips the fix folder (discouraged). `--no-commits` = default.

## Args

`<feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]`

Slug or `ai_specs/fixes/<folder>/`. `next` resumes an in-progress fix. Tags from suspected domain (`state`, `data`, `ui`, …).

Phrases: `bugfix: …` (chat), `bugfix from tester report` (QA paste), `bugfix from ai_specs/fixes/<slug>/` (resume).

## Load (once each; no INDEX.md)

1. This file.
2. [`../../LOADMAP.md`](../../LOADMAP.md) cards for `+tag` / `--load=` / `--full` (guess tags from the report if none given).
3. Fix folder `request.md` + `README.md` when resuming.
4. `--load=` paths and any feature `README.md` Contract if the bug names a slug.
5. `ai_docs/memory.md` once, before replacing an app-wide gotcha row.
6. Screen file before Figma if the bug is visual.

Lite bootstrap. Broad search → `explore` subagent. Read each file once. Skip tests unless asked.

## Persist (unless `--no-persist`)

Create `ai_specs/fixes/YYYY-MM-DD-<slug>/` at start: `request.md` (command verbatim) + draft `README.md`. Mode B: `intake.md` (+ optional `intake-source.txt`). Append steering to `request.md`. No chat transcripts.

## Steps

1. Intake — one-sentence bug. Mode B: normalize paste (column map in the guide). Ask once for missing flavor/platform/locale.
2. Reproduce — stop if not reproducible.
3. Isolate — root cause, minimal scope. Ask only on real tradeoffs.
4. Fix — minimal diff. No unrelated refactors. No tests.
5. Verify — re-run repro; analyzer on touched files.
6. Write README Status (`done` / `in-progress` / `TBD(backend)`). If the fix is an app-wide gotcha (shared widget or cross-feature trap), replace the matching row in `ai_docs/memory.md` (≤ 4 KB; create from [`../../templates/app-seed/ai_docs/memory.md`](../../templates/app-seed/ai_docs/memory.md) if missing). Do not append a duplicate. Do not put feature-only notes or verify commands there. Worklog append if `ai_worklog/` exists.
7. If `--commit`: [`../git/commit-after-phase.md`](../git/commit-after-phase.md) — show files + message, wait for yes. `--no-commits` skips (default).
8. Handoff ≤10 lines: Done; files; analyzer; open items; next command; Context used.

Runtime stack + hot reload: app skill `dart-fix-runtime-errors`.

## Done when

Repro resolved (or blocker recorded), README + `request.md` updated.
