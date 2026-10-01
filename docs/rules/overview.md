# Cursor rules

Thirteen Cursor rules install from [`templates/cursor-rules/`](../../templates/cursor-rules/). [`install-rules.sh`](../../setup/install-rules.sh) copies each `*.template` into `.cursor/rules/` and drops the `.template` suffix. Deeper guidance stays under [`rules/`](../../rules/). Setup is in [new project setup](../installation/new-project-setup.md).

These guides cover every template. `no-request-prints` sits with Dart because it governs `print` and `debugPrint` around HTTP traffic.

| Guide | Templates | Scope |
|-------|-----------|--------|
| [Flutter rules](flutter-rules.md) | 6 | Screens, shared widgets, flavors, strings, remote data sources, Figma direction |
| [Dart rules](dart-rules.md) | 4 | Imports, callbacks, `part` libraries, request logging |
| [Core rules](core-rules.md) | 3 | `AppRouter`, when an agent asks, session bootstrap |

## Quick reference

| Rule | Category | Purpose |
|------|----------|---------|
| [`flutter-page-bloc`](flutter-rules.md#page-and-bloc) | Flutter | Thin page, `BlocProvider`, private view, controller names |
| [`flutter-shared-widgets`](flutter-rules.md#shared-widgets) | Flutter | Shared buttons and media, spacing, tokens |
| [`flutter-flavors`](flutter-rules.md#flavors) | Flutter | Flavor entrypoints, shells, Firebase, Makefile |
| [`flutter-localization`](flutter-rules.md#localization) | Flutter | User-facing strings from localization |
| [`flutter-remote-datasources`](flutter-rules.md#remote-data-sources) | Flutter | Inline `DioHelper` calls in remote data sources |
| [`figma-arabic-rtl`](flutter-rules.md#figma-and-rtl) | Flutter | Arabic-first Figma and semantic direction |
| [`dart-imports`](dart-rules.md#imports) | Dart | Absolute `package:` imports |
| [`dart-callbacks`](dart-rules.md#callbacks) | Dart | Explicit closures on UI callbacks |
| [`dart-part-part-of`](dart-rules.md#part-libraries) | Dart | Library plus `widgets/` parts for large screens |
| [`no-request-prints`](dart-rules.md#no-request-prints) | Dart | HTTP logs stay on `PrettyDioLogger` |
| [`app-router-navigation`](core-rules.md#app-router) | Core | Push and pop through `AppRouter` |
| [`agent-decision-gates`](core-rules.md#decision-gates) | Core | Ask when the contract or the product is missing |
| [`core-digest`](core-rules.md#core-digest-always-on) | Core | Always-on digest + LOADMAP; not full INDEX during phases |
