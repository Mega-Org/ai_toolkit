# New project setup

Put `ai_toolkit/` in a project, install Cursor skills and Cursor rules, then use the five skills. Command details and troubleshooting are in [`../../INSTALL.md`](../../INSTALL.md). The toolkit overview is [`../../README.md`](../../README.md).

## 1. Start from a project root

Use the root of the app repository. That directory must be the current working directory when you run the installer, because the scripts look for `./ai_toolkit` and write `./.cursor`.

`git` should be available so you can review what the copy changed.

## 2. Add `ai_toolkit/`

This repository vendors `ai_toolkit/`: the files are tracked in the parent repo, and `git submodule status` does not list the folder. Copying the directory into a new repo matches that layout.

**Copy (same layout as this repo)**

Copy the `ai_toolkit/` tree into the project root so this path exists:

```text
<project>/ai_toolkit/setup/install.sh
```

Commit the copied tree in the app repo when you are ready. Later toolkit updates are new files in that same tree.

**Optional: git submodule**

Another project can pin `ai_toolkit` as a git submodule instead of copying files. The steps for that pattern are in [`../../README.md`](../../README.md) under "How to use in an app (submodule)" and in [`../../setup/per-app-integration.md`](../../setup/per-app-integration.md). After the submodule is checked out, `ai_toolkit/setup/install.sh` is the same installer. Submodule sync and upgrade stay on `./ai_toolkit/bin/toolkit` as those docs describe. This repository does not use that checkout.

## 3. Run the installer

From the project root:

```bash
bash ai_toolkit/setup/install.sh
```

or:

```bash
./ai_toolkit/setup/install.sh
```

The script creates `.cursor/skills`, `.cursor/rules`, and `.cursor/plans`, copies the four skill templates and the rule templates, strips the `.template` suffix, merges Cursor ignore templates into `.cursorignore` / `.cursorindexingignore`, and runs `ai_toolkit/setup/verify-setup.sh`.

`install-skills.sh` and `install-rules.sh` overwrite same-named files already in `.cursor/skills/` and `.cursor/rules/`. On a brand-new `.cursor/` tree there is nothing to replace. If the project already has skills or rules under those names, review the diff before you commit:

```bash
git diff -- .cursor/skills .cursor/rules .cursorignore .cursorindexingignore
```

## 4. Confirm verification output

`verify-setup.sh` confirms `.cursor/skills/` exists and that each skill has `SKILL.md`:

- `autopilot-plan`
- `feature-make-plan`
- `feature-implement-phase`
- `bugfix`
- `backend-contract`

A missing skill prints a warning. The closing `Verified` line means the skills directory exists. Details are in [`../../INSTALL.md`](../../INSTALL.md).

## 5. First usage

After those `SKILL.md` files are in `.cursor/skills/`, Cursor can run:

- `/feature-make-plan`
- `/feature-implement-phase`
- `/bugfix`
- `/autopilot-plan`
- `/backend-contract`

Workflows under `ai_toolkit/workflows/` and rules under `ai_toolkit/rules/` are read in place. The installer only copies Cursor skills and Cursor rules into `.cursor/`. Skill runs load checklists plus [`../../LOADMAP.md`](../../LOADMAP.md) cards. Full sessions may start at [`../../INDEX.md`](../../INDEX.md).
