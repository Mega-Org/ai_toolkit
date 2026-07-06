# Firebase / FlutterFire aliases and notes

## Purpose

Shell aliases, CLI reminders, and Firebase-related commands for day-to-day work, including Remote Config store-ops.

## Fill when

- When Firebase modules, RC admin, or CLI workflows you use regularly change.

## References

- [`alias/_index.md`](_index.md)
- [`rules/firebase/_index.md`](../rules/firebase/_index.md)
- Setup: [`setup/remote-config-store-ops.md`](../setup/remote-config-store-ops.md)

## Remote Config admin (store-ops)

Prefer **Makefile targets** when present in the app repo:

```bash
make rc-admin-install   # npm install only
make rc-admin           # install + start local panel → http://127.0.0.1:3847
```

Bootstrap from toolkit (copy template if missing):

```bash
chmod +x ai_toolkit/setup/scripts/bootstrap-rc-admin.sh
./ai_toolkit/setup/scripts/bootstrap-rc-admin.sh
./ai_toolkit/setup/scripts/bootstrap-rc-admin.sh --copy-template  # refresh from template
```

## FlutterFire CLI (general)

```bash
# Configure Firebase for a flavor (example — adjust paths per app)
flutterfire configure --out=lib/src/firebase_options_<flavor>.dart

# Re-run after adding flavors or changing Firebase apps
```

See app `ai_toolkit/setup/flavors.md` when the repo uses product flavors.

## Environment variables (rc-admin)

| Variable | Purpose |
|----------|---------|
| `FIREBASE_PROJECT_ID` | Target Firebase project |
| `GOOGLE_APPLICATION_CREDENTIALS` | Absolute path to service account JSON |
| `PORT` | Local server port (default `3847`) |
| `ADMIN_TOKEN` | Optional; requires `X-Admin-Token` on `/api/*` |

Never commit `.env` or service account files.

## Integration workflow

Full phased setup: [`workflows/integration/remote-config-store-ops.md`](../workflows/integration/remote-config-store-ops.md)
