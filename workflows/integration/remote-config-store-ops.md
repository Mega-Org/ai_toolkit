# Remote Config store-ops integration

## Purpose

Phased playbook to integrate **store review** (hide/replace UI during App Store / Play review), **store updater** (min-version / force-update prompts), and a **local RC admin panel** into any Flutter app that shares this toolkit. Phase **0 — Analyze** decides whether the app is **`single_app`** or **`multi_flavor`**; all later phases follow the same code patterns with simpler or fuller key matrices.

## Fill when

- Adding store-ops to a new app, changing RC key layout, or updating the vendored rc-admin template.

## References

- Integration manifest (per app): `ai_docs/integrations/remote-config-store-ops.md` — **source of truth** after Phase 0
- Optional feature tracking: `ai_specs/features/remote-config-store-ops/README.md`, `plan.md`
- Patterns: [`../../patterns/modules/remote-config-store-review.md`](../../patterns/modules/remote-config-store-review.md), [`../../patterns/modules/remote-config-store-updater.md`](../../patterns/modules/remote-config-store-updater.md), [`../../patterns/tooling/rc-admin-panel.md`](../../patterns/tooling/rc-admin-panel.md)
- Setup: [`../../setup/remote-config-store-ops.md`](../../setup/remote-config-store-ops.md)
- Rules: [`../../rules/firebase/remote-config-store-ops.md`](../../rules/firebase/remote-config-store-ops.md)
- Templates: [`../../templates/tooling/rc-admin/README.md`](../../templates/tooling/rc-admin/README.md), [`../../templates/docs/integration-manifest.md`](../../templates/docs/integration-manifest.md)
- Checklist: [`../../reference/checklist-remote-config-store-ops.md`](../../reference/checklist-remote-config-store-ops.md)
- Agent skill: [`../../reference/agent-skills/remote-config-store-ops/SKILL.md`](../../reference/agent-skills/remote-config-store-ops/SKILL.md)

## Usage

**When to use** — Integrate store review + force update + RC admin, or audit an existing integration.

**What you say** — Natural language is enough. Examples:

- `setup-remote-config-store-ops`
- `bootstrap store-ops`
- `Integrate RC store review and updater for this app`

**Default behavior**

1. Run **Phase 0 — Analyze** and write `ai_docs/integrations/remote-config-store-ops.md`.
2. Execute phases **1–6** in order; track progress in optional `ai_specs/features/remote-config-store-ops/plan.md`.
3. Verify with [`../../reference/checklist-remote-config-store-ops.md`](../../reference/checklist-remote-config-store-ops.md).

## Phase 0 — Analyze

Inspect the **actual codebase** — do not assume flavors.

| Signal | Typical outcome |
|--------|-----------------|
| Single `main.dart` / one app shell, no flavor enum | `deployment_mode: single_app` |
| Flavor enum + `main_<flavor>.dart` + `_<flavor>_app.dart` per flavor | `deployment_mode: multi_flavor` |
| Android + iOS targets | `platforms: [android, ios]` |

**Read**

- `ai_docs/architecture.md`, entrypoints (`main.dart` vs `main_<flavor>.dart`)
- Flavor enum (if any), Firebase layout, `pubspec.yaml` deps
- Existing `_store_review` / `_store_updater` / `tool/firebase/rc-admin/` (may already be partially present)

**Decide and record in the integration manifest**

- `deployment_mode`: `single_app` \| `multi_flavor`
- `flavors[]` — e.g. `['app']` or `['user', 'security']`
- `platforms[]` — typically `['android', 'ios']`
- RC key table (names only — app-specific prefixes)
- Key count: **4** (single_app, 2 features × 2 platforms) or **4 × flavors** (multi_flavor)
- Firebase project id, bootstrap entrypoints, shell wiring notes

Copy [`../../templates/docs/integration-manifest.md`](../../templates/docs/integration-manifest.md) → `ai_docs/integrations/remote-config-store-ops.md` and fill every field.

## Phase 1 — Dart modules

