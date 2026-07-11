# Per-app integration (ai_toolkit submodule)

Repo-first setup: each Flutter app vendors this toolkit as a **git submodule** at `ai_toolkit/`. Commands live at `./ai_toolkit/bin/toolkit` — **no global PATH or machine install required**. Works on Mac, Linux, and Windows via **Git Bash** or **WSL**.

Pinned policy: each app records a toolkit commit SHA. `git pull` in the app keeps that pin. Run `toolkit pull` only when you intentionally upgrade.

## New app (first time)

From the **app** repository root:

```bash
git submodule add -b main https://github.com/Mega-Org/ai_toolkit.git ai_toolkit
git submodule update --init --recursive

# Seed thin pointers (skip files you already have)
cp ai_toolkit/templates/app-seed/CLAUDE.md .
cp ai_toolkit/templates/app-seed/AGENTS.md .
mkdir -p .cursor/rules ai_docs
cp ai_toolkit/templates/app-seed/cursor-rules/ai-toolkit-seed.mdc .cursor/rules/
# Only if stubs missing:
# cp ai_toolkit/templates/app-seed/ai_docs/*.md ai_docs/

# Merge Makefile toolkit-* targets from:
#   ai_toolkit/templates/app-seed/Makefile.snippet

git add .gitmodules ai_toolkit CLAUDE.md AGENTS.md .cursor/rules ai_docs
git commit -m "Add ai_toolkit submodule and AI seed files"
```

After the submodule exists, prefer:

```bash
./ai_toolkit/bin/toolkit status
# or
make toolkit-status
```

## Daily commands

| Goal | Command |
|------|---------|
| After `git pull` in the app | `./ai_toolkit/bin/toolkit sync` or `make toolkit-sync` |
| Upgrade toolkit to latest `main` | `./ai_toolkit/bin/toolkit pull` → commit staged pointer in the **app** |
| Publish edits made under `ai_toolkit/` | `./ai_toolkit/bin/toolkit push "message"` → then commit app bump when ready |
| Inspect state | `./ai_toolkit/bin/toolkit status` |

Upgrade example:

```bash
./ai_toolkit/bin/toolkit pull
git commit -m "Bump ai_toolkit"
```

Edit shared rules example:

```bash
# edit files under ai_toolkit/
./ai_toolkit/bin/toolkit push "Clarify cubit naming rule"
git commit -m "Bump ai_toolkit"
# other apps: toolkit pull && commit when you want the change
```

## Clone for teammates

```bash
git clone --recurse-submodules <app-repo-url>
# or after a normal clone:
git submodule update --init --recursive
```

## Migrate nested clone → submodule

If `ai_toolkit/` already exists as an untracked nested git repo:

```bash
# Prefer (once bin/toolkit exists inside that folder):
./ai_toolkit/bin/toolkit migrate

# Or from a global/other clone of this repo:
# /path/to/ai_toolkit/bin/toolkit migrate
```

Commit or stash any toolkit edits before migrating.

## Optional: auto-sync after pull

Copy `templates/app-seed/githooks/post-merge` to `.githooks/post-merge`, then:

```bash
chmod +x .githooks/post-merge
git config core.hooksPath .githooks
```

## Mac vs Windows

| | Mac / Linux | Windows |
|--|-------------|---------|
| Submodule | Git | Git for Windows |
| CLI | `./ai_toolkit/bin/toolkit …` | Same in **Git Bash** or **WSL** |
| Makefile | `make toolkit-sync` | Git Bash + `make`, or call the script directly |

Do **not** require `~/dev/ai_toolkit` or shell `PATH` changes. A global clone is optional only if you bootstrap many new apps and want `toolkit add` before any submodule exists.

## Chicken-and-egg (no submodule yet)

Use the raw git command in **New app** above. `make toolkit-add` (from the seed snippet) falls back to `git submodule add` when `./ai_toolkit/bin/toolkit` is not present yet.

## What belongs where

- **This repo (`ai_toolkit`)**: shared rules, patterns, workflows, templates, `bin/toolkit`.
- **Each app**: `.gitmodules`, pinned submodule pointer, thin `CLAUDE.md` / `AGENTS.md` / `.cursor/rules`, and product docs in `ai_docs/` / `ai_specs/`.

Full playbook: [`workflows/integration/link-ai-toolkit.md`](../workflows/integration/link-ai-toolkit.md).
