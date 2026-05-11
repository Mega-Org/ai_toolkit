# Cubit structure

## Purpose

How to structure feature and page state with Cubit. This is the default state
management pattern for this app.

## Fill when

- Cubit file layout changes.
- Async state conventions change.
- Composite page state conventions change.
- `SafeEmitMixin` usage changes.

## References

- `lib/core/foundation/safe_emit_mixin.dart`
- `lib/core/foundation/async.dart`
- `rules/core/async.md`
- `patterns/state/cubit-vs-bloc.md`

## Content

### Default Cubit shape

New feature Cubits should use `SafeEmitMixin`.

Write **`with SafeEmitMixin`** without a type argument — it is inferred from **`Cubit<XxxState>`**
(see `rules/core/foundation.md`).

```dart
class TempActionCubit extends Cubit<TempActionState> with SafeEmitMixin {
  TempActionCubit() : super(const TempActionState.initial());
}
```

Use Cubit methods for normal feature actions:

- load;
- refresh;
- submit;
- save;
- delete;
- update selected item;
- move to the next page step.

Do not create Bloc events for these simple feature actions.

### Choose a state shape

| Situation | Use |
| --- | --- |
| One async operation only | `typedef TempActionState = Async<T>;` in the Cubit file |
| One async operation with no returned data | `typedef TempActionState = Async<void>;` and `Async.successWithoutData()` |
| Multiple fields or page concerns | `XxxState extends Equatable` in `xxx_state.dart` (same stem as `xxx_cubit.dart`) |
| One submit state plus page data | One composite state with `Async<void> submitState` plus the other fields |
| Form that can stay local to widgets | Widget-local controllers/state, no Cubit required |

Forms do not always need Cubit ownership. Use Cubit when the form state affects
the page flow, must survive step changes, feeds a submit request, or is shared
between widgets. Keep simple widget-only input local when Cubit adds no value.

### Single async state

Use this when one function only manages loading, success, and failure, and the
screen does not need to keep the success data in state after the listener reacts.

For **use-case invocation** (`await`, `fold`, resetting `initial`), see
[`cubit-and-use-case.md`](cubit-and-use-case.md).

#### Presentation params

For **several** screen fields — or whenever you already have a domain/presentation
**`*Params`** type — pass **one immutable params object** into the Cubit method
with a **`final`** parameter: **`void submit(final XxxParams params)`** — not long
positional lists. Colocate presentation-only param classes with the Cubit or
screen (**`final` fields**, **`const` constructor** when possible). For **two or
three** stable primitives only, **named parameters** on the Cubit method are still
fine; prefer a params object once the bundle grows or is shared (see
`LoginCubit.submit` + **`LoginParams`** under `lib/src/authentication/presentation/login/`).

#### Void vs `Future`

Prefer **`void`** on Cubit actions when **call sites** do not need to **await**
(typical for submit from `onPressed`). The method body may still be **`async`** and
**`await`** the use case — see
[`cubit-and-use-case.md`](cubit-and-use-case.md) for the standard **`fold`**
sequence (**`SafeEmitMixin`** makes **`emit`** safe after dispose; see that doc).

Use **`Future<void>`** only when tests or coordinators **must await** completion.

#### Ephemeral submit: reset to `initial`

After emitting terminal **`Async.failure`** / **`Async.successWithoutData`**,
emit **`Async.initial()`** again in the **same completion callback** so the UI
does not keep a stale success/failure flag across rebuilds (which can re-trigger
`BlocListener` side effects or duplicate navigation).

```dart
typedef TempDeleteState = Async<void>;

class TempDeleteCubit extends Cubit<TempDeleteState> with SafeEmitMixin {
  TempDeleteCubit() : super(const TempDeleteState.initial());

  final TempDeleteUseCase _deleteUseCase = injector();

  void delete(final TempDeleteParams params) async {
    emit(const Async.loading());

    final result = await _deleteUseCase(params);
    result.fold(
      (failure) => emit(Async.failure(failure)),
      (_) => emit(const Async.successWithoutData()),
    );
    emit(const Async.initial());
  }
}
```

For **composite** state (e.g. `submit` inside `RegisterState`), reset only
that field: `emit(state.copyWith(submit: const Async.initial()))` after the same
terminal emits.

Rules:

- Keep the typedef in the same `xxx_cubit.dart` file.
- Use the typedef name `XxxState`, matching `XxxCubit`.
- Start with `const XxxState.initial()` — in the Cubit constructor use **`super(const XxxState.initial())`**, not `super(const Async.initial())`, so the typedef remains the state identity at construction.
- Emit `Async.loading()`, then `Async.failure(...)` or success.
- If the function only drives a one-shot loading/success/failure UI and does not
  need to save data, emit `Async.initial()` (or reset the `Async` slice)
  **after** the terminal emit in the same callback.
- Do not use `Async.success(null)`. For no-data success, use
  `Async.successWithoutData()`.

### Single async state with data

Use `Async.success(data)` only when real non-null data is returned and the UI
needs that data.

```dart
typedef TempItemsState = Async<List<TempItem>>;

class TempItemsCubit extends Cubit<TempItemsState> with SafeEmitMixin {
  TempItemsCubit() : super(const TempItemsState.initial());

  final TempGetItemsUseCase _getItemsUseCase = injector();

  Future<void> getItems() async {
    emit(const Async.loading());

    final result = await _getItemsUseCase(NoParams());
    result.fold(
      (failure) {
        emit(Async.failure(failure));
      },
      (items) {
        emit(Async.success(items));
      },
    );
  }
}
```

