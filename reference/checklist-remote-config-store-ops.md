# Remote Config store-ops checklist

Quick verification after integrating or changing store review, store updater, or RC admin. Key count and names come from **`ai_docs/integrations/remote-config-store-ops.md`**.

## Analysis and manifest

- [ ] Phase 0 complete; `deployment_mode` recorded (`single_app` | `multi_flavor`)
- [ ] Integration manifest lists all RC keys, Firebase project id, bootstrap paths
- [ ] Key count matches mode: **4** (single_app) or **4 × flavors** (multi_flavor)

## Dart modules

- [ ] `lib/src/_store_review/` — library + parts; single `src/` tree for constants/models
- [ ] `lib/src/_store_updater/` — library + parts; repository + dialog + view model
- [ ] `_PlatformConfig` branches match manifest (platform-only vs platform+flavor)
- [ ] RC key constants sync comment ↔ `tool/firebase/rc-admin/rc-keys.js`
- [ ] `package:` imports use host app package name
- [ ] Required pub deps present

## App shell

- [ ] `BlocProvider(StoreReviewManager, lazy: false)` in root app or **each** flavor shell
- [ ] `UpdateViewModel.init()` in shared bootstrap after Firebase
- [ ] Sensitive UI wrapped with `StoreReviewBuilder` (or documented exceptions)

## RC admin tool

- [ ] `tool/firebase/rc-admin/` present; `rc-keys.js` `FLAVORS` and `KEY_MAP` match manifest
- [ ] `rc-groups.js` and `public/shared.js` KEY_MAP aligned
- [ ] `.env` configured; service account **outside** repo
- [ ] `make rc-admin-install` succeeds
- [ ] Panel opens at `http://127.0.0.1:<PORT>`
- [ ] Flavor selector hidden when `FLAVORS.length === 1`

## Firebase Console

- [ ] Two parameter groups: **Store Review**, **Store Updater**
- [ ] All N keys published with **JSON** value type
- [ ] No managed keys left as loose top-level parameters (run sync-groups if needed)

## Functional smoke tests

- [ ] **Review OFF** — wrapped UI visible on target build
- [ ] **Review ON** (pubspec version) — wrapped UI hidden on target build
- [ ] **Update OFF** — no dialog when on current version
- [ ] **Update ON** (min above installed) — dialog appears; force-update blocks dismiss when enabled
- [ ] Repeat per flavor if `multi_flavor`

## Static analysis

- [ ] `dart analyze` (or `make analyze`) — no new errors in `_store_review` / `_store_updater`

## Security

- [ ] `.env`, service account JSON, `node_modules/` not committed
- [ ] Server binds `127.0.0.1` only

## References

- Workflow: [`../workflows/integration/remote-config-store-ops.md`](../workflows/integration/remote-config-store-ops.md)
- Setup: [`../setup/remote-config-store-ops.md`](../setup/remote-config-store-ops.md)
