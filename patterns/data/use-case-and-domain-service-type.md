# Use cases, params, and `DomainServiceType`

## Purpose

Step-by-step convention for **`IUseCase<Output, Params>`**, **param objects**, and
**`DomainServiceType<T>`** in this app, aligned with the reference project
(`IUseCase` + `call(Params)` + dartz `Either`) and this repo’s core names
(`Output` / `Params` generices, `NoParams`, typedef in `foundation/`).

## When to load

- Adding or changing **domain use cases**, **repository contracts**, or **param
  types** for API/domain flows.

## References

- Rules: [`../../rules/core/foundation.md`](../../rules/core/foundation.md)
- Code: `lib/core/foundation/i_use_case.dart`, `lib/core/foundation/typedef.dart`
- Presentation: Cubit → use case (`await`, `fold`, ephemeral reset): [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md)
- Multi-step submit mapping: [`../flutter/stepped-page-flow.md`](../flutter/stepped-page-flow.md)

---

## 1. Contract recap

`IUseCase` fixes **one** entry point: **`call` takes exactly one `Params` value**
and returns a **failed-or-success** async result.

```60:62:lib/core/foundation/i_use_case.dart
abstract class IUseCase<Output, Params> {
  DomainServiceType<Output> call(final Params params);
}
```

**`DomainServiceType<T>`** is the project default for that return shape:

```1:3:lib/core/foundation/typedef.dart
part of core;

typedef DomainServiceType<T> = Future<Either<Failure, T>>;
```

Do **not** introduce a second typedef for the same meaning. Use
`DomainServiceType<T>` on **repository** methods and on **use case** `call`
overrides (writing `Future<Either<Failure, T>>` explicitly is allowed but
equivalent — keep **one** style per file when touch-tuning).

---

## 2. Implementing a use case

1. **Class:** `class MyActionUseCase extends IUseCase<SuccessType, MyActionParams>`.
2. **DI:** `@Injectable()` and inject the **repository interface** (not Dio).
3. **`call`:** delegate to the repository and **return** its
   `DomainServiceType<SuccessType>` (often `return _repository.myMethod(params);`).

Example (authentication — **`LoginUseCase` first**, then **`LoginParams extends NoParams`**
in the same file; repository imports this library for the param type):

```dart
// lib/src/authentication/domain/use_cases/login_use_case.dart
@Injectable()
class LoginUseCase extends IUseCase<void, LoginParams> {
  @override
  DomainServiceType<void> call(final LoginParams params) =>
      _repository.login(params);
}

class LoginParams extends NoParams {
  const LoginParams({required this.phone, required this.password});
  final PhoneEntity phone;
  final String password;

  @override
  Map<String, dynamic> get toMap => { /* … */ };

  @override
  List<Object?> get props => [phone, password];
}
```

Repository side uses the **same** `DomainServiceType` vocabulary:

```6:11:lib/src/authentication/domain/repository/authentication_repository.dart
abstract class AuthenticationRepository {
  DomainServiceType<void> register(RegisterParams params);

  DomainServiceType<void> login(LoginParams params);
```

---

## 3. Designing `Params`

### Structure checklist

| Concern | Convention |
|--------|------------|
| Where params live | **`XxxUseCase`** first, **`XxxParams`** at the **bottom of the same file** (`xxx_use_case.dart`). **Do not** add a sibling **`*_params.dart`** unless several use cases **share** the same param type (rare). Repository contracts may **`import`** that use-case library **only** for the param type (`AuthenticationRepository` ↔ `login_use_case.dart`). |
| Identity | **`*Params`** name pairs with use case (`LoginUseCase` ↔ `LoginParams`). |
| Base type | **`extends NoParams`** (Equatable + empty default **`toMap`**). Override **`props`** / **`toMap`** as needed; annotate **`@override`** when overriding. |
| Immutability | **`final` fields**, **`const` constructor** when every field allows it. |
| Body JSON | **`@override Map<String, dynamic> get toMap`** on params or on sealed variants when the API expects a body. |
| Query string | **`Map<String, dynamic> get queryParameters`** (or getters merged into one map) for anything the **caller** supplies — see **Query parameters** below. |
| Presentation | Cubits/pages map UI → **`Params`**; params stay free of **`BuildContext`** / widgets. |
| Design traceability | **Should:** one-line **`///` doc comment immediately above each field** that maps to a labeled design control — see **Field doc comments** below. |
| Selected entities | **Should:** prefer **domain entity** types over bare ids when the user picked an object in UI — see **Entity vs primitive id** below. |

