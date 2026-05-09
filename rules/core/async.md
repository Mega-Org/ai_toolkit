# Async state

## Purpose

Rules for using `Async<T>` from `lib/core/foundation/async.dart` in presentation
state.

## Fill when

- `Async<T>` constructors or computed flags change.
- Cubit loading/success/failure conventions change.
- The team changes how no-data success is represented.

## References

- `lib/core/foundation/async.dart`
- `patterns/state/cubit-structure.md`
- `patterns/state/cubit-vs-bloc.md`
- `rules/core/foundation.md`

## Content

### Definition

`Async<T>` is a presentation-state wrapper for request lifecycle:

- `Async.initial()` means nothing is running and no result is stored.
- `Async.loading()` means a request is in progress.
- `Async.success(data)` means a request completed with non-null data.
- `Async.successWithoutData()` means a request completed successfully with no
  data payload.
- `Async.failure(failure)` means a request failed and stores the `Failure`.

It exposes:

- `data`
- `failure`
- `errorMessage`
- `isInitial`
- `isLoading`
- `isSuccess`
- `isFailure`

Use `Async<T>` in Cubit/state classes for UI-friendly state. Do not use it as a
repository or use-case return type. Domain and data layers should continue using
`DomainServiceType<T>` / `Either<Failure, T>`.

### Success with data

Use `Async.success(data)` only when there is real non-null data that the UI needs
to read from state.

```dart
typedef TempItemsState = Async<List<TempItem>>;

class TempItemsCubit extends Cubit<TempItemsState> with SafeEmitMixin {
  TempItemsCubit() : super(const TempItemsState.initial());

  final TempItemsUseCase _itemsUseCase = injector();

  Future<void> loadItems() async {
    emit(const Async.loading());

    final result = await _itemsUseCase(NoParams());
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

Do not reset to `Async.initial()` when the screen must keep showing `data` from
state.

### Success without data

Use `Async.successWithoutData()` for submit/save/delete operations that only need
to tell the UI that the operation succeeded.

```dart
typedef TempSubmitState = Async<void>;

class TempSubmitCubit extends Cubit<TempSubmitState> with SafeEmitMixin {
  TempSubmitCubit() : super(const TempSubmitState.initial());

  final TempSubmitUseCase _submitUseCase = injector();

  Future<void> submit(final TempSubmitParams params) async {
    emit(const Async.loading());

    final result = await _submitUseCase(params);
    result.fold(
      (failure) {
        emit(Async.failure(failure));
      },
      (_) {
        emit(const Async.successWithoutData());
      },
    );

    emit(const Async.initial());
  }
}
```

Do not write:

```dart
emit(const Async.success(null));
```

`Async.success(null)` does not represent success correctly because `isSuccess`
depends on either non-null `data` or `successWithoutData`.

### Resetting to initial

If a function only manages loading, success, and failure for a one-shot action,
and the UI does not need to keep data or success state, emit
`Async.initial()` after the result state.

Use this for:

- delete;
- submit without returned data;
- share/reshare;
- save where the page closes or listener shows a toast;
- action flows where success/failure is consumed immediately.

Do not reset immediately when:

- the UI reads returned `data`;
- the screen should keep showing success state;
- a later widget build must know the last result.

### Composite state usage

When a page has more than one concern, keep `Async<T>` as a named field inside a
larger state class.

```dart
class TempEditorState extends Equatable {
  const TempEditorState({
    required this.saveState,
    required this.currentStep,
  });

  final Async<void> saveState;
  final int currentStep;

  TempEditorState.initial()
      : this(
          saveState: const Async.initial(),
          currentStep: 0,
        );

  TempEditorState copyWith({
    final Async<void>? saveState,
    final int? currentStep,
  }) {
    return TempEditorState(
      saveState: saveState ?? this.saveState,
      currentStep: currentStep ?? this.currentStep,
    );
  }

  @override
  List<Object> get props => [
        saveState,
        currentStep,
      ];
}
```

Emit partial updates:

```dart
emit(state.copyWith(saveState: const Async.loading()));
emit(state.copyWith(saveState: const Async.successWithoutData()));
```

### UI listener pattern

```dart
void handleTempSubmitState(BuildContext context, Async<void> submitState) {
  if (submitState.isLoading) {
    TempLoading.show();
    return;
  }

  TempLoading.hide();

  if (submitState.isSuccess) {
    TempToast.success(context, message: 'Done');
  } else if (submitState.isFailure) {
    TempToast.error(context, message: submitState.errorMessage ?? '');
  }
}
```

### Rules

- Use `Async` only for presentation state.
- Use `Async.success(data)` only with real non-null data.
- Use `Async.successWithoutData()` for no-data success.
- Never use `Async.success(null)`.
- Reset one-shot states to `Async.initial()` when no data/result must be kept.
- Do not reset data states that the UI still needs.
