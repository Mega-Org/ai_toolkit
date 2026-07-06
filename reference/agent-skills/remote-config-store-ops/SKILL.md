---
name: remote-config-store-ops
description: Integrate Firebase Remote Config store review UI gating, force-update prompts, and local RC admin panel. Use for setup-remote-config-store-ops, bootstrap store-ops, or RC key / admin tooling changes.
---

# Remote Config store-ops

## Canonical docs (read in order)

1. **Workflow** — `ai_toolkit/workflows/integration/remote-config-store-ops.md` (phases 0–6)
2. **App manifest** — `ai_docs/integrations/remote-config-store-ops.md` (after Phase 0)
3. **Setup** — `ai_toolkit/setup/remote-config-store-ops.md`
4. **Patterns** — `ai_toolkit/patterns/modules/remote-config-store-review.md`, `remote-config-store-updater.md`, `ai_toolkit/patterns/tooling/rc-admin-panel.md`
5. **Rules** — `ai_toolkit/rules/firebase/remote-config-store-ops.md`
6. **Checklist** — `ai_toolkit/reference/checklist-remote-config-store-ops.md`

## Quick start

1. Run **Phase 0 — Analyze**; write integration manifest from `ai_toolkit/templates/docs/integration-manifest.md`.
2. Copy or configure Dart modules under `lib/src/_store_review/` and `lib/src/_store_updater/`.
3. Bootstrap RC admin: `./ai_toolkit/setup/scripts/bootstrap-rc-admin.sh` or `make rc-admin-install`.
4. Configure `rc-keys.js` / Dart `_Constants` from manifest; verify with checklist.

## Deployment modes

| Mode | RC keys (2 features) | `_PlatformConfig` |
|------|----------------------|-------------------|
| `single_app` | 4 (2 platforms) | Platform only |
| `multi_flavor` | 4 × flavors | Platform + flavor enum |

**Do not assume flavors** — read entrypoints and flavor enum first.

## Do not

- Hardcode app project ids or key prefixes in toolkit files.
- Commit `.env` or service account JSON.
- Duplicate RC key names without sync comments in Dart and `rc-keys.js`.

## Installing in a Cursor project

Copy this folder to `.agents/skills/remote-config-store-ops/SKILL.md` in the app repo.

Portable source: `ai_toolkit/reference/agent-skills/remote-config-store-ops/SKILL.md`
