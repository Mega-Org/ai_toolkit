# Rules (`rules/`)

## Purpose

Short **must / must-not** guidance for Dart, Flutter, tests, Git, tooling, Firebase, and shared **`lib/core`** usage. Load rules **early** when touching an area; they stay enforceable and tool-neutral.

## Top-level areas

| Folder | Role | Index |
|--------|------|--------|
| `rules/dart/` | Analyzer, imports, generated-code expectations | [`dart/_index.md`](dart/_index.md) |
| `rules/flutter/` | Widgets, performance, framework usage | [`flutter/_index.md`](flutter/_index.md) |
| `rules/testing/` | Unit, widget, integration, golden conventions | [`testing/_index.md`](testing/_index.md) |
| `rules/git/` | Branches, commits, alignment with git workflows | [`git/_index.md`](git/_index.md) |
| `rules/tooling/` | Codegen, IDE, `build_runner` | [`tooling/_index.md`](tooling/_index.md) |
| `rules/firebase/` | FlutterFire, public-repo safety | [`firebase/_index.md`](firebase/_index.md) |
| `rules/core/` | Barrel, foundation, network, DI, app-wide blocs, theme, router, config values/assets, l10n, services, utils | [`core/_index.md`](core/_index.md) |

## Quick map (common tasks)

| Topic | Leaf file |
|--------|-----------|
| Dart analysis / imports | [`dart/imports-and-analysis.md`](dart/imports-and-analysis.md) |
| Widgets / performance | [`flutter/widgets-and-performance.md`](flutter/widgets-and-performance.md) |
| `build_runner`, generation | [`tooling/build-runner.md`](tooling/build-runner.md) |
| Firebase secrets in repos | [`firebase/security-public-repos.md`](firebase/security-public-repos.md) |
| Dio, interceptors, failures | [`core/network.md`](core/network.md) |
| `get_it` / injectable | [`core/di.md`](core/di.md) |
| App-wide blocs / cubits | [`core/blocs-app-wide.md`](core/blocs-app-wide.md) |
| Theme (notifier, `AppTheme`, `MaterialApp`) | [`core/theme.md`](core/theme.md) |
| Router | [`core/router.md`](core/router.md) |
| Values, dimensions, assets, constants | [`core/config.md`](core/config.md) |
| Localization | [`core/localization.md`](core/localization.md) |
| Services / utils | [`core/services.md`](core/services.md), [`core/utils.md`](core/utils.md) |

## References

- How-to examples (longer snippets): [`patterns/_index.md`](../patterns/_index.md)
- Ordered playbooks: [`workflows/README.md`](../workflows/README.md)
- Toolkit entrypoint: [`INDEX.md`](../INDEX.md)
