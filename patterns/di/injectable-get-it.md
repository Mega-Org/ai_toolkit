# get_it + injectable (patterns)

## Purpose

Step-by-step **implementation patterns** for registering and resolving dependencies in this app. Enforceable rules (scopes, widget boundaries, what must not be hand-edited) live in [`../../rules/core/di.md`](../../rules/core/di.md) — read that first; this file shows **how to wire a feature** with **dummy types only**.

## Stack (this app)

| Piece | Role |
|-------|------|
| **`injector`** | `GetIt.instance` — global accessor |
| **`@InjectableInit`** | Codegen entry: `injector.init()` → `lib/core/di/di.config.dart` |
| **`initializeDependencies()`** | `pushNewScopeAsync` → inner `configureDependencies()` |
| **`resetDependenciesScope()`** | Optional hook → `resetScope()` → re-`init()` (logout / session teardown) |
| **`RegisterModule`** | `@module` for `Dio`, `SharedPreferences`, secure storage, etc. |

After any annotation change:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Never edit **`di.config.dart`** by hand.

---

## 1. Bootstrap and scopes

**Startup** (flavor `main_*.dart` → shared app config) calls `initializeDependencies()` once before `runApp`.

```dart
// di.dart (shape only — dummy comments)
final injector = GetIt.instance;

@InjectableInit(initializerName: 'init', preferRelativeImports: true, asExtension: true)
Future<void> initializeDependencies() async {
  await injector.pushNewScopeAsync(
    init: (_) async {
      await configureDependencies();
    },
  );
}

Future<void> configureDependencies() async {
  await injector.init();
}

Future<void> resetDependenciesScope() async {
  await disposeBeforeScopeResetHook?.call(); // e.g. long-lived sockets
  await injector.resetScope();
  await configureDependencies();
}
```

**Inner scope** (everything from codegen `injector.init()`): dropped on `resetDependenciesScope()` and recreated on the next `configureDependencies()`.

**Manual `register*` outside codegen**: only if a type must **survive** scope reset — decide explicitly; wrong placement causes stale services or duplicated platform singletons.

---

## 2. Annotation cheat sheet

| Annotation | Use when |
|------------|----------|
| `@Injectable(as: SomeAbstraction)` | Repository / data source **implementation** bound to interface |
| `@injectable` / `@Injectable()` | Concrete use case, cubit, or helper with no `as:` |
| `@module` + getters / methods | Third-party constructors, config objects, **factory** wiring |
| `@lazySingleton` | Exactly **one** shared instance app-wide (coordinator, transport config) |
| `@singleton` | Eager single instance (e.g. locale holder recreated on scope reset) |
| `@preResolve` + `Future<T>` | Async init before graph is ready (`SharedPreferences.getInstance`) |
| `@PostConstruct(preResolve: true)` | Async setup **after** construct (`DioHelper`-style infra) |
| `@factoryParam` | Constructor arg **not** in GetIt — passed at `injector<T>(param1: …)` |

`@injectable` and `@Injectable()` are equivalent here; pick one style per feature and stay consistent.

---

## 3. Data layer — abstract + impl, bind `as:`

Same file: abstract contract + implementation. Repository depends on the **abstract** data source; injectable registers the impl as that type.

```dart
// temp_remote_data_source.dart
abstract class TempRemoteDataSource {
  Future<TempItemDto> fetchItem(final String itemId);
}

@Injectable(as: TempRemoteDataSource)
class TempRemoteDataSourceImpl implements TempRemoteDataSource {
  TempRemoteDataSourceImpl(this._http);

  final TempHttpHelper _http; // registered infra, not raw Dio in new code

  @override
  Future<TempItemDto> fetchItem(final String itemId) async {
    final Map<String, dynamic> json = await _http.get(
      url: TempApiPaths.item(itemId),
    );
    return TempItemDto.fromJson(json);
  }
}
```

```dart
// temp_repository_impl.dart
@Injectable(as: TempRepository)
class TempRepositoryImpl implements TempRepository {
  const TempRepositoryImpl(this._remote);

  final TempRemoteDataSource _remote;

  @override
  DomainServiceType<TempItemEntity> loadItem(final String itemId) {
    return collectFailure(() async {
      final dto = await _remote.fetchItem(itemId);
      return Right(dto.toEntity());
    });
  }
}
```

