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
