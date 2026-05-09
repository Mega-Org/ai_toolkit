# Bootstrap session

## Purpose
Neutral, ordered playbook for starting or resuming an AI session: read `INDEX.md`, load aliases when running commands, load stack patterns, open active `ai_specs/` for feature work, optional `ai_docs/`.

## Fill when
- When session load order or optional steps change.

## References
- `ai_toolkit/INDEX.md`

## Content

Use **lite** or **full** bootstrap as described in `INDEX.md`. Full bootstrap is for new features, refactors, multi-file work, architecture changes, unclear-scope debugging, and PR preparation.

### Steps (full bootstrap)

1. **Entrypoint** — Read `ai_toolkit/INDEX.md` first.
2. **Task workflow** — If the task maps to a workflow in `INDEX.md` → `Task Routing`, open that workflow next (for example feature planning uses `workflows/feature-delivery/make-plan.md`).
3. **Rules** — Load `rules/` files for areas you will touch (see `INDEX.md` → `Rule Routing`). Prefer `_index.md` under each rules folder, then linked leaf files.
4. **Patterns** — Load `patterns/` files that match the stack areas in play (see `INDEX.md` → `Pattern Routing`).
5. **Aliases** — Read `alias/flutter.md` and `alias/firebase.md` only when you will run shell commands that rely on those shortcuts.
6. **App docs** — If the repo has `ai_docs/` (for example `ai_docs/architecture.md`, `ai_docs/conventions.md`), read them before changing boundaries between core and features or naming conventions.
7. **Active spec** — For spec-driven feature work, open the active file under the app’s `ai_specs/` (per-product specs stay in the app repo, not in this toolkit).

### Resume mid-task

- Re-read `INDEX.md` → `Defaults` and `Boundaries`.
- Re-open the workflow from step 2 above and any `ai_specs/` file that defines the current slice of work.
- Pull in additional `rules/` or `patterns/` only when the task expands into new areas.

### Missing paths

If `ai_docs/`, `ai_specs/`, or a referenced rules file does not exist yet, treat the path as the intended contract and continue with the nearest existing guidance in `INDEX.md`.
