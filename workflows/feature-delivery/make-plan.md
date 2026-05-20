# Make plan from spec

## Purpose

Phased planning for a product feature: capture requirements in a durable feature spec, generate or refresh a tracked execution plan, and align with BRD business analysis, `ai_docs/`, and toolkit rules/patterns.

## Fill when

- Planning phases, spec/plan file layout, or make-plan invocation modes change.

## References

- App paths (per repo): `ai_specs/INDEX.md`, `ai_specs/features/<feature>/README.md`, `ai_specs/features/<feature>/plan.md`, `ai_docs/architecture.md`, `ai_docs/conventions.md`
- BRD (when present): `ai_specs/brd/INDEX.md`, `ai_specs/brd/README.md`
- Templates: [`../../templates/specs/feature-implementation-spec.md`](../../templates/specs/feature-implementation-spec.md), [`../../templates/specs/feature-plan.md`](../../templates/specs/feature-plan.md)
- Next step: [`implement-phase.md`](implement-phase.md)

## Feature folder contract

Each feature uses:

```text
ai_specs/features/<feature>/
  README.md   # requirements, logic, services, API/UI contracts, Figma links
  plan.md     # phased plan, progress, verification, done/pending
```

- **`README.md`** is stable feature truth (what to build).
- **`plan.md`** is execution state (how to build it, what is done). **Always write or update `plan.md` during make-plan** — do not leave the plan only in chat or `.cursor/plans/`.

If the app has `ai_specs/INDEX.md`, read it first.

## Usage

**When to use** — You want a phased delivery plan for a feature, either from an existing spec or from a new requirements message.

**What you say** — Natural language is enough. Examples:

- `make-plan feature authentication` (with requirements, logic, services, UI, Figma URLs in the same message)
- `Plan from ai_specs/features/checkout/README.md`
- `make-plan --no-commits` to skip Git preflight

**Default behavior**

1. **Commit-first preflight** — [`../git/commit-before-work.md`](../git/commit-before-work.md) unless `--no-commits`.
2. **Spec + plan files** — Create or update `README.md` and **`plan.md`** under `ai_specs/features/<feature>/`.
3. **Planning steps** — Run the **Steps** below.
4. **Handoff** — User runs [`implement-phase.md`](implement-phase.md) per phase; each phase updates `plan.md`.

## Invocation modes

### Mode A — Plan from existing spec

Use when `ai_specs/features/<feature>/README.md` already exists.

1. Load `README.md` (+ BRD + `ai_docs/` per Inputs).
2. Create or refresh `plan.md` from the spec.
3. Do **not** rewrite `README.md` unless the user asked to update requirements.

### Mode B — Spec + plan from user message (preferred for new features)

Use when the user provides requirements in chat (logic, services, UI, Figma URLs, backend constraints).

1. Create `ai_specs/features/<feature>/` if missing.
2. **Write or update `README.md`** — capture requirements, feature logic, services/integrations, API assumptions, UI/UX, **Figma references** (URLs only in the spec; load design via Figma MCP during UI phases, not necessarily during planning).
3. Align with BRD when present; mark `TBD(owner): ...` for gaps.
4. **Write or update `plan.md`** — phased checklist with status `pending` for each phase, verification per phase, risks, rules/patterns pointers.
5. Set feature `Status` in `README.md` header to `draft` or `in-progress` as appropriate.

If the feature name is unclear, ask before writing files.

## Preflight: commit before planning

Before step 1, follow [`../git/commit-before-work.md`](../git/commit-before-work.md) unless `--no-commits`.

## Inputs

1. **Feature identity** — Slug folder name under `ai_specs/features/<feature>/` (e.g. `authentication`, `notifications`).
2. **User requirements** (Mode B) — Purpose, flows, services, API/stub scope, UI notes, Figma links, flavors/surfaces, non-goals.
3. **`README.md`** — Feature contract when it exists or after Mode B writes it.
4. **`ai_docs/`** — `architecture.md`, `conventions.md` when present.
5. **BRD** — `ai_specs/brd/INDEX.md` and routed feature/app-surface/analysis files when present.
6. **Toolkit** — `ai_toolkit/INDEX.md` → Defaults, Rule Routing, Pattern Routing.

**Stub-first:** If the spec or user says UI/domain first with stub HTTP, order phases accordingly and copy any **Next session** / API cutover checklist into `plan.md` — do not assume live endpoints in early phases.

**Network features:** Note feature-scoped API path constants under `<feature>/data/api/` (remote datasources only; not cubits) — see [`../../patterns/data/feature-data-layer.md`](../../patterns/data/feature-data-layer.md).

## Steps

1. **Restate scope** — Goals, non-goals, acceptance criteria. If BRD was loaded, add **Business alignment** (files + constraining rules).
2. **Map surfaces** — UI entry points, Bloc/Cubit, data/repos/APIs, DI, routing, l10n, tests.
3. **Align with core** — Core vs feature placement (`ai_docs/` or `rules/core/_index.md`).
4. **Phase the work** — Ordered, committable phases in **`plan.md`** (e.g. contract → data → domain → presentation → wiring → tests). Each phase: **Status**, **Deliverables**, **Verification**, **Rules/patterns** links.
5. **Risks and dependencies** — BRD/spec differences: `Spec extends BRD` | `Spec conflicts with BRD` | `BRD has missing detail`.
6. **Persist files** — Update `plan.md` (required). Update `README.md` in Mode B or when requirements changed. Update `ai_specs/INDEX.md` **Current Active Specs** if this feature is new.

## Outputs

- **`ai_specs/features/<feature>/plan.md`** — canonical phased plan and progress tracker.
- **`ai_specs/features/<feature>/README.md`** — created or updated in Mode B (or unchanged in Mode A).
- Pointers to `rules/` and `patterns/` per phase in `plan.md`.
- **Next:** [`implement-phase.md`](implement-phase.md) for the first `pending` phase.

## After the plan

- Run **`implement-phase.md`** per phase (bootstrap + commit-before-work unless `--no-commits`).
- **`implement-phase`** must update `plan.md` after each phase (status, verification, notes, **Next**).
- Use [`../git/commit-after-phase.md`](../git/commit-after-phase.md) when committing per phase.
- Finish with [`verify-and-pr.md`](verify-and-pr.md) when all phases are `done`.
