# Flutter flavors setup template

## Purpose

Reusable AI toolkit template for documenting Flutter product flavors: flavor names, app IDs, display names, native config locations, and the mechanical steps to reproduce or extend a setup.

Keep real app bundle IDs, display labels, Firebase project files, and customer-specific naming in the app repository's `ai_docs/`, onboarding docs, or an app-local copy of this file. This shared toolkit file should stay generic.

## Flavor matrix

Copy this table into app-local docs and replace every placeholder:

| Flavor | `AppEnvironmentEnum` | Android `applicationId` | iOS bundle id | Home screen label | Dart entrypoint | App shell | Firebase (Dart) | Android native Firebase | iOS native Firebase | iOS AppIcon set | iOS launch storyboard key |
|--------|----------------------|-------------------------|---------------|-------------------|-----------------|-----------|-----------------|-------------------------|---------------------|-----------------|---------------------------|
| `<flavor_a>` | `<flavorA>` | `<base.package>.<flavor_a>` | `<base.bundle>.<flavor_a>` | `<Display Name A>` | `lib/main_<flavor_a>.dart` | `lib/apps/_<flavor_a>_app.dart` | `lib/src/firebase_options_<flavor_a>.dart` | `android/app/src/<flavor_a>/google-services.json` | `ios/config/<flavor_a>/GoogleService-Info.plist` | `AppIcon-<FlavorA>` | `LaunchScreen<FlavorA>` |
| `<flavor_b>` | `<flavorB>` | `<base.package>.<flavor_b>` | `<base.bundle>.<flavor_b>` | `<Display Name B>` | `lib/main_<flavor_b>.dart` | `lib/apps/_<flavor_b>_app.dart` | `lib/src/firebase_options_<flavor_b>.dart` | `android/app/src/<flavor_b>/google-services.json` | `ios/config/<flavor_b>/GoogleService-Info.plist` | `AppIcon-<FlavorB>` | `LaunchScreen<FlavorB>` |

**Gradle:** use a single flavor dimension such as `flavorDimensions += "app"`. Product flavor names must match CLI flavor names, Android source sets, Dart entrypoints, Firebase option suffixes, and Makefile targets.

**Kotlin namespace** (Java/Kotlin package for `MainActivity`) stays separate from the install id; only `applicationId` / bundle IDs change per flavor.

## Per-flavor Dart layout (home)

Under `lib/src/features/<flavor>/main_page/` every type and file is flavor-prefixed:

- `<flavor>_main_page.dart` → `<Flavor>MainPage`
- `models/<flavor>_main_page_tabs_enum.dart` → `<Flavor>MainPageTabsEnum`
- `observer/<flavor>_main_page_observer.dart` (+ updater / mixin parts)
- `widgets/<flavor>_bottom_navigation_bar.dart`, `<flavor>_bottom_nav_bg_painter.dart`

Mirror the same naming for every flavor. **Do not** introduce a shared `MainPage` base across flavors when the app rule requires each flavor to own its shell.

## Android (Gradle Kotlin DSL)

`android/app/build.gradle.kts` — `defaultConfig` + flavors template:

```kotlin
defaultConfig {
    applicationId = "<base.package>"
    // minSdk / targetSdk / versionCode / versionName from Flutter
}

flavorDimensions += "app"
productFlavors {
    create("<flavor_a>") {
        dimension = "app"
        applicationIdSuffix = ".<flavor_a>"
        resValue("string", "app_name", "<Display Name A>")
    }
    create("<flavor_b>") {
        dimension = "app"
        applicationIdSuffix = ".<flavor_b>"
        resValue("string", "app_name", "<Display Name B>")
    }
}
```

- `android/app/src/main/AndroidManifest.xml` should use `android:label="@string/app_name"` (values come from `resValue` above per flavor).
- `afterEvaluate` / `FlutterTask`: map Gradle `flavor` to `lib/main_<flavor>.dart` so CLI and IDE builds stay aligned.

**Google Services plugin**

- `android/settings.gradle.kts` — in `plugins { }`: `id("com.google.gms.google-services") version "4.4.2" apply false`
- `android/app/build.gradle.kts` — in `plugins { }`: `id("com.google.gms.google-services")`

## iOS (xcconfig, schemes, plist copy)

**`ios/Flutter/<FlavorA>.xcconfig`**

```xcconfig
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = <base.bundle>.<flavor_a>
BUNDLE_DISPLAY_NAME = <Display Name A>
FLUTTER_TARGET = lib/main_<flavor_a>.dart
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon-<FlavorA>
FLAVOR = <flavor_a>
LAUNCH_SCREEN_STORYBOARD = LaunchScreen<FlavorA>
```

