# AI Toolkit Index

Read this file first. It is the stable entrypoint for AI agents working in Flutter apps that share this toolkit.

## Session Bootstrap

Choose one mode:

- **Lite**: read this file, then only the rule, pattern, or workflow files needed for the task.
- **Full**: read this file, then `workflows/session/bootstrap-session.md`, relevant `alias/` files, app-specific `ai_docs/`, and the active `ai_specs/` file when the task is spec-driven.

Use full bootstrap for new features, refactors, multi-file work, architecture changes, debugging with unknown scope, and PR preparation. Use lite bootstrap for small edits, targeted reviews, and quick fixes.

If a referenced path has not been created yet, treat the path as the intended contract and continue with the nearest existing guidance.

## Load Order

1. Start here: `ai_toolkit/INDEX.md`.
2. Load the task workflow from `ai_toolkit/workflows/`.
3. Load enforceable rules from `ai_toolkit/rules/`.
4. Load implementation examples from `ai_toolkit/patterns/`.
5. Load command aliases from `ai_toolkit/alias/` only when running commands.
6. Load app-specific `ai_docs/` and `ai_specs/` from the app repo when they exist.

## Task Routing

| Task | Start with |
|------|------------|
| Start or resume a session | `workflows/session/bootstrap-session.md` |
| Plan a feature from a spec | `workflows/feature-delivery/make-plan.md` |
| Implement one phase | `workflows/feature-delivery/implement-phase.md` |
| Verify work or draft a PR | `workflows/feature-delivery/verify-and-pr.md` |
| Fix a bug | `workflows/maintenance/bugfix.md` |
| Refactor existing code | `workflows/maintenance/refactor.md` |
| Upgrade dependencies | `workflows/maintenance/dependency-upgrade.md` |
| Commit after a phase | `workflows/git/commit-after-phase.md` |
| Create or configure a Flutter app | `setup/new-flutter-app.md` |
| Work in a Melos repo | `setup/melos-monorepo.md` |
| Configure CI | `setup/ci-github-gitlab.md` |
| Use shell aliases | `alias/flutter.md`, `alias/firebase.md` |
| Clean up imports | `patterns/dart/absolute-imports.md` |

## Rule Routing

| Area | Load |
|------|------|
| Dart analysis, generated files, imports | `rules/dart/_index.md` |
| Flutter widgets and performance | `rules/flutter/_index.md` |
| Tests | `rules/testing/_index.md` |
| Git conventions | `rules/git/_index.md` |
| build_runner and generated code | `rules/tooling/build-runner.md` |
| Firebase and public repo safety | `rules/firebase/security-public-repos.md` |
| Shared core architecture | `rules/core/_index.md` |
| Network, Dio, failures | `rules/core/network.md` |
| Dependency injection | `rules/core/di.md` |
| App-wide blocs or cubits | `rules/core/blocs-app-wide.md` |
| Theme, router, and config | `rules/core/theme-router-config.md` |
| Localization | `rules/core/localization.md` |
| Services and utilities | `rules/core/services.md`, `rules/core/utils.md` |

## Pattern Routing

| Need | Load |
|------|------|
| Absolute Dart imports | `patterns/dart/absolute-imports.md` |
| Bloc or Cubit structure | `patterns/state/bloc-structure.md` |
| Choosing Cubit vs Bloc | `patterns/state/cubit-vs-bloc.md` |
| json_serializable models | `patterns/data/json-models-json-serializable.md` |
| Dio repositories | `patterns/data/dio-and-repositories.md` |
| Either and failures | `patterns/data/either-and-failures.md` |
| get_it and injectable | `patterns/di/injectable-get-it.md` |
| Responsive Flutter layout | `patterns/flutter/responsive-and-layout.md` |
| iOS pods and builds | `patterns/platform/ios-pods-and-build.md` |

## Defaults

- Build Flutter apps for iOS and Android.
- Prefer Bloc / Cubit for state.
- Use `get_it` and `injectable` for dependency injection.
- Use Dio for network work.
- Use `json_serializable` for data models and run `brb` after generated model changes.
- Return repository results as `Either<Failure, T>` where the app follows the shared core pattern.
- Use absolute package imports.
- Follow the app's `ai_docs/architecture.md` when local paths differ from this toolkit.

## Boundaries

Keep this toolkit tool-neutral and product-neutral. Do not add Cursor `SKILL.md`, Claude-specific command files, secrets, environment URLs, client IDs, per-feature specs, or architecture prose that only applies to one app.
