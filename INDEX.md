# AI Toolkit Index

Read this file first. It is the stable entrypoint for AI agents working in Flutter apps that share this toolkit.

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

Choose one mode:

- **Lite**: read this file, then only the rule, pattern, or workflow files needed for the task (use the section overviews above to find leaf files).
- **Full**: read this file, then [`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md), relevant [`alias/`](alias/_index.md) files, app-specific `ai_docs/`, `ai_specs/INDEX.md` when present, and the active spec file when the task is spec-driven.

Use full bootstrap for new features, refactors, multi-file work, architecture changes, debugging with unknown scope, and PR preparation. Use lite bootstrap for small edits, targeted reviews, and quick fixes.

If a referenced path has not been created yet, treat the path as the intended contract and continue with the nearest existing guidance.

## Load order

1. Start here: `ai_toolkit/INDEX.md`.
2. When you need breadth before leaf files, open the relevant section overview (`rules/_index.md`, `patterns/_index.md`, `workflows/README.md`, `templates/_index.md`, etc.).
3. Load the task workflow from `ai_toolkit/workflows/` (see [`workflows/README.md`](workflows/README.md)).
4. Load enforceable rules from `ai_toolkit/rules/`.
5. Load implementation examples from `ai_toolkit/patterns/`.
6. Load command aliases from `ai_toolkit/alias/` only when running commands.
7. Load app-specific `ai_docs/`, `ai_specs/`, and `ai_worklog/` from the app repo when they exist. Prefer `ai_specs/INDEX.md` first, then `ai_specs/features/<feature>/README.md` and `plan.md` for feature delivery; BRD under `ai_specs/brd/` when product rules apply. For daily tracking, use `ai_worklog/INDEX.md` and today's `ai_worklog/daily/YYYY-MM-DD.md`.

## Task routing

| Task | Start with |
|------|------------|
| Start or resume a session | [`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md) |
| Plan a feature from a spec | [`workflows/feature-delivery/make-plan.md`](workflows/feature-delivery/make-plan.md) — preflight: [`workflows/git/commit-before-work.md`](workflows/git/commit-before-work.md) (use **`make-plan --no-commits`** to skip) |
| Implement one phase | [`workflows/feature-delivery/implement-phase.md`](workflows/feature-delivery/implement-phase.md) — preflight: [`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md), then [`workflows/git/commit-before-work.md`](workflows/git/commit-before-work.md) (use **`implement-phase --no-commits`** to skip Git preflight only) |
| Verify work or draft a PR | [`workflows/feature-delivery/verify-and-pr.md`](workflows/feature-delivery/verify-and-pr.md) |
| Fix a bug | [`workflows/maintenance/bugfix.md`](workflows/maintenance/bugfix.md) |
| Refactor existing code | [`workflows/maintenance/refactor.md`](workflows/maintenance/refactor.md) |
| Upgrade dependencies | [`workflows/maintenance/dependency-upgrade.md`](workflows/maintenance/dependency-upgrade.md) |
| Commit before plan or phase | [`workflows/git/commit-before-work.md`](workflows/git/commit-before-work.md) |
| Commit after a phase | [`workflows/git/commit-after-phase.md`](workflows/git/commit-after-phase.md) |
| Setup daily worklog | [`workflows/worklog/setup-worklog.md`](workflows/worklog/setup-worklog.md) — templates: [`templates/worklog/_index.md`](templates/worklog/_index.md) |
| Update worklog after work | [`workflows/worklog/update-worklog.md`](workflows/worklog/update-worklog.md) |
| Generate daily report | [`workflows/worklog/daily-report.md`](workflows/worklog/daily-report.md) |
| Show open TODOs | [`workflows/worklog/todo-list.md`](workflows/worklog/todo-list.md) |
| Analyze a BRD or product source | [`workflows/product-analysis/brd-analysis.md`](workflows/product-analysis/brd-analysis.md) — templates: [`templates/brd/_index.md`](templates/brd/_index.md) |
| Create or configure a Flutter app | [`setup/new-flutter-app.md`](setup/new-flutter-app.md) |
| Work in a Melos repo | [`setup/melos-monorepo.md`](setup/melos-monorepo.md) |
| Configure CI | [`setup/ci-github-gitlab.md`](setup/ci-github-gitlab.md) |
| Use shell aliases | [`alias/flutter.md`](alias/flutter.md), [`alias/firebase.md`](alias/firebase.md) |
| Clean up imports | [`patterns/dart/absolute-imports.md`](patterns/dart/absolute-imports.md) |
| Split a large screen into `part` files | [`patterns/dart/part-part-of-library.md`](patterns/dart/part-part-of-library.md) |

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
| Shared core architecture | [`rules/core/_index.md`](rules/core/_index.md) |
| Network, Dio, failures | [`rules/core/network.md`](rules/core/network.md) |
| Dependency injection | [`rules/core/di.md`](rules/core/di.md) |
| App-wide blocs or cubits | [`rules/core/blocs-app-wide.md`](rules/core/blocs-app-wide.md) |
| Theme (`ThemeManager`, tokens, `MaterialApp`) | [`rules/core/theme.md`](rules/core/theme.md); color naming on `AppTheme`: [`rules/core/app-theme-color-tokens.md`](rules/core/app-theme-color-tokens.md) |
| Typography (`TextStyles`) | [`rules/core/text-styles.md`](rules/core/text-styles.md) |
| Router | [`rules/core/router.md`](rules/core/router.md) |
| Values, dimensions, flutter_gen, constants, responsive numbers, **`assets/icons/`** filenames (`*_ic.svg`) | [`rules/core/config.md`](rules/core/config.md); layout wiring: [`patterns/flutter/responsive-and-layout.md`](patterns/flutter/responsive-and-layout.md) |
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
| Presentation field naming (`TextEditingController`, private `_…Controller`) | [`patterns/flutter/presentation-field-naming.md`](patterns/flutter/presentation-field-naming.md) |
| Infinite scroll / `PaginatedListView` + `PaginationController` | [`patterns/flutter/pagination-paginated-list-view.md`](patterns/flutter/pagination-paginated-list-view.md) |
| iOS pods and builds | [`patterns/platform/ios-pods-and-build.md`](patterns/platform/ios-pods-and-build.md) |

## Defaults

See **Flutter Defaults** in [`README.md`](README.md).

## Boundaries

See **Per-App Integration** and the closing paragraphs of [`README.md`](README.md) for what belongs in this toolkit versus each app repo.
