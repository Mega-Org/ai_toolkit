# Setup index

## Purpose

How to attach `ai_toolkit/` to an app and refresh Cursor skills/rules.

## Fill when

Install scripts or submodule workflow change.

## References

- [`install.sh`](install.sh) — primary entry
- [`per-app-integration.md`](per-app-integration.md) — submodule vs vendored
- [`verify-setup.sh`](verify-setup.sh) — post-install checks

## Content

### Vendored toolkit

From repo root:

```bash
bash ai_toolkit/setup/install.sh
```

Installs five Cursor skills, cursor rules from templates, ignore files, writes `.cursor/.ai_toolkit_version`, runs verify.

### Submodule apps

Use `./ai_toolkit/bin/toolkit add|sync|pull|push` — see [`per-app-integration.md`](per-app-integration.md).

### After upgrade

Review diff under `.cursor/`, run the app's command from `ai_docs/conventions.md` (for example `make analyze`) on app code if Dart changed, read [`../docs/migration/upgrading-ai-toolkit.md`](../docs/migration/upgrading-ai-toolkit.md).
