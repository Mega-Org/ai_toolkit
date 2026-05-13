# Flutter flavors setup (Tariq Alsamo)

## Purpose

Canonical reference for the **client** and **provider** product flavors: IDs, display names, native config locations, and the mechanical steps to reproduce or extend the setup. Pair with the enforceable rule `.cursor/rules/flutter-flavors.mdc`.

## Flavor matrix

| Flavor | `AppEnvironmentEnum` | Android `applicationId` | iOS bundle id | Home screen label | Dart entrypoint | App shell | Firebase (Dart) | Android native Firebase | iOS native Firebase | iOS AppIcon set | iOS launch storyboard key |
|--------|----------------------|-------------------------|---------------|-------------------|-----------------|-----------|-----------------|-------------------------|---------------------|-----------------|---------------------------|
| `client` | `client` | `com.tariqalsamo.client` | `com.tariqalsamo.client` | Tariq Alsamo | `lib/main_client.dart` | `lib/apps/_client_app.dart` | `lib/src/firebase_options_client.dart` | `android/app/src/client/google-services.json` | `ios/config/client/GoogleService-Info.plist` | `AppIcon-Client` | `LaunchScreenClient` |
| `provider` | `provider` | `com.tariqalsamo.provider` | `com.tariqalsamo.provider` | Provider | `lib/main_provider.dart` | `lib/apps/_provider_app.dart` | `lib/src/firebase_options_provider.dart` | `android/app/src/provider/google-services.json` | `ios/config/provider/GoogleService-Info.plist` | `AppIcon-Provider` | `LaunchScreenProvider` |

**Gradle:** `flavorDimensions += "tariqalsamo"`; product flavor names are exactly `client` and `provider` (used with `flutter run --flavor …` and Android source sets).

**Kotlin namespace** (Java/Kotlin package for `MainActivity`) stays `com.mega.base.flutter_base`; only `applicationId` / bundle ids change per flavor.

## Per-flavor Dart layout (home)

Under `lib/src/features/<flavor>/main_page/` every type and file is flavor-prefixed, for example for `client`:

- `client_main_page.dart` → `ClientMainPage`
- `models/client_main_page_tabs_enum.dart` → `ClientMainPageTabsEnum`
- `observer/client_main_page_observer.dart` (+ updater / mixin parts)
- `widgets/client_bottom_navigation_bar.dart`, `client_bottom_nav_bg_painter.dart`

Mirror the same naming for `provider` (`ProviderMainPage`, …). **Do not** introduce a shared `MainPage` base across flavors.

## Android (Gradle Kotlin DSL)

`android/app/build.gradle.kts` — `defaultConfig` + flavors (excerpt):

```kotlin
defaultConfig {
    applicationId = "com.tariqalsamo"
    // minSdk / targetSdk / versionCode / versionName from Flutter
}

flavorDimensions += "tariqalsamo"
productFlavors {
    create("client") {
        dimension = "tariqalsamo"
        applicationIdSuffix = ".client"
        resValue("string", "app_name", "Tariq Alsamo")
    }
    create("provider") {
        dimension = "tariqalsamo"
        applicationIdSuffix = ".provider"
        resValue("string", "app_name", "Provider")
    }
}
```

- `android/app/src/main/AndroidManifest.xml` should use `android:label="@string/app_name"` (values come from `resValue` above per flavor).
- `afterEvaluate` / `FlutterTask`: map Gradle `flavor` to `lib/main_client.dart` vs `lib/main_provider.dart` so CLI and IDE builds stay aligned.

**Google Services plugin**

- `android/settings.gradle.kts` — in `plugins { }`: `id("com.google.gms.google-services") version "4.4.2" apply false`
- `android/app/build.gradle.kts` — in `plugins { }`: `id("com.google.gms.google-services")`

## iOS (xcconfig, schemes, plist copy)

**`ios/Flutter/Client.xcconfig`**

```xcconfig
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = com.tariqalsamo.client
BUNDLE_DISPLAY_NAME = Tariq Alsamo
FLUTTER_TARGET = lib/main_client.dart
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon-Client
FLAVOR = client
INFOPLIST_KEY_UILaunchStoryboardName = LaunchScreenClient
```

**`ios/Flutter/Provider.xcconfig`**

```xcconfig
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = com.tariqalsamo.provider
BUNDLE_DISPLAY_NAME = Provider
FLUTTER_TARGET = lib/main_provider.dart
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon-Provider
FLAVOR = provider
INFOPLIST_KEY_UILaunchStoryboardName = LaunchScreenProvider
```

