# Presentation field naming (`StatefulWidget` locals)

## Purpose

Shared naming for **widget-local fields** in Flutter presentation code so controllers and similar holders stay readable and consistent across repos that use this toolkit.

## When to load

- Adding or refactoring `TextEditingController`, `FocusNode`, `ScrollController`, or other widget-owned disposable objects in screens and dialogs.

## Must / should

**Must:** Fields that hold `TextEditingController` instances (and the same idea for other `…Controller` framework types used as fields):

1. **Private** — leading underscore when they are implementation details of the state class (`_passwordController`, not `passwordController`).
2. **Fully spelled** — suffix **`Controller`**, not abbreviations such as `Ctrl` (`_passwordController`, not `_passwordCtrl`).

**Should:** Name by **role** (what the field controls), not only by type — for example `_confirmPasswordController` for “confirm password”, not `_confirmController` if multiple text fields exist on the same screen.

## Examples

```dart
class _LoginViewState extends State<_LoginView> {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
  // ...
}
```

## References

- Page + provider structure: [`page-bloc-provider.md`](page-bloc-provider.md)
- Flutter rules index: [`../../rules/flutter/_index.md`](../../rules/flutter/_index.md)

## Enforcement

The Dart analyzer does **not** enforce suffix spelling. To fail CI on banned abbreviations, use a **custom lint** rule in the repo or rely on code review and this document.
