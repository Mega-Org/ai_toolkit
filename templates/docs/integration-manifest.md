# Integration manifest template

Copy to **`ai_docs/integrations/remote-config-store-ops.md`** in each app repo. This file is the **source of truth** after Phase 0 analysis of [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md).

## Manifest

```markdown
# Remote Config store-ops integration

**Status:** draft | in-progress | complete  
**Last analyzed:** YYYY-MM-DD

## Deployment

| Field | Value |
|-------|--------|
| `deployment_mode` | `single_app` \| `multi_flavor` |
| `platforms` | `android`, `ios` |
| `flavors` | e.g. `app` or `user`, `security` |
| RC key count | 4 (single_app) or 4 × flavors (multi_flavor) |

## Firebase

| Field | Value |
|-------|--------|
| Project ID | `{{FIREBASE_PROJECT_ID}}` |
| Parameter groups | Store Review, Store Updater |

## Bootstrap

| Field | Value |
|-------|--------|
| Entrypoint(s) | e.g. `lib/main.dart` or `lib/main_user.dart`, `lib/main_security.dart` |
| App shell(s) | e.g. `lib/apps/_user_app.dart` |
| Shared bootstrap | e.g. `lib/config/initialize_app_config.dart` |
| `UpdateViewModel.init()` | Called from shared bootstrap after Firebase init |
| `StoreReviewManager` | `BlocProvider` in root app / each flavor shell |

## RC keys — Store Review

| Flavor | Android | iOS |
|--------|---------|-----|
| _(fill)_ | | |

## RC keys — Store Updater

| Flavor | Android | iOS |
|--------|---------|-----|
| _(fill)_ | | |

## Dart modules

| Module | Path |
|--------|------|
| Store review | `lib/src/_store_review/` |
| Store updater | `lib/src/_store_updater/` |

## Tooling

| Tool | Path |
|------|------|
| RC admin | `tool/firebase/rc-admin/` |
| Makefile | `make rc-admin`, `make rc-admin-install` |

## Wiring notes

- _(App-specific: which UI is wrapped in StoreReviewBuilder, debug skips, store URLs, etc.)_

## Verification

- [ ] `dart analyze` clean
- [ ] RC admin loads all keys
- [ ] Review ON/OFF on one build (per flavor if multi_flavor)
- [ ] Force-update dialog when below min_version
```

## References

- Spec template: [`../specs/integration-remote-config-store-ops.md`](../specs/integration-remote-config-store-ops.md)
- Checklist: [`../../reference/checklist-remote-config-store-ops.md`](../../reference/checklist-remote-config-store-ops.md)
