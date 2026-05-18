# Broadcast observer hub

Portable pattern for **imperative fan-out**: one place broadcasts a signal; several listeners react without threading the same callback through many constructors.

**Enforceable rule:** observer hubs are **presentation-layer only** — no definitions or `notify…` usage in feature **`data/`** or **`domain/`**. See [`../../rules/architecture/observer-presentation-only.md`](../../rules/architecture/observer-presentation-only.md).

This file uses **generic names** only. Adapt folder and type names to your app.

## When to use

- More than one listener must react to the **same** signal (e.g. switch root shell tab from deep link, push handler, or post-login flow while the tab bar already has a direct `ValueChanged`).
- A bounded domain needs “something happened elsewhere” updates (e.g. list refresh after a sheet closes) and a **single hub** per domain keeps coupling clearer than a global event bus.

## When not to use

- **Single-owner** screen or feature state → prefer **Cubit/Bloc** under `BlocProvider` (see cubit patterns in this folder).
- **Parent → one child** with no broadcast → pass a normal callback.
- **App-wide** concerns (auth, locale) → use the mechanisms your app reserves for that (often app-wide blocs/cubits), not many small hubs.

**Rule of thumb:** one **hub per bounded concern** (e.g. “shell tabs”, “orders list sync”). Do not grow one hub into a kitchen-sink bus.

## Anatomy

Three roles:

1. **Observer** — holds user callbacks; **registers** with the updater in its constructor (or via an explicit `init` if you prefer); **`dispose`** unregisters. Private `_notify…` methods are invoked only by the updater.
2. **Updater** — private singleton (`._()` constructor), collection of observers, **`static void notify…`** entry points that loop and call each observer’s private `_notify…`. Optional **`static void dispose()`** clears the singleton for tests or rare full reset.
3. **Mixin (optional)** — reduces boilerplate for **`State`**: creates the observer in **`initState`**, disposes in **`dispose`**. **`Cubit`** owners: keep an **`Observer?`** field (or construct in the constructor body), **`dispose`** it in **`close()`** — see **Variant B**. Optionally add a **second mixin** with **explicit `attach…` / `detach…`** (or `init…` / `dispose…`) for the same hub so Cubits/services can share hook overrides without subclassing `State` — see **Variant B — binding mixin**.

Typical **file split** (keeps one public import surface):

```text
feature_shell_observer.dart   // library: class Observer + part directives
feature_shell_updater.dart    // part: singleton updater + static notify…
feature_shell_observer_mixin.dart  // part: State mixin (optional) + optional binding mixin for non-State owners
```

**Naming (this app):** the client-address hub uses **`ClientAddressObserverUpdater`** for the singleton fan-out class so it reads clearly next to other types and avoids a bare `*Updater` name collision.

## Variant A — Shell tab hub (minimal)

**Enum** (example):

```dart
enum AppShellTab { home, orders, profile }
```

**Observer** (library entry):

```dart
// feature_shell_observer.dart
import 'package:flutter/material.dart';

part 'feature_shell_updater.dart';
part 'feature_shell_observer_mixin.dart';

class ShellTabObserver {
  ShellTabObserver({this.onTabChanged}) {
    ShellTabUpdater.instance._attach(this);
  }

  final void Function(AppShellTab tab)? onTabChanged;

  void dispose() {
    ShellTabUpdater.instance._detach(this);
  }

  void _notifyTabChanged(AppShellTab tab) {
    onTabChanged?.call(tab);
  }
}
```

**Mixin** (`part` file — keeps the library file as the single import):

```dart
// feature_shell_observer_mixin.dart
part of 'feature_shell_observer.dart';

mixin ShellTabObserverMixin<T extends StatefulWidget> on State<T> {
  ShellTabObserver? _shellTabObserver;

  void onShellTabChanged(AppShellTab tab);

  @override
  void initState() {
    super.initState();
    _shellTabObserver = ShellTabObserver(onTabChanged: onShellTabChanged);
  }

  @override
  void dispose() {
    _shellTabObserver?.dispose();
    super.dispose();
  }
}
```

**Updater** (`part` file):

```dart
// feature_shell_updater.dart
part of 'feature_shell_observer.dart';

class ShellTabUpdater {
  ShellTabUpdater._();
  static ShellTabUpdater? _instance;
  static ShellTabUpdater get instance => _instance ??= ShellTabUpdater._();

  final List<ShellTabObserver> _observers = [];

  void _attach(ShellTabObserver o) {
    _observers.add(o);
  }

  void _detach(ShellTabObserver o) {
    _observers.remove(o);
  }

  /// Call from deep links, push handlers, etc.
  static void notifyTabChanged(AppShellTab tab) {
    for (final o in instance._observers) {
      o._notifyTabChanged(tab);
    }
  }

  static void dispose() {
    instance._observers.clear();
    _instance = null;
  }
}
```

**Note:** the bottom bar may still call `onTabChanged(tab)` on the shell `State` directly. The updater is for **other producers** that do not go through that callback. If nothing calls `notifyTabChanged` yet, the hub is still valid infrastructure for when those producers appear.

