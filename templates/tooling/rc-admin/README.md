# RC admin template (`templates/tooling/rc-admin/`)

Portable scaffold for `tool/firebase/rc-admin/` in any Flutter app. Copy to the app repo and configure placeholders from Phase 0 analysis.

## Placeholders (configure after copy)

| Placeholder | File | Description |
|-------------|------|-------------|
| `{{FIREBASE_PROJECT_ID}}` | `.env.example` → `.env` | Firebase project id |
| `{{GOOGLE_APPLICATION_CREDENTIALS}}` | `.env` | Absolute path to service account JSON (outside repo) |
| `{{PUBSPEC_REL_PATH}}` | `pubspec-version.js` | Default `../../../pubspec.yaml` from `tool/firebase/rc-admin/` |
| `{{DEPLOYMENT_MODE}}` | integration manifest | `single_app` \| `multi_flavor` |
| `{{FLAVORS}}` | `rc-keys.js` | e.g. `['app']` or `['user','security']` |
| `{{RC_KEY_MAP}}` | `rc-keys.js`, `rc-groups.js`, `public/shared.js` | Full key matrix from manifest |

## Default scaffold shape

The vendored template ships with **`single_app`** defaults:

- `FLAVORS = ['app']`
- Four example RC keys (2 features × 2 platforms)
- Flavor selector hidden in UI when `FLAVORS.length === 1`

Replace key names and expand `KEY_MAP` for **`multi_flavor`** per [`../../patterns/tooling/rc-admin-panel.md`](../../patterns/tooling/rc-admin-panel.md).

## Copy into app

```bash
./ai_toolkit/setup/scripts/bootstrap-rc-admin.sh
# or --copy-template to refresh from this directory
```

Or manually:

```bash
rsync -a --exclude node_modules --exclude .env \
  ai_toolkit/templates/tooling/rc-admin/ tool/firebase/rc-admin/
```

Then:

1. Fill `ai_docs/integrations/remote-config-store-ops.md` from [`../docs/integration-manifest.md`](../docs/integration-manifest.md)
2. Edit `rc-keys.js`, `rc-groups.js`, `public/shared.js` to match Dart `_Constants`
3. `cp .env.example .env` and set credentials
4. `make rc-admin`

## Sync with live app tool

When the reference app's `tool/firebase/rc-admin/` gains UX or group fixes, re-vendor into this template (exclude `.env`, `node_modules/`). Keep toolkit files free of app-specific project ids or package names.

## References

- Workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- Setup: [`../../setup/remote-config-store-ops.md`](../../setup/remote-config-store-ops.md)
- Pattern: [`../../patterns/tooling/rc-admin-panel.md`](../../patterns/tooling/rc-admin-panel.md)
