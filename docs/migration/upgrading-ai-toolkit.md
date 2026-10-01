# Upgrading ai_toolkit

Bring an existing project to toolkit 2.0.0: new autopilot skill, Cursor skill and rule templates, install scripts, and the docs under [`docs/`](../). Release notes: [`../../CHANGELOG.md`](../../CHANGELOG.md). New-project install: [`../installation/new-project-setup.md`](../installation/new-project-setup.md).

## 1. Update the toolkit tree

**Vendored (this repository):** pull or copy a newer `ai_toolkit/` into the project root so `ai_toolkit/setup/install.sh` exists. Files under `ai_toolkit/` are ordinary repo content.

**Submodule:** from the app root, pull the pin, then reinstall:

```bash
./ai_toolkit/bin/toolkit pull
```

Details: [`../../setup/per-app-integration.md`](../../setup/per-app-integration.md).

## 2. Reinstall Cursor skills and rules

From the project root:

```bash
bash ai_toolkit/setup/install.sh
```

That creates `.cursor/skills`, `.cursor/rules`, and `.cursor/plans` when missing, copies the skill and rule templates, merges search exclusions, then runs [`../../setup/verify-setup.sh`](../../setup/verify-setup.sh).

Existing apps can apply only the search exclusions, or rerun `install.sh`:

```bash
bash ai_toolkit/setup/install-vscode-search.sh
```

Skills and rules only:

```bash
bash ai_toolkit/setup/install-skills.sh
bash ai_toolkit/setup/install-rules.sh
bash ai_toolkit/setup/install-ignore.sh
bash ai_toolkit/setup/install-vscode-search.sh
bash ai_toolkit/setup/verify-setup.sh
```

## 3. Overwrite behavior

Same-named files under `.cursor/skills/` and `.cursor/rules/` are replaced by the templates. Local edits to those copies are lost unless you re-apply them after the copy. Extra files inside an existing skill directory that the template does not include stay on disk. Workflows and rules under `ai_toolkit/workflows/` and `ai_toolkit/rules/` are read in place; the installer does not copy them into `.cursor/`.

Review before you commit:

```bash
git diff -- .cursor/skills .cursor/rules .cursorignore .cursorindexingignore
```

`install-ignore.sh` creates `.cursorignore` and `.cursorindexingignore` at the app root, or appends any missing template patterns. Custom extra lines are kept.

## 4. Breaking changes

There is no change to app Dart APIs, `ai_specs/` layout, or feature workflow contracts for make-plan and implement-phase.

The upgrade effect is a reinstall of Cursor skills and Cursor rules from templates. Projects that customized `.cursor/skills/*` or `.cursor/rules/*.mdc` must re-apply those edits after `install.sh`, or keep custom files under names the templates do not use.

Autopilot is new. Install adds `.cursor/skills/autopilot-plan/` when that skill was missing. Modes and commit policy: [`../../rules/feature-delivery/autopilot-execution-modes.md`](../../rules/feature-delivery/autopilot-execution-modes.md).

## 5. After upgrade

1. Confirm verify output lists the six skills (including `backend-contract` and `feature-verify-pr`).
2. Check `.cursor/.ai_toolkit_version` matches [`../../VERSION`](../../VERSION).
3. Open [`../workflows/overview.md`](../workflows/overview.md) for autopilot and verify-pr commands.
4. Optional: copy [`../../templates/app-seed/preferences.md`](../../templates/app-seed/preferences.md) → `ai_docs/preferences.md`.
5. Share [`../../templates/cursor-skills/autopilot-plan/TEAM_GUIDE.md.template`](../../templates/cursor-skills/autopilot-plan/TEAM_GUIDE.md.template) with the team.
