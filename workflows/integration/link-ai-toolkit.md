# Link ai_toolkit (submodule)

Ordered checklist to attach this toolkit to a Flutter app as a **pinned git submodule**.

## When to use

- New app with no `ai_toolkit/` folder
- App that still has a nested/untracked clone of the toolkit
- Verifying seed files and Makefile shortcuts

## Steps

1. **Add or migrate**
   - Missing folder: `git submodule add -b main https://github.com/Mega-Org/ai_toolkit.git ai_toolkit`
   - Nested clone: `./ai_toolkit/bin/toolkit migrate` (after toolkit is present) or backup → remove → submodule add
2. **Init**: `git submodule update --init --recursive`
3. **Seed** (skip if already present): copy from `ai_toolkit/templates/app-seed/` — `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/ai-toolkit-seed.mdc`, optional `ai_docs/` stubs
4. **Makefile**: merge `templates/app-seed/Makefile.snippet` (`toolkit-add`, `toolkit-sync`, `toolkit-pull`, `toolkit-push`, `toolkit-status`)
5. **Optional hook**: install `templates/app-seed/githooks/post-merge` via `core.hooksPath`
6. **Commit** in the app: `.gitmodules`, `ai_toolkit` pointer, seed files
7. **Verify**: `./ai_toolkit/bin/toolkit status` and that agents can open `ai_toolkit/INDEX.md`

## Daily after setup

- Stay on pin: `git pull` then `toolkit sync` (or post-merge hook)
- Upgrade: `toolkit pull` + app commit
- Publish shared edits: `toolkit push "…"` + app bump

## References

- Setup guide: [`setup/per-app-integration.md`](../../setup/per-app-integration.md)
- Seed templates: [`templates/app-seed/README.md`](../../templates/app-seed/README.md)
- CLI: [`bin/toolkit`](../../bin/toolkit)