Copy or adapt modules per patterns:

| Module | Path | Pattern |
|--------|------|---------|
| Store review | `lib/src/_store_review/` | [`remote-config-store-review.md`](../../patterns/modules/remote-config-store-review.md) |
| Store updater | `lib/src/_store_updater/` | [`remote-config-store-updater.md`](../../patterns/modules/remote-config-store-updater.md) |

**Always**

- Library file + `part` / `part of` layout (not separate importable widgets per file)
- Sealed `_PlatformConfig` → resolves **one RC key** from `Platform` (+ flavor when `multi_flavor`)
- Same JSON payloads: `ReviewEntity`, `UpdateEntity`
- RC key constants with sync comment ↔ `tool/firebase/rc-admin/rc-keys.js`
- Fix `package:` imports to the host app

**Branch on `deployment_mode`**

- **`single_app`**: `_PlatformConfig` branches on `Platform` only; 2 keys per module
- **`multi_flavor`**: add flavor switch via `getAppEnvironment` (or app equivalent); 4 keys per module

Add missing `pubspec` deps if needed: `firebase_remote_config`, `package_info_plus`, `pub_semver`, `url_launcher`.

## Phase 2 — App shell

| Mode | Wiring |
|------|--------|
| **`single_app`** | `BlocProvider(StoreReviewManager, lazy: false)` in root app widget; `UpdateViewModel.init()` in shared bootstrap |
| **`multi_flavor`** | Same in **each** `_<flavor>_app.dart`; `UpdateViewModel.init()` once in shared `initialize_app_config` (or equivalent) |

Wrap sensitive UI with `StoreReviewBuilder`. For imperative guards, use `StoreReviewBuilder.isUnderReview(context)`.

## Phase 3 — RC admin tool

1. If missing, copy scaffold from [`../../templates/tooling/rc-admin/`](../../templates/tooling/rc-admin/) → `tool/firebase/rc-admin/`.
2. Configure `rc-keys.js` and `rc-groups.js` from the integration manifest.
3. Set `FLAVORS` in `rc-keys.js` — `['app']` for single_app; hide flavor selector in UI when `FLAVORS.length === 1`.
4. Keep `public/shared.js` `KEY_MAP` in sync with `rc-keys.js` (preview resolver).

Run [`../../setup/scripts/bootstrap-rc-admin.sh`](../../setup/scripts/bootstrap-rc-admin.sh) or `make rc-admin-install`.

## Phase 4 — Build wiring

- Makefile targets (see [`../../setup/remote-config-store-ops.md`](../../setup/remote-config-store-ops.md))
- `.gitignore`: `.env`, service account JSON, `node_modules/`
- `.env.example` from template; service account **outside** repo

## Phase 5 — Firebase Console

Publish **N** JSON parameters (from manifest) in two parameter groups:

| Group | Feature |
|-------|---------|
| **Store Review** | All store-review keys |
| **Store Updater** | All store-updater keys |

Use RC admin presets or manual Console entry. Parameters must use **`valueType: JSON`**.

## Phase 6 — Verify

1. `dart analyze` (or app Makefile `make analyze`)
2. RC admin: load config, push review ON/OFF for one platform (and per flavor if multi_flavor)
3. App: confirm review mode hides wrapped UI; updater dialog when min version exceeds installed version
4. Complete [`../../reference/checklist-remote-config-store-ops.md`](../../reference/checklist-remote-config-store-ops.md)

## Consumer steps (existing app with modules already present)

When modules and admin tool already exist (reference implementation):

1. Write `ai_docs/integrations/remote-config-store-ops.md` from analysis.
2. Optional: `ai_specs/features/remote-config-store-ops/` marking phases done.
3. Normalize `_store_review` file tree to single `src/` layout under library root.
4. Align vendored toolkit template with any drift from live `tool/firebase/rc-admin/`.

## Handoff

After Phase 6, day-to-day ops use `make rc-admin` and the checklist. Feature changes to review/updater behavior follow [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md) with the integration manifest as context.
