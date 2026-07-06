# Firebase and public repositories

## Purpose

Safety rules for `firebase_options.dart`, API keys in repos, Remote Config admin credentials, and what must never be committed or mirrored publicly.

## Fill when

- When Firebase project layout, RC admin tooling, or secret handling changes.

## References

- RC store-ops rules: [`remote-config-store-ops.md`](remote-config-store-ops.md)
- Setup: [`../../setup/remote-config-store-ops.md`](../../setup/remote-config-store-ops.md)
- Optional paths in **your app repos** (not copied here): e.g. `lib/firebase_options.dart`, `lib/src/firebase_options_<flavor>.dart`

## Must not commit

| Asset | Location (typical) |
|-------|---------------------|
| RC admin `.env` | `tool/firebase/rc-admin/.env` |
| Service account private keys | Outside repo; path in `.env` only |
| `node_modules/` | `tool/firebase/rc-admin/node_modules/` |
| Local secrets / `.env` with production keys | App root or tool dirs |

## FlutterFire generated files

- **`firebase_options_*.dart`** — often committed per flavor; they contain client API keys that are not secret in mobile apps but still identify the project.
- **Native Firebase configs** — follow flavor layout in app docs (`google-services.json`, `GoogleService-Info.plist` per flavor).

## Remote Config admin

- Local panel only (`127.0.0.1`); service account needs Remote Config Admin — treat like production credentials.
- See [`remote-config-store-ops.md`](remote-config-store-ops.md) for key sync and group rules.

## Public / open-source repos

- Scrub project IDs from examples; use placeholders in templates.
- Document required env vars in `.env.example` without real values.
- Never open PRs that add service account JSON or RC admin `.env`.
