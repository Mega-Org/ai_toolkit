# App seed templates (`templates/app-seed/`)

Thin files to copy into each Flutter app after `git submodule add` (or `toolkit add`).

| Path | Copy to |
|------|---------|
| `CLAUDE.md` | app root |
| `AGENTS.md` | app root |
| `preferences.md` | `ai_docs/preferences.md` (optional override) |
| Install `core-digest.mdc` | `.cursor/rules/` via [`setup/install-rules.sh`](../../setup/install-rules.sh) (not copied manually) |
| `ai_docs/architecture.md` | `ai_docs/` (skip if already present) |
| `ai_docs/conventions.md` | `ai_docs/` (skip if already present) |
| `ai_docs/memory.md` | `ai_docs/` (optional) |
| `Makefile.snippet` | merge targets into app `Makefile` |
| `githooks/post-merge` | optional `.githooks/post-merge` + `git config core.hooksPath .githooks` |

Legacy `cursor-rules/ai-toolkit-seed.mdc` is retired — use **`core-digest.mdc`** from [`../cursor-rules/core-digest.mdc.template`](../cursor-rules/core-digest.mdc.template).

See [`setup/per-app-integration.md`](../../setup/per-app-integration.md).
