# Install Cursor skills and rules

Installs Cursor skills and Cursor rules from this toolkit into the current project. The toolkit entry point is [`README.md`](README.md). Folder roles for the rest of `setup/` stay in [`setup/README.md`](setup/README.md).

## Prerequisites

- `bash`
- `git`, so you can review the diff after install
- A project root that already contains an `ai_toolkit/` directory

Run the installer from that project root. The scripts resolve `ai_toolkit/` and `.cursor/` from the current working directory.

## Layout in this repository

In this repository, `ai_toolkit/` is vendored. Git tracks its files as ordinary content in the parent repo (a normal tree, not a submodule gitlink). `git submodule status` prints nothing here.

`.gitmodules` still lists `ai_toolkit`, and `ai_toolkit/.git` points at `.git/modules/ai_toolkit`. That modules directory is not present, and the parent index does not record a gitlink. Treat the folder as files inside this repo.

Other projects can vendor the same way (copy `ai_toolkit/` into the repo) or add it as a git submodule. The submodule steps are in [How to use in an app](README.md#how-to-use-in-an-app-submodule) and [`setup/per-app-integration.md`](setup/per-app-integration.md).

## Installation

From the project root:

```bash
bash ai_toolkit/setup/install.sh
```

If the script is executable, this is the same entry point:

```bash
./ai_toolkit/setup/install.sh
```

`install.sh` is the only entry point. It calls the other setup scripts with `bash`.

## What the script does

`ai_toolkit/setup/install.sh` does the following, then stops if a step fails (`set -e`):

1. Sets the toolkit directory to `$PWD/ai_toolkit`. If that directory is missing, it prints `ai_toolkit not found` and exits 1.
2. Creates `.cursor/skills`, `.cursor/rules`, and `.cursor/plans` when they are missing. `mkdir -p` leaves existing files in those directories alone.
3. Runs `ai_toolkit/setup/install-skills.sh`.
4. Runs `ai_toolkit/setup/install-rules.sh`.
5. Runs `ai_toolkit/setup/install-ignore.sh` (creates or merges `.cursorignore` and `.cursorindexingignore` at the project root).
6. Runs `ai_toolkit/setup/install-vscode-search.sh`. It merges missing `search.exclude` keys from [`templates/vscode/search-exclude.json`](templates/vscode/search-exclude.json) into `.vscode/settings.json`. Editor search then skips `ai_specs/`, `ai_docs/`, `ai_worklog/` except `TODOS.md`, and these `ai_toolkit` folders: `templates`, `docs`, `bin`, and `reference`. The files still show in the Explorer, and agents can still read every file. Keys already in `search.exclude` are left unchanged. If the script cannot place the keys safely, it changes nothing, prints a snippet to paste, and exits 0 so install continues.
7. Runs `ai_toolkit/setup/verify-setup.sh`.

In the search panel, turn off the gear icon **Use Exclude Settings** for a one-off search that includes the excluded paths.

### Skills

`install-skills.sh` copies these five directories from `ai_toolkit/templates/cursor-skills/` into `.cursor/skills/`:

- `feature-make-plan`
- `feature-implement-phase`
- `bugfix`
- `autopilot-plan`
- `backend-contract`

The copy includes nested files. `autopilot-plan` brings `modes/`, `features/`, `examples/`, and `TEAM_GUIDE.md.template` along with `SKILL.md.template`. Every file whose name ends in `.template` is renamed by stripping that suffix (`SKILL.md.template` becomes `SKILL.md`). Files that already have no `.template` suffix are copied unchanged.

### Rules

`install-rules.sh` copies every `*.template` file from `ai_toolkit/templates/cursor-rules/` into `.cursor/rules/`, then strips the `.template` suffix. The templates in this toolkit are `.mdc.template` files, so the installed names are `.mdc`. The script then prints how many `*.mdc` files are in `.cursor/rules/` (that count includes rules that were already there).

Cursor skills and Cursor rules are the only copies under `.cursor/`. Ignore templates are merged into the **project root**. Workflows in `ai_toolkit/workflows/` and guidance in `ai_toolkit/rules/` stay in the toolkit and are read from those paths.

## Overwrite warning

`install-skills.sh` and `install-rules.sh` overwrite same-named files already in `.cursor/skills/` and `.cursor/rules/`. A skill directory that already exists is updated in place: matching files are replaced, and extra local files inside that directory are left on disk. A rule template replaces the `.mdc` file with the same name.

Review the diff after install:

```bash
git diff -- .cursor/skills .cursor/rules .cursorignore .cursorindexingignore
```

## Verification

`ai_toolkit/setup/verify-setup.sh` checks the skill install:

- `.cursor/skills/` exists. If it does not, the error count increases by one.
- Each of these files exists:
  - `.cursor/skills/autopilot-plan/SKILL.md`
  - `.cursor/skills/feature-make-plan/SKILL.md`
  - `.cursor/skills/feature-implement-phase/SKILL.md`
  - `.cursor/skills/bugfix/SKILL.md`
  - `.cursor/skills/backend-contract/SKILL.md`

A missing skill prints a warning and does not increase the error count. When the skills directory exists, the script ends with `Verified`. When it does not, the script ends with a warning and the error count.

You can run the check by itself from the project root:

```bash
bash ai_toolkit/setup/verify-setup.sh
```

The verifier does not inspect `.cursor/rules/` or `.cursor/plans/`.

## Troubleshooting

### Toolkit directory missing

`install.sh` looks for `ai_toolkit/` under the current directory. Run it from the project root that contains `ai_toolkit/`. From any other directory it exits with `ai_toolkit not found`.

### Templates missing

Skills are copied from `ai_toolkit/templates/cursor-skills/<skill>`. Rules are copied from `ai_toolkit/templates/cursor-rules/*.template`. If a skill directory or the rules template glob is missing, `cp` fails and `install.sh` stops. Restore those template paths, then run the installer again.

### Skills or rules overwritten

Re-running the installer replaces same-named skill and rule files under `.cursor/`. Read `git diff` before you commit. Keep local edits in a different filename, or re-apply them after the copy.

The installer leaves application source, `ai_specs/`, and `ai_docs/` unchanged. It also leaves files already in `.cursor/plans/` unchanged.

### Scripts are not executable

`bash ai_toolkit/setup/install.sh` runs without the execute bit. `./ai_toolkit/setup/install.sh` needs it. If the shell reports `Permission denied`, use the `bash` form, or mark the scripts executable:

```bash
chmod +x ai_toolkit/setup/install.sh ai_toolkit/setup/install-skills.sh ai_toolkit/setup/install-rules.sh ai_toolkit/setup/install-ignore.sh ai_toolkit/setup/install-vscode-search.sh ai_toolkit/setup/verify-setup.sh
```

`install.sh` invokes the other setup scripts through `bash`, so they do not need the execute bit when you start from `install.sh`.

## Related docs

- Toolkit overview: [`README.md`](README.md)
- New project: [`docs/installation/new-project-setup.md`](docs/installation/new-project-setup.md)
- Picking up toolkit updates: [`docs/installation/existing-project-setup.md`](docs/installation/existing-project-setup.md)
- ARB keys: [`docs/tooling/l10n-add.md`](docs/tooling/l10n-add.md)
- Cursor plugins: [`docs/tooling/cursor-plugins.md`](docs/tooling/cursor-plugins.md)
