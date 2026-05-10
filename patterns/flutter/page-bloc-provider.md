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