### Field doc comments

Add a **single-line doc comment directly above each field** in `*Params` when the
field maps to a **labeled control in design** (form label, section title, toggle
caption).

- **Purpose:** traceability only — link the code field to the design label so
  implementers know which attribute is which without opening the mockup.
- **Placement:** **above the field only** — not class-level essays, not on
  `toMap`, not duplicated in widgets or cubits.
- **Wording:** use the **user-facing label text from design** (same meaning as
  the primary locale l10n `…Label` where applicable). Per-repo locale policy
  (e.g. Arabic-first products) belongs in that repo’s **`ai_docs/conventions.md`**.
- **Does not replace l10n** — UI still reads strings from ARB / `AppLocalizations`.
- **Internal / non-UI fields** (flags with no design control) may omit a comment
  or use a short technical note.

```dart
class SubmitOrderParams extends NoParams {
  const SubmitOrderParams({
    required this.orderType,
    required this.customerName,
    required this.deliverySite,
  });

  /// Order type
  final OrderTypeEnum orderType;

  /// Customer name
  final String customerName;

  /// Delivery site
  final SiteEntity deliverySite;

  @override
  Map<String, dynamic> get toMap => {
        'order_type': orderType.apiValue,
        'customer_name': customerName,
        'site_id': deliverySite.id,
      };

  @override
  List<Object?> get props => [orderType, customerName, deliverySite];
}
```

### Entity vs primitive id

For fields the user selects in a dropdown, picker, or catalog:

- **Prefer the domain entity** (`SiteEntity`, `UnitEntity`, `PhoneEntity`, …)
  on `*Params` when that object exists in the domain layer.
- **Map to API ids / keys only inside `toMap`** (or the data-layer mapper).
- **Use a bare id** only when the entity is never needed after selection (no
  review screen, no display name) **and** no suitable domain type exists.

This keeps review steps and submit builders able to show names without extra
fetches. Stepped flows that assemble submit params from drafts should follow
this when mapping picker selections — see
[`../flutter/stepped-page-flow.md`](../flutter/stepped-page-flow.md).

### Preferred: flat `*Params` class

- **`extends NoParams`**, **`const` constructor** when all fields allow it.
- **`@override props`:** include every field that defines equality for the use case.
- **`@override toMap`:** build the **API/body** map where the feature maps domain → JSON;
  reuse models (`PhoneModel.fromEntity`) inside the map when the data layer
  expects it.

Example (`LoginParams` — **below** `LoginUseCase` in the same file):

```dart
// lib/src/authentication/domain/use_cases/login_use_case.dart
class LoginParams extends NoParams {
  const LoginParams({required this.phone, required this.password});

  final PhoneEntity phone;
  final String password;

  @override
  Map<String, dynamic> get toMap => {
        'password': password,
        ...PhoneModel.fromEntity(phone).toMap,
      };

  @override
  List<Object?> get props => [phone, password];
}
```

### Many behavioral types: sealed hierarchy

When one use case or flow has **multiple disjoint inputs** (different screens or
intents share an endpoint), define a **`sealed`** base **`extends NoParams`** and one
**`final class`** per variant (each **also** extends that sealed base). Outer wrapper
**Params** can carry a sealed **case** type plus shared fields (e.g. OTP **`VerifyOtpParams`**
+ **`VerifyOtpInput`**).

Example — sealed **`VerifyOtpInput`** and **`VerifyOtpParams`** holding it:

