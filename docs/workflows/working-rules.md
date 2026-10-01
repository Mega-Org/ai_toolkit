# Shared working rules

Used by make-plan, implement-phase, and bugfix. The workflow files are checklists; this page is the explanation.

## Argument format

Every of those skills accepts:

```text
<feature|plan-path> [phase|next] [+tag -tag] [--load=a,b] [--full] [--commit]
```

- `feature` — slug under `ai_specs/features/<feature>/` (bugfix: fix slug or `ai_specs/fixes/...` path).
- `plan-path` — `ai_specs/features/<feature>/plan.md` when you pass a file instead of a slug.
- `phase` / `next` — implement-phase: named phase or first `Status: pending`. Ignored by make-plan. Bugfix: resume if a fix folder exists.
- `+tag` / `-tag` — add/remove LOADMAP tags on top of the phase `Load:` line.
- `--load=a,b` — extra relative paths (comma-separated) to read once.
- `--full` — every tagged LOADMAP **card** (still skip indexes and untagged leaves).
- `--commit` — show files + message and wait for yes (default is no commit). `--no-commits` is an alias for the default.

## Read once

Open each path at most once per run. Do not re-read `INDEX.md`, section `_index.md` files, or a contract reply after you already took the listed `#ID` slices. Prefer `limit` on Agent cards (`LOADMAP.md`: first 60 lines).

## Explore subagent

Send **broad** searches (find a widget, “where is X called”, unknown file layout) to an `explore` subagent. Keep the parent on the load list, diffs, and writes.

## Figma

1. Read `ai_specs/design/screens/<slug>.md` (Layout digest when present) **first**.
2. Call Figma MCP **per node** listed in this phase’s `Inputs` (or `+figma` screens). Do not fetch a whole Figma file.
3. Figma copy is language intent; user-visible strings go through l10n.

## Ask gate (scoped)

- **implement-phase / autopilot:** ask only about **this phase’s `Inputs`**. Prefer uninterrupted implementation once those Inputs suffice. Missing product/API still stops that phase.
- **make-plan / bugfix:** ask on loaded files for that slug/fix only.
- One numbered list. Do not invent contracts. User chooses decide-now or `TBD(owner)`.
- Missing backend contract → suggest `/backend-contract request <feature> [topic]`. Do not invent the reply.

## Split when too big

If `plan.md` exceeds **8 KB**, move `Status: done` phases into `history.md` ([`feature-history.md`](../../templates/specs/feature-history.md)). Do not duplicate them in `plan.md`.

## Memory (replace, do not append)

| File | Budget | Holds | Who writes |
|------|--------|-------|------------|
| `ai_specs/features/<feature>/memory.md` | 3 KB | code map, symbols, l10n section and keys, feature gotchas, agreed contract IDs | make-plan creates it empty; implement-phase replaces rows at handoff; `/backend-contract apply` replaces the contract row |
| `ai_docs/memory.md` | 4 KB | shared components, cross-feature gotchas (`app-memory` tag) | implement-phase and bugfix replace rows |

Replace the matching screen, symbol, key, gotcha, or contract-ID row. Do not append a second copy. If a write would pass the budget, drop the oldest row in that section first. Verify commands stay in `ai_docs/conventions.md`. An autopilot phase child does not write either file; it lists new facts in the handoff and the parent writes.

## l10n keys

Dry-run `make l10n-add` (or `./ai_toolkit/bin/l10n-add`) first. Show **one preview per phase**. Write only after the user says yes (`--apply`). Insert at the end of the named `@-SECTION-`. Placeholders only in `app_en.arb`. Docs: [`../tooling/l10n-add.md`](../tooling/l10n-add.md).

## Tests

Do not write, run, or scaffold tests unless the user asks. Skip `Tests` fields and test steps in older plans.

## Handoff (10 lines)

```text
Done: …
Files changed: …
Analyzer: …
Open items: …
Next: <exact command>
Context used: tags=…; inputs=…; cards=…
```

Keep it to about ten lines. No toolkit prose dump.
