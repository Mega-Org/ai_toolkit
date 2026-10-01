## Agent card

**LOADMAP tags:** `state`
**Read rest of this file:** yes if implementing success-with-data vs `successWithoutData`, or reset/`isSuccess` listener rules.

### Must
- Mark Cubit/Bloc params `final` when never reassigned; keep param types immutable (`final` fields, `const` when possible).
- `Async<T>` is **presentation** lifecycle: `initial`, `loading`, `success(data)`, `successWithoutData()`, `failure`.
- Use `Async.success(data)` only when the UI must read non-null data from state.
- Use `successWithoutData` for void / fire-and-forget success.
- Domain/data return `DomainServiceType<T>` / `Either<Failure, T>` — never `Async`.

### Must not
- Use `Async<T>` on repository or use-case contracts.
- Treat `isSuccess` as durable page data after an ephemeral reset to `initial`.
- Invent extra loading flags beside `Async` for the same request.

### When to load the rest
- Copy examples (`TempItemsCubit`), failure mapping, or listener/`BlocConsumer` guidance.

### Related (cards first)
- `cubit-structure.md`, `cubit-and-use-case.md`; `+domain` for `Either`.

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

### `final` on parameters and param types

When a Cubit or Bloc method takes a params object (or any formal parameter that
is never reassigned), mark it **`final`** — e.g. **`void submit(final LoginParams params)`**.
Keep param/value types **immutable** with **`final` fields** (and **`const`**
constructors when every field allows it). See
[`patterns/state/cubit-structure.md`](../../patterns/state/cubit-structure.md)
(presentation params) and
[`patterns/data/use-case-and-domain-service-type.md`](../../patterns/data/use-case-and-domain-service-type.md).

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

Prefer **`void submit(final TempSubmitParams params)`** when callers do not await,
chain the use case with **`.then`**, and **always** end one-shot flows with
`emit(const Async.initial())` after the terminal failure/success emit so listeners
do not see stale outcomes — see `patterns/state/cubit-structure.md` (single async
state + presentation params).

```dart
typedef TempSubmitState = Async<void>;

class TempSubmitCubit extends Cubit<TempSubmitState> with SafeEmitMixin {
  TempSubmitCubit() : super(const TempSubmitState.initial());

  final TempSubmitUseCase _submitUseCase = injector();

  void submit(final TempSubmitParams params) {
    emit(const Async.loading());

    // SafeEmitMixin: no `if (isClosed) return` needed before emit-only paths.
    _submitUseCase(params).then((result) {
      result.fold(
        (failure) => emit(Async.failure(failure)),
        (_) => emit(const Async.successWithoutData()),
      );
      emit(const Async.initial());
    });
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

Emit partial updates (finish one-shot saves with a reset of that slice when the UI
does not need to hold success/failure):

```dart
emit(state.copyWith(saveState: const Async.loading()));
emit(state.copyWith(saveState: const Async.successWithoutData()));
emit(state.copyWith(saveState: const Async.initial()));
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
- Prefer **`void`** Cubit actions chained with **`.then`** when nobody awaits them;
  pass **immutable presentation param objects** (`final XxxParams`) — see
  `patterns/state/cubit-structure.md`.
