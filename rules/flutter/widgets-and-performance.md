# Widgets and performance

## Purpose
Must / must-not guidance for building widgets, rebuild boundaries, and performance-minded Flutter patterns.

## Fill when
- When performance baselines or widget composition standards change.

## References
- Optional paths in **your app repos** (not copied here).

## Content

### Page-level `BlocProvider` and `BuildContext`

**Must:** For a screen that introduces a feature-scoped `Bloc`/`Cubit` with `BlocProvider`, use a **`StatelessWidget` page** whose `build` returns **`BlocProvider`** and a **`child`** widget that is **below** the provider in the tree (typically a **private** `_PageView` / `_FeatureView`). Put **controllers and other `State` only on that child** (or deeper), not on a widget that wraps `BlocProvider` in the same `build` while also needing `context.read<YourCubit>()` for the same provider.

**Rationale:** `context` in the same `build` as `BlocProvider` is an **ancestor** of the provider; `context.read` / `BlocProvider.of` for that cubit require a **descendant** context. A child view (or `Builder`) fixes this; the preferred structure avoids ad-hoc `Builder` layers.

**How-to:** See [`patterns/flutter/page-bloc-provider.md`](../../patterns/flutter/page-bloc-provider.md).
