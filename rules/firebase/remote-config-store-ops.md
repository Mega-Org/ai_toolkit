# Remote Config store-ops rules

## Purpose

Enforceable rules for Firebase Remote Config keys, the local RC admin tool, and sync between Dart modules and Node tooling.

## Fill when

- Changing RC key layout, admin server security, or parameter group behavior.

## References

- Workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- Patterns: [`../../patterns/modules/_index.md`](../../patterns/modules/_index.md), [`../../patterns/tooling/rc-admin-panel.md`](../../patterns/tooling/rc-admin-panel.md)
- Public repo safety: [`security-public-repos.md`](security-public-repos.md)

## RC key definition

- **Must** define managed RC key names in **one JS resolver** (`tool/firebase/rc-admin/rc-keys.js`) **and** Dart `_Constants` in each module.
- **Must** add a sync comment on both sides (`keep in sync with …`).
- **Must not** hardcode app-specific key prefixes in `ai_toolkit/` — only in each app's integration manifest and configured tooling.

## Parameter groups

- When using the rc-admin tool, **must** store parameters inside `parameterGroups` (**Store Review**, **Store Updater**), not as unmanaged loose top-level keys.
- Group membership is **organizational** — Dart still reads flat key names at runtime.
- Every publish **must** set `valueType: JSON` for managed parameters.

## Secrets and repo hygiene

- **Must not** commit: `tool/firebase/rc-admin/.env`, service account JSON, `node_modules/`.
- Service account keys **should** live outside the repository; when used, set absolute path in `.env`.
- **May** omit `GOOGLE_APPLICATION_CREDENTIALS` when developers use `firebase login` — resolved in `credentials.js` (never commit refresh tokens).
- **Must not** embed Firebase project IDs or package names in toolkit templates — use placeholders (`{{FIREBASE_PROJECT_ID}}`, etc.).

## Admin server

- Server **must** bind to **127.0.0.1** only (local ops tool — not hosted in v1).
- **Should** set optional `ADMIN_TOKEN` when running on shared developer machines.
- **Must** fail with a clear error if neither a valid service account path nor Firebase CLI login is available.

## Payload contracts

- Store review JSON **must** match `ReviewEntity`: `is_enabled`, `review_version` (semver name only).
- Store updater JSON **must** match `UpdateEntity`: `is_enabled`, `min_version`, `force_update`.
- Admin validation (`payloads.js`, `version-validate.js`) **must** stay aligned with Dart parsing.

## Deployment mode

- Phase 0 analysis **must** record `single_app` vs `multi_flavor` in `ai_docs/integrations/remote-config-store-ops.md`.
- **Must not** assume flavors in toolkit prose — branch on manifest.

## Do not

- Duplicate `KEY_MAP` in JS without documenting that `public/shared.js` preview map must match `rc-keys.js`.
- Push RC values from CI without a documented, secured alternative to the local admin panel (out of scope for v1).
