# Responsive layout (`responsive_framework`)

## Purpose

Single place to describe **how this app wires `responsive_framework`**: root breakpoints, the scaled shell around routed content, where numbers live, and what to use in features.

## References (this repo)

| Piece | Path |
|-------|------|
| Root breakpoints | `lib/my_app.dart` — **`ResponsiveBreakpoints.builder`** |
| Scaled route shell | `lib/my_app.dart` — **`MaterialApp.builder`** → **`Overlay`** → **`AppScaledBox`**, wrapping `child` |
| Scale widget | `lib/core/configs/responsive/app_scaled_box.dart` — **`AppScaledBox`** (**`ResponsiveScaledBox`** + **`BouncingScrollWrapper`**) |
| All breakpoint / tier numbers | `lib/core/constants/responsive_constants.dart` — **`AppResponsiveLayout`** |
| Rules (constants split, imports) | [`rules/core/config.md`](../../rules/core/config.md) |

## Stack

- **Package:** `responsive_framework`.
- **Breakpoints:** At the top of **`MyApp.build`**, **`ResponsiveBreakpoints.builder`** defines named bands (**`MOBILE`**, **`TABLET`**, **`DESKTOP`**, **`4K`**) using widths from **`AppResponsiveLayout`**.
- **Scaled UI width:** **`MaterialApp.builder`** wraps the navigator `child` in **`Overlay`** / **`OverlayEntry`** so the subtree passes through **`AppScaledBox`**, which applies **`ResponsiveScaledBox`** with a **`ResponsiveValue<double>`** built from **`Condition.between`** tiers (portrait + landscape design widths). **`BouncingScrollWrapper`** adds consistent overscroll / mouse-drag behavior.
- **Constants:** **`AppResponsiveLayout`** centralizes values. **`Breakpoint`** fields are **`double`**; **`Condition.between`** requires **`int`** for **`start`** / **`end`** — both shapes are declared explicitly in **`responsive_constants.dart`**.

## What to use in feature widgets

- **`ResponsiveBreakpoints.of(context)`** — **`isMobile`**, **`isTablet`**, **`equals(DESKTOP)`**, etc., for layout branching.
- **`ResponsiveValue<T>`** / **`ResponsiveVisibility`** — when a property (padding, columns, widget replacement) should change by breakpoint.
- **`Dimensions`** — spacing, radii, icon sizes (design tokens), not duplicate breakpoint widths (those stay in **`AppResponsiveLayout`**).

## When you change behavior

1. Adjust tiers or breakpoints in **`AppResponsiveLayout`** first.
2. Keep **`MyApp`** breakpoint list and **`AppScaledBox`** conditions consistent with those constants (no stray literals).
3. If **`Dimensions.isMobile`** is re-enabled, align it with **`ResponsiveBreakpoints`** (see commented code in **`dimensions.dart`**).

## Fill when

- Root **`ResponsiveBreakpoints`** list, **`MaterialApp.builder`** wrapping strategy, or **`AppScaledBox`** scaling tiers change.
