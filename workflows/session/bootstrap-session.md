# Bootstrap session

## Purpose
Neutral, ordered playbook for starting or resuming an AI session: read `INDEX.md`, load aliases when running commands, load stack patterns, open active `ai_specs/` for feature work, optional `ai_docs/`.

## Fill when
- When session load order or optional steps change.

## References
- `ai_toolkit/INDEX.md`
- `ai_toolkit/workflows/session/_index.md`
- `ai_toolkit/rules/_index.md`
- `ai_toolkit/patterns/_index.md`

## Content

Use **lite** or **full** bootstrap as described in `INDEX.md`. Full bootstrap is for new features, refactors, multi-file work, architecture changes, unclear-scope debugging, and PR preparation.

### Steps (full bootstrap)

1. **Entrypoint** — Read `ai_toolkit/INDEX.md` first (section overviews table points to each folder’s `_index.md` / `workflows/README.md`).
2. **Task workflow** — If the task maps to a workflow in `INDEX.md` → `Task Routing`, open that workflow next (for example feature planning uses `workflows/feature-delivery/make-plan.md`). Subfolder maps: `workflows/feature-delivery/_index.md`, `workflows/maintenance/_index.md`, `workflows/git/_index.md`. For **`make-plan`** or **`implement-phase`**, the workflow includes Git preflight via [`../git/commit-before-work.md`](../git/commit-before-work.md) unless the user passes **`--no-commits`**.
3. **Rules** — Load `rules/_index.md` for a full map, then `_index.md` under each rules subfolder you touch, then linked leaf files.
4. **Patterns** — Load `patterns/_index.md`, then the subfolder `_index.md` (for example `patterns/data/_index.md`) and leaf files for the stack areas in play.
5. **Aliases** — Read `alias/_index.md` and the linked alias files only when you will run shell commands that rely on those shortcuts.
6. **App docs** — If the repo has `ai_docs/` (for example `ai_docs/architecture.md`, `ai_docs/conventions.md`), read them before changing boundaries between core and features or naming conventions.
7. **Active spec** — For spec-driven feature work, open the active file under the app’s `ai_specs/` (per-product specs stay in the app repo, not in this toolkit).

### Resume mid-task

- Re-read `INDEX.md` and [`README.md`](../../README.md) for defaults and boundaries.
- Re-open the workflow from step 2 above and any `ai_specs/` file that defines the current slice of work.
- Pull in additional rules (`rules/_index.md`) or patterns (`patterns/_index.md`) only when the task expands into new areas.

### Missing paths

If `ai_docs/`, `ai_specs/`, or a referenced toolkit file does not exist yet, treat the path as the intended contract and continue with the nearest existing guidance in `INDEX.md` or the relevant section `_index.md`.
