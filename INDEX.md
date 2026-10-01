# AI Toolkit Index

Stable map of this toolkit. **Skill runs (make-plan, implement-phase, bugfix) skip this file** and use [`LOADMAP.md`](LOADMAP.md) plus the workflow checklist. Open this INDEX for full sessions or when choosing a task.

## Toolkit sections

Each top-level folder has an overview that lists its files and cross-references the rest of the kit:

| Section | Overview |
|---------|----------|
| Aliases | [`alias/_index.md`](alias/_index.md) |
| Setup | [`setup/_index.md`](setup/_index.md) |
| Rules | [`rules/_index.md`](rules/_index.md) |
| Patterns | [`patterns/_index.md`](patterns/_index.md) |
| Workflows | [`workflows/README.md`](workflows/README.md) |
| Templates | [`templates/_index.md`](templates/_index.md) |
| Reference | [`reference/_index.md`](reference/_index.md) |

Stack defaults, per-app integration, and repository boundaries are documented in [`README.md`](README.md).

## Session bootstrap

**Lite is the default** ([`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md)):

- **Lite (default):** do **not** read this file during a skill run. Open the task workflow checklist, then [`LOADMAP.md`](LOADMAP.md) cards for tags, then the workflow’s app load list.
- **Full:** read this file, then the bootstrap playbook, aliases when running commands, `ai_docs/`, and spec indexes **only when choosing a feature**. Use full when the user asks or the task has no skill loader.

If a referenced path has not been created yet, treat it as the intended contract and continue with the nearest existing file.

## Git

**Default is no commit** in make-plan, implement-phase, bugfix, backend-contract, verify-and-pr, and autopilot Direct. Checklists open with `Commit: false (default)`. `--commit`: show files and a proposed message, ask, commit only after yes. `--no-commits` is an alias for the default. Playbooks are opt-in: [`workflows/git/commit-before-work.md`](workflows/git/commit-before-work.md), [`workflows/git/commit-after-phase.md`](workflows/git/commit-after-phase.md). Autopilot Safe/Cloud still **ask before** any commit.

## LOADMAP

Feature delivery and bugfix resolve toolkit leaves via [`LOADMAP.md`](LOADMAP.md) (`+tag` / `-tag` / `--load=` / `--full`). During a phase, do **not** browse this INDEX, section `_index.md` files, or spec indexes. Shared working rules: [`docs/workflows/working-rules.md`](docs/workflows/working-rules.md).

## Load order

1. Skill run: workflow checklist → LOADMAP cards → that workflow’s load list. Otherwise start here.
2. Breadth (full session only): section overviews (`rules/_index.md`, `patterns/_index.md`, `workflows/README.md`, `templates/_index.md`).
3. Task workflow under `ai_toolkit/workflows/` ([`workflows/README.md`](workflows/README.md)).
4. Enforceable rules / patterns: **tagged leaves** in LOADMAP, not the whole tree.
5. Aliases from `ai_toolkit/alias/` only when running commands.
6. App files as the workflow lists them. Build specs: `ai_specs/features/<feature>/` (`README.md` + `plan.md`). Analysis KBs by path convention (`brd/features/<slug>.md`, `design/features/<slug>.md`, `api/features/<slug>/`). Contracts register: `ai_specs/api/contracts/INDEX.md`. Worklog: append-only via [`workflows/worklog/update-worklog.md`](workflows/worklog/update-worklog.md).

## Task routing

| Task | Start with |
|------|------------|
| Understand the whole flow (sources → build) | [`workflows/full-pipeline.md`](workflows/full-pipeline.md) — new-user end-to-end map (BRD → Figma → screen data → API → build) |
| Start or resume a session | [`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md) |
| Plan a feature from a spec | [`workflows/feature-delivery/make-plan.md`](workflows/feature-delivery/make-plan.md) — skill `/feature-make-plan`; specs only; creates empty `memory.md` when missing; args `<feature\|plan-path> [phase\|next] [+tag -tag] [--load=a,b] [--full] [--commit]`; coverage check; missing contract → `/backend-contract request` |
| Implement one phase | [`workflows/feature-delivery/implement-phase.md`](workflows/feature-delivery/implement-phase.md) — skill `/feature-implement-phase`; **Agent mode only** (never a Cursor plan); same args; LOADMAP + phase Inputs; replaces `memory.md` rows at handoff; skip test steps |
| Backend contract (request / check / apply / intake) | [`workflows/api-analysis/backend-contract.md`](workflows/api-analysis/backend-contract.md) — skill `/backend-contract`; args `request <feature> [topic]`, `check <contract-folder>`, `apply <contract-folder>`, `intake <file>`; register `ai_specs/api/contracts/INDEX.md`; `apply` replaces the feature memory contract row. **Commit:** false (default). |
| Verify work or draft a PR | [`workflows/feature-delivery/verify-and-pr.md`](workflows/feature-delivery/verify-and-pr.md) — after phases `done` (or scoped review); lists open TBDs; **Commit:** false (default); `--commit` asks first |
| Fix a bug | [`workflows/maintenance/bugfix.md`](workflows/maintenance/bugfix.md) — skill `/bugfix`; same args + LOADMAP; chat / tester report / resume fix folder; app-wide gotchas replace rows in `ai_docs/memory.md` |
| Refactor existing code | [`workflows/maintenance/refactor.md`](workflows/maintenance/refactor.md) |
| Upgrade dependencies | [`workflows/maintenance/dependency-upgrade.md`](workflows/maintenance/dependency-upgrade.md) |
| Normalize icons / images (scoped rename + catalogs) | [`workflows/maintenance/normalize-assets.md`](workflows/maintenance/normalize-assets.md) — catalogs → `ai_specs/design/analysis/icons-catalog.md` / `images-catalog.md` |
| Commit before work (opt-in) | [`workflows/git/commit-before-work.md`](workflows/git/commit-before-work.md) — only if the user asked to save a dirty tree first; show files + message; wait for yes |
| Commit after a phase (opt-in) | [`workflows/git/commit-after-phase.md`](workflows/git/commit-after-phase.md) — `--commit` or explicit ask; show files + message; wait for yes |
| Setup daily worklog | [`workflows/worklog/setup-worklog.md`](workflows/worklog/setup-worklog.md) — templates: [`templates/worklog/_index.md`](templates/worklog/_index.md) |
| Update worklog after work | [`workflows/worklog/update-worklog.md`](workflows/worklog/update-worklog.md) |
| Generate daily report | [`workflows/worklog/daily-report.md`](workflows/worklog/daily-report.md) |
| Show open TODOs | [`workflows/worklog/todo-list.md`](workflows/worklog/todo-list.md) |
| Analyze a BRD or product source | [`workflows/product-analysis/brd-analysis.md`](workflows/product-analysis/brd-analysis.md) — templates: [`templates/brd/_index.md`](templates/brd/_index.md) |
| Analyze Figma / design for screens, flows, and nav graph | [`workflows/product-analysis/figma-analysis.md`](workflows/product-analysis/figma-analysis.md) — templates: [`templates/design/_index.md`](templates/design/_index.md) |
| Derive what each screen needs from the API (design → API bridge) | [`workflows/product-analysis/screen-data-analysis.md`](workflows/product-analysis/screen-data-analysis.md) → `ai_specs/api/screen-requirements/` (planning-only; not loaded during implementation) |
| Analyze / reanalyze API collection (Postman, Apidog, OpenAPI) | [`workflows/api-analysis/_index.md`](workflows/api-analysis/_index.md) — full: [`analyze-collection.md`](workflows/api-analysis/analyze-collection.md); update: [`reanalyze-collection.md`](workflows/api-analysis/reanalyze-collection.md); pack handoff: [`pack-collection-handoff.md`](workflows/api-analysis/pack-collection-handoff.md) — templates: [`templates/api/_index.md`](templates/api/_index.md) |
| Run endpoints + save real response examples into the collection | [`workflows/api-analysis/test-and-capture.md`](workflows/api-analysis/test-and-capture.md) — after API is callable; safety-gated (non-prod default, redact secrets/PII) |
| Create or configure a Flutter app | [`setup/new-flutter-app.md`](setup/new-flutter-app.md) |
| Work in a Melos repo | [`setup/melos-monorepo.md`](setup/melos-monorepo.md) |
| Configure CI | [`setup/ci-github-gitlab.md`](setup/ci-github-gitlab.md) |
| Use shell aliases | [`alias/flutter.md`](alias/flutter.md), [`alias/firebase.md`](alias/firebase.md) |
| API analyze / reanalyze / pack collection handoff phrases | [`alias/api.md`](alias/api.md) — workflows: [`workflows/api-analysis/_index.md`](workflows/api-analysis/_index.md) |
| Clean up imports | [`patterns/dart/absolute-imports.md`](patterns/dart/absolute-imports.md) |
| Split a large screen into `part` files | [`patterns/dart/part-part-of-library.md`](patterns/dart/part-part-of-library.md) |
| Link this toolkit into an app (submodule) | [`workflows/integration/link-ai-toolkit.md`](workflows/integration/link-ai-toolkit.md) — setup: [`setup/per-app-integration.md`](setup/per-app-integration.md) |
| Integrate store review + force update + RC admin | [`workflows/integration/remote-config-store-ops.md`](workflows/integration/remote-config-store-ops.md) |
| Add ARB keys in a `@-SECTION-` | [`docs/tooling/l10n-add.md`](docs/tooling/l10n-add.md) — `make l10n-add` (dry-run, then `--apply`) |
| Trim Cursor MCP / duplicate Figma | [`docs/tooling/cursor-plugins.md`](docs/tooling/cursor-plugins.md) — manual Settings step |

## Rule routing

Structured map of all rule areas: [`rules/_index.md`](rules/_index.md).

| Area | Load |
|------|------|
| Dart analysis, generated files, imports, **`part` / `part of`**, **enum wire parsing**, **enum l10n** | [`rules/dart/_index.md`](rules/dart/_index.md) |
| Feature UI `part` libraries (relative `part of`, formatters part) | [`rules/dart/part-part-of.md`](rules/dart/part-part-of.md) |
| Redundant `: super()` (zero-arg superclass ctor) | [`rules/dart/constructors.md`](rules/dart/constructors.md) |
| UI callbacks: explicit closures vs method tear-offs | [`rules/dart/callbacks.md`](rules/dart/callbacks.md) |
| Flutter widgets and performance | [`rules/flutter/_index.md`](rules/flutter/_index.md) |
| Figma → Flutter direction, defaults before explicit alignment | [`rules/flutter/design-direction-and-localization.md`](rules/flutter/design-direction-and-localization.md) |
| Shared UI wrappers (images, SVG, buttons), `SizedBox` vs `Container` | [`rules/flutter/ui-composition.md`](rules/flutter/ui-composition.md) |
| Tests | [`rules/testing/_index.md`](rules/testing/_index.md) |
| Git conventions | [`rules/git/_index.md`](rules/git/_index.md) |
| build_runner and generated code | [`rules/tooling/build-runner.md`](rules/tooling/build-runner.md) |
| Firebase and public repo safety | [`rules/firebase/security-public-repos.md`](rules/firebase/security-public-repos.md) |
| Remote Config store-ops | [`rules/firebase/remote-config-store-ops.md`](rules/firebase/remote-config-store-ops.md) |
| Shared core architecture | [`rules/core/_index.md`](rules/core/_index.md) |
| Network, Dio, failures | [`rules/core/network.md`](rules/core/network.md) |
| Dependency injection | [`rules/core/di.md`](rules/core/di.md) |
| App-wide blocs or cubits | [`rules/core/blocs-app-wide.md`](rules/core/blocs-app-wide.md) |
| Theme (`ThemeManager`, tokens, `MaterialApp`) | [`rules/core/theme.md`](rules/core/theme.md); color naming on `AppTheme`: [`rules/core/app-theme-color-tokens.md`](rules/core/app-theme-color-tokens.md) |
| Typography (`TextStyles`) | [`rules/core/text-styles.md`](rules/core/text-styles.md) |
| Router | [`rules/core/router.md`](rules/core/router.md) |
| Values, dimensions, flutter_gen, constants, responsive numbers, **`assets/icons/`** filenames (`*_ic.svg` / `*-ic.svg`) | [`rules/core/config.md`](rules/core/config.md); normalize + catalogs: [`workflows/maintenance/normalize-assets.md`](workflows/maintenance/normalize-assets.md); layout wiring: [`patterns/flutter/responsive-and-layout.md`](patterns/flutter/responsive-and-layout.md) |
| `Async<T>` presentation state; **`final`** on submit/param arguments where not reassigned | [`rules/core/async.md`](rules/core/async.md) |
| Localization | [`rules/core/localization.md`](rules/core/localization.md) |
| Services and utilities | [`rules/core/services.md`](rules/core/services.md), [`rules/core/utils.md`](rules/core/utils.md) |
| Observer hubs (presentation only; not in `data/` or `domain/`) | [`rules/architecture/observer-presentation-only.md`](rules/architecture/observer-presentation-only.md) |

## Pattern routing

Pattern subfolders (state, data, DI, platform, etc.): [`patterns/_index.md`](patterns/_index.md).

| Need | Load |
|------|------|
| Absolute Dart imports; **`part` / `part of` screen libraries**; **enum wire parsing**; **enum l10n** | [`patterns/dart/absolute-imports.md`](patterns/dart/absolute-imports.md), [`patterns/dart/part-part-of-library.md`](patterns/dart/part-part-of-library.md), [`patterns/dart/enums-wire-parsing.md`](patterns/dart/enums-wire-parsing.md), [`patterns/dart/enums-l10n.md`](patterns/dart/enums-l10n.md) |
| Cubit structure | [`patterns/state/cubit-structure.md`](patterns/state/cubit-structure.md) |
| Cubit + `IUseCase` (`await`, `fold`, `SafeEmitMixin`) | [`patterns/state/cubit-and-use-case.md`](patterns/state/cubit-and-use-case.md) |
| Bloc structure | [`patterns/state/bloc-structure.md`](patterns/state/bloc-structure.md) |
| Choosing Cubit vs Bloc | [`patterns/state/cubit-vs-bloc.md`](patterns/state/cubit-vs-bloc.md) |
| Broadcast observer hub (imperative fan-out, shell / domain) | [`patterns/state/broadcast-observer-hub.md`](patterns/state/broadcast-observer-hub.md) |
| json_serializable models | [`patterns/data/json-models-json-serializable.md`](patterns/data/json-models-json-serializable.md) |
| Manual `fromJson` (int / String / double) | [`patterns/data/manual-json-fromjson-primitives.md`](patterns/data/manual-json-fromjson-primitives.md) |
| Dio repositories | [`patterns/data/dio-and-repositories.md`](patterns/data/dio-and-repositories.md) |
| Either and failures | [`patterns/data/either-and-failures.md`](patterns/data/either-and-failures.md) |
| Feature `data/` folder (`api/`, `datasources/`, `models/`, `repository/`) | [`patterns/data/feature-data-layer.md`](patterns/data/feature-data-layer.md) |
| get_it and injectable | [`patterns/di/injectable-get-it.md`](patterns/di/injectable-get-it.md) |
| Responsive Flutter layout | [`patterns/flutter/responsive-and-layout.md`](patterns/flutter/responsive-and-layout.md) |
| Shared media and buttons (neutral; names in `ai_docs/conventions.md`) | [`patterns/flutter/shared-media-and-buttons.md`](patterns/flutter/shared-media-and-buttons.md) |
| Page + `BlocProvider` + view (`context` under provider) | [`patterns/flutter/page-bloc-provider.md`](patterns/flutter/page-bloc-provider.md); rule [`rules/flutter/widgets-and-performance.md`](rules/flutter/widgets-and-performance.md) |
| Multi-step / wizard page flow | [`patterns/flutter/stepped-page-flow.md`](patterns/flutter/stepped-page-flow.md); pair with [`patterns/dart/part-part-of-library.md`](patterns/dart/part-part-of-library.md) for large route UI |
| Presentation field naming (`TextEditingController`, private `_…Controller`) | [`patterns/flutter/presentation-field-naming.md`](patterns/flutter/presentation-field-naming.md) |
| Infinite scroll / `PaginatedListView` + `PaginationController` | [`patterns/flutter/pagination-paginated-list-view.md`](patterns/flutter/pagination-paginated-list-view.md) |
| RC store review / updater modules | [`patterns/modules/_index.md`](patterns/modules/_index.md) |
| RC admin local panel | [`patterns/tooling/rc-admin-panel.md`](patterns/tooling/rc-admin-panel.md) |
| iOS pods and builds | [`patterns/platform/ios-pods-and-build.md`](patterns/platform/ios-pods-and-build.md) |

## Defaults

See **Flutter Defaults** in [`README.md`](README.md).

## Boundaries

See **Per-App Integration** and the closing paragraphs of [`README.md`](README.md) for what belongs in this toolkit versus each app repo.
