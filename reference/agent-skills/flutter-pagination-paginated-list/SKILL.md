---
name: flutter-pagination-paginated-list
description: Wire infinite scroll using the shared PaginationController and PaginatedListView module. Use when adding or refactoring paged lists, pull-to-refresh with pagination, horizontal story-style rails, dedupe, or in-place row updates.
---

# Flutter pagination (`PaginatedListView`)

## Canonical doc

Read and follow **`ai_toolkit/patterns/flutter/pagination-paginated-list-view.md`** before editing feature code. It covers:

- Import path and library layout for the host app (see that file’s **Where it lives** section — package name differs per project).
- Page-local controller vs cubit-owned controller.
- `addPageRequestListener`, `dispose`, `addItems`, `setError`, `refresh`.
- Dedupe, `updateItem` / `removeItem`, filter-driven `refresh`.
- Horizontal lists, sliver constructor, custom loading/error builders.

## Do not

- Duplicate pagination behavior with ad-hoc `ScrollController` + manual page math unless the product explicitly requires a different UX.
- Skip `dispose` on `PaginationController`.
- Leave the Cubit’s `Async` stuck in a terminal state if you also use it only to signal the latest fetch — see the pattern doc.

## Quick checklist

1. Create `PaginationController<int, T>(initialPageKey: 1)` (or appropriate `K`).
2. `addPageRequestListener` in `initState` / cubit ctor; `dispose` in `dispose` / `close`.
3. On fetch success: `addItems(paginatedData)`; on failure: `setError`.
4. Wrap UI with `PaginatedListView` and optional custom empty/error builders.

## Installing in a Cursor project

**Portable source (this file):** `ai_toolkit/reference/agent-skills/flutter-pagination-paginated-list/SKILL.md` in any repo that includes this `ai_toolkit`.

**Cursor discovery:** copy that file to `.agents/skills/flutter-pagination-paginated-list/SKILL.md` in the app repo (or merge into your team’s shared skills tree). Other configured skill roots work too.

Vendoring the skill here keeps one canonical `SKILL.md` for all apps that share this toolkit; the pattern doc remains under `ai_toolkit/patterns/flutter/`.
