# Flutter shell aliases template

## Purpose
Document reusable shell aliases and shortcuts for Flutter, `build_runner`, `flutter_gen`, and iOS CocoaPods workflows shared across projects.

This file is a generic AI toolkit template. Keep project-specific flavor names, bundle IDs, app titles, and Firebase paths in the app repository docs or Makefile, not in this shared alias reference.

## Fill when
- When you add, rename, or remove aliases or change pod / build_runner habits.

## References
- `alias/_index.md`
- `rules/tooling/build-runner.md`
- `patterns/platform/ios-pods-and-build.md`

## Content

## Aliases

These aliases are safe defaults to copy into a shell profile or app-local setup doc when they match the project:

```bash
# Flutter core
alias fclean="flutter clean"
alias fpg="flutter pub get"
alias fpu="flutter pub upgrade"
alias fr="flutter run"
alias fb="flutter build apk --release"
alias fbi="flutter build ios --release"

# Flutter clean + pub get combo (most common reset)
alias fcpg="fclean && fpg"

# build_runner (you use json_serializable + injectable)
alias brb="dart run build_runner build --delete-conflicting-outputs"
alias brw="dart run build_runner watch --delete-conflicting-outputs"

# Shortcut combos
alias fpgbrb="fpg && brb"
alias fpgbrw="fpg && brw"
alias fcpgbrb="fclean && fpg && brb"

# flutter_gen
alias fgen="dart run flutter_gen:generate"
alias fpggen="fpg && fgen"

# iOS pod workflow
alias cdios="cd ios"
alias delpodlock="rm -f ios/Podfile.lock"
alias podupdate="cd ios && pod update && cd .."

# Full iOS clean & reinstall (run from project root)
alias iosclean="fclean && fpg && delpodlock && cd ios && pod update && cd .."

# Per-flavor aliases are app-specific.
# Prefer the repo Makefile (`make <flavor> run`, `make <flavor>-apk`, …) when it exists.
# If an app does not have Makefile targets yet, add them first, then document any aliases there.
```

Note: assume `brw` is automatically running when working on a Flutter
project that uses build_runner.

Note: always use `--delete-conflicting-outputs` with build_runner,
never without it.

Note: for iOS pod issues always run `iosclean` from the project root,
never delete Podfile.lock manually without also running pod update after.

## Flavor alias template

Use this only in app-local documentation after replacing every placeholder and confirming there is no Makefile target that should be used instead:

```bash
alias fr-<flavor>="flutter run --flavor <flavor> -t lib/main_<flavor>.dart --dart-define=APP_FLAVOR=<flavor>"
alias fb-<flavor>="flutter build apk --release --flavor <flavor> -t lib/main_<flavor>.dart --dart-define=APP_FLAVOR=<flavor>"
alias fbi-<flavor>="flutter build ipa --release --flavor <flavor> -t lib/main_<flavor>.dart --dart-define=APP_FLAVOR=<flavor>"
```

For shared toolkit docs, describe the command shape only. App-specific aliases belong beside the app's `Makefile`, `ai_docs/`, or onboarding docs.
