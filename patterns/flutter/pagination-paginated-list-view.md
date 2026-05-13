# Pagination: `PaginationController` + `PaginatedListView`

## Where it lives (this repo)

- **Library**: `lib/src/_pagination/app_pagination.dart` (`library app_pagination`).
- **Import**: `package:tariq_alsamo/src/_pagination/app_pagination.dart`.
- **Primary view**: `PaginatedListView<K, T>` (also `.sliver` constructor, `paginated_grid_view`, `paginated_page_view` for other layouts).

This module is **UI-driven**: `PaginatedListView` wraps the list in a `NotificationListener<ScrollNotification>` and calls `controller.onReceiveNotification` so the controller can request the next page near the scroll end. It also schedules `controller.init(screenHeight: …)` on the first frame so the initial page loads.

## Mental model

| Piece | Role |
|-------|------|
| `PaginationController<K, T>` | Holds `PaginationState` (items, `pageKey`, `isLoading`, `isLastPage`, `failure`), notifies via `paginatedStateNotifier`, fires `addPageRequestListener` callbacks with the current `pageKey`. |
| `PaginatedListView` | Renders items, empty/first-page loading/error, and trailing “new page” loading/error; triggers scroll-based fetches. |
| Your Cubit / use case | Performs the network call for a given page; **you** push the result into the controller with `addItems` / `appendPage` / `setError` (or int-key helpers below). |

The controller is **not** the repository: it is a scroll-aware list coordinator. Keep request parameters (filters, search) in the Cubit; pass them inside the page listener when calling the use case.

## `PaginationController<int, T>` helpers (`addItems`)

For `K == int`, the extension `addItems(PaginatedData<T>)` on `PaginationController<int, T>`:

- Resets internal state when `state.pageKey == 1` before appending (so a “first page” response replaces correctly after refresh).
- Calls `appendPage` with `newKey: state.pageKey + 1`, `newItems`, and `isLastPage: !data.pageInfo.hasNext`.

Use **`setError`** when the use case returns a failure so the list can show first-page or inline retry UI.

## Two wiring styles (pick one per screen)

Both are valid; choose based on who must own the controller lifecycle and who needs direct access to item mutations.

### A — Controller on the **page / sheet `State`** (common)

Use when the list is the main concern of the widget and you already use `BlocListener` to reflect fetch results.

1. `final _paginationController = PaginationController<int, MyItem>(initialPageKey: 1);`
2. In `initState`: `_paginationController.addPageRequestListener((page) { context.read<MyCubit>().load(page); });`
3. In `dispose`: `_paginationController.dispose();`
4. In `BlocListener` / `MultiBlocListener`: on success with `PaginatedData`, call `_paginationController.addItems(data)`; on failure, `_paginationController.setError(failure)`.
5. Build `PaginatedListView(controller: _paginationController, itemBuilder: …)`.

**Examples (reference app, same module shape):** awards list with per-tab `BlocProvider`, society groups tab with pull-to-refresh + `removeDuplicatedItemsWhere`, country ranking tab with `updateItem` on side-channel state, add-members sheet with `listenWhen` on search to `refresh()`.

### B — Controller owned by the **Cubit** (compact for shared logic)

Use when multiple widgets read the same paged list, or the Cubit already coordinates observers that mutate items (e.g. “seen” / sync helpers).

1. Cubit holds `PaginationController<int, T>`, registers `addPageRequestListener` in the constructor or an init method, and disposes the controller in `close()`.
2. Expose a getter if the UI needs the same instance (e.g. horizontal strip + elsewhere).
3. On each fetch, call `_paginationController.addItems` / `setError` from inside the Cubit after `fold`.

**Example:** stories rail — horizontal `PaginatedListView`, custom `firstPageLoadingBuilder` / `newPageLoadingBuilder` / error builders wired with `controller.retryLastFailedRequest`.

## Required UI wiring checklist

- [ ] **Listener registered** before the first build completes (typically `initState`).
- [ ] **`dispose`** on the controller when the owning `State` or Cubit is torn down.
- [ ] **Every successful paged response** applied with `addItems` (or `appendPage` / `insertPage` if you are not using `PaginatedData` + int extension).
- [ ] **Failures** call `setError` so loading flags clear and error UI can show.
- [ ] **Do not** forget `setError` / `addItems` pairing — otherwise `isLoading` can stick.

## Pull-to-refresh and filter changes

- Call **`controller.refresh()`** to reset to `PaginationState.initial` and re-run the page-1 listener.
- Some screens debounce refresh (`Timer` + `cancel`) so rapid filter updates do not stack requests; keep debounce logic next to the controller or Cubit, not inside the generic pagination library.

When filters or query params change, prefer **`listenWhen`** on the Cubit field that represents those params, then `refresh()` the controller (country users tab pattern).

## Deduplication

After `addItems`, if the API can return overlapping rows across pages, call:

`removeDuplicatedItemsWhere((first, second) => first.id == second.id)` (or your stable key).

## Mutating loaded rows without refetch

`PaginationController` supports:

- `updateItem(updateWhere: …, newItem: (old) => …)` — e.g. unread badge, step counts, membership flags.
- `removeItem((e) => …)` — e.g. row removed after an action.
- `addItem` / `itemList` / `uniqueByKey` — use sparingly and document why a refetch is not used.

Cross-screen updates can still go through a **broadcast observer** pattern (see `patterns/state/broadcast-observer-hub.md`); the observer holds or receives the controller and calls these helpers.

## `PaginatedListView` options

- **`scrollDirection`**: `Axis.horizontal` for rails; last item row/column appends new-page loading/error (see implementation in `paginated_list_view.dart`).
- **Custom builders**: `firstPageLoadingBuilder`, `firstPageErrorBuilder`, `noItemsFoundBuilder`, `newPageLoadingBuilder`, `newPageErrorBuilder` — use for shimmer rows, compact spinners on horizontal lists, and l10n’d retry.
- **`.sliver`**: embed inside `CustomScrollView` when the page already uses slivers (app bar, headers).
- **`padding` / `scrollController` / `cacheExtent`**: match design and nested scroll scenarios.

## Async state in the Cubit vs list state

You may keep **`Async<PaginatedData<T>>`** (or similar) on the Cubit for one-shot UI or analytics while still driving **`PaginationController`** for the list. Emit loading/success/failure for the **current request** if needed, then reset to `Async.initial()` so the next page request is not blocked by a stuck “success” flag — see stories-style `getStories` emissions.

Avoid duplicating the **full item list** in Cubit state unless a second consumer truly needs it; the controller already holds the list.

## Naming and typos

Use a consistent name such as `_paginationController` (avoid drift like `_pagainationController` in long-lived code).

## Verification

- Scroll to end: next page loads; `isLastPage` stops further triggers.
- First-page error: retry invokes `retryLastFailedRequest` or your listener re-fetches.
- Refresh: list clears and page 1 loads again.
- Filter change: no stale rows from the previous query (usually `refresh()` + cubit param update ordering).

## Related toolkit

- Page structure + `BlocProvider`: [`page-bloc-provider.md`](page-bloc-provider.md).
- Imperative fan-out to lists: [`../state/broadcast-observer-hub.md`](../state/broadcast-observer-hub.md).
- `Async<T>` rules: [`../../rules/core/async.md`](../../rules/core/async.md).