See also [`../data/feature-data-layer.md`](../data/feature-data-layer.md).

---

## 4. Domain — use cases

Constructor-inject the repository (or other registered services). No `injector` inside new use cases.

```dart
@injectable
class LoadTempItemUseCase implements IUseCase<TempItemEntity, LoadTempItemParams> {
  LoadTempItemUseCase(this._repository);

  final TempRepository _repository;

  @override
  DomainServiceType<TempItemEntity> call(final LoadTempItemParams params) {
    return _repository.loadItem(params.itemId);
  }
}
```

---

## 5. Presentation — cubit

Prefer **`@Injectable()`** and constructor injection of use cases. Pair with [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md).

```dart
typedef TempItemState = Async<TempItemEntity>;

@Injectable()
class TempItemCubit extends Cubit<TempItemState> with SafeEmitMixin {
  TempItemCubit(this._loadItem) : super(const TempItemState.initial());

  final LoadTempItemUseCase _loadItem;

  Future<void> load(final String itemId) async {
    emit(const TempItemState.loading());
    final result = await _loadItem(LoadTempItemParams(itemId: itemId));
    result.fold(
      (final Failure failure) => emit(TempItemState.failure(failure)),
      (final TempItemEntity item) => emit(TempItemState.success(item)),
    );
  }
}
```

### Screen-specific input — `@factoryParam`

Use for IDs, sealed navigation inputs, or flags that must **not** be singletons in GetIt.

```dart
@Injectable()
class TempItemDetailsCubit extends Cubit<TempItemState> with SafeEmitMixin {
  TempItemDetailsCubit(
    this._loadItem,
    @factoryParam this.itemId,
  ) : super(const TempItemState.initial()) {
    load();
  }

  final LoadTempItemUseCase _loadItem;
  final String itemId;

  Future<void> load() async { /* same fold pattern */ }
}
```

**Page** — resolve in `BlocProvider.create` only (not in `build` on every frame):

```dart
class TempItemDetailsPage extends StatelessWidget {
  const TempItemDetailsPage({required this.itemId, super.key});

  final String itemId;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => injector<TempItemDetailsCubit>(param1: itemId),
      child: const _TempItemDetailsView(),
    );
  }
}
```

Codegen maps `@factoryParam` → `param1`, `param2`, … in order. Do **not** add `factory TempItemDetailsCubit.fromInjector()` helpers.

**Runtime args that belong on `submit`**, not the constructor (e.g. register client vs provider): keep cubit `@Injectable()` with no `@factoryParam`; pass sealed params into the use case from the method.

---

## 6. `@module` — when not to use a plain class

Use a module for:

- Types you do not own (`Dio`, `FlutterSecureStorage`)
- **`Future`** factories (`@preResolve`)
- **Composed** singletons that need several registered deps

```dart
@module
abstract class TempRegisterModule {
  @lazySingleton
  TempSecureStore get secureStore => const TempSecureStore();

  @preResolve
  @lazySingleton
  Future<TempPrefs> get prefs => TempPrefs.getInstance();

  @injectable
  Dio get apiClient => Dio(BaseOptions(baseUrl: 'https://api.example.test'));
}
```

**Feature-scoped module** (e.g. realtime): separate `@module` class in the feature; register coordinator with `@lazySingleton` and inject `Dio` + token use case in a **method** when construction is non-trivial.

```dart
@module
abstract class TempRealtimeModule {
  @lazySingleton
  TempRealtimeConfig get config => const TempRealtimeConfig(url: 'wss://example.test');

  @lazySingleton
  TempRealtimeHub hub(
    TempRealtimeConfig config,
    Dio dio,
    GetTempAuthTokenUseCase getToken,
  ) {
    return TempRealtimeHubFactory.create(config: config, dio: dio, getToken: getToken);
  }
}
```

---

## 7. Long-lived infrastructure

### `DioHelper`-style (`@PostConstruct`)

```dart
@injectable
class TempHttpHelper {
  TempHttpHelper() {
    _wireInterceptors();
  }

  @PostConstruct(preResolve: true)
  Future<TempHttpHelper> create() async {
    return TempHttpHelper();
  }

  final Dio _dio = Dio(/* base options */);

  void _wireInterceptors() { /* … */ }
}
```

