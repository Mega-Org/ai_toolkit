# BRD Analysis Workflow

## Purpose

Create an app-specific BRD knowledge base from a source business requirements document. The output should be a set of concise Markdown contracts under the app repo's `ai_specs/brd/`, while this reusable workflow and its templates remain in `ai_toolkit/`.

## Fill When

- A project has a BRD, proposal, product brief, or similar source document that should become durable AI-readable context.
- Feature planning needs stable business truth before implementation starts.
- Existing `ai_specs/` files need to be checked against a broader business source.

## Inputs

1. **Source documents** — PDFs, Markdown, docs, OCR text, or exported notes. Store originals under the app repo, for example `ai_specs/brd/source/`.
2. **App context** — `ai_docs/`, existing `ai_specs/`, localization or RTL conventions, and known app surfaces.
3. **Templates** — Use [`../../templates/brd/brd-index.md`](../../templates/brd/brd-index.md), [`../../templates/brd/feature-business-spec.md`](../../templates/brd/feature-business-spec.md), and [`../../templates/brd/app-surface-spec.md`](../../templates/brd/app-surface-spec.md).

## Output Shape

Use this structure in the app repo unless the project already has a compatible BRD analysis layout:

```text
ai_specs/brd/
  README.md
  INDEX.md
  source/
  analysis/
  features/
  app_surfaces/
```

Keep reusable extraction guidance in `ai_toolkit/`. Keep project-specific facts, rules, uncertainties, and references in `ai_specs/brd/`.

## Steps

1. **Prepare the source set** — Identify the original BRD files and any companion specs. Preserve source filenames and note page, section, or heading references when available.
2. **Extract raw facts** — Read the source by section and capture facts without inventing missing backend, design, or policy behavior.
3. **Normalize language** — Convert noisy PDF or OCR text into clear business language. Preserve Arabic-first, RTL-first assumptions where the product or UI copy implies them.
4. **Classify every fact** — Assign each fact to one of: product, actor, app surface, feature, business rule, status or enum, integration, admin control, MVP scope, future scope, or ambiguity.
5. **Write cross-cutting analysis first** — Create concise files under `analysis/` for product summary, business model, users and roles, app surfaces, MVP vs future scope, global rules, statuses, and integrations.
6. **Write feature contracts** — Create one file per feature under `features/` using `feature-business-spec.md`. Link any existing implementation spec instead of duplicating it.
7. **Write app-surface journeys** — Create customer, provider, admin, or other surface files under `app_surfaces/` using `app-surface-spec.md`.
8. **Build the BRD index** — Use `brd-index.md` to route future agents from tasks to the right analysis, feature, and app-surface files.
9. **Record ambiguities** — Mark uncertain details as `TBD` with an owner such as product, backend, design, or admin policy.
10. **Review for scope leakage** — Remove implementation code from BRD files. Keep only business constraints and AI implementation notes needed to avoid misinterpretation.

## Quality Rules

- Keep files small enough for selective context loading.
- Put stable global business truth in `analysis/`.
- Put feature-specific behavior and rules in `features/`.
- Put actor journeys and screen/module boundaries in `app_surfaces/`.
- Prefer explicit `MVP scope` and `Future scope` sections over vague wording.
- Do not silently resolve contradictions between the BRD and newer specs. Report the difference and ask which source wins unless the user already gave priority.

## Before Implementation

When a project has `ai_specs/brd/`, load the app BRD `INDEX.md` before planning or coding a feature. Then load the routed feature file, app-surface file, and relevant cross-cutting analysis files. Summarize which BRD references were used and call out whether the requested work extends, conflicts with, or leaves gaps in the BRD.
