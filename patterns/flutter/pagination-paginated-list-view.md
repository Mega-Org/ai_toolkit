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
| Your Cubit / use case | Performs the network call for a given page; **the UI** (or, in rare cases, the Cubit) pushes the result into the controller with `addItems` / `appendPage` / `setError`. |

The controller is **not** the repository: it is a scroll-aware list coordinator. Keep request parameters (filters, search) in the Cubit or in page `State`; pass them inside the page listener when calling the use case.

## Default: controller on the page `State` (preferred)

**Put `PaginationController` on the private `_View` `State`**, not on the Cubit, unless a documented exception applies (see [Cubit-owned controller](#cubit-owned-controller-exceptions) below).

This matches [`page-bloc-provider.md`](page-bloc-provider.md): the public page provides `BlocProvider`; the private `_…View` `State` owns scroll/list controllers and wires them to the Cubit.

### Why UI-owned

- **Lifecycle** — `initState` / `dispose` align with the list widget; no `close()` coupling on injectable Cubits.
- **Local mutations** — `updateItem`, `addItem`, `refresh` from `OrderObserverStateMixin` (or similar) stay on the same `State` that already holds the controller.
- **Thin Cubit** — fetch + domain params only; the loaded item list lives in the controller, not duplicated in Cubit state.

### Reference screens (this app)

| Screen | Controller owner | Fetch wiring |
|--------|------------------|--------------|
| [`orders_list.dart`](../../../lib/src/features/orders/presentation/orders_list/orders_list.dart) | `_OrderListBodyState` | `BlocListener` + `Async<PaginatedData<T>>` (see [Optional: `BlocListener` + `Async`](#optional-bloclistener--async)) |
| [`client_all_complaints_page.dart`](../../../lib/src/features/client/complaints/presentation/all/client_all_complaints_page.dart) | `_ClientAllComplaintsViewState` | Page listener `await`s `loadComplaintsPage` → `fold` → `addItems` / `setError` (**preferred**) |
| [`client_my_address_cubit.dart`](../../../lib/src/features/client/my_address/presentation/my_addresses/client_my_address_cubit.dart) | Cubit | Exception: observer + pull-to-refresh owned with fetch in Cubit |

## `PaginationController<int, T>` helpers (`addItems`)

For `K == int`, the extension `addItems(PaginatedData<T>)` on `PaginationController<int, T>`:

- Resets internal state when `state.pageKey == 1` before appending (so a “first page” response replaces correctly after refresh).
- Calls `appendPage` with `newKey: state.pageKey + 1`, `newItems`, and `isLastPage: !data.pageInfo.hasNext`.

Use **`setError`** when the use case returns a failure so the list can show first-page or inline retry UI.

## Wiring checklist (UI-owned controller)

1. On the private view `State`: `final _paginationController = PaginationController<int, MyItem>(initialPageKey: 1);`
2. In `initState`: `_paginationController.addPageRequestListener((page) { … });` — call the Cubit with page + filters.
3. In `dispose`: `_paginationController.dispose();`
4. On each successful page: `_paginationController.addItems(data)`; on failure: `_paginationController.setError(failure)`.
5. Build `PaginatedListView` (or `.sliver`) with `controller: _paginationController` and `itemBuilder`.

### Preferred: page listener + `DomainServiceType` (no list `Async`)

Keep the Cubit free of a per-page `Async<PaginatedData<T>>` when the list is the only consumer:

```dart
Future<void> _onPageRequest(final int page) async {
  final result = await context.read<MyCubit>().loadPage(
    page: page,
    filter: _filter,
  );
  if (!mounted) return;
  result.fold(
    (failure) => _paginationController.setError(failure),
    (data) => _paginationController.addItems(data),
  );
}
```

**Example:** `ClientAllComplaintsCubit.loadComplaintsPage` + `_ClientAllComplaintsViewState._onPageRequest`.

### Optional: `BlocListener` + `Async`

Use when you already emit `Async<PaginatedData<T>>` for the same screen (analytics, secondary widgets, or legacy cubits):

```dart
BlocListener<MyCubit, Async<PaginatedData<MyItem>>>(
  listener: (context, state) {
    if (state.isFailure) {
      _paginationController.setError(state.failure);
    } else if (state.isSuccess && state.data != null) {
      _paginationController.addItems(state.data!);
    }
  },
  child: PaginatedListView<int, MyItem>(controller: _paginationController, …),
)
```

Cubit contract for this style:

- `emit(Async.loading())` before the use case.
- `emit(Async.failure(…))` or `emit(Async.success(data))` on result.
- **`emit(const Async.initial())` immediately after** so the next page request is not blocked and the listener does not re-apply stale success ([`async.md`](../../rules/core/async.md)).

**Example:** `OrdersListCubit` + `_OrderListBody` in `orders_list.dart`.

Do **not** emit `Async.loading()` again after success/failure.

## Observer / in-place row updates (UI-owned)

When a broadcast observer (e.g. `OrderObserverStateMixin`) updates rows without refetching:

- Hold the controller on the same `State` as the mixin.
- Call `updateItem`, `addItem`, or `refresh()` on `_paginationController` from observer callbacks.

See [`broadcast-observer-hub.md`](../state/broadcast-observer-hub.md).

## Cubit-owned controller (exceptions)

Use **only** when multiple widgets must share one controller instance, or the Cubit already centralizes observer + pull-to-refresh + fetch (e.g. addresses).

1. Cubit holds `PaginationController<int, T>`, registers `addPageRequestListener` in the constructor, disposes in `close()`.
2. Expose a getter if the UI needs the same instance.
3. On each fetch, call `paginationController.addItems` / `setError` from inside the Cubit after `fold`.

**Example:** `ClientMyAddressCubit.paginationController`.

Do **not** default new list screens to Cubit-owned controllers because an older screen did.

## Pull-to-refresh and filter changes

- Call **`controller.refresh()`** to reset to `PaginationState.initial` and re-run the page-1 listener.
- When filters or query params change (tab, status chip), update local `State` or Cubit params, then **`_paginationController.refresh()`** so stale rows are cleared.
- Debounce rapid filter changes next to the controller or Cubit, not inside the generic pagination library.

## Deduplication

After `addItems`, if the API can return overlapping rows across pages:

`removeDuplicatedItemsWhere((first, second) => first.id == second.id)` (or your stable key).

## Mutating loaded rows without refetch

`PaginationController` supports:

- `updateItem(updateWhere: …, newItem: (old) => …)`
- `removeItem((e) => …)`
- `addItem` / `getItemWhere` — use sparingly; prefer `refresh()` when correctness needs a full refetch.

## `PaginatedListView` options

- **`scrollDirection`**: `Axis.horizontal` for rails.
- **Custom builders**: `firstPageLoadingBuilder`, `firstPageErrorBuilder`, `noItemsFoundBuilder`, `newPageLoadingBuilder`, `newPageErrorBuilder`.
- **`.sliver`**: embed inside `CustomScrollView` when the page already uses slivers (orders list tab bodies).
- **`padding` / `scrollController` / `cacheExtent`**: match design and nested scroll scenarios.

## Async state in the Cubit vs list state

- **Preferred:** no duplicate item list in Cubit; Cubit methods return `DomainServiceType<PaginatedData<T>>` for page fetches.
- **Optional:** `Async<PaginatedData<T>>` per request + `BlocListener` as above; reset to `initial()` after each apply.
- Avoid keeping the **full item list** in Cubit state when the controller already holds it.

## Naming

Use `_paginationController` consistently (avoid typos like `_pagainationController`).

## Verification

- Scroll to end: next page loads; `isLastPage` stops further triggers.
- First-page error: retry invokes `retryLastFailedRequest` or your listener re-fetches.
- Refresh: list clears and page 1 loads again.
- Filter change: no stale rows from the previous query (`refresh()` + param update ordering).

## Related toolkit

- Page structure + `BlocProvider`: [`page-bloc-provider.md`](page-bloc-provider.md).
- Imperative fan-out to lists: [`broadcast-observer-hub.md`](../state/broadcast-observer-hub.md).
- `Async<T>` rules: [`../../rules/core/async.md`](../../rules/core/async.md).
- Agent skill (portable): [`.agents/skills/flutter-pagination-paginated-list/SKILL.md`](../../../.agents/skills/flutter-pagination-paginated-list/SKILL.md).
