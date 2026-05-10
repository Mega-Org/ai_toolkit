# Core dependency injection (rules)

## Purpose

Define how **GetIt** + **injectable** are wired in this app, what survives **scope resets**, and how **widgets, cubits, and layers** should obtain dependencies. Use this when adding registrations, new features, or reviewing AI-generated code.

## Stack

- **`get_it`**: service locator instance exposed as **`injector`**.
- **`injectable`**: annotations + **`dart run build_runner`** → **`lib/core/di/di.config.dart`** (generated; never edit by hand).

## Entry points (real files)

| Symbol | Role |
|--------|------|
| **`injector`** | `GetIt.instance` — global accessor (`lib/core/di/di.dart`). |
| **`initializeDependencies()`** | Registers a few **outer** singletons, then **`pushNewScope`**, whose `init` calls **`configureDependencies()`**. |
| **`configureDependencies()`** | **`await injector.init()`** — runs codegen **`@InjectableInit`** (`initializerName: 'init'`, `preferRelativeImports: true`, `asExtension: true`). |
| **`resetDependenciesScope()`** | **`injector.resetScope()`** then **`configureDependencies()`** — recreates **inner** scope registrations only. |

## Scopes — what resets vs survives

**Outer (manual) registrations** in `initializeDependencies()` **before** `pushNewScope`:

- Survive **`resetDependenciesScope()`** (they are not part of the disposable inner scope).
- In this project: **`FlutterSecureStorage`**, **`SharedPreferences`**, **`LocalizationContainer`** (and its manual **`init()`**).

**Inner scope** (everything registered via **`injector.init()`** / codegen):

- **Dropped** on **`resetDependenciesScope()`** and re-registered on the next **`configureDependencies()`**.

**Rule:** When you add manual `injector.register*` calls, decide explicitly whether they belong **before** or **inside** the scoped `init`. Wrong placement causes subtle bugs (e.g. locale or secure storage recreated unintentionally, or stale services after logout).

## `@module` — `RegisterModule`

Use **`@module` `abstract class RegisterModule`** for types that are awkward as plain `@injectable` classes: third-party constructors, primitives, or **new `Dio` / `CancelToken` per resolution** when that is desired.

This project’s module exposes, among other things, **`Dio`** and **`CancelToken`** as **`@injectable`** getters (factory-style resolution via injectable).

## Registration patterns by layer

### Implementations behind interfaces

Register the **implementation** as the **abstract** type so callers depend on abstractions:

- **`@Injectable(as: TempRemoteDataSource)`** on **`TempRemoteDataSourceImpl`**.
- **`@Injectable(as: TempRepository)`** on **`TempRepositoryImpl`**.

### Use cases

- Prefer **`@injectable`** or **`@Injectable()`** on concrete use case classes.
- Constructor parameters that are also registered are resolved automatically.

### Cubits / blocs

- Annotate with **`@Injectable()``** (or **`@lazySingleton`** when the instance must be **one shared instance** app-wide — use sparingly and only with a clear lifecycle reason).
- **Preferred:** constructor-injected collaborators (use cases, repositories).

```dart
// Illustrative only — names are placeholders, not production types.

@Injectable()
class TempOrdersCubit extends Cubit<TempOrdersState> {
  TempOrdersCubit(this._loadOrdersUseCase) : super(const TempOrdersState.initial());