Data sources should depend on **`TempHttpHelper`**, not duplicate interceptor stacks on a raw `Dio` from the module unless intentional.

### App-wide locale holder (`@singleton` + `@PostConstruct`)

```dart
@singleton
class TempLocalizationHolder {
  TempLocalizationHolder(this._readLang, this._writeLang);

  final ReadTempLanguageUseCase _readLang;
  final WriteTempLanguageUseCase _writeLang;

  TempLanguage _language = TempLanguage.ar;

  @PostConstruct()
  Future<void> init() async {
    _language = await _readLang();
  }

  // setLocalizer(BuildContext), setLanguage, getters …
}
```

Top-level `appLocalizer` getters may read this holder via `injector<TempLocalizationHolder>()` — that is intentional for context-less code.

### Shared cubit (`@lazySingleton`) — rare

Only when **multiple routes** must share one cubit instance:

```dart
@lazySingleton
class TempGlobalBannerCubit extends Cubit<TempBannerState> {
  TempGlobalBannerCubit(this._fetch) : super(const TempBannerState.initial());

  final FetchTempBannersUseCase _fetch;
}
```

Default for screen state remains **`@Injectable()`** (new instance per `BlocProvider.create`).

---

## 8. Resolving from UI and legacy cubits

| Location | Pattern |
|----------|---------|
| Route / sheet `BlocProvider.create` | `injector<TempXCubit>()` or `injector<TempXCubit>(param1: …)` |
| Widget below provider | `context.read<TempXCubit>()` |
| App shell / flavor root | `MultiBlocProvider` + `injector` in `create` |
| **Avoid** | `injector` inside `build`, field initializers on new cubits |

**Legacy (do not copy for new code):** some cubits resolve a use case with `injector<LoadTempItemsUseCase>()` in a field initializer. New cubits should use constructor injection.

**Optional test override:** constructor with nullable deps defaulting to `injector` only when null — use sparingly.

```dart
@Injectable()
class TempContactCubit extends Cubit<TempContactState> {
  TempContactCubit([SendTempMessageUseCase? send])
      : _send = send ?? injector<SendTempMessageUseCase>(),
        super(const TempContactState.initial());

  final SendTempMessageUseCase _send;
}
```

---

## 9. New feature checklist

1. **Domain** — abstract repository in `domain/`; use cases with `@injectable` / `@Injectable()`.
2. **Data** — abstract + `*Impl` in `datasources/`; `@Injectable(as: …)`; repository impl `@Injectable(as: TempRepository)`.
3. **Presentation** — cubit `@Injectable()`; use cases in constructor; `@factoryParam` only for route args.
4. **Page** — thin `StatelessWidget` + `BlocProvider(create: (_) => injector<…>())` + private `_View` ([`../flutter/page-bloc-provider.md`](../flutter/page-bloc-provider.md)).
5. **Codegen** — run `build_runner`; fix missing imports or wrong `as:` types.
6. **Scope** — if the service must survive logout scope reset, register manually **outside** inner `init` (product decision).

---

## 10. Anti-patterns

| Do not | Do instead |
|--------|------------|
| Call `injector` in `build` | Resolve in `BlocProvider.create` or constructor |
| Register concrete impl without `as:` when callers use abstract type | `@Injectable(as: TempRepository)` |
| Hand-edit `di.config.dart` | Regenerate with build_runner |
| `@lazySingleton` on every cubit | `@Injectable()` per screen unless shared state is required |
| `@factoryParam` for values passed only to `submit` | Params on use case / method |
| Duplicate `Dio` stacks in each data source | Inject shared `TempHttpHelper` or module `Dio` by design |
| `factory X.fromInjector()` on cubit | `injector<X>(param1: …)` at provider site |

---

## Related

- Rules: [`../../rules/core/di.md`](../../rules/core/di.md)
- Data layout: [`../data/feature-data-layer.md`](../data/feature-data-layer.md)
- Cubit + use case: [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md)
- Page shell: [`../flutter/page-bloc-provider.md`](../flutter/page-bloc-provider.md)
- Tooling: [`../../rules/tooling/build-runner.md`](../../rules/tooling/build-runner.md)
