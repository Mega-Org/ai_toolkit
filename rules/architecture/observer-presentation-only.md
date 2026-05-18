# Observer hubs — presentation layer only

## Purpose

Keep **broadcast observer hubs** (and their updaters / mixins) out of **domain** and **data** so side effects and UI sync stay in presentation. Domain and data stay testable and free of imperative fan-out.

## References

- Pattern (how to build a hub): [`../../patterns/state/broadcast-observer-hub.md`](../../patterns/state/broadcast-observer-hub.md)
- Architecture rules index: [`_index.md`](_index.md)
- In-repo examples: `lib/src/features/orders/utils/order_observer/`, `lib/src/features/client/my_address/utils/client_address_observer/`, `lib/src/features/client/main_page/observer/`

## Must

- Define observer hub types (`*Observer`, `*ObserverUpdater`, `*ObserverMixin`, `*ObserverBindingMixin`) only under the feature **presentation** surface:
  - `lib/src/features/<feature>/presentation/…`, or
  - `lib/src/features/<feature>/utils/<domain>_observer/` when the folder exists **solely** for presentation fan-out (same three-part layout as the pattern doc).
- Register, attach, detach, and call **`notify…`** only from **presentation** code: pages, widgets, sheets, and **presentation** cubits/blocs (e.g. `attachOrderObserver()` in `initState` / cubit constructor + `detach` in `dispose` / `close()`).
- After a use case or repository succeeds, return **`Either` / entities** to the caller; let presentation invoke **`ObserverUpdater.notify…`** (or refresh via cubit state) — do not notify from inside the use case or repository.

## Must not

- **No imports** of observer hub types under:
  - `lib/src/features/<feature>/domain/`
  - `lib/src/features/<feature>/data/`
  - `lib/core/` domain/data-style modules (repositories, datasources, use cases that are not presentation).
- **No calls** to `*ObserverUpdater.notify…`, `attach…Observer`, or `detach…Observer` from:
  - repository implementations,
  - remote/local datasources,
  - domain entities or use cases.
- Do not use observer hubs as a substitute for **repository results**, **streams**, or **app-wide** blocs/cubits reserved for global concerns (auth, locale, etc.) — see the pattern doc “When not to use”.

## Allowed in presentation

- **`State` + observer mixin** (`initState` / `dispose`).
- **Cubit/Bloc + binding mixin** or manual `Observer?` field (`close()` must `dispose` / detach).
- **Success paths** after `fold` on a use case: cubit or page calls `notifyAdd` / `notifyUpdate` / `notifyRefresh`, then updates local state if needed.

## Review checklist

- [ ] `domain/` and `data/` have zero references to `*Observer`, `*ObserverUpdater`, or `*ObserverMixin`.
- [ ] Every `notify…` call site lives under `presentation/` (or a presentation-only `utils/…_observer/` caller).
- [ ] Repositories and use cases return data only; they do not fan out to observers.
