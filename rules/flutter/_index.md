# Flutter rules index

## Purpose
Entry point for Flutter UI and framework enforceable rules.

## Fill when
- When you add or rename Flutter rule topics under `rules/flutter/`.

## References
- `rules/_index.md` (all rule areas)
- `rules/flutter/widgets-and-performance.md`

## Content

- Widget composition and provider/`context` ordering: [`widgets-and-performance.md`](widgets-and-performance.md) (page + `BlocProvider`: [`../patterns/flutter/page-bloc-provider.md`](../patterns/flutter/page-bloc-provider.md)).
- Shared UI wrappers (images, SVG, buttons), `SizedBox` vs `Container`: [`ui-composition.md`](ui-composition.md); examples: [`../patterns/flutter/shared-media-and-buttons.md`](../patterns/flutter/shared-media-and-buttons.md).
- Widget-local controllers and similar fields: [`../patterns/flutter/presentation-field-naming.md`](../patterns/flutter/presentation-field-naming.md).
- Paged lists — **default:** `PaginationController` on the page `_View` `State`, not the Cubit; see [`../patterns/flutter/pagination-paginated-list-view.md`](../patterns/flutter/pagination-paginated-list-view.md).
