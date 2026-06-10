# Patterns: Flutter UI (`patterns/flutter/`)

## Purpose

**UI and layout** conventions that complement [`rules/flutter/_index.md`](../../rules/flutter/_index.md)—for example responsive breakpoints and adaptive layouts.

## Contents

| File | Topic |
|------|--------|
| [`shared-media-and-buttons.md`](shared-media-and-buttons.md) | Project image/SVG/button wrappers (resolve names in `ai_docs/conventions.md`); layout hygiene |
| [`responsive-and-layout.md`](responsive-and-layout.md) | `responsive_framework`: root breakpoints, `AppScaledBox`, `AppResponsiveLayout` constants |
| [`core-bottom-sheets.md`](core-bottom-sheets.md) | Modal sheets: static `show`, `showAppModalBottomSheet`, sheet-scoped `BlocProvider`, Cubit alignment |
| [`core-alerts-dialogs.md`](core-alerts-dialogs.md) | Centered dialogs/alerts: `showAppDialog`, static `show`, dialog-scoped Cubit, when to use raw `showDialog` |
| [`page-bloc-provider.md`](page-bloc-provider.md) | Route page: `StatelessWidget` + `BlocProvider` + private `_View` (`StatefulWidget` when needed) so `context` is under the provider |
| [`stepped-page-flow.md`](stepped-page-flow.md) | Multi-step / wizard route structure: Cubit-owned step/tab navigation, optional `enums/` and `models/`, step drafts, animated switcher |
| [`presentation-field-naming.md`](presentation-field-naming.md) | Widget-local `TextEditingController` / `…Controller` fields: private `_…`, full `Controller` suffix (no `Ctrl`) |
| [`pagination-paginated-list-view.md`](pagination-paginated-list-view.md) | `PaginationController` on page `State` (default) + `PaginatedListView`; Cubit fetch only; `addItems` / `refresh`, sliver, dedupe, observer updates |

Large screens split with `part` / `part of`: [`../dart/part-part-of-library.md`](../dart/part-part-of-library.md).

## References

- Flutter rules: [`../../rules/flutter/_index.md`](../../rules/flutter/_index.md)
- Theme (core): [`../../rules/core/theme.md`](../../rules/core/theme.md); router: [`../../rules/core/router.md`](../../rules/core/router.md); dimensions, text styles, assets: [`../../rules/core/config.md`](../../rules/core/config.md)
- Patterns overview: [`../_index.md`](../_index.md)
