## Agent card

**LOADMAP tags:** `nav`
**Read rest of this file:** no, unless adding a shared transition type or changing `navigatorKey` / observers.

### Must
- Use `AppRouter` static helpers (`push`, `pushNamed`, `pop`, `popUntil`, `getCurrentRoute`) instead of parallel `Navigator.of` wrappers.
- Pass local `BuildContext` into `pop` / `popUntil` when you have one; `appContext` only for context-less sites with a mounted navigator.
- One global `appNavigatorKey` on root `MaterialApp`. Shared transitions live in `animated_routes.dart`.
- Route names from router/feature constants — no magic strings. Typed `push<T>` / `pop<T>(result:)`.

### Must not
- Invent per-feature `PageRoute` subclasses; extend `animated_routes.dart`.
- Hard-code route names if constants exist.
- Use `appContext` when a real `BuildContext` is available.

### When to load the rest
- `pushWithTransition` / `RouteAware` observer wiring, responsive shell note.

### Related (cards first)
- Core digest already covers `AppRouter` call-site rules; this leaf is the toolkit source.

### Card protocol
- Default: this card is enough. Use `limit: 60` so you do not ingest the full leaf.
- Read the rest of **this** file only when **Read rest** is yes, or **When to load the rest** matches.
- Do not open `INDEX.md`, `rules/_index.md`, or `patterns/_index.md` to rediscover this leaf.
- Related files: open their **Agent cards** first; skip them if the other tag was not requested.
- No `tests` tag. Do not write or run tests. Do not commit unless the user asks.
- Edit in place; do not rewrite the whole leaf to “clean it up.”
- If the body is a stub (`Fill in later`), stop after this card; do not invent policy.
- Indexes, templates, and untagged leaves are not part of this tag.
- Spec templates, skills, and backend-contract work belong to later plan todos — not this card.

# Router

## Purpose

Imperative and typed navigation: **`GlobalKey<NavigatorState>`**, **`AppRouter`** static helpers, route observers, and shared route transitions. **Design tokens** (spacing, typography, assets) are in [`config.md`](config.md). **Theming** is in [`theme.md`](theme.md).

## Fill when

- `AppRouter` API, `navigatorKey`, or `appContext` assumptions change.
- `animated_routes.dart` transition types or helpers change.
- Root **`MaterialApp`** navigation wiring changes (e.g. `navigatorObservers`, `navigatorKey`).

## References (this repo)

- `lib/core/configs/router/app_router.dart`
- `lib/core/configs/router/animated_routes.dart`
- `lib/my_app.dart` (`navigatorKey`, `navigatorObservers`, `home` → `_BuilderScreen`)

## Content

### Global navigator key

- **`appNavigatorKey`** (from **`AppRouter`**) — use for **`MaterialApp.navigatorKey`** so **`AppRouter.appContext`** and static **`push` / `pop` / `popUntil`** work when no local **`BuildContext`** is available.
- Prefer passing an explicit **`BuildContext`** into router helpers when the call site already has one; use **`appContext`** only when safe (mounted navigator).

### `AppRouter` helpers

- **`push`**, **`pushNamed`** (if present), **`pushWithTransition`**, **`pushWithAnimatedOpacity`**, **`pop`**, **`popUntil`**, **`getCurrentRoute`** — follow the signatures in **`app_router.dart`**; do not duplicate **`Navigator.of`** wrappers for the same patterns elsewhere.
- **`routeAwareObserver`** — register on **`MaterialApp.navigatorObservers`** when using **`RouteAware`** widgets.

### Animated routes

- **`animated_routes.dart`** defines **`TransitionType`** and shared **`PageRoute`** builders used by **`pushWithTransition`** — extend there for new shared transitions.

### App shell (brief)

- **`ResponsiveBreakpoints.builder`** wraps the app in **`my_app.dart`**; breakpoint names align with **`responsive_framework`** usage elsewhere. This is layout shell, not business routing — keep router docs focused on **`AppRouter`** and **`Navigator`**.

### Rules

- **One** global navigator key for this app’s root stack unless the product explicitly introduces a nested navigator with its own contract.
- Do not hard-code route **names** as magic strings if the router module already exposes constants or typed routes.