**`ios/Flutter/<FlavorB>.xcconfig`**

```xcconfig
#include "Generated.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = <base.bundle>.<flavor_b>
BUNDLE_DISPLAY_NAME = <Display Name B>
FLUTTER_TARGET = lib/main_<flavor_b>.dart
ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon-<FlavorB>
FLAVOR = <flavor_b>
LAUNCH_SCREEN_STORYBOARD = LaunchScreen<FlavorB>
```

**Xcode project**

- Duplicate `Debug` / `Release` / `Profile` into `Debug-<Flavor>`, `Release-<Flavor>`, `Profile-<Flavor>` for every flavor, with each base config pointing at that flavor's xcconfig.
- Shared schemes: `ios/Runner.xcodeproj/xcshareddata/xcschemes/<flavor>.xcscheme`, each binding Run/Test/Profile/Archive to the matching `*-<Flavor>` configurations.
- `RunnerTests` stays on a flavor-aligned configuration so `flutter test` keeps working.

**`ios/Runner/Info.plist`**

- `CFBundleDisplayName` → `$(BUNDLE_DISPLAY_NAME)` (per-flavor from xcconfig).

**Run Script (copy Firebase plist into the app bundle)**

```bash
cp -v "${SRCROOT}/config/${FLAVOR}/GoogleService-Info.plist" \
      "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
```

Do **not** also list `GoogleService-Info.plist` under **Copy Bundle Resources** for `Runner` — Xcode would emit “Multiple commands produce … GoogleService-Info.plist”.

**Folders:** `ios/config/<flavor>/` — each holds that flavor's `GoogleService-Info.plist`.

## Launcher icons and splash

- Config files: `flutter_launcher_icons-<flavor>.yaml` (with `android_flavor`, `ios_app_icon_name` matching the table above).
- Regenerate: `make icons-<flavor>` (or the app's documented wrapper).
- Native splash: `make splash-<flavor>` when available, or the app's documented wrapper around `flutter_native_splash`.
- After regen, confirm `git status` only touches expected asset / `android/app/src/<flavor>/res/` paths.

## Firebase (Dart + native)

1. Install / use `flutterfire_cli`; `firebase login` as needed.
2. For each Firebase app (matching bundle / package id), run `flutterfire configure` with `--out=lib/src/firebase_options_<flavor>.dart`.
3. Move generated **default-location** native files away from `android/app/google-services.json` and `ios/Runner/GoogleService-Info.plist` into the flavor paths in the matrix above. Do not commit the default paths.

## Commands (Makefile)

From repo root, prefer the app's `Makefile` targets over open-coded `flutter run` / `flutter build` commands:

- `make <flavor> run` — debug run with correct `-t`, `--flavor`, and `APP_FLAVOR`.
- `make <flavor> apk` / `make <flavor> aab` / `make <flavor> ipa` — release builds.
- Hyphenated equivalents when the app supports them: `make <flavor>-apk`, `make <flavor>-run`, etc.
- `make get`, `make clean`, `make analyze`, `make format`, `make test`, `make icons-*`, `make splash-*`.

Shell alias templates for the same flutter invocations: `ai_toolkit/alias/flutter.md`.

## Verification checklist

- [ ] `flutter clean && flutter pub get`
- [ ] Android: install **all** flavors on one device/emulator — distinct launcher entries, labels, icons, and package IDs.
- [ ] Android: cold start shows correct splash per flavor; signed-in flow lands on the correct `<Flavor>MainPage` as designed.
- [ ] iOS: build/run every flavor scheme; General tab shows correct bundle ID; home screen labels and icons differ.
- [ ] `flutter analyze` and `flutter test` pass.

## Add a new flavor in N steps

1. `AppEnvironmentEnum` + any API/env wiring that keys off flavor name.
2. `lib/main_<flavor>.dart` + `lib/src/firebase_options_<flavor>.dart` (after `flutterfire configure`).
3. `lib/apps/_<flavor>_app.dart` + full `lib/src/features/<flavor>/main_page/` tree (prefixed symbols only).
4. Android `productFlavors` + `src/<flavor>/` + `google-services.json`.
5. iOS `<Flavor>.xcconfig`, six-way (or 3×N) Xcode configurations, shared scheme, `AppIcon-<Flavor>`, storyboard name, Run Script plist copy, `ios/config/<flavor>/`.
6. `flutter_launcher_icons-<flavor>.yaml` + splash YAML; regenerate.
7. Root `Makefile` `FLAVORS` list + the app-local flavor matrix row.
8. `.vscode/launch.json` debug/profile/release triple for the new flavor.
