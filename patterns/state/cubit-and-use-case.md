## Agent card

**LOADMAP tags:** `state`
**Read rest of this file:** no, unless copying the full `LoginCubit` / composite `RegisterCubit` samples.

### Must
- Emit loading before await (`Async.loading()` or `copyWith(submit: const Async.loading())`).
- Map UI → domain `Params` in the Cubit (trim, entities, sealed variants). Then `await _useCase(params)`.
- `result.fold`: failure → `Async.failure`; success → `Async.success` / `successWithoutData`.
- Ephemeral flows: emit `Async.initial()` (or reset the slice) **after** the terminal emit so listeners do not stick.
- Public API: `void submit(...)` (async body OK). `@Injectable()` + `BlocProvider(create: (_) => injector<…>())`.
- After await, rely on `SafeEmitMixin`; do not add `if (isClosed) return` solely to guard `emit`.

### Must not
- Pass `BuildContext` or controllers into a use case.
- Skip the post-success/failure reset on ephemeral submit flags.
- Duplicate `isClosed` guards when the mixin already no-ops `emit`.

### When to load the rest
- Need the full Login vs Register snippets or DI notes at the end.

### Related (cards first)
- `+domain` for `IUseCase`/params; `+di` for `@Injectable` / `@factoryParam`.

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

# Cubit calling `IUseCase`

## Purpose

Standard shape for feature Cubits that **build domain `Params`** and call **`IUseCase.call`** (`DomainServiceType<T>` → `Future<Either<Failure, T>>`). Use this together with [`cubit-structure.md`](cubit-structure.md) and [`../data/use-case-and-domain-service-type.md`](../data/use-case-and-domain-service-type.md).

## When to load

- Wiring a new **submit/load** Cubit method that invokes a use case.
- Choosing between **`typedef XxxState = Async<T>`** vs **composite state** with an **`Async` slice**.

---

## 1. Shared steps

1. **Emit loading** before awaiting work (`Async.loading()` or `copyWith(submit: const Async.loading())`).
2. **Map UI → domain `Params`** in the Cubit (trim strings, build `PhoneEntity`, pick sealed variants). Never pass `BuildContext` or controllers into the use case.
3. **`final result = await _useCase(params);`** — keep the flow linear.
4. **`result.fold`** — failure → `Async.failure(failure)`; success → `Async.success(...)` or `Async.successWithoutData()` when `Output` is `void`.
5. **Ephemeral flows:** emit **`Async.initial()`** (or reset only the `Async` field via `copyWith`) **after** the terminal success/failure emit so listeners do not see stale flags on rebuilds (`cubit-structure.md`).

**After `await`:** feature Cubits use **`SafeEmitMixin`** (`lib/core/foundation/safe_emit_mixin.dart`). **`emit`** is a no-op when the cubit is closed, so do **not** add **`if (isClosed) return;`** solely to guard **`emit`**. Use an early return only when you must skip **non-emit** work after await (logging side effects, analytics, etc.) or when the cubit does **not** use **`SafeEmitMixin`** (legacy).

---

## 2. Whole state is `Async<T>` (`LoginCubit`)

Use when the screen only cares about **one** async operation and **`Async<void>`** (or `Async<Data>`) is the entire state.

```dart
typedef LoginState = Async<void>;

@Injectable()
class LoginCubit extends Cubit<LoginState> with SafeEmitMixin {
  LoginCubit(this._loginUseCase) : super(const LoginState.initial());

  final LoginUseCase _loginUseCase;

  void submit(final LoginParams params) async {
    emit(const Async.loading());
    final normalized = LoginParams(
      phone: PhoneEntity(
        phone: params.phone.phone.trim(),
        code: params.phone.code,
        isoCode: params.phone.isoCode,
      ),
      password: params.password,
    );
    final result = await _loginUseCase(normalized);
    result.fold(
      (failure) => emit(Async.failure(failure)),
      (_) => emit(const Async.successWithoutData()),
    );
    emit(const Async.initial());
  }
}
```

**Public API:** keep **`void submit(...)`** (async body is fine). Call sites from `onPressed` do not need to `await`.

**DI:** annotate **`@Injectable()`**, register via codegen, provide with **`BlocProvider(create: (_) => injector<LoginCubit>())`** — see [`../../rules/core/di.md`](../../rules/core/di.md).

---

## 3. Composite state with an `Async` slice (`RegisterCubit`)

Use when the page keeps **other fields** (tabs, variant, form draft) and only **`submit`** should go through loading/success/failure.

```dart
void submit(final RegisterParams params) async {
  emit(state.copyWith(submit: const Async.loading()));
  final result = await _registerUseCase(params);
  result.fold(
    (failure) => emit(state.copyWith(submit: Async.failure(failure))),
    (_) => emit(state.copyWith(submit: const Async.successWithoutData())),
  );
  emit(state.copyWith(submit: const Async.initial()));
}
```

Each register screen builds **`RegisterClientParams`** or **`RegisterProviderParams`** and passes them into **`submit`** (trim field strings at the call site when needed) — no **`@factoryParam`** role flag on the Cubit.

Reset **only** the async slice with `copyWith(submit: …)`, not the whole page state.

---

## 4. `Future<void>` on the Cubit method

Expose **`Future<void>`** only when **tests or coordinators must await** completion (`cubit-structure.md`). Otherwise **`void … async`** is enough.

---

## 5. Alternative: `.then` instead of `await`

Chaining **`_useCase(params).then((result) { … })`** is equivalent if you strongly prefer a non-`async` method body. With **`SafeEmitMixin`**, **`emit`** inside the callback is already safe when closed. Prefer **`async`/`await`** in new code for readability and parity with authentication flows.
