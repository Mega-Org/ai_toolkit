# Remote Config store-ops setup

## Purpose

Prerequisites and one-time bootstrap for **store review**, **store updater**, and the local **RC admin panel** in a Flutter app using this toolkit.

## Fill when

- First-time integration, new developer machine, or CI docs for rc-admin.

## References

- Workflow: [`../workflows/integration/remote-config-store-ops.md`](../workflows/integration/remote-config-store-ops.md)
- Patterns: [`../patterns/modules/_index.md`](../patterns/modules/_index.md), [`../patterns/tooling/rc-admin-panel.md`](../patterns/tooling/rc-admin-panel.md)
- Rules: [`../rules/firebase/remote-config-store-ops.md`](../rules/firebase/remote-config-store-ops.md)
- Bootstrap script: [`scripts/bootstrap-rc-admin.sh`](scripts/bootstrap-rc-admin.sh)
- Aliases: [`../alias/firebase.md`](../alias/firebase.md)

## Prerequisites checklist

| Requirement | Notes |
|-------------|--------|
| **Node.js 18+** | For `tool/firebase/rc-admin/` |
| **Firebase project** | Shared across app flavors unless documented otherwise |
| **Service account JSON** | Remote Config Admin role; store **outside** repo |
| **`GOOGLE_APPLICATION_CREDENTIALS`** | Absolute path in `tool/firebase/rc-admin/.env` |
| **Flutter deps** | Add if missing: `firebase_remote_config`, `package_info_plus`, `pub_semver`, `url_launcher` |
| **Integration manifest** | `ai_docs/integrations/remote-config-store-ops.md` after Phase 0 |

## Flutter dependencies

In host app `pubspec.yaml`:

```yaml
dependencies:
  firebase_remote_config: ^any  # match app's Firebase BOM
  package_info_plus: ^any
  pub_semver: ^any
  url_launcher: ^any
```

Firebase must already be initialized before RC modules fetch (typical: after `Firebase.initializeApp` in bootstrap).

## RC admin bootstrap

### 1. Copy scaffold (if missing)

Copy [`../templates/tooling/rc-admin/`](../templates/tooling/rc-admin/) → `tool/firebase/rc-admin/`.

### 2. Configure environment

```bash
cp tool/firebase/rc-admin/.env.example tool/firebase/rc-admin/.env
# Edit .env — set FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS
```

### 3. Configure keys

From the integration manifest, edit:

- `rc-keys.js` — `FLAVORS`, `KEY_MAP`
- `rc-groups.js` — group key lists
- `public/shared.js` — preview `KEY_MAP` (must match)

### 4. Install and run

**Makefile (preferred):**

```makefile
rc-admin-install:
	cd tool/firebase/rc-admin && npm install

rc-admin:
	cd tool/firebase/rc-admin && npm install && node server.js
```

**Or bootstrap script:**

```bash
./ai_toolkit/setup/scripts/bootstrap-rc-admin.sh
# optional: --copy-template to force copy from ai_toolkit template
```

Open `http://127.0.0.1:3847` (or `PORT` from `.env`).

## `.gitignore` entries

Ensure the app repo ignores:

```gitignore
tool/firebase/rc-admin/.env
tool/firebase/rc-admin/node_modules/
**/secrets/*-rc-admin.json
```

## Firebase Console

Create two **parameter groups** (names fixed by rc-admin):

- **Store Review**
- **Store Updater**

Initial publish can be done via rc-admin presets or manual Console entry. Use **JSON** value type for all managed keys.

## Verification

1. `make rc-admin` → panel loads project id and pubspec version
2. GET `/api/config` returns all keys from manifest
3. Push review OFF → app no longer treats build as under review
4. `dart analyze` clean after Dart module wiring

See [`../reference/checklist-remote-config-store-ops.md`](../reference/checklist-remote-config-store-ops.md).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Service account file not found | Use absolute path in `.env` |
| PERMISSION_DENIED on publish | Grant Remote Config Admin to service account |
| App ignores RC changes | Restart app; check correct flavor/platform key |
| Port in use | Change `PORT` in `.env` |
