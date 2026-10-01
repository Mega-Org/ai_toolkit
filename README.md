# AI Toolkit

Reusable, Flutter-first guidance for AI-assisted work across apps. This repo keeps the shared source of truth as plain Markdown so Cursor, Claude Code, Codex, and other tools can all read the same rules, patterns, and workflows.

Per-app files such as `CLAUDE.md`, `AGENTS.md`, and `.cursor/rules` should stay thin. They should point agents to this toolkit, usually starting with `ai_toolkit/INDEX.md` and the session bootstrap workflow at `ai_toolkit/workflows/session/bootstrap-session.md`.

## Quick start

1. Put `ai_toolkit/` at the project root (copy or [submodule](#how-to-use-in-an-app-submodule)).
2. From the project root, install Cursor skills and rules:

```bash
bash ai_toolkit/setup/install.sh
```

3. Open [`INDEX.md`](INDEX.md) for session bootstrap and task routing.
4. Use the five skills: `feature-make-plan`, `feature-implement-phase`, `bugfix`, `autopilot-plan`, `backend-contract`.

Full install steps: [`INSTALL.md`](INSTALL.md). New project: [`docs/installation/new-project-setup.md`](docs/installation/new-project-setup.md). Upgrade: [`docs/migration/upgrading-ai-toolkit.md`](docs/migration/upgrading-ai-toolkit.md).

## What's included

| Area | What you get |
|------|----------------|
| Workflows | Make-plan, implement-phase, autopilot, bugfix, plus analysis and git playbooks |
| Cursor templates | Five skills and Cursor rules under [`templates/cursor-skills/`](templates/cursor-skills/) and [`templates/cursor-rules/`](templates/cursor-rules/) |
| Install scripts | [`setup/install.sh`](setup/install.sh) copies skills/rules into `.cursor/` and merges ignore files at the app root |
| Rules and patterns | Stack guidance under [`rules/`](rules/) and [`patterns/`](patterns/) |
| Docs | [`docs/`](docs/) — installation, workflows, rules, tooling, migration |

## Documentation

| Doc | Purpose |
|-----|---------|
| [`INSTALL.md`](INSTALL.md) | Prerequisites, install, verify, troubleshooting |
| [`docs/workflows/overview.md`](docs/workflows/overview.md) | The four feature/maintenance workflows |
| [`docs/rules/overview.md`](docs/rules/overview.md) | Cursor rule templates by category |
| [`docs/migration/upgrading-ai-toolkit.md`](docs/migration/upgrading-ai-toolkit.md) | Existing-project upgrade |
| [`docs/tooling/l10n-add.md`](docs/tooling/l10n-add.md) | Section-aware ARB inserts (`make l10n-add`) |
| [`docs/tooling/cursor-plugins.md`](docs/tooling/cursor-plugins.md) | Disable unused / duplicate Figma plugins |
| [`CHANGELOG.md`](CHANGELOG.md) | Release notes |
| [`templates/cursor-skills/autopilot-plan/TEAM_GUIDE.md.template`](templates/cursor-skills/autopilot-plan/TEAM_GUIDE.md.template) | Autopilot for the team (install renames to `TEAM_GUIDE.md`) |

## Structure overview

- `INDEX.md`: the AI entrypoint. Read this first in every session.
- `bin/toolkit`: repo-local CLI to add/sync/pull/push the toolkit submodule in each app.
- `bin/l10n-add`: section-aware ARB inserts (dry-run default). Docs: [`docs/tooling/l10n-add.md`](docs/tooling/l10n-add.md).
- `alias/`: shell aliases and command shortcuts — overview [`alias/_index.md`](alias/_index.md).
- `setup/`: install scripts (`install.sh`, skills, rules, ignore files, verify) plus project checklists — overview [`setup/_index.md`](setup/_index.md).
- `rules/`: short must / must-not guidance — overview [`rules/_index.md`](rules/_index.md).
- `patterns/`: implementation examples and conventions — overview [`patterns/_index.md`](patterns/_index.md).
- `workflows/`: ordered playbooks — layout [`workflows/README.md`](workflows/README.md). Autopilot: [`workflows/feature-delivery/autopilot-phases.md`](workflows/feature-delivery/autopilot-phases.md).
- `templates/`: spec skeletons, app-seed files, and Cursor skill/rule templates — overview [`templates/_index.md`](templates/_index.md).
- `docs/`: human guides for install, workflows, rules, tooling, and migration.
- `reference/`: supporting checklists and notes — overview [`reference/_index.md`](reference/_index.md).

This toolkit uses `workflows/`, not `commands/`. The intent is the same as command-style playbooks in some AI tools, but "workflow" better matches phased, multi-step work and keeps the naming tool-neutral.

## Installation

From a project root that already contains `ai_toolkit/`:

```bash
bash ai_toolkit/setup/install.sh
```

The script creates `.cursor/skills`, `.cursor/rules`, and `.cursor/plans`, copies the four skill templates and thirteen rule templates, and runs verify. Same-named files under `.cursor/skills/` and `.cursor/rules/` are overwritten. Details: [`INSTALL.md`](INSTALL.md).

## Bootstrap Modes

Use the smallest mode that gives enough context.

- **Lite bootstrap**: read `INDEX.md`, then the task-relevant rule or pattern files. Use for small edits, reviews, and focused fixes.
- **Full bootstrap**: read `INDEX.md`, `workflows/session/bootstrap-session.md`, relevant aliases, app-specific `ai_docs/`, and the active spec in `ai_specs/` when present. Use for new features, multi-file work, refactors, debugging, or anything that changes architecture.

If a referenced file does not exist yet, continue with the closest available file and preserve the stable path in new docs.

## Task Routing

Section overviews: [`setup/_index.md`](setup/_index.md), [`workflows/README.md`](workflows/README.md), [`rules/_index.md`](rules/_index.md), [`patterns/_index.md`](patterns/_index.md), [`templates/_index.md`](templates/_index.md).

- New Flutter app or repository setup: start in [`setup/`](setup/_index.md), then load relevant [`rules/`](rules/_index.md) before creating code.
- Feature implementation from a spec: use [`workflows/feature-delivery/make-plan.md`](workflows/feature-delivery/make-plan.md), then load matching rules and patterns (see indexes above).
- Bug fix: use [`workflows/maintenance/bugfix.md`](workflows/maintenance/bugfix.md), then load rules for the touched domain.
- Refactor: use [`workflows/maintenance/refactor.md`](workflows/maintenance/refactor.md), then load the current app architecture docs before editing.
- Dependency upgrade: use [`workflows/maintenance/dependency-upgrade.md`](workflows/maintenance/dependency-upgrade.md) and relevant setup notes.
- BRD or product-source analysis: use [`workflows/product-analysis/brd-analysis.md`](workflows/product-analysis/brd-analysis.md) and the [`templates/brd/`](templates/brd/_index.md) skeletons.
- Figma / design analysis (screens, flows, nav graph): use [`workflows/product-analysis/figma-analysis.md`](workflows/product-analysis/figma-analysis.md) and the [`templates/design/`](templates/design/_index.md) skeletons.
- API collection analysis (Postman / Apidog / OpenAPI) and collection handoff: use [`workflows/api-analysis/_index.md`](workflows/api-analysis/_index.md) and [`templates/api/`](templates/api/_index.md).
- Commit or PR prep: use [`workflows/git/commit-after-phase.md`](workflows/git/commit-after-phase.md) and [`workflows/feature-delivery/verify-and-pr.md`](workflows/feature-delivery/verify-and-pr.md).
- Dart import cleanup: use [`patterns/dart/absolute-imports.md`](patterns/dart/absolute-imports.md).
- Build runner, generated files, or json_serializable: load [`rules/tooling/build-runner.md`](rules/tooling/build-runner.md) and [`patterns/data/json-models-json-serializable.md`](patterns/data/json-models-json-serializable.md) when available.
- Core architecture changes: load [`rules/core/_index.md`](rules/core/_index.md) and the specific `rules/core/*` file for the area being touched.

## Flutter Defaults

These defaults guide future rules and patterns unless an app-specific `ai_docs/` file says otherwise.

- Mobile targets: iOS and Android.
- State management: Bloc / Cubit.
- Dependency injection: `get_it` with `injectable`.
- Network: Dio.
- Serialization: `json_serializable` generated `*.g.dart` files. Do not use Freezed for these models unless a documented exception exists.
- Repository results: `dartz` `Either<Failure, T>`.
- Common supporting packages: firebase, flutter_gen, responsive_framework, path_provider, and intl.

## How to use in an app (submodule)

Full guide: [`setup/per-app-integration.md`](setup/per-app-integration.md). Playbook: [`workflows/integration/link-ai-toolkit.md`](workflows/integration/link-ai-toolkit.md).

**Add once** (from the app repo root — Mac, Linux, or Git Bash / WSL on Windows):

```bash
git submodule add -b main https://github.com/Mega-Org/ai_toolkit.git ai_toolkit
cp ai_toolkit/templates/app-seed/CLAUDE.md .
cp ai_toolkit/templates/app-seed/AGENTS.md .
mkdir -p .cursor/rules && cp ai_toolkit/templates/app-seed/cursor-rules/ai-toolkit-seed.mdc .cursor/rules/
# Merge Makefile targets from ai_toolkit/templates/app-seed/Makefile.snippet
git add .gitmodules ai_toolkit CLAUDE.md AGENTS.md .cursor/rules
git commit -m "Add ai_toolkit submodule and AI seed files"
```

**Daily** (repo-local CLI — no global install):

| Goal | Command |
|------|---------|
| After app `git pull` | `./ai_toolkit/bin/toolkit sync` or `make toolkit-sync` |
| Upgrade toolkit | `./ai_toolkit/bin/toolkit pull` then commit the app pointer |
| Push toolkit edits | `./ai_toolkit/bin/toolkit push "message"` then bump the app |
| Status | `./ai_toolkit/bin/toolkit status` |

**Clone for teammates:** `git clone --recurse-submodules <app-url>` (or `git submodule update --init --recursive` after clone).

Apps pin a commit SHA. Other apps do not auto-update when you push toolkit changes — run `toolkit pull` in each app when you want the newer pin.

## Per-App Integration

Each app should keep its own product-specific docs outside this toolkit:

- `ai_docs/architecture.md`: app-specific core and feature boundaries.
- `ai_docs/conventions.md`: naming, folders, and app-level exceptions.
- `ai_specs/`: app-specific spec workspace. Prefer `ai_specs/README.md` (layer map) and `ai_specs/INDEX.md` (feature matrix + load order). Per feature **build** specs: `ai_specs/features/<feature>/README.md` (requirements) and `plan.md` (phased plan + progress). Analysis truth: BRD in `ai_specs/brd/`; design/Figma in `ai_specs/design/`; API collection KB in `ai_specs/api/` (send the dated archive named in `COLLECTION_HANDOFF.md`; contracts register `api/contracts/INDEX.md`). Same feature slug may appear under `brd/features/`, `design/features/`, `api/features/`, and root `features/` — different ownership, not duplicates. Plan with [`workflows/feature-delivery/make-plan.md`](workflows/feature-delivery/make-plan.md); implement with [`implement-phase.md`](workflows/feature-delivery/implement-phase.md). Optional per app: `fixes/`, `integrations/`, `archive/`. Refactors/tooling: [`workflows/maintenance/refactor.md`](workflows/maintenance/refactor.md) + `ai_docs/`.
- **Cursor Agent Skills** (optional): portable templates under [`reference/agent-skills/`](reference/agent-skills/) — copy into `.agents/skills/<name>/` in each app repo so Cursor can discover them. Keep long-form guidance in `ai_toolkit/patterns/` and `ai_toolkit/rules/`; skills should stay short and link there.

The toolkit should not contain secrets, environment URLs, client IDs, or product-only architecture prose.
