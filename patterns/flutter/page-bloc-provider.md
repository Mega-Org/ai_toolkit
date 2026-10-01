## Agent card

**LOADMAP tags:** `ui`
**Read rest of this file:** no, unless wiring constructor args into `create:` or a sheet/dialog-scoped provider.

### Must
- Public page (`XxxPage`) is a `StatelessWidget` that only creates `BlocProvider` (or `.value`).
- `child` of the provider is a private `_FeatureView` (StatefulWidget when controllers/focus/tickers are needed).
- Call `context.read` / `BlocBuilder` / `BlocConsumer` only from widgets **below** the provider.
- Resolve cubits with `injector<XxxCubit>()` in `create:` (see `di` tag).
- Keep local State (controllers, dispose) on `_View`, never on the same widget that wraps `BlocProvider`.
- Pass cubit constructor args from the public page into `create:` only; give `_View` copies only if the UI needs them.

### Must not
- Call `context.read` / `BlocProvider.of` with the page’s ancestor `BuildContext` (provider not visible).
- Mix `TextEditingController` / `FocusNode` onto the public page that also builds `BlocProvider`.
- Put `StatefulWidget` on the route widget solely to own the provider.

### When to load the rest
- Need the `LoginPage` sample or `BlocProvider.value` / sheet variants.
- App-wide blocs (different scope) — then also `rules/core/blocs-app-wide.md` (untagged; load only if asked).

### Related (cards first)
- `+state` for Cubit/`Async`; `+di` for `injector` / `@factoryParam`.
- `+pagination` if the `_View` State owns `PaginationController`.

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

# Page shell + feature-scoped Bloc/Cubit

## Purpose

Avoid **`context` under `BlocProvider`** mistakes (calling `context.read` / `BlocProvider.of` with the **ancestor** `BuildContext`, which does not see the provider). Prefer a **thin route widget** that only creates the provider and builds the real UI **below** it.

## Pattern

1. **Public page** (`LoginPage`, `VerifyOtpPage`, …): `StatelessWidget`.
2. **`build`**: return `BlocProvider` (or `BlocProvider.value` when injecting from parent) whose **`child`** is a **private** `_FeatureView` widget.
3. **Stateful pieces** (controllers, `FocusNode`, `TickerProvider`, etc.): live on **`_FeatureView`** (or deeper), **never** on the same widget that wraps `BlocProvider` in the same `build` method.

```dart
class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => injector<LoginCubit>(),
      child: const _LoginView(),
    );
  }
}

class _LoginView extends StatefulWidget {
  const _LoginView();

  @override
  State<_LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<_LoginView> {
  // TextEditingController, dispose, etc.

  @override
  Widget build(BuildContext context) {
    // context is below BlocProvider — safe for context.read<LoginCubit>()
    return Scaffold(/* ... */);
  }
}
```

## Why

- The **`BuildContext` passed to `_LoginView.build`** is a **descendant** of `BlocProvider`, so `context.read<Cubit>()`, `BlocBuilder`, and `BlocConsumer` resolve the cubit without a **`Builder`** workaround.
- The route widget stays cheap (no local state mixed with provider wiring).

## Variants

- **Constructor args for the cubit** (e.g. `VerifyOtpCubit(param1: input)`): keep them on the **public** `StatelessWidget`; pass `input` only into `create:` / `BlocProvider`, not necessarily into `_View` unless the UI needs them.

## References

- Rule: [`../../rules/flutter/widgets-and-performance.md`](../../rules/flutter/widgets-and-performance.md)
- App-wide blocs (different scope): [`../../rules/core/blocs-app-wide.md`](../../rules/core/blocs-app-wide.md)
- Modal/sheet-scoped providers: [`core-bottom-sheets.md`](core-bottom-sheets.md), [`core-alerts-dialogs.md`](core-alerts-dialogs.md)
