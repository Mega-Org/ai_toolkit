# Make plan from spec

## Purpose
Phased planning from a feature spec; pulls in `ai_docs/` and BRD business analysis when present, then aligns phases with business rules, rules, and patterns.

## Fill when
- When your planning phases or spec format conventions change.

## References
- Optional paths in **your app repos** (not copied here): e.g. `ai_specs/`, `ai_docs/architecture.md`
- Optional BRD analysis in **your app repos** (not copied here): e.g. `ai_specs/brd/INDEX.md`, `ai_specs/brd/README.md`

## Content

Use this workflow after you have (or will create) a written spec for the feature—typically under the app’s `ai_specs/`.

### Usage

**When to use** — You have (or will write) a feature idea and want a **phased plan**: scope, surfaces, core vs feature placement, ordered phases, risks, and per-phase verification—aligned with this app’s `ai_docs/` and the shared toolkit.

**What you say** — Use natural language, for example: “Plan the feature from `ai_specs/checkout/README.md`,” or “Run make-plan for the payment flow we discussed.” You do **not** need a special command name; describing the goal is enough.

**What happens by default**

1. **Commit-first preflight (automatic)** — The agent follows [`../git/commit-before-work.md`](../git/commit-before-work.md) **without you asking**: checks `git status`, and if there are uncommitted changes, proposes a commit message and confirms before planning. **You do not need to say “do commit before work” every time**; it is the default for this workflow.
2. **Planning** — The agent runs the **Steps** below (restate scope, map surfaces, align with core, phase the work, risks, verification) and outputs a plan you can execute with [`implement-phase.md`](implement-phase.md).

**When you do need to say something extra** — Only if you want to **skip** the Git preflight (e.g. dirty tree on purpose). Then say **`make-plan --no-commits`** or plain language such as **“plan without committing first.”** Otherwise, stay silent; preflight still runs.

### Preflight: commit before planning

Before step 1 below, follow **`../git/commit-before-work.md`**: check `git status`; if there are uncommitted changes, **default to committing** with an AI-generated message after quick confirmation—unless the user used **`--no-commits`**. This is **default behavior**; the user does not need to request it explicitly each session.

### Inputs

1. **Spec** — The feature brief or requirement document (markdown or equivalent in `ai_specs/` or agreed location).
2. **`ai_docs/`** — When present, read `ai_docs/architecture.md` and `ai_docs/conventions.md` so the plan respects this app’s core vs feature layout and naming.
3. **BRD business analysis** — Search the app repo for `ai_specs/brd/INDEX.md`, `ai_specs/brd/README.md`, or a similar BRD analysis index. If found, read the index first, then load the feature-specific BRD files, app-surface files, and global rule/status files routed by that index.
4. **Toolkit** — Cross-check `ai_toolkit/INDEX.md` → `Defaults`, `Rule Routing`, and `Pattern Routing` for stack-wide constraints (Bloc/Cubit, Dio, injectable, json_serializable, Either/failures, etc.).

If the spec defines **current implementation scope** (e.g. UI + logic first, **stub HTTP** / `Future.delayed`, connect real API later), **restate that ordering** in phased delivery and point to the spec’s **Next session** / API cutover checklist so Phase B–E do not assume live endpoints prematurely. When the feature has network calls, note **feature-scoped API path constants** under the feature `data/` folder (single source for remote services; not in cubits)—see e.g. `ai_specs/authentication/README.md` §1.

### Steps

1. **Restate scope** — Summarize goals, non-goals, and acceptance criteria from the spec in your own words so gaps are visible early. If BRD analysis was found, include a short **Business alignment** summary naming the BRD files loaded and the business rules that constrain the feature.
2. **Map surfaces** — List UI entry points, state (Bloc/Cubit), data (repos, APIs), DI registrations, routing, l10n keys, and tests affected.
3. **Align with core** — Decide what belongs in shared `lib/core` vs the feature folder using app `ai_docs/` when available; otherwise follow `rules/core/_index.md` and linked core rules.
4. **Phase the work** — Break delivery into ordered phases (for example: models and API layer → repositories → domain/use cases → presentation → wiring → tests → docs). Each phase should be committable or reviewable on its own where possible. **Stub-first specs:** allow repository **stubs** early if the spec says so; reserve a later slice or explicit “next session” for **real Dio**, DTOs against production JSON, and base URL configuration—without inventing the checklist in chat when the spec already lists it.
5. **Risks and dependencies** — Flag migrations, flag/env changes, breaking API contracts, ordering constraints between phases, and any differences between the feature spec and BRD business truth:
   - **Spec extends BRD** — The spec introduces allowed new behavior not present in the BRD. Ask whether to update the BRD analysis or treat the feature spec as the approved override.
   - **Spec conflicts with BRD** — The spec contradicts BRD business truth. Pause for clarification unless the user explicitly approves the newer spec.
   - **BRD has missing detail** — Mark the gap as `TBD` and identify the likely owner (`product`, `backend`, `design`, or `admin policy`).
6. **Verification** — For each phase, note how you will verify it (unit/widget/integration tests, manual checks, affected platforms).

### Outputs

- A phased checklist or bullet plan you can execute with `workflows/feature-delivery/implement-phase.md` one slice at a time.
- Explicit pointers to which `rules/` and `patterns/` files apply per phase so implementation stays consistent with the toolkit.
- **Business references loaded** when BRD analysis exists, including the BRD index, feature files, app-surface files, and global rules/statuses used to shape the plan.
- A clear note for every BRD/spec difference found, using `Spec extends BRD`, `Spec conflicts with BRD`, or `BRD has missing detail`.

### After the plan

- Run **`workflows/feature-delivery/implement-phase.md`** for each phase (each run starts with **`../git/commit-before-work.md`** unless `--no-commits`).
- Use **`workflows/git/commit-after-phase.md`** if you commit per phase after completing work.
- Finish with **`workflows/feature-delivery/verify-and-pr.md`** when the feature is complete.