```6:48:lib/src/authentication/domain/verify_otp_input.dart
sealed class VerifyOtpInput extends Equatable {
  const VerifyOtpInput();

  @override
  List<Object?> get props => [];
}

final class VerifyOtpRegisterInput extends VerifyOtpInput {
  const VerifyOtpRegisterInput({required this.phone, required this.isClient});

  final PhoneEntity phone;
  final bool isClient;

  @override
  List<Object?> get props => [phone, isClient];
}

final class VerifyOtpLoginInput extends VerifyOtpInput {
  const VerifyOtpLoginInput({required this.phone});

  final PhoneEntity phone;

  @override
  List<Object?> get props => [phone];
}
```

```dart
// lib/src/authentication/domain/use_cases/verify_otp_use_case.dart
class VerifyOtpParams extends NoParams {
  const VerifyOtpParams({required this.code, required this.input});

  final String code;
  final VerifyOtpInput input;

  @override
  Map<String, dynamic> get toMap => {'code': code};

  @override
  List<Object?> get props => [code, input];
}
```

- **Repository / remote:** use **`switch (params.input)`** (or equivalent) for
  variant-specific paths or body extras; keep variant-specific **keys** next to
  the **variant type**, not as loose strings on a generic map.

### Query parameters (GET filters, pagination, search)

**Rule:** Caller-driven query values live on **`Params`** as getters — typically:

```dart
Map<String, dynamic> get queryParameters => {
  if (page != null) 'page': page,
  if (limit != null) 'per_page': limit,
  'sort': sortField.apiName,
};
```

- **Remote service / datasource:** pass **`queryParameters: params.queryParameters`**
  into Dio (or merge with defaults **in one place** next to params construction),
  not **`{'page': 1, 'q': 'hardcoded'}`** inside the datasource for values that
  should vary per request.
- **Stable route names / path segments** belong in **`AuthApiPaths`** / API path
  helpers; **per-request** query maps belong on **params**.

### No inputs

Use **`NoParams`** from core and **`IUseCase<Output, NoParams>`**. Call sites
pass **`const NoParams()`**.

### Reference-style shortcuts (optional)

In a large legacy codebase, a use case may use **`IUseCase<Output, int>`** (or
another primitive) when the operation is **only** “by id”. Prefer explicit
`*Params` in **new** features so adding a filter or flag later does not break
the signature.

---

## 4. Choosing `Output`

| Goal | Typical `Output` |
|------|------------------|
| Success, no domain payload | `void` → `DomainServiceType<void>` |
| One entity / DTO | Entity type, e.g. `CachedUser` |
| Lists / pagination wrappers | `List<…>`, `PaginatedData<…>`, etc. |

If an existing feature already uses **`Unit`** (dartz) for “success only”, stay
consistent **within that feature**; for **new** flows prefer **`void`** unless
you need `Unit` for combinators — see
[`../../rules/core/foundation.md`](../../rules/core/foundation.md).

---

## 5. File placement (typical feature)

| Artifact | Location |
|----------|----------|
| Use case | `lib/src/<feature>/domain/use_cases/<snake>_use_case.dart` |
| Params | **Preferred:** same Dart library as the matching use case — **`XxxUseCase` first**, **`XxxParams extends NoParams` below** (`login_use_case.dart`). Optional separate `*_params.dart` only when shared heavily across use cases. |
| Repository abstraction | `lib/src/<feature>/domain/repository/` (may **import** use-case libraries to reference param types — matches reference apps.) |

Keep **domain** params free of Flutter widgets or `BuildContext`; presentation
maps UI → `Params` before calling the use case.

---

## 6. Reference project (`thoad`) alignment

The reference uses the same ideas: **`call(Params)`**, **`NoParams`**, repository
methods returning **`Future<Either<Failure, T>>`**, and optional
**`DomainServiceType<T>`** on overrides for readability. This repo names the
first generic **`Output`** and centralizes the typedef in **`typedef.dart`** —
behavior matches when **`Params`** and **`Either`** usage match.
