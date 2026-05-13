# AI Toolkit

Reusable, Flutter-first guidance for AI-assisted work across apps. This repo keeps the shared source of truth as plain Markdown so Cursor, Claude Code, Codex, and other tools can all read the same rules, patterns, and workflows.

Per-app files such as `CLAUDE.md`, `AGENTS.md`, and `.cursor/rules` should stay thin. They should point agents to this toolkit, usually starting with `ai_toolkit/INDEX.md` and the session bootstrap workflow at `ai_toolkit/workflows/session/bootstrap-session.md`.

## Layout

- `INDEX.md`: the AI entrypoint. Read this first in every session.
- `alias/`: shell aliases and command shortcuts — overview [`alias/_index.md`](alias/_index.md).
- `setup/`: project setup checklists and bootstrapping — overview [`setup/_index.md`](setup/_index.md).
- `rules/`: short must / must-not guidance — overview [`rules/_index.md`](rules/_index.md).
- `patterns/`: implementation examples and conventions — overview [`patterns/_index.md`](patterns/_index.md).
- `workflows/`: ordered playbooks — layout [`workflows/README.md`](workflows/README.md).
- `reference/`: supporting checklists and notes — overview [`reference/_index.md`](reference/_index.md).

This toolkit uses `workflows/`, not `commands/`. The intent is the same as command-style playbooks in some AI tools, but "workflow" better matches phased, multi-step work and keeps the naming tool-neutral.

## Bootstrap Modes

Use the smallest mode that gives enough context.

- **Lite bootstrap**: read `INDEX.md`, then the task-relevant rule or pattern files. Use for small edits, reviews, and focused fixes.
- **Full bootstrap**: read `INDEX.md`, `workflows/session/bootstrap-session.md`, relevant aliases, app-specific `ai_docs/`, and the active spec in `ai_specs/` when present. Use for new features, multi-file work, refactors, debugging, or anything that changes architecture.

If a referenced file does not exist yet, continue with the closest available file and preserve the stable path in new docs.

## Task Routing

Section overviews: [`setup/_index.md`](setup/_index.md), [`workflows/README.md`](workflows/README.md), [`rules/_index.md`](rules/_index.md), [`patterns/_index.md`](patterns/_index.md).

- New Flutter app or repository setup: start in [`setup/`](setup/_index.md), then load relevant [`rules/`](rules/_index.md) before creating code.
- Feature implementation from a spec: use [`workflows/feature-delivery/make-plan.md`](workflows/feature-delivery/make-plan.md), then load matching rules and patterns (see indexes above).
- Bug fix: use [`workflows/maintenance/bugfix.md`](workflows/maintenance/bugfix.md), then load rules for the touched domain.
- Refactor: use [`workflows/maintenance/refactor.md`](workflows/maintenance/refactor.md), then load the current app architecture docs before editing.
- Dependency upgrade: use [`workflows/maintenance/dependency-upgrade.md`](workflows/maintenance/dependency-upgrade.md) and relevant setup notes.
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

## Per-App Integration

Each app should keep its own product-specific docs outside this toolkit:

- `ai_docs/architecture.md`: app-specific core and feature boundaries.
- `ai_docs/conventions.md`: naming, folders, and app-level exceptions.
- `ai_specs/`: feature specs and phase plans.
- **Cursor Agent Skills** (optional): portable templates under [`reference/agent-skills/`](reference/agent-skills/) — copy into `.agents/skills/<name>/` in each app repo so Cursor can discover them. Keep long-form guidance in `ai_toolkit/patterns/` and `ai_toolkit/rules/`; skills should stay short and link there.

The toolkit should not contain secrets, environment URLs, client IDs, or product-only architecture prose.
