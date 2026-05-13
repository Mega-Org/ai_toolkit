# New Flutter app setup

## Purpose
Checklist for creating a new Flutter app and aligning it with shared analyzer, DI, and optional flavors conventions.

## Fill when
- After you lock analyzer rules and default packages for greenfield apps.
- When injectable, flavors, or Melos conventions change.

## References
- Optional paths in **your app repos** (not copied here): e.g. `pubspec.yaml`, `analysis_options.yaml`
- This repo’s **implemented** multi-flavor contract (client + provider, Android + iOS): [`flavors.md`](flavors.md) and `.cursor/rules/flutter-flavors.mdc`.

## Content
<!-- Fill in later. Leave empty if unknown. -->

For a second product flavor on top of `AppEnvironmentEnum`, follow the matrix and checklist in [`flavors.md`](flavors.md) instead of re-deriving Gradle/Xcode steps from scratch.
