# Bugfix workflow

## Purpose

Ordered steps for diagnosing and fixing bugs: intake, persist request, reproduce, isolate, fix, verify, handoff. Reactive maintenance — not feature delivery.

Supports **chat-driven fixes** (your command and requirements), **external QA intake** (Excel, Jira, sheets, free text), and **resuming** an in-progress fix folder.

## Fill when

- Bug triage steps, persistence rules, verification gates, or invocation flags change.

## References

- Bootstrap: [`../session/bootstrap-session.md`](../session/bootstrap-session.md)
- Commit before work: [`../git/commit-before-work.md`](../git/commit-before-work.md)
- Worklog (optional): [`../worklog/update-worklog.md`](../worklog/update-worklog.md)
- Templates: [`../../templates/specs/bugfix-request.md`](../../templates/specs/bugfix-request.md), [`../../templates/specs/tester-bug-report.md`](../../templates/specs/tester-bug-report.md), [`../../templates/specs/fix-spec.md`](../../templates/specs/fix-spec.md)
- App QA column mapping (optional): `ai_docs/qa-intake.md` — scaffold: [`../../templates/docs/qa-intake.md`](../../templates/docs/qa-intake.md)
- App paths (when present): `ai_specs/fixes/`, `ai_docs/architecture.md`, `ai_docs/conventions.md`, active `ai_specs/features/<feature>/`
- Runtime errors (Flutter): app skill `dart-fix-runtime-errors` when stack trace / hot reload applies

## How to invoke (users)

**When to use** — Something is broken: crash, wrong UI, bad API handling, regression, analyzer error tied to behavior, or a QA report to fix.

**What you say** — Natural language or shorthand:

| Invocation | Meaning |
|------------|---------|
| `bugfix: …` | Mode A — chat-driven fix from your message |
| `bugfix from tester report` + paste | Mode B — normalize external QA intake, then fix |
| `bugfix from ai_specs/fixes/<slug>/` | Mode C — resume existing fix folder |
| `bugfix --no-commits` | Skip commit-before-work |
| `bugfix --no-persist` | Chat only — **discouraged**; no fix folder |

Include reproduction steps, stack trace, flavor, platform, and locale when known.

## Invocation modes

### Mode A — Chat-driven (most common)

Use when **you** describe the bug in chat.

1. Persist **`request.md`** with your initial command verbatim.
2. Draft **`README.md`** (fix-spec) from your message.
3. Continue with **Steps** below.

### Mode B — External QA intake

Use when QA pasted a **structured report**, **Excel/Sheets row or table**, **Jira/tracker export**, or **free text** from email/chat.

**Sources (any):**

- Filled [`tester-bug-report.md`](../../templates/specs/tester-bug-report.md)
- Tabular paste (Excel / Google Sheets / CSV — often TSV when copied)
- Tracker issue body (Jira, Linear, YouTrack, …)
- Free text — agent extracts fields
- File under `ai_specs/fixes/inbox/` in the app repo

**Before reproduce:**

1. If `ai_docs/qa-intake.md` exists, load it for app-specific column names.
2. Normalize to **`intake.md`** using the tester-bug-report shape.
3. Save optional raw paste as **`intake-source.txt`**.
4. Persist **`request.md`** — include your chat command and any extra requirements (e.g. “client only”, “minimal diff”).
5. Merge **`intake.md`** facts into **`README.md`** (problem, repro, environment).
6. Ask **once** for missing **Environment** fields (flavor/app, platform, build/version, locale).
7. Continue with **Steps** below.

**Tabular paste (Excel/Sheets):** detect header row; map common column aliases (English and Arabic when obvious):

| Common headers | Maps to |
|----------------|---------|
| ID, Bug ID, #, رقم | External reference |
| Title, Summary, العنوان, Bug | Summary |
| Steps, STR, خطوات, Repro | Steps to reproduce |
| Expected, المتوقع | Expected result |
| Actual, الفعلي | Actual result |
| Version, Build, الإصدار | Environment → build |
| Device, Platform, الجهاز | Environment → platform |
| App, Flavor, التطبيق | Environment → flavor |
| Severity, الأولوية | Severity |

