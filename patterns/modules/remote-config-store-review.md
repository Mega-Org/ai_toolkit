# Remote Config store review module

## Purpose

Pattern for `lib/src/_store_review/`: a Firebase Remote Config–driven **store review mode** that hides or replaces sensitive UI while a specific app **version name** is under App Store / Play Store review.

## Fill when

- Adding store review to a new app, changing RC keys, or branching between `single_app` and `multi_flavor`.

## References

- Integration workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- Updater sibling: [`remote-config-store-updater.md`](remote-config-store-updater.md)
- RC admin: [`../tooling/rc-admin-panel.md`](../tooling/rc-admin-panel.md)
- App manifest: `ai_docs/integrations/remote-config-store-ops.md`

## File layout

Use a **library root** + `part` files. Prefer a `src/` subtree for constants and models (single tree — no duplicate `models/` at library root).

```text
lib/src/_store_review/
  store_review.dart              # library; all package: imports
  src/
    store_review_manager.dart    # part — Cubit
    store_review_builder.dart    # part — conditional widget
    constants/constants.dart     # part — RC key names
    models/
      config_model.dart          # part — sealed _PlatformConfig
      review_entity.dart         # part — JSON entity
```

```dart
// store_review.dart (library)
import 'package:firebase_remote_config/firebase_remote_config.dart';
// … host app imports (environment, core, equatable, etc.)

part 'src/constants/constants.dart';
part 'src/models/config_model.dart';
part 'src/models/review_entity.dart';
part 'src/store_review_manager.dart';
part 'src/store_review_builder.dart';
```

Part files use `part of '../store_review.dart';` or `part of '../../store_review.dart';` (relative — never `package:` in `part of`).

## RC payload (`ReviewEntity`)

Firebase parameter value is **JSON**:

```json
{ "is_enabled": true, "review_version": "1.0.0" }
```

| Field | Type | Meaning |
|-------|------|---------|
| `is_enabled` | `bool` | Master switch for review mode |
| `review_version` | `string` | Semver **name only** (`major.minor.patch`) — compared to `PackageInfo.version` |

**Review mode is active** when `is_enabled == true` **and** `review_version == PackageInfo.version` (parsed with `pub_semver`).

**OFF preset:** `{ "is_enabled": false, "review_version": "0.0.0" }`

## RC keys (`_Constants`)

Define key name constants in `src/constants/constants.dart`. Add a sync comment:

```dart
// RC keys — keep in sync with tool/firebase/rc-admin/rc-keys.js (storeReview).
```

Key count follows `deployment_mode` in the integration manifest:

| Mode | Keys |
|------|------|
| `single_app` | 2 (android, ios) |
| `multi_flavor` | 4 (2 flavors × 2 platforms) |

Key **names** are app-specific — fill from the manifest, not from this doc.

## `_PlatformConfig` — key resolution

Sealed hierarchy picks **one** RC key at runtime.

### `single_app`

Branch on `Platform` only:

```dart
sealed class _PlatformConfig extends Equatable {
  abstract final String remoteConfigKey;

  factory _PlatformConfig.fromPlatform() {
    return Platform.isAndroid
        ? const _AndroidConfig()
        : const _IosConfig();
  }
}

class _AndroidConfig extends _PlatformConfig {
  const _AndroidConfig();
  @override
  String get remoteConfigKey => _Constants.remoteConfigKeyAndroid;
}

class _IosConfig extends _PlatformConfig {
  const _IosConfig();
  @override
  String get remoteConfigKey => _Constants.remoteConfigKeyIOS;
}
```

### `multi_flavor`

Add flavor dimension via the app's environment getter (e.g. `getAppEnvironment`):

```dart
factory _AndroidConfig.getEnv() {
  switch (getAppEnvironment) {
    case AppEnvironmentEnum.flavorA:
      return const _FlavorAAndroidConfig();
    case AppEnvironmentEnum.flavorB:
      return const _FlavorBAndroidConfig();
  }
}
```

Mirror for iOS. Each leaf config returns the correct `_Constants.remoteConfigKey*`.

## `StoreReviewManager`

- Extends `Cubit<Async<bool>>` where `true` = **under review**.
- Constructor calls `_init()`: `fetchAndActivate`, read RC JSON, emit result.
- Debounce RC updates (~1s) when `onConfigUpdated` fires for this key.
- Fail closed for UI: until success, treat as under review (`state.data ?? true`).

Register at app root:

```dart
BlocProvider(
  create: (_) => StoreReviewManager(),
  lazy: false,
)
```

**`multi_flavor`:** one provider per `_<flavor>_app.dart` shell.

## `StoreReviewBuilder`

Wraps widgets that must hide during review:

```dart
StoreReviewBuilder(
  child: SensitiveFeatureButton(...),
  // optional: reviewWidget, builder
)
```

Imperative check: `StoreReviewBuilder.isUnderReview(context)`.

## Semver rules

- Compare **`PackageInfo.version`** (name) — not build number (`1.0.0+42` → use `1.0.0`).
- RC admin validates the same shape (see `version-validate.js` in rc-admin template).

## Do not

- Hardcode app or flavor names in toolkit prose — use the integration manifest.
- Store RC keys in multiple Dart files without a single constants part.
- Use loose top-level Firebase parameters when the admin tool manages groups (see tooling pattern).
