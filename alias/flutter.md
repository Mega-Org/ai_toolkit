# Flutter shell aliases

## Purpose
Document shell aliases and shortcuts for Flutter, `build_runner`, `flutter_gen`, and iOS CocoaPods workflows shared across projects.

## Fill when
- When you add, rename, or remove aliases or change pod / build_runner habits.

## References
- `alias/_index.md`
- `rules/tooling/build-runner.md`
- `patterns/platform/ios-pods-and-build.md`

## Content

## Aliases

These aliases are already configured and can be used as needed:

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

# Per-flavor run / build (Tariq Alsamo — client + provider)
# Prefer the repo Makefile (`make client run`, `make provider-apk`, …) when scripting.
alias fr-client="flutter run --flavor client -t lib/main_client.dart"
alias fr-provider="flutter run --flavor provider -t lib/main_provider.dart"
alias fb-client="flutter build apk --release --flavor client -t lib/main_client.dart"
alias fb-provider="flutter build apk --release --flavor provider -t lib/main_provider.dart"
alias fbi-client="flutter build ipa --release --flavor client -t lib/main_client.dart"
alias fbi-provider="flutter build ipa --release --flavor provider -t lib/main_provider.dart"
```

Note: assume `brw` is automatically running when working on a Flutter
project that uses build_runner.

Note: always use `--delete-conflicting-outputs` with build_runner,
never without it.

Note: for iOS pod issues always run `iosclean` from the project root,
never delete Podfile.lock manually without also running pod update after.
