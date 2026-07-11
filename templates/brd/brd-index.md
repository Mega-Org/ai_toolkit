# BRD Knowledge Base Index Template

## Source Documents

- List original BRD files, source paths, versions, and dates when known.
- Note primary source language: Arabic | English | mixed.
- Note extraction method, OCR limitations, or missing source sections.
- Spec canonical language: English (default) | bilingual.

## How to Use This Knowledge Base

1. Start here before planning or implementing a feature.
2. Load `analysis/glossary.md` when naming, routing, or translating domain terms.
3. Load the routed feature file, app-surface file, and relevant cross-cutting analysis files.
4. Treat this knowledge base as business truth unless a newer approved spec explicitly overrides it.
5. Report conflicts, extensions, and missing detail before implementation.

## Knowledge Map

### Cross-Cutting Analysis

- Link glossary, product summary, business model, users and roles, apps and surfaces, MVP vs future scope, global business rules, statuses, and integrations.

### Feature Contracts

- Link each feature business spec.

### App Surfaces

- Link each customer, provider, admin, or other app-surface spec.

## Feature Task Routing

| Task or feature area | Load these files |
|----------------------|------------------|
| Example feature | `analysis/glossary.md`, `analysis/...`, `features/...`, `app_surfaces/...` |

## App-Surface Routing

| Surface | Load these files |
|---------|------------------|
| Example surface | `app_surfaces/...`, related `features/...`, `analysis/glossary.md` |

## Global Implementation Rules

- Keep Arabic-first and RTL-first assumptions when product copy or UI behavior is involved.
- Use glossary canonical English names in specs and cross-links; keep source terms in the glossary.
- Use app localization for user-facing strings.
- Preserve MVP vs future boundaries unless the user explicitly changes scope.
- Link implementation specs instead of duplicating technical details in BRD files.

## Ambiguity and TBD Policy

- Use `TBD(product): ...` for missing business decisions.
- Use `TBD(backend): ...` for API, data, lifecycle, or persistence questions.
- Use `TBD(design): ...` for UI, content, screen inventory, or interaction questions.
- Use `TBD(admin policy): ...` for moderation, approval, permissions, and operational policy questions.
