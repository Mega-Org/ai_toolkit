# Bugfix

Cursor command: `/bugfix`. Checklist: [`bugfix.md`](../../workflows/maintenance/bugfix.md). Shared rules: [working-rules](working-rules.md). Among the four workflows: [overview](overview.md).

## What it does

Diagnoses a bug and applies a **minimal** fix using the same lean loader as feature delivery: LOADMAP tags, read-once, explore subagent for broad search, analyzer on touched files, no tests unless you ask, ~10-line handoff with Context used.

Writes a fix folder at the start (unless `--no-persist`):

```text
ai_specs/fixes/YYYY-MM-DD-<slug>/
  request.md    # command verbatim; later steering appended
  README.md     # problem, investigation, root cause, verification, status
```

Mode B also writes `intake.md` and may save `intake-source.txt`. Feature `plan.md` is updated only when you ask. An app-wide gotcha replaces the matching row in `ai_docs/memory.md` (4 KB; no append). Verify commands stay in `ai_docs/conventions.md`.

Default is no commit. `--commit` shows files + a proposed message and waits for yes. `--no-commits` is an alias for the default.

## When to use it

Crash, wrong UI, bad API handling, regression, analyzer error tied to behavior, or a QA report.

| Phrase | Mode |
|--------|------|
| `bugfix: …` | **A** — chat |
| `bugfix from tester report` + paste | **B** — Excel / Sheets / Jira / free text |
| `bugfix from ai_specs/fixes/<slug>/` | **C** — resume |

## Command syntax

```text
/bugfix <feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]
```

Slug or fix-folder path. Tags = suspected domain (`state`, `data`, `ui`, …). `--no-persist` skips the folder (discouraged). `--no-commits` = default.

```text
/bugfix login +state +nav
bugfix: client login blank after OTP on iOS, Arabic
bugfix from tester report
bugfix from ai_specs/fixes/2026-09-27-blank-login/
```

## QA paste (Mode B)

If `ai_docs/qa-intake.md` exists, use it for column names. Normalize to `intake.md`. Ask **once** for missing flavor, platform, build, locale.

Common headers → fields: ID/#; Title/Summary/العنوان; Steps/STR/خطوات; Expected/المتوقع; Actual/الفعلي; Version/Build/الإصدار; Device/Platform/الجهاز; App/Flavor/التطبيق; Severity/الأولوية. Unmapped columns: list and confirm — do not block on a perfect schema. One bug per run.

## Best practices

- Persist the folder from the start so `request.md` keeps decisions.
- Keep the diff on the root cause.
- Re-run the original repro and the analyzer on touched files.
- Status `done` when resolved; `in-progress` or `TBD(backend)` when blocked.
- Runtime stack + hot reload: app skill `dart-fix-runtime-errors`.
