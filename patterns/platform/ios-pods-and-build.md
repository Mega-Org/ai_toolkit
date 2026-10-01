# iOS Pods and Flutter build

## Purpose

iOS-specific build steps that differ from plain `flutter build ios`.

## Fill when

Firebase SPM, minimum iOS version, or Podfile conventions change.

## References

- Makefile: `patch-ios-spm`, flavor targets
- `ios/Podfile`, `ios/Runner.xcworkspace`

## Content

### After `flutter pub get`

Firebase SPM may rewrite `ios/Package.swift` to iOS 13. Restore the minimum iOS version from `ai_docs/conventions.md` (for example iOS 15+):

```bash
make patch-ios-spm
```

Run when iOS build fails on deployment target or after dependency upgrades touching Firebase.

### CocoaPods

Consultant / client flavors use the shared `ios/` tree. When native plugins change:

```bash
cd ios && pod install && cd ..
```

Prefer **`make`** flavor run targets from project docs over ad-hoc `flutter run` when flavors matter.

### Analyzer

iOS build issues do not replace Dart verification — still run the app's command from `ai_docs/conventions.md` (for example `make analyze`) on touched Dart files.