  final LoadTempOrdersUseCase _loadOrdersUseCase;
}
```

**Runtime arguments (navigation / screen-specific):** use **`@factoryParam`** on constructor parameters that are **not** registered services (flags, sealed inputs, IDs). Codegen registers a **`factoryParam`** factory; resolve with **`injector<X>(param1: …)`** (then **`param2`** if you declare two factory params). Example in-repo: **`LoginCubit`** and **`RegisterCubit`** have none — register client vs provider is **`RegisterClientParams` / `RegisterProviderParams`** passed to **`submit`**. **`VerifyOtpCubit`** uses **`@factoryParam VerifyOtpInput input`**. Do **not** add **`factory X.fromInjector()`** helpers on the Cubit — **`@Injectable()`** plus **`injector`** at **`BlocProvider`** creation is enough.

### Long-lived infrastructure

- Use **`@lazySingleton`** for app-wide services that must not multiply (e.g. playback/orchestration helpers) when a single instance is required by design.
- **`@PostConstruct`** (optionally **`preResolve: true`**) for async setup after construction (same pattern as shared **`DioHelper`**-style types in **`core`**).

## Rules for widgets and UI

1. **Do not** call **`GetIt.instance`** or **`injector`** inside **`StatelessWidget.build`** (or **`build`** paths that rerun every frame) to resolve routine dependencies — it hides dependencies and complicates tests.
2. **Do** resolve scoped types where the widget tree is set up:
   - **`BlocProvider(create: (_) => injector<TempFeatureCubit>())`**
   - **`MultiBlocProvider`** at app or route level (same pattern).
3. **Prefer** **`context.read<T>()`** / **`BlocProvider`** for types already provided above the widget.
4. **Injectable types** (cubits, use cases) should **take dependencies in the constructor** when possible; reserve **`injector<T>()`** inside a class for legacy or exceptional cases (some existing cubits resolve a use case via **`injector`** in a field initializer — new code should prefer constructor injection).

## Code generation

After adding, removing, or changing **`@injectable` / `@Injectable` / `@module` / `@lazySingleton`** annotations:

```bash
dart run build_runner build --delete-conflicting-outputs
```

(use the project’s documented alias if one exists).

**Never** hand-edit **`lib/core/di/di.config.dart`**.

## Guidance for AI assistants

When implementing a feature in this repo:

1. **Locate** `lib/core/di/di.dart` — confirm **`RegisterModule`** vs a new **`@injectable`** type.
2. **Bind abstractions**: data layer **`as:`** interface; domain use cases as concrete **`@injectable`**.
3. **Wire cubits** with **`@Injectable()`** and constructor parameters matching registered types.
4. **Run codegen** after annotation changes; fix analyzer errors from missing imports or wrong `as:` types.
5. **Scope**: default new registrations go through codegen (inner scope). Only move manual **`registerSingleton` / `registerLazySingleton`** next to **`initializeDependencies()`** if the product owner needs that instance to **survive** **`resetDependenciesScope()`**.
6. **UI**: provide cubits with **`BlocProvider`** and **`injector<Cubit>()`** in **`create`**, not in **`build`**.

## Examples (dummy names only)

All snippets are **illustrative**; replace types with real feature names in actual code.

### 1) Repository + data source

```dart
// temp_repository.dart (abstract)
abstract class TempRepository {
  Future<Result> load(String id);
}

// temp_repository_impl.dart
@Injectable(as: TempRepository)
class TempRepositoryImpl implements TempRepository {
  TempRepositoryImpl(this._remote);

  final TempRemoteDataSource _remote;

  @override
  Future<Result> load(String id) => _remote.fetch(id);
}

// temp_remote_data_source.dart
abstract class TempRemoteDataSource {
  Future<Result> fetch(String id);
}

// temp_remote_data_source_impl.dart
@Injectable(as: TempRemoteDataSource)
class TempRemoteDataSourceImpl implements TempRemoteDataSource {
  TempRemoteDataSourceImpl(this._dio);

  final Dio _dio; // resolved from RegisterModule / app wiring

  @override
  Future<Result> fetch(String id) async { /* ... */ throw UnimplementedError(); }
}
```

### 2) Use case consumed by a cubit

```dart
@injectable
class LoadTempProfileUseCase {
  LoadTempProfileUseCase(this._repository);

  final TempRepository _repository;

  Future<Either<Failure, Profile>> call(String userId) async {
    return _repository.load(userId);
  }
}

@Injectable()
class TempProfileCubit extends Cubit<Async<Profile>> {
  TempProfileCubit(this._loadUseCase) : super(const Async.initial());

  final LoadTempProfileUseCase _loadUseCase;

  Future<void> load(String userId) async {
    emit(const Async.loading());
    final result = await _loadUseCase(userId);
    result.fold(
      (f) => emit(Async.failure(f)),
      (p) => emit(Async.success(p)),
    );
  }
}
```

### 3) Page provides cubit (acceptable `injector` usage)

```dart
BlocProvider(
  create: (_) => injector<TempProfileCubit>()..load('dummy-user-id'),
  child: const TempProfileView(),
)
```

### 4) Module-only construction

```dart
@module
abstract class ExampleRegisterModule {
  @injectable
  Dio get exampleDio => Dio(BaseOptions(baseUrl: 'https://example.test'));

  @injectable
  CancelToken get exampleCancelToken => CancelToken();
}
```

### 5) Shared cubit instance (`@lazySingleton`)

Use only when multiple routes/widgets must share **one** cubit instance:

```dart
@lazySingleton
class TempGlobalBannersCubit extends Cubit<TempBannersState> {
  TempGlobalBannersCubit(this._useCase) : super(const TempBannersState.initial());

  final FetchTempBannersUseCase _useCase;
}
```

## References (this monorepo)

- **`lib/core/di/di.dart`** — `injector`, `initializeDependencies`, scopes, **`RegisterModule`**.
- **`lib/core/di/di.config.dart`** — generated registrations.
- **`lib/core/network/helper/dio_helper.dart`** — example of **`@Injectable()`** + **`@PostConstruct`** infrastructure.

## Related toolkit docs

- Update this file when **scope behavior**, **manual registrations**, or **`RegisterModule`** contents change.