**Xcode project**

- Duplicate `Debug` / `Release` / `Profile` into `Debug-client`, `Release-client`, `Profile-client` (base config → `Client.xcconfig`) and `Debug-provider`, … (→ `Provider.xcconfig`).
- Shared schemes: `ios/Runner.xcodeproj/xcshareddata/xcschemes/client.xcscheme` and `provider.xcscheme`, each binding Run/Test/Profile/Archive to the matching `*-client` / `*-provider` configurations.
- `RunnerTests` stays on a flavor-aligned configuration so `flutter test` keeps working.

**`ios/Runner/Info.plist`**

- `CFBundleDisplayName` → `$(BUNDLE_DISPLAY_NAME)` (per-flavor from xcconfig).

**Run Script (copy Firebase plist into the app bundle)**

```bash
cp -v "${SRCROOT}/config/${FLAVOR}/GoogleService-Info.plist" \
      "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
```

Do **not** also list `GoogleService-Info.plist` under **Copy Bundle Resources** for `Runner` — Xcode would emit “Multiple commands produce … GoogleService-Info.plist”.

**Folders:** `ios/config/client/`, `ios/config/provider/` — each holds that flavor’s `GoogleService-Info.plist`.

## Launcher icons and splash

- Config files: `flutter_launcher_icons-client.yaml`, `flutter_launcher_icons-provider.yaml` (with `android_flavor`, `ios_app_icon_name` matching the table above).
- Regenerate: `make icons-client` / `make icons-provider` (or `flutter pub run flutter_launcher_icons -f …`).
- Native splash: `dart run flutter_native_splash:create --flavor client` (and `provider`), or `make splash-client` / `make splash-provider`.
- After regen, confirm `git status` only touches expected asset / `android/app/src/<flavor>/res/` paths.

## Firebase (Dart + native)

1. Install / use `flutterfire_cli`; `firebase login` as needed.
2. For each Firebase app (matching bundle / package id), run `flutterfire configure` with `--out=lib/src/firebase_options_<flavor>.dart`.
3. Move generated **default-location** native files away from `android/app/google-services.json` and `ios/Runner/GoogleService-Info.plist` into the flavor paths in the matrix above. Do not commit the default paths.

## Commands (Makefile)

From repo root:

- `make client run` / `make provider run` — debug run with correct `-t` and `--flavor`.
- `make client apk` / `make provider aab` / `make client ipa` — release builds.
- Hyphenated equivalents: `make client-apk`, `make provider-run`, etc.
- `make get`, `make clean`, `make analyze`, `make format`, `make test`, `make icons-*`, `make splash-*`.

Shell aliases for the same flutter invocations: `ai_toolkit/alias/flutter.md` (`fr-client`, `fb-provider`, …).

## Verification checklist

- [ ] `flutter clean && flutter pub get`
- [ ] Android: install **both** flavors on one device/emulator — two launcher entries, distinct labels and icons, ids `com.tariqalsamo.client` / `com.tariqalsamo.provider`.
- [ ] Android: cold start shows correct splash per flavor; signed-in flow lands on `ClientMainPage` vs `ProviderMainPage` as designed.
- [ ] iOS: build/run via `client` and `provider` schemes; General tab shows correct bundle id; home screen labels and icons differ.
- [ ] `flutter analyze` and `flutter test` pass.

## Add a new flavor in N steps

1. `AppEnvironmentEnum` + any API/env wiring that keys off flavor name.
2. `lib/main_<flavor>.dart` + `lib/src/firebase_options_<flavor>.dart` (after `flutterfire configure`).
3. `lib/apps/_<flavor>_app.dart` + full `lib/src/features/<flavor>/main_page/` tree (prefixed symbols only).
4. Android `productFlavors` + `src/<flavor>/` + `google-services.json`.
5. iOS `<Flavor>.xcconfig`, six-way (or 3×N) Xcode configurations, shared scheme, `AppIcon-<Flavor>`, storyboard name, Run Script plist copy, `ios/config/<flavor>/`.
6. `flutter_launcher_icons-<flavor>.yaml` + splash YAML; regenerate.
7. Root `Makefile` `FLAVORS` list + this doc’s matrix row.
8. `.vscode/launch.json` debug/profile/release triple for the new flavor.
