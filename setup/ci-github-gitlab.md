# CI: GitHub and GitLab

## Purpose

Optional recipes and conventions for CI pipelines (analyze, test, build) for Flutter apps that follow this toolkit.

## Fill when

- When you standardize CI across repositories or change runner images and caches.

## References

- App repo: `.gitlab-ci.yml` (GitLab) or `.github/workflows/*.yml` (GitHub)
- Local verification: [`workflows/feature-delivery/verify-and-pr.md`](../workflows/feature-delivery/verify-and-pr.md) (when filled)
- Dart analysis rules: [`rules/dart/_index.md`](../rules/dart/_index.md)

---

## GitLab (this repository)

### What you need on GitLab

1. **Project** with your code pushed and **Settings → CI/CD** available.
2. **Runners**: either GitLab.com **instance shared runners** (usually on by default) or your own [registered runners](https://docs.gitlab.com/runner/) if your group disables shared runners.
3. **No secrets** for a minimal pipeline that only runs `dart analyze` and `flutter test`. Add **CI/CD variables** only when you add jobs that sign builds, talk to Firebase, or use private packages (SSH keys, tokens, `GOOGLE_APPLICATION_CREDENTIALS`, etc.).
4. **Optional**: [merge request pipelines](https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html) and [rules](https://docs.gitlab.com/ee/ci/yaml/#rules) to skip jobs on draft MRs or certain paths.

### What the toolkit expects from CI

Align automation with how agents and humans verify work:

| Gate | Command | Notes |
|------|---------|--------|
| Static analysis | `dart analyze` (or `flutter analyze`) | Uses `analysis_options.yaml` at repo root. |
| Tests | `flutter test` | Matches [`rules/testing/_index.md`](../rules/testing/_index.md) expectations. |
| Format (optional) | `dart format --output=none --set-exit-if-changed .` | Fails CI if code is not formatted; enable if the team wants format enforcement. |

Melos monorepos: see [`melos-monorepo.md`](melos-monorepo.md) and run `melos bootstrap` / scoped analyze-test commands instead of a single package root.

### Image and Flutter version

The sample `.gitlab-ci.yml` in the app repo uses a public Flutter image (e.g. `cirruslabs/flutter`). Pin the **image tag** (e.g. `3.27.x` or `stable`) so CI matches the **SDK constraint** in `pubspec.yaml` (`environment.sdk`). Upgrade the image when you bump the SDK.

### Caching

Cache Pub (`~/.pub-cache`) and optionally Flutter pub get artifacts to speed up pipelines; tune `key` branches vs merge requests per GitLab docs.

### Build jobs (optional)

Add Android/iOS/web build stages only when you need artifacts in CI; they need longer runner time and often **variables** (signing, stores). Keep analyze + test as the default merge gates.

---

## GitHub Actions

Mirror the same gates: checkout, setup Flutter (e.g. `subosito/flutter-action` or a container), `flutter pub get`, `dart analyze`, `flutter test`. Store secrets in repository **Actions secrets** when builds need them.

## Content

<!-- Repo-specific overrides (runner tags, protected branches, signing) can be noted here or in ai_docs/ when present. -->