## Variant B — Domain hub (multiple events, optional defaults)

Same skeleton, but:

- Several **`static void notifyAdd(Item x)`**, **`notifyUpdate(Item x)`**, **`notifyRemoved(int id)`**, etc.
- **`Set<DomainListObserver>`** inside the updater if the same observer instance might register twice or identity matters for deduplication; use **`List`** if you rely on order or duplicates cannot happen.
- Inside each `_notify…`, you can branch: if a callback is set, call it; else apply a **default** (e.g. mutate a passed-in list controller). Keep defaults **small and obvious** so observers stay readable.

**Attach from a Cubit** (no `State` mixin):

```dart
class OrdersListCubit extends Cubit<OrdersState> {
  DomainListObserver? _observer;

  OrdersListCubit() : super(const OrdersState()) {
    _observer = DomainListObserver(
      onItemAdded: (item) => emit(state.copyWith(items: [item, ...state.items])),
    );
  }

  @override
  Future<void> close() {
    _observer?.dispose();
    return super.close();
  }
}
```

### Variant B — binding mixin (explicit attach/detach, non-`State` owners)

When the listener is a **`Cubit`**, **service**, or other type that is **not** `State<T>`, you can still deduplicate attach/detach with a **plain mixin** (no `on State<T>` constraint) that exposes **`attach…Observer()`** / **`detach…Observer()`** (or `init…` / `dispose…` naming — pick one pair per hub and document it). The owner **must** call those in matching lifecycle hooks (e.g. cubit constructor + `close()`). Document that **calling attach twice without detach leaks** the previous observer instance.

Same handler shape as the `State` mixin: default no-op methods (e.g. **`onOrderUpdated`** / **`onOrderRefresh`**) that the concrete class overrides when needed.

**Example (Cubit):**

```dart
@Injectable()
class OrdersListCubit extends Cubit<OrdersListState>
    with SafeEmitMixin, OrderObserverBindingMixin {
  OrdersListCubit(this._getOrders) : super(const OrdersListState.initial()) {
    attachOrderObserver();
  }

  final GetOrdersUseCase _getOrders;

  @override
  void onOrderUpdated(OrderEntity order) { /* merge into pagination */ }

  @override
  void onOrderRefresh(int orderId) { /* refetch row if present */ }

  @override
  Future<void> close() {
    detachOrderObserver();
    return super.close();
  }
}
```

**In-repo reference:** `lib/src/features/orders/utils/order_observer/` — `OrderObserverStateMixin` (`State`) + `OrderObserverBindingMixin` (explicit attach/detach).

## Multi-flavor or multi-product shells

If your app ships **separate entrypoints** (e.g. client vs provider) and policy says **no shared shell abstractions** across them:

- **Duplicate** the observer/updater/mixin **per variant** with **prefixed** names (`ClientShellTabUpdater` vs `ProviderShellTabUpdater`).
- Do **not** introduce a shared abstract base class for observers across variants if that violates your duplication rules.

## Lifecycle and testing

- Every **attach** must have a matching **`dispose`** (mixin `dispose`, or cubit `close`, or explicit teardown).
- Tests that construct multiple app shells may need **`ShellTabUpdater.dispose()`** (or equivalent) in `tearDown` so singletons do not leak between tests.

## Playbooks

| Situation | What to do |
|-----------|------------|
| New root tab | Add enum value; register the page in the shell; add **`notify…`** call sites only for code paths that change tabs **without** the bar’s callback. |
| Switch tab from a service / link / cubit | Call **`ShellTabUpdater.notifyTabChanged(tab)`** (or your variant’s static); ensure a mounted listener (e.g. shell `State` with mixin) handles **`setState`**. |
| New bounded “something changed” channel | Add a **new** folder under the feature (`utils/…_observer/`), same three-part layout; invoke **`notify…`** from success paths (sheets, mutations). **`Cubit`** listeners: **`Observer?`** + **`dispose`** in **`close()`** (see **Variant B**), or a **binding mixin** with explicit **`attach…` / `detach…`** (see **Variant B — binding mixin**). Examples: `lib/src/features/client/my_address/utils/client_address_observer/` (`ClientAddressObserverUpdater`); orders `lib/src/features/orders/utils/order_observer/`. |
| Extend an existing hub | Add **`static notifyX`** on the updater and **`_notifyX`** on the observer; avoid spawning many hubs for the same domain. |

## Checklist (new hub)

- [ ] Updater is a **singleton** with **static** `notify…` only on the public API you need.
- [ ] Observer **`dispose`** always detaches.
- [ ] **`List` vs `Set`** chosen deliberately.
- [ ] Hub scope is **one concern**; not a general-purpose global bus.
- [ ] Multi-flavor policy respected (duplicate vs shared).
- [ ] If you add a **binding mixin** (`attach…` / `detach…` or `init…` / `dispose…`), document the **no double-attach without detach** rule at the mixin site.

For Cubit-first screen state, use the other files in `patterns/state/` (`cubit-structure`, `cubit-vs-bloc`) before introducing a hub.
