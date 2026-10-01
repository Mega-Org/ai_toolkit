# Agent and workflow preferences (template)

Copy to **`ai_docs/preferences.md`** in each app. Agents read it when present (see `core-digest.mdc`). Replace values per team; do not invent a missing file.

## Commits

- Default **no commit** in make-plan, implement-phase, bugfix, backend-contract, autopilot Direct, verify-pr.
- `--commit` always shows files + message and waits for yes.

## Tests

- Out of scope unless the user asks. Skip test steps in older plans.

## Plans and specs

- make-plan writes **specs only**; live execution plan is `ai_specs/features/<feature>/plan.md`.
- Split done phases to `history.md` when plan exceeds 8 KB.

## Autopilot

- Prefer **Direct** on a feature branch; nothing pushed from autopilot.

## Loading

- Use LOADMAP tags + phase `Load`/`Inputs`; never browse `ai_toolkit/INDEX.md` during a phase.
- Measure context: `./ai_toolkit/bin/toolkit context <feature> [phase]`.

## Asking

- One focused question on real gaps only (contract, product conflict, architecture fork).

## l10n

- One dry-run preview per phase; `make l10n-add --apply` only after yes.

## Backend contracts

- Arabic summary kept in requests; register under `ai_specs/api/contracts/`; source order: agreed reply > reference doc > collection snapshot.

## Product defaults

- Arabic **RTL-first** when the product is Arabic-first; git host and verify command live in `ai_docs/conventions.md` (for example GitLab and `make analyze`); upstream toolkit changes land in `ai_toolkit/` first.

## Chat

- Prefer code citations and short handoffs; no drive-by refactors.
