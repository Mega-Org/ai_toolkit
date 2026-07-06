# RC admin panel (local tooling)

## Purpose

Pattern for `tool/firebase/rc-admin/`: a **local-only** Node/Express admin UI that loads and publishes Firebase Remote Config JSON for store review and store updater parameters. Binds to **127.0.0.1**; not for production hosting.

## Fill when

- Scaffolding rc-admin in a new app, changing flavor matrix, or syncing template drift.

## References

- Integration workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- Dart modules: [`../modules/remote-config-store-review.md`](../modules/remote-config-store-review.md), [`../modules/remote-config-store-updater.md`](../modules/remote-config-store-updater.md)
- Setup: [`../../setup/remote-config-store-ops.md`](../../setup/remote-config-store-ops.md)
- Template scaffold: [`../../templates/tooling/rc-admin/README.md`](../../templates/tooling/rc-admin/README.md)
- Rules: [`../../rules/firebase/remote-config-store-ops.md`](../../rules/firebase/remote-config-store-ops.md)

## Directory layout

```text
tool/firebase/rc-admin/
  package.json
  server.js              # Express + firebase-admin
  rc-keys.js             # KEY_MAP, FLAVORS, resolveKeys()
  rc-groups.js           # Console parameter groups
  payloads.js            # validate + preset builders
  pubspec-version.js     # reads app version from pubspec.yaml
  version-validate.js    # semver name rules (review_version)
  .env.example
  public/
    index.html
    app.js
    shared.js            # preview KEY_MAP — keep in sync with rc-keys.js
    styles.css
    tabs/
      store-review.js
      store-updater.js
```

Copy from [`../../templates/tooling/rc-admin/`](../../templates/tooling/rc-admin/) when missing.

## Configuration (`rc-keys.js`)

After Phase 0 analysis, set:

| Export | Meaning |
|--------|---------|
| `FEATURES` | `['storeReview', 'storeUpdater']` (fixed) |
| `FLAVORS` | `['app']` for `single_app`; flavor slugs for `multi_flavor` |
| `PLATFORMS` | `['android', 'ios', 'both']` |
| `KEY_MAP` | Nested `feature → flavor → platform → key string` |
| `ALL_KEYS` | Flat list of every managed parameter |
| `resolveKeys(feature, flavor, platform)` | Returns key array (`both` → 2 keys) |

Add sync comments pointing to Dart `_Constants` in both modules.

**Single implicit flavor:** use `FLAVORS = ['app']` and map `KEY_MAP[feature].app.android` / `.ios`.

## Parameter groups (`rc-groups.js`)

Organize Console UI — **does not affect runtime key names**:

| Group | Keys |
|-------|------|
| **Store Review** | All store-review RC keys |
| **Store Updater** | All store-updater RC keys |

Functions:

- `setGroupedParameter(template, key, definition)` — write JSON parameter inside group
- `syncParameterGroups(template)` — migrate stray top-level keys into groups
- `findParameter(template, key)` — read from group or legacy top-level

Every publish must set `valueType: 'JSON'`.

## Admin UI behavior

Two tabs: **Store Review**, **Store Updater**.

Shared selectors:

- **Flavor** — hidden when `FLAVORS.length === 1` (single_app)
- **Platform** — android / ios / both

Actions per tab: Reload, Push custom, ON preset, OFF preset. Publish preview shows target keys + JSON payload.

Presets read pubspec version name via `pubspec-version.js` (path relative to tool dir, default `../../../pubspec.yaml`).

## Server API

| Method | Route | Body |
|--------|-------|------|
| GET | `/api/meta` | — |
| GET | `/api/config` | — |
| POST | `/api/sync-groups` | — |
| POST | `/api/push` | `{ feature, flavor, platform, payload }` |
| POST | `/api/presets/review-on` | `{ flavor, platform, version? }` |
| POST | `/api/presets/review-off` | `{ flavor, platform }` |
| POST | `/api/presets/update-on` | `{ flavor, platform, version?, forceUpdate? }` |
| POST | `/api/presets/update-off` | `{ flavor, platform }` |

Optional `ADMIN_TOKEN` env → require `X-Admin-Token` header on `/api/*`.

## Environment

```env
FIREBASE_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
PORT=3847
# ADMIN_TOKEN=optional
```

Service account needs **Firebase Remote Config Admin** (or Editor). Never commit `.env` or key JSON.

## Makefile targets

```makefile
rc-admin-install:
	cd tool/firebase/rc-admin && npm install

rc-admin:
	cd tool/firebase/rc-admin && npm install && node server.js
```

Prefer Makefile targets over ad-hoc `flutter run`-style invocations in docs.

## Sync checklist

When changing keys:

1. `ai_docs/integrations/remote-config-store-ops.md` key table
2. `rc-keys.js` `KEY_MAP` + `ALL_KEYS`
3. `rc-groups.js` group key lists
4. `public/shared.js` preview `KEY_MAP`
5. Dart `_Constants` in `_store_review` and `_store_updater`

## Do not

- Bind the server to `0.0.0.0` in v1.
- Store toolkit project IDs or app package names — placeholders only in templates.
- Leave managed keys as loose top-level Console parameters after first publish.
