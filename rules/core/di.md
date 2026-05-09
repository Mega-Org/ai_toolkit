# Core dependency injection

## Purpose
injectable registration conventions; no direct `getIt` in widgets; bloc/cubit registration patterns.

## Fill when
- When DI registration rules or injectable modules change.

## References
- `flutter_base/lib/core/di/di.dart`, `di.config.dart`, `realtime_dispose_bridge.dart`
- `vorma/lib/core/di/di.dart`

## Content

### Entry points

- **`final injector = GetIt.instance`** — the app-wide accessor (same name in both reference apps).
- **`initializeDependencies()`**: runs **`injector.init()`** from **`@InjectableInit`** (`initializerName: 'init'`, `preferRelativeImports: true`, `asExtension: true`).
- **`configureDependencies()`**: **`await injector.init()`** — called after scope setup where applicable.
- **`resetDependenciesScope()`**: resets GetIt scope and re-runs configuration — flutter_base also invokes **`disposeRealtimeBeforeScopeResetHook`** before reset (assign from **`main`** for realtime teardown).

### Scopes

- **flutter_base**: **`injector.pushNewScope`** with **`init`** that calls **`configureDependencies()`**. **`LocalizationContainer`** is scoped/recreated per scope reset; language is re-read in **`@PostConstruct`** on the container.
- **vorma**: registers **`FlutterSecureStorage`**, **`SharedPreferences`**, **`LocalizationContainer`** manually **before** **`pushNewScope`**, so those singletons **survive** inner scope resets — intentional for language container stability.

When changing scope behavior, document **which types reset** vs survive a scope reset to avoid subtle auth/locale bugs.

### `@module` (`RegisterModule`)

- Third-party or primitive construction: **`FlutterSecureStorage`** (with platform options), **`SharedPreferences`** (`@preResolve` + `@lazySingleton` in flutter_base), **`Dio`** options.
- vorma adds **`CancelToken`** as **`@injectable`**.

### Rules for widgets and UI

- **Do not call `GetIt.instance` or `injector` directly in StatelessWidget build methods** for routine dependencies — prefer **`context.read<T>()`** / **`BlocProvider`** / constructor injection.
- **Acceptable `injector` usage in core**: **blocs/cubits** registered as lazy singletons resolving use cases (e.g. **`AppAuthenticationBloc`**, **`AppLanguageCubit`**) — this is the established pattern in the reference apps.

### Injectable annotations

- **`@injectable`**: default transient/factory per injectable config.
- **`@singleton` / `@lazySingleton`**: long-lived services (**`DioHelper`**, **`LocalizationContainer`** in flutter_base).
- **`@PostConstruct`**: async init after construction (e.g. **`DioHelper.create`**, **`LocalizationContainer.init`**).

### Code generation

- After changing registrations: run **`dart run build_runner build`** (or project alias). **Never hand-edit** `di.config.dart`.