Do not reset to initial if the page must keep showing the returned data from
state. Reset only for one-shot flows where the success/failure should be cleared.

### Composite page state

Use a separate state file when the Cubit owns multiple page concerns — **`part` /
`part of`** so state stays in the same library as the Cubit (see `temp_editor_*`
below).

**Naming:** class **`XxxState`**, file **`xxx_state.dart`** — same feature prefix as
**`xxx_cubit.dart`** / **`XxxCubit`** (e.g. `register_cubit.dart` +
`register_state.dart`). Do **not** insert **`Page`** in the type or filename unless
you must distinguish several state classes in one feature.

In-repo example: `lib/src/authentication/presentation/register/manager/`
(`register_cubit.dart` + `register_state.dart`).

```dart
// temp_editor_cubit.dart
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tariq_alsamo/core/core.dart';

part 'temp_editor_state.dart';

class TempEditorCubit extends Cubit<TempEditorState> with SafeEmitMixin {
  TempEditorCubit() : super(TempEditorState.initial());

  final TempSaveUseCase _saveUseCase = injector();

  void updateStep(final int step) {
    emit(state.copyWith(currentStep: step.clamp(0, 2)));
  }

  void updateDraft(final TempDraft draft) {
    emit(state.copyWith(draft: draft));
  }

  void save() {
    if (!state.draft.isValid) {
      return;
    }

    emit(state.copyWith(saveState: const Async.loading()));

    _saveUseCase(state.draft.toParams()).then((result) {
      result.fold(
        (failure) =>
            emit(state.copyWith(saveState: Async.failure(failure))),
        (_) => emit(
          state.copyWith(saveState: const Async.successWithoutData()),
        ),
      );
      emit(state.copyWith(saveState: const Async.initial()));
    });
  }
}
```

```dart
// temp_editor_state.dart
part of 'temp_editor_cubit.dart';

class TempEditorState extends Equatable {
  const TempEditorState({
    required this.currentStep,
    required this.saveState,
    required this.draft,
  });

  final int currentStep;
  final Async<void> saveState;
  final TempDraft draft;

  TempEditorState.initial()
      : this(
          currentStep: 0,
          saveState: const Async.initial(),
          draft: TempDraft.initial(),
        );

  TempEditorState copyWith({
    final int? currentStep,
    final Async<void>? saveState,
    final TempDraft? draft,
  }) {
    return TempEditorState(
      currentStep: currentStep ?? this.currentStep,
      saveState: saveState ?? this.saveState,
      draft: draft ?? this.draft,
    );
  }

  @override
  List<Object> get props => [
        currentStep,
        saveState,
        draft,
      ];
}
```

Rules:

- Cubit file has `part 'xxx_state.dart';`.
- State file starts with `part of 'xxx_cubit.dart';`.
- State extends `Equatable`.
- Provide **`initial()`** and **`copyWith`**.
  - **`initial()`:** Prefer **`const XxxState.initial()`** that redirects to the main
    constructor (**`… : this(…)`**) when **every** default can be **`const`** (for
    example `submit: const Async.initial()`). If a field’s starting value cannot be
    const (runtime identity, mutable holder, etc.), use a **non-const** named
    constructor or factory and **omit** `const` where required — do not force
    `const` incorrectly.
  - **`copyWith`:** Prefer **`final`** on optional named parameters (`final Async<void>? submit`)
    so overrides stay explicit and assignments stay single-shot.
- Include every state field in `props`.
- Use clear async field names like `saveState`, `deleteState`, or
  `uploadState`.
- Keep page-global state in one state object unless there is a real reuse reason
  to split it.

### Page usage

Use `BlocProvider` at the page boundary. Use `BlocConsumer` when the page needs
listener side effects. Use `BlocSelector` for narrow rebuilds.

For **modal bottom sheets** or **centered dialogs** (short-lived overlays with
their own Cubit), put `BlocProvider` inside the widget’s static `show` method so
scope matches the overlay — see [`patterns/flutter/core-bottom-sheets.md`](../flutter/core-bottom-sheets.md)
and [`patterns/flutter/core-alerts-dialogs.md`](../flutter/core-alerts-dialogs.md).

```dart
BlocProvider(
  create: (context) => TempEditorCubit(),
  child: BlocConsumer<TempEditorCubit, TempEditorState>(
    listener: (context, state) {
      final saveState = state.saveState;

      if (saveState.isLoading) {
        TempLoading.show();
        return;
      }

      TempLoading.hide();

      if (saveState.isSuccess) {
        Navigator.of(context).pop();
        TempToast.success(context, message: 'Saved');
      } else if (saveState.isFailure) {
        TempToast.error(context, message: saveState.errorMessage ?? '');
      }
    },
    builder: (context, state) {
      return BlocSelector<TempEditorCubit, TempEditorState, int>(
        selector: (state) => state.currentStep,
        builder: (context, currentStep) {
          return TempStepView(currentStep: currentStep);
        },
      );
    },
  ),
)
```

### Do not

- Do not create a state file for pure `Async<T>`.
- Do not use `Async.success(null)`.
- Do not keep one-shot success/failure state forever when no data must be saved.
- Do not force every form field into Cubit if widget-local state is enough.
- Do not override `emit` manually in new Cubits; use `SafeEmitMixin`.
