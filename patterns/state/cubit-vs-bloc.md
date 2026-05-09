# Cubit vs Bloc

## Purpose

Decision guide for choosing Cubit or Bloc.

## Fill when

- A feature pattern moves from Cubit to Bloc or from Bloc to Cubit.
- A new app-wide state owner is introduced.
- The team changes how forms or async state are managed.

## References

- `patterns/state/cubit-structure.md`
- `patterns/state/bloc-structure.md`
- `rules/core/async.md`
- `rules/core/blocs-app-wide.md`

## Content

### Default decision

Use Cubit first.

Choose Cubit when:

- the state belongs to one feature or page;
- actions are simple methods like `load`, `submit`, `save`, `delete`, or
  `updateCurrentStep`;
- the state is `Async<T>` or a page state with `copyWith`;
- the UI reacts to loading, success, failure, selections, filters, or step
  changes.

Choose Bloc only when:

- the state is app-wide;
- named events are part of the design;
- many places dispatch the same events;
- the flow represents lifecycle/session transitions rather than one screen's
  local actions.

### Quick examples

Use Cubit for a one-shot delete:

```dart
typedef TempDeleteState = Async<void>;

class TempDeleteCubit extends Cubit<TempDeleteState> with SafeEmitMixin {
  TempDeleteCubit() : super(const TempDeleteState.initial());

  Future<void> delete() async {
    emit(const Async.loading());
    final result = await _deleteUseCase(NoParams());
    result.fold(
      (failure) => emit(Async.failure(failure)),
      (_) => emit(const Async.successWithoutData()),
    );
    emit(const Async.initial());
  }
}
```

Use Cubit for page state:

```dart
class TempEditorCubit extends Cubit<TempEditorState> with SafeEmitMixin {
  TempEditorCubit() : super(TempEditorState.initial());

  void updateCurrentStep(final int step) {
    emit(state.copyWith(currentStep: step));
  }

  Future<void> save() async {
    emit(state.copyWith(saveState: const Async.loading()));
  }
}
```

Use Bloc for app-level events:

```dart
class TempSessionBloc extends Bloc<TempSessionEvent, TempSessionState> {
  TempSessionBloc() : super(TempSessionInitial()) {
    on<TempSessionStarted>(_onStarted);
    on<TempSessionLoggedOut>(_onLoggedOut);
  }
}
```

### Forms

Forms do not automatically require Cubit.

Use widget-local state/controllers when the form is simple and only used inside
one widget. Use Cubit when form values must coordinate page steps, validation,
submission, dynamic lists, selected entities, or data shared across child
widgets.

### Rules

- New feature state should normally be Cubit.
- New feature Cubits should use `SafeEmitMixin`.
- For pure loading/success/failure state, use `Async<T>`.
- For no-data success, use `Async.successWithoutData()`, not
  `Async.success(null)`.
- For one-shot async functions that do not need to keep data or state, reset to
  `Async.initial()` after success/failure has been emitted.
- Keep full Bloc for app-wide event state.
