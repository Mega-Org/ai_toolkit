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
| `rules/architecture/` | Cross-layer boundaries (observers, etc.) | [`architecture/_index.md`](architecture/_index.md) |

## Quick map (common tasks)

| Topic | Leaf file |
|--------|-----------|
| Dart rules (imports, analysis — expand over time) | [`dart/_index.md`](dart/_index.md); constructors: [`dart/constructors.md`](dart/constructors.md); callbacks (no tear-offs): [`dart/callbacks.md`](dart/callbacks.md); **enum wire parsing**: [`dart/enums-wire-parsing.md`](dart/enums-wire-parsing.md); **enum l10n**: [`dart/enums-l10n.md`](dart/enums-l10n.md) |
| Remote data sources (inline Dio + JSON in public methods) | [`flutter/remote-data-sources.md`](flutter/remote-data-sources.md); pattern [`../patterns/data/remote-data-source-inline.md`](../patterns/data/remote-data-source-inline.md) |
| Widgets / performance | [`flutter/widgets-and-performance.md`](flutter/widgets-and-performance.md) |
| Shared UI wrappers, `Row`/`Column` `spacing`, `SizedBox` vs `Container` | [`flutter/ui-composition.md`](flutter/ui-composition.md); [`patterns/flutter/shared-media-and-buttons.md`](../patterns/flutter/shared-media-and-buttons.md) |
| `build_runner`, generation | [`tooling/build-runner.md`](tooling/build-runner.md) |
| Firebase secrets in repos | [`README.md`](../README.md) (until `rules/firebase/security-public-repos.md` is added) |
| Dio, interceptors, failures | [`core/network.md`](core/network.md) |
| `Async<T>` presentation state; **`final`** on Cubit submit params when not reassigned | [`core/async.md`](core/async.md) |
| `IUseCase`, params, `DomainServiceType` | [`core/foundation.md`](core/foundation.md); pattern [`../patterns/data/use-case-and-domain-service-type.md`](../patterns/data/use-case-and-domain-service-type.md) |
| `get_it` / injectable | [`core/di.md`](core/di.md) |
| App-wide blocs / cubits | [`core/blocs-app-wide.md`](core/blocs-app-wide.md) |
| Theme (`ThemeManager`, `AppTheme`, `MaterialApp`) | [`core/theme.md`](core/theme.md); **`AppTheme` color naming** — [`core/app-theme-color-tokens.md`](core/app-theme-color-tokens.md) |
| Typography (`TextStyles`, `AppFonts`) | [`core/text-styles.md`](core/text-styles.md); surface with dimensions — [`core/config.md`](core/config.md) |
| Router | [`core/router.md`](core/router.md) |
| Values, dimensions, assets, constants, responsive tiers | [`core/config.md`](core/config.md) (includes **`assets/icons/`** naming: **`*_ic.svg`** / prefer **`*_ic.png`**); [`patterns/flutter/responsive-and-layout.md`](../patterns/flutter/responsive-and-layout.md) |
| Localization | [`core/localization.md`](core/localization.md) |
| Services / utils | [`core/services.md`](core/services.md), [`core/utils.md`](core/utils.md) |
| Broadcast observer hub (singleton updater + observers; not a global event bus) | [`../patterns/state/broadcast-observer-hub.md`](../patterns/state/broadcast-observer-hub.md); **presentation only** — [`architecture/observer-presentation-only.md`](architecture/observer-presentation-only.md) |

## References

- How-to examples (longer snippets): [`patterns/_index.md`](../patterns/_index.md)
- Ordered playbooks: [`workflows/README.md`](../workflows/README.md)
- Toolkit entrypoint: [`INDEX.md`](../INDEX.md)
