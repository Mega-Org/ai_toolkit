# BRD Analysis Workflow

## Purpose

Create an app-specific BRD knowledge base from a source business requirements document. The output should be a set of concise Markdown contracts under the app repo's `ai_specs/brd/`, while this reusable workflow and its templates remain in `ai_toolkit/`.

## Fill When

- A project has a BRD, proposal, product brief, or similar source document that should become durable AI-readable context.
- Feature planning needs stable business truth before implementation starts.
- Existing `ai_specs/` files need to be checked against a broader business source.

## Inputs

1. **Source documents** — PDFs, Markdown, docs, OCR text, or exported notes. Store originals under the app repo, for example `ai_specs/brd/source/`.
2. **App context** — `ai_docs/`, existing `ai_specs/INDEX.md`, existing `ai_specs/`, localization or RTL conventions, and known app surfaces.
3. **Templates** — Use [`../../templates/brd/brd-index.md`](../../templates/brd/brd-index.md), [`../../templates/brd/feature-business-spec.md`](../../templates/brd/feature-business-spec.md), [`../../templates/brd/app-surface-spec.md`](../../templates/brd/app-surface-spec.md), and [`../../templates/brd/glossary.md`](../../templates/brd/glossary.md).

## Output Shape

Use this structure in the app repo unless the project already has a compatible BRD analysis layout:

```text
ai_specs/brd/
  README.md
  INDEX.md
  source/
  analysis/
    glossary.md
  features/
  app_surfaces/
```

Keep reusable extraction guidance in `ai_toolkit/`. Keep project-specific facts, rules, uncertainties, and references in `ai_specs/brd/`.
When the app uses a root `ai_specs/INDEX.md`, add or update its BRD entry so future agents route through the project-level specs map before loading BRD details.

## Steps

1. **Prepare the source set** — Identify the original BRD files and any companion specs. Preserve source filenames and note page, section, or heading references when available.
2. **Detect source language and quality** — Record whether sources are Arabic, English, or mixed. Note OCR noise, missing pages, scanned tables, or unreadable sections in `INDEX.md`. Treat source language separately from app UI language (Arabic BRD ≠ Arabic-only app).
3. **Build the glossary first** — Create `analysis/glossary.md` before naming features or surfaces. Map Arabic (or other source) terms to stable English canonical names used across `ai_specs/brd/`. Freeze those names for the project; do not rename mid-extraction without updating the glossary.
4. **Extract raw facts** — Read the source by section and capture facts without inventing missing backend, design, or policy behavior. When quoting ambiguous Arabic (or other source) wording, keep a short source snippet next to the English interpretation.
5. **Normalize into canonical contracts** — Convert noisy PDF or OCR text into clear business language in the project's canonical spec language (default: English contracts). Preserve Arabic-first, RTL-first assumptions where the product or UI copy implies them. Do not silently invent translations that change product meaning.
6. **Classify every fact** — Assign each fact to one of: product, actor, app surface, feature, business rule, validation or eligibility, status or enum, integration, admin control, MVP scope, future scope, screen or module, or ambiguity.
7. **Write cross-cutting analysis first** — Create concise files under `analysis/` for product summary, business model, users and roles, app surfaces, MVP vs future scope, global rules, statuses, integrations, and the glossary.
8. **Write feature contracts** — Create one file per feature under `features/` using `feature-business-spec.md`. Fill business flow, business rules, and the dedicated validation/eligibility section. Link **build** specs at root `ai_specs/features/<feature>/README.md` and execution plans at `plan.md` instead of duplicating them in BRD files (those paths are the Flutter delivery layer, not this BRD `features/` folder).
9. **Write app-surface journeys** — Create customer, provider, admin, or other surface files under `app_surfaces/` using `app-surface-spec.md`. Fill main journeys, screen inventory (purpose, entry, exit), and the journey-to-screen map. Use `TBD(design)` when a journey step has no named screen.
10. **Build the BRD index** — Use `brd-index.md` to route future agents from tasks to the right analysis, feature, and app-surface files. Record source language, OCR notes, and glossary link.
11. **Record ambiguities** — Mark uncertain details as `TBD` with an owner such as product, backend, design, or admin policy.
12. **Contradiction and coverage pass** — Compare sections for conflicting rules. Map every major source heading to analysis, feature, app-surface, future scope, or TBD. Report unmapped headings and unresolved conflicts before finishing.
13. **Review for scope leakage** — Remove implementation code from BRD files. Keep only business constraints and AI implementation notes needed to avoid misinterpretation.

## Quality Rules

- Keep files small enough for selective context loading.
- Put stable global business truth in `analysis/`.
- Put feature-specific behavior and rules in `features/`.
- Put actor journeys and screen/module boundaries in `app_surfaces/`.
- Prefer explicit `MVP scope` and `Future scope` sections over vague wording.
- Prefer English canonical names from the glossary in file names, headings, and cross-links; keep Arabic source terms in the glossary and in quoted snippets when useful.
- Capture field and eligibility validation in the feature **Validation and Eligibility** section, not only as loose business-rule bullets.
- Capture screens as inventory (purpose, entry, exit) plus journey-to-screen maps; leave Flutter layout, widgets, and navigation code to implementation specs.
- Do not invent missing business behavior, API shapes, screens, or validation messages.
- Do not silently resolve contradictions between BRD sections, or between the BRD and newer specs. Report the difference and ask which source wins unless the user already gave priority.
- Treat “nice to have”, “later”, or optional wording as Future scope unless the user marks it MVP.
- Admin-only or ops-only behavior belongs in a feature contract and an admin (or ops) app-surface file, not only in the customer surface.

## AI Decision Cases

| Case | Required behavior |
|------|-------------------|
| Ambiguous Arabic or OCR wording | Keep source snippet; write English interpretation only if confident; otherwise `TBD(product)` |
| Term appears with multiple translations | Pick one glossary canonical name; note aliases; do not use both names as separate features |
| Conflict between BRD sections | Record both; do not pick a winner unless the user already prioritized |
| Conflict between BRD and existing `ai_specs/` | Report both; ask which source wins unless the user already prioritized |
| Feature mentioned once with no flow | Create a feature stub and mark flow / validation as `TBD` |
| Journey step with no screen named | Keep the journey step; add `TBD(design)` in the screen inventory / map |
| Validation mentioned without field detail | Capture the business gate; mark field-level rules `TBD(product)` or `TBD(backend)` |
| UI copy appears in the BRD | Capture business meaning and locale notes; do not hardcode layout or English-only UI assumptions |
| Scope sounds optional or deferred | Put under Future scope, not MVP |

## Before Implementation

When a project has `ai_specs/brd/`, load the app BRD `INDEX.md` before planning or coding a feature. Then load the glossary (when present), the routed feature file, app-surface file, and relevant cross-cutting analysis files. Summarize which BRD references were used and call out whether the requested work extends, conflicts with, or leaves gaps in the BRD.