If headers do not match, list unmapped columns and ask the user to confirm mapping — do not block on a perfect schema.

**Batch:** one bug at a time by default. `--batch` (future) may create one folder per row.

### Mode C — Resume existing fix

Use when a folder already exists under `ai_specs/fixes/YYYY-MM-DD-<slug>/`.

1. Load **`request.md`** and **`README.md`**.
2. **Append** new user text to **`request.md`** (Requirements, Decisions, or Session notes).
3. Continue from the current **Status** in README.

## Persist session (default)

**Default:** create `ai_specs/fixes/YYYY-MM-DD-<slug>/` at workflow **start**, not only at end — unless `--no-persist`.

| File | When |
|------|------|
| [`request.md`](../../templates/specs/bugfix-request.md) | **Always** — initial command verbatim; append when the user steers |
| [`README.md`](../../templates/specs/fix-spec.md) | **Always** — fix-spec draft at start; update through investigate / fix / verify |
| `intake.md` | Mode B — normalized external QA report |
| `intake-source.txt` | Optional — raw Excel/Jira/paste audit trail |
| `reproduction.md`, `root-cause.md`, `verification.md` | Optional deep dives (see app `ai_specs/fixes/README.md`) |

**Do not** store full chat transcripts. Store explicit user commands, requirements, constraints, and decisions only.

If `ai_specs/fixes/` is missing, create it and add `README.md` from the app’s fix-specs contract or [`../../templates/specs/fix-spec.md`](../../templates/specs/fix-spec.md) index note.

## Preflight

1. **Bootstrap** — **Lite** for narrow, obvious fixes. **Full** for unknown scope, multi-file, or architecture-touching bugs ([`../session/bootstrap-session.md`](../session/bootstrap-session.md)).
2. **Persist** — Create fix folder and **`request.md`** + draft **`README.md`** unless `--no-persist`.
3. **Commit before work** — [`../git/commit-before-work.md`](../git/commit-before-work.md) unless `--no-commits`.
4. **Rules** — Load leaf rules for domains in play (network, router, l10n, state, etc.) from [`../../INDEX.md`](../../INDEX.md) Rule routing.

## Steps

1. **Intake** — Restate the bug in one sentence. For Mode B, confirm normalized intake. Ask one clarifying question if reproduction is unclear.
2. **Reproduce** — Follow user or intake steps; use analyzer, logs, or Dart MCP as appropriate. Stop and report if not reproducible after reasonable effort.
3. **Isolate** — Find root cause; define minimal file/symbol scope. Propose options if tradeoffs exist; wait for user choice. Update README **Investigation** and **Root cause**.
4. **Fix** — Minimal diff; match app conventions; no unrelated refactors. Update README **Fix plan** when the approach is chosen.
5. **Verify** — Re-run repro; analyzer on touched paths; locale/platform checks when relevant. Fill README **Verification** and **Retest for QA** (when external QA was involved or user will hand off to testers).
6. **Record steering** — Whenever the user adds requirements, constraints, or approvals in chat, append to **`request.md`** (do not wait until the end).
7. **Handoff** — Summarize what changed, why, and manual checks left. Set README **Status** to `done` when resolved, or `in-progress` / `TBD(backend)` when blocked. Offer commit / worklog only when the user asks.

## After fix

- Optional: `update worklog` per [`../worklog/update-worklog.md`](../worklog/update-worklog.md)
- If the bug blocked a feature phase, note it in that feature’s `plan.md` **Notes** only when the user asks
- Do **not** auto-open a PR unless the user requests verify-and-pr flow

## Done when

Reproduction no longer fails (or the reported error is resolved), **`README.md`** reflects root cause and verification, **`request.md`** captures the user’s command and stated requirements, and the user has confirmed or requested follow-up.
