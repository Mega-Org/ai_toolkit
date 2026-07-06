# Remote Config store updater module

## Purpose

Pattern for `lib/src/_store_updater/`: Firebase Remote Config–driven **min-version checks** and optional **force-update** dialogs when the installed app is below a configured version.

## Fill when

- Adding force-update to a new app, changing RC keys, or branching between `single_app` and `multi_flavor`.

## References

- Integration workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- Review sibling: [`remote-config-store-review.md`](remote-config-store-review.md)
- RC admin: [`../tooling/rc-admin-panel.md`](../tooling/rc-admin-panel.md)
- App manifest: `ai_docs/integrations/remote-config-store-ops.md`

## File layout

Library + `part` files (models at library root or under `src/` — stay consistent within the module):

```text
lib/src/_store_updater/
  store_updater.dart
  constants/constants.dart
  models/
    config_model.dart       # sealed _PlatformConfig (+ store URLs)
    update_entity.dart
  repositories/store_update_repository.dart
  views/update_dialog.dart
  view_models/update_view_model.dart
```

## RC payload (`UpdateEntity`)

```json
{ "is_enabled": true, "min_version": "1.0.0", "force_update": false }
```

| Field | Type | Meaning |
|-------|------|---------|
| `is_enabled` | `bool` | Master switch |
| `min_version` | `string` | Users below this version are prompted |
| `force_update` | `bool` | Non-dismissible dialog; may trigger cache wipe |

**Update available** when `is_enabled`, `min_version != "0.0.0"`, and installed version `< min_version` (semver compare).

**OFF preset:** `{ "is_enabled": false, "min_version": "0.0.0", "force_update": false }`

## RC keys and store URLs

In `constants/constants.dart`:

```dart
// RC keys — keep in sync with tool/firebase/rc-admin/rc-keys.js (storeUpdater).
```

Also define **store listing URLs** per platform (+ flavor when `multi_flavor`) for the update dialog's "Open store" action. Fill from app config — not the toolkit.

Key count matches store review (2 or 4 keys per manifest).

## `_PlatformConfig`

Same sealed pattern as store review — resolves RC key and store URL.

### `single_app`

Platform branch only → one key per OS.

### `multi_flavor`

Platform + flavor switch → one key per OS × flavor.

## Repository

`_IUpdateRepository` (or named repository class):

- Reads RC JSON for resolved key
- Parses `UpdateEntity`
- Compares `PackageInfo.version` to `min_version` via `pub_semver`
- Exposes `onConfigChanged` stream from `FirebaseRemoteConfig.onConfigUpdated`

## `UpdateViewModel`

Singleton-style bootstrap (not a Cubit):

```dart
static void init() async {
  if (kDebugMode) return; // skip in debug, or remove guard per app policy
  _getInstance.checkUpdate();
  _getInstance._addUpdateListener();
}
```

Call **`UpdateViewModel.init()`** once from shared app bootstrap (e.g. `initialize_app_config`) — **not** per flavor shell, unless flavors use separate Firebase projects (unusual).

Dialog presentation uses `appNavigatorKey.currentContext` and shared `AppRouter` conventions.

On force update, optionally clear cached user data before showing the dialog (app-specific use case).

## App shell wiring

| Component | Where |
|-----------|--------|
| `UpdateViewModel.init()` | Shared bootstrap after Firebase init |
| Update dialog | Shown imperatively by view model — no root `BlocProvider` required |

## Platform notes

- iOS `min_version` may include build suffix in RC (`1.0.3+4`) — repository should compare **version name** consistently with Android.
- Skip updater in debug builds if local iteration should not block on RC (document choice in manifest).

## Do not

- Duplicate RC fetch logic outside the repository.
- Commit store URLs as secrets — they are public listing links.
- Block debug workflows without documenting the guard in the integration manifest.
