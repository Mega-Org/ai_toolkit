# Dependency upgrade workflow

## Purpose

Upgrade Flutter/Dart or pub packages with minimal breakage.

## Fill when

Major Flutter SDK or Firebase upgrades.

## References

- iOS SPM patch: [`../../patterns/platform/ios-pods-and-build.md`](../../patterns/platform/ios-pods-and-build.md)
- [`../../setup/melos-monorepo.md`](../../setup/melos-monorepo.md) (skip for a single-app repo; see `ai_docs/conventions.md` when the app differs)

## Content

1. **Plan** — Note packages + whether codegen (`build_runner`) or iOS pods will change.
2. **Pub** — Edit `pubspec.yaml` / run `flutter pub upgrade <pkg>` as team prefers; `flutter pub get`.
3. **iOS** — `make patch-ios-spm` when Firebase/SPM touched; `pod install` under `ios/` if plugins changed.
4. **Codegen** — `dart run build_runner build --delete-conflicting-outputs` when injectable/json targets break.
5. **Verify** — the app's command from `ai_docs/conventions.md` (for example `make analyze`); `flutter test` only if user asked.
6. **Document** — Log breaking API changes in feature specs if behavior shifted.
