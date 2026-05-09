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
| Reference | [`reference/_index.md`](reference/_index.md) |

Stack defaults, per-app integration, and repository boundaries are documented in [`README.md`](README.md).

## Session bootstrap

Choose one mode:

- **Lite**: read this file, then only the rule, pattern, or workflow files needed for the task (use the section overviews above to find leaf files).
- **Full**: read this file, then [`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md), relevant [`alias/`](alias/_index.md) files, app-specific `ai_docs/`, and the active `ai_specs/` file when the task is spec-driven.

Use full bootstrap for new features, refactors, multi-file work, architecture changes, debugging with unknown scope, and PR preparation. Use lite bootstrap for small edits, targeted reviews, and quick fixes.

If a referenced path has not been created yet, treat the path as the intended contract and continue with the nearest existing guidance.

## Load order

1. Start here: `ai_toolkit/INDEX.md`.
2. When you need breadth before leaf files, open the relevant section overview (`rules/_index.md`, `patterns/_index.md`, `workflows/README.md`, etc.).
3. Load the task workflow from `ai_toolkit/workflows/` (see [`workflows/README.md`](workflows/README.md)).
4. Load enforceable rules from `ai_toolkit/rules/`.
5. Load implementation examples from `ai_toolkit/patterns/`.
6. Load command aliases from `ai_toolkit/alias/` only when running commands.
7. Load app-specific `ai_docs/` and `ai_specs/` from the app repo when they exist.

## Task routing

| Task | Start with |
|------|------------|
| Start or resume a session | [`workflows/session/bootstrap-session.md`](workflows/session/bootstrap-session.md) |
| Plan a feature from a spec | [`workflows/feature-delivery/make-plan.md`](workflows/feature-delivery/make-plan.md) |
| Implement one phase | [`workflows/feature-delivery/implement-phase.md`](workflows/feature-delivery/implement-phase.md) |
| Verify work or draft a PR | [`workflows/feature-delivery/verify-and-pr.md`](workflows/feature-delivery/verify-and-pr.md) |
| Fix a bug | [`workflows/maintenance/bugfix.md`](workflows/maintenance/bugfix.md) |
| Refactor existing code | [`workflows/maintenance/refactor.md`](workflows/maintenance/refactor.md) |
| Upgrade dependencies | [`workflows/maintenance/dependency-upgrade.md`](workflows/maintenance/dependency-upgrade.md) |
| Commit after a phase | [`workflows/git/commit-after-phase.md`](workflows/git/commit-after-phase.md) |
| Create or configure a Flutter app | [`setup/new-flutter-app.md`](setup/new-flutter-app.md) |
| Work in a Melos repo | [`setup/melos-monorepo.md`](setup/melos-monorepo.md) |
| Configure CI | [`setup/ci-github-gitlab.md`](setup/ci-github-gitlab.md) |
| Use shell aliases | [`alias/flutter.md`](alias/flutter.md), [`alias/firebase.md`](alias/firebase.md) |
| Clean up imports | [`patterns/dart/absolute-imports.md`](patterns/dart/absolute-imports.md) |

## Rule routing

Structured map of all rule areas: [`rules/_index.md`](rules/_index.md).

| Area | Load |
|------|------|
| Dart analysis, generated files, imports | [`rules/dart/_index.md`](rules/dart/_index.md) |
| Flutter widgets and performance | [`rules/flutter/_index.md`](rules/flutter/_index.md) |
| Tests | [`rules/testing/_index.md`](rules/testing/_index.md) |
| Git conventions | [`rules/git/_index.md`](rules/git/_index.md) |
| build_runner and generated code | [`rules/tooling/build-runner.md`](rules/tooling/build-runner.md) |
| Firebase and public repo safety | [`rules/firebase/security-public-repos.md`](rules/firebase/security-public-repos.md) |
| Shared core architecture | [`rules/core/_index.md`](rules/core/_index.md) |
| Network, Dio, failures | [`rules/core/network.md`](rules/core/network.md) |
| Dependency injection | [`rules/core/di.md`](rules/core/di.md) |
| App-wide blocs or cubits | [`rules/core/blocs-app-wide.md`](rules/core/blocs-app-wide.md) |
| Theme (notifier, tokens, `MaterialApp`) | [`rules/core/theme.md`](rules/core/theme.md) |
| Router, values, assets, constants | [`rules/core/theme-router-config.md`](rules/core/theme-router-config.md) |
| Localization | [`rules/core/localization.md`](rules/core/localization.md) |
| Services and utilities | [`rules/core/services.md`](rules/core/services.md), [`rules/core/utils.md`](rules/core/utils.md) |

## Pattern routing

Pattern subfolders (state, data, DI, platform, etc.): [`patterns/_index.md`](patterns/_index.md).

| Need | Load |
|------|------|
| Absolute Dart imports | [`patterns/dart/absolute-imports.md`](patterns/dart/absolute-imports.md) |
| Bloc or Cubit structure | [`patterns/state/bloc-structure.md`](patterns/state/bloc-structure.md) |
| Choosing Cubit vs Bloc | [`patterns/state/cubit-vs-bloc.md`](patterns/state/cubit-vs-bloc.md) |
| json_serializable models | [`patterns/data/json-models-json-serializable.md`](patterns/data/json-models-json-serializable.md) |
| Dio repositories | [`patterns/data/dio-and-repositories.md`](patterns/data/dio-and-repositories.md) |
| Either and failures | [`patterns/data/either-and-failures.md`](patterns/data/either-and-failures.md) |
| get_it and injectable | [`patterns/di/injectable-get-it.md`](patterns/di/injectable-get-it.md) |
| Responsive Flutter layout | [`patterns/flutter/responsive-and-layout.md`](patterns/flutter/responsive-and-layout.md) |
| iOS pods and builds | [`patterns/platform/ios-pods-and-build.md`](patterns/platform/ios-pods-and-build.md) |

## Defaults

See **Flutter Defaults** in [`README.md`](README.md).

## Boundaries

See **Per-App Integration** and the closing paragraphs of [`README.md`](README.md) for what belongs in this toolkit versus each app repo.
