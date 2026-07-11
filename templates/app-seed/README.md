# App seed templates (`templates/app-seed/`)

Thin files to copy into each Flutter app after `git submodule add` (or `toolkit add`).

| Path | Copy to |
|------|---------|
| `CLAUDE.md` | app root |
| `AGENTS.md` | app root |
| `cursor-rules/ai-toolkit-seed.mdc` | `.cursor/rules/` |
| `ai_docs/architecture.md` | `ai_docs/` (skip if already present) |
| `ai_docs/conventions.md` | `ai_docs/` (skip if already present) |
| `Makefile.snippet` | merge targets into app `Makefile` |
| `githooks/post-merge` | optional `.githooks/post-merge` + `git config core.hooksPath .githooks` |

See [`setup/per-app-integration.md`](../../setup/per-app-integration.md).
