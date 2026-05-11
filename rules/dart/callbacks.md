# Callbacks: avoid function tear-offs

## Purpose

Keep callback wiring explicit so call sites show intent, breakpoints stay obvious, and future argument-passing does not require rewriting tear-offs.

## Rules

- **Must** wrap calls to instance methods (for example `_onSubmit`) in an explicit closure at Flutter/Dart UI callback sites—do **not** pass the method as a tear-off.

  Prefer:

  ```dart
  onPressed: () {
    _onSubmit();
  },
  ```

  Over:

  ```dart
  onPressed: _onSubmit,
  ```

- **Should** use the same explicit-closure style for `onPressed`, `onTap`, `listener`, `builder`, and similar when forwarding to a private or public method so breakpoints and future guards stay localized.

- **May** use tear-offs where Dart idioms expect them: **constructor tear-offs** (`MyWidget.new`), **`Iterable`/`Future` callbacks** (`items.map(Model.fromJson)`), or **top-level/static** one-shot handlers when a closure adds no clarity.

## Rationale

Explicit closures make “what runs when” visible in the widget tree, ease debugging, and avoid subtle differences between tear-offs and closures when methods depend on `this` or generics.

## References

- [`dart/_index.md`](_index.md)
