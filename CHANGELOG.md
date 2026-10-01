# Changelog

## [Unreleased]

### Added

- **Cursor plan autopilot.** `/autopilot-plan` accepts a Cursor plan (`~/.cursor/plans/*.plan.md` or `.cursor/plans/*.plan.md`, YAML `todos:`). Only those plans load [`features/cursor-plans.md`](templates/cursor-skills/autopilot-plan/features/cursor-plans.md); feature plans keep Status, the context pack, and memory. Optional to-do tags: `[light]` / `[standard]` / `[deep]` (no tag is `standard`; up to 3 consecutive `[light]` share one subagent), `[load: ui, nav]`, `[see: ## heading]`, and `[skip]`. Example: `content: "[deep] [load: data] [see: ## 2. New apps and reinstalls] Create setup/install-vscode-search.sh ..."`. Guide: [`docs/workflows/autopilot-guide.md`](docs/workflows/autopilot-guide.md).
- **Editor search exclusions.** [`setup/install-vscode-search.sh`](setup/install-vscode-search.sh), called from [`setup/install.sh`](setup/install.sh), merges [`templates/vscode/search-exclude.json`](templates/vscode/search-exclude.json) into `.vscode/settings.json`. Editor search skips `ai_specs/`, `ai_docs/`, `ai_worklog/` except `TODOS.md`, and the `ai_toolkit` folders `templates`, `docs`, `bin`, and `reference`. Turn off **Use Exclude Settings** in the search panel for a one-off search that includes those paths. Existing apps run `bash ai_toolkit/setup/install-vscode-search.sh`, or rerun `install.sh`.
- **Review fixes.** `toolkit context` uses a per-tag startup budget and slices plan anchors (an unknown anchor is reported as not found). `verify-setup` checks links that point outside the toolkit, and legacy plan warnings are one summary line per plan. Autopilot requires a Task subagent for each phase or light batch; the parent chat only updates plan Status lines, `autopilot_*` lines, and `memory.md`.
- **Lean loading (Round 3).** Filled toolkit stubs (git, tooling, testing, imports, json models, iOS, checklists, setup, maintenance workflows). **`toolkit context`**, **`verify-setup`** link/stub guards, **`feature-verify-pr`** skill, **`preferences.md`** template + capture workflow, GitLab-aware **`verify-and-pr`**, **`.cursor/.ai_toolkit_version`** on install, design **Layout digest** pattern.
- **Cursor ignore templates.** [`templates/cursor-ignore/`](templates/cursor-ignore/) plus [`setup/install-ignore.sh`](setup/install-ignore.sh), called from [`setup/install.sh`](setup/install.sh). `.cursorignore` skips generated Dart and build trees; `.cursorindexingignore` skips `ai_specs/api/source/snapshot.json` and `ai_specs/brd/source/*.pdf` (handoff MD stays indexed).
- **`l10n-add`.** [`bin/l10n-add`](bin/l10n-add) inserts keys at the end of a mirrored `@-SECTION-`. Dry-run by default; `--apply` writes both ARBs and runs `flutter gen-l10n`. Docs: [`docs/tooling/l10n-add.md`](docs/tooling/l10n-add.md).
- **Plugin checklist.** [`docs/tooling/cursor-plugins.md`](docs/tooling/cursor-plugins.md) — disable unused MCP plugins and the duplicate Figma copy under `~/.claude` (manual Cursor Settings step).
- **Backend contract kit.** Templates [`templates/api/backend-request.md`](templates/api/backend-request.md), [`backend-reply.md`](templates/api/backend-reply.md), [`backend-gaps.md`](templates/api/backend-gaps.md), [`contracts-index.md`](templates/api/contracts-index.md); workflow [`workflows/api-analysis/backend-contract.md`](workflows/api-analysis/backend-contract.md); skill `/backend-contract` (`request` / `check` / `apply` / `intake`). Pack writes a dated archive plus a 3-line pointer in `COLLECTION_HANDOFF.md`. Reanalyze respects agreed replies (never reopen contract-answered gaps; collection-lags-reply table).

## [2.0.0] - 2026-09-27

### Added

- **Autopilot workflow.** [`workflows/feature-delivery/autopilot-phases.md`](workflows/feature-delivery/autopilot-phases.md) runs unfinished plan phases in order. Direct, Safe, and Cloud modes are in [`rules/feature-delivery/autopilot-execution-modes.md`](rules/feature-delivery/autopilot-execution-modes.md). The Cursor skill template is [`templates/cursor-skills/autopilot-plan/`](templates/cursor-skills/autopilot-plan/) (`SKILL.md.template`, `TEAM_GUIDE.md.template`, `modes/`, `features/`, `examples/`).
- **Install scripts.** [`setup/install.sh`](setup/install.sh) is the entry point. It creates `.cursor/skills`, `.cursor/rules`, and `.cursor/plans`, then runs [`setup/install-skills.sh`](setup/install-skills.sh), [`setup/install-rules.sh`](setup/install-rules.sh), and [`setup/verify-setup.sh`](setup/verify-setup.sh).
- **Templates.** Four Cursor skills under [`templates/cursor-skills/`](templates/cursor-skills/): `feature-make-plan`, `feature-implement-phase`, `bugfix`, and `autopilot-plan`. Thirteen Cursor rules under [`templates/cursor-rules/`](templates/cursor-rules/) (`*.mdc.template`).
- **Documentation.** [`INSTALL.md`](INSTALL.md), plus guides under [`docs/installation/`](docs/installation/), [`docs/workflows/`](docs/workflows/), [`docs/rules/`](docs/rules/), and [`docs/migration/`](docs/migration/).

### Migration

From the project root, reinstall so the templates land in `.cursor/`:

```bash
bash ai_toolkit/setup/install.sh
```

If the script is executable, the same entry point is:

```bash
./ai_toolkit/setup/install.sh
```

The installer copies `ai_toolkit/templates/cursor-skills/` into `.cursor/skills/` and `ai_toolkit/templates/cursor-rules/*.template` into `.cursor/rules/`, then strips the `.template` suffix. Same-named files already in those directories are overwritten. A skill directory that already exists is updated in place: matching files are replaced, and extra local files inside that directory stay on disk. A rule template replaces the `.mdc` file with the same name.

Review the copy before you commit:

```bash
git diff -- .cursor/skills .cursor/rules
```

Update steps and the overwrite effect are in [`docs/migration/upgrading-ai-toolkit.md`](docs/migration/upgrading-ai-toolkit.md).
