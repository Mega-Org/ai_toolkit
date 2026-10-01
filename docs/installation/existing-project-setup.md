# Existing project setup

Pick up toolkit updates, then reinstall Cursor skills and Cursor rules. Full install behavior is in [`../../INSTALL.md`](../../INSTALL.md). The toolkit overview is [`../../README.md`](../../README.md).

## How this repository stores the toolkit

Here, `ai_toolkit/` is vendored. Its files are ordinary content in the parent repository, and `git submodule status` does not list the directory. A toolkit update in this checkout is an update to those files (pull the app repo, or copy in a newer `ai_toolkit/` tree).

A different project that added `ai_toolkit` as a submodule follows [`../../setup/per-app-integration.md`](../../setup/per-app-integration.md): `./ai_toolkit/bin/toolkit pull` (or `git submodule update`) and then the same reinstall below. That submodule flow is optional and is not how this repository records the folder.

## Re-run the installer

From the project root, after `ai_toolkit/` contains the version you want:

```bash
bash ai_toolkit/setup/install.sh
```

That runs `ai_toolkit/setup/install-skills.sh`, `ai_toolkit/setup/install-rules.sh`, `ai_toolkit/setup/install-ignore.sh`, and `ai_toolkit/setup/verify-setup.sh`.

To refresh only one side:

```bash
bash ai_toolkit/setup/install-skills.sh
bash ai_toolkit/setup/install-rules.sh
bash ai_toolkit/setup/install-ignore.sh
bash ai_toolkit/setup/verify-setup.sh
```

`verify-setup.sh` checks `.cursor/skills/` and the five `SKILL.md` files (`autopilot-plan`, `feature-make-plan`, `feature-implement-phase`, `bugfix`, `backend-contract`). It warns if `.cursorignore` or `.cursorindexingignore` is missing. It does not check rules.

## Review the diff

`install-skills.sh` and `install-rules.sh` overwrite same-named files already in `.cursor/skills/` and `.cursor/rules/`. Local edits to those copies are replaced by the templates. Extra files inside an existing skill directory stay on disk if the template does not include them.

Before committing, review:

```bash
git diff -- .cursor/skills .cursor/rules .cursorignore .cursorindexingignore
```

Re-apply any project-specific edits you still need, or keep them under a different filename so the next copy does not replace them.

## What the installer leaves alone

Re-running the scripts does not modify:

- Application source (`lib/`, native projects, and the rest of the app tree)
- `ai_specs/`
- `ai_docs/`
- Files already in `.cursor/plans/` (`mkdir -p` does not clear that directory)

Workflows in `ai_toolkit/workflows/` and guidance in `ai_toolkit/rules/` are read in place. The installer does not copy them into `.cursor/`. Updating the vendored toolkit updates those files directly; it does not rewrite them through the skill and rule copy steps.

`install-ignore.sh` creates or merges `.cursorignore` and `.cursorindexingignore` at the project root (appends missing template patterns only).
