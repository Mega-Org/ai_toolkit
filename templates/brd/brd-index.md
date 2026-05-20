# BRD Knowledge Base Index Template

## Source Documents

- List original BRD files, source paths, versions, and dates when known.
- Note extraction method, OCR limitations, or missing source sections.

## How to Use This Knowledge Base

1. Start here before planning or implementing a feature.
2. Load the routed feature file, app-surface file, and relevant cross-cutting analysis files.
3. Treat this knowledge base as business truth unless a newer approved spec explicitly overrides it.
4. Report conflicts, extensions, and missing detail before implementation.

## Knowledge Map

### Cross-Cutting Analysis

- Link product summary, business model, users and roles, apps and surfaces, MVP vs future scope, global business rules, statuses, and integrations.

### Feature Contracts

- Link each feature business spec.

### App Surfaces

- Link each customer, provider, admin, or other app-surface spec.

## Feature Task Routing

| Task or feature area | Load these files |
|----------------------|------------------|
| Example feature | `analysis/...`, `features/...`, `app_surfaces/...` |

## App-Surface Routing

| Surface | Load these files |
|---------|------------------|
| Example surface | `app_surfaces/...`, related `features/...` |

## Global Implementation Rules

- Keep Arabic-first and RTL-first assumptions when product copy or UI behavior is involved.
- Use app localization for user-facing strings.
- Preserve MVP vs future boundaries unless the user explicitly changes scope.
- Link implementation specs instead of duplicating technical details in BRD files.

## Ambiguity and TBD Policy

- Use `TBD(product): ...` for missing business decisions.
- Use `TBD(backend): ...` for API, data, lifecycle, or persistence questions.
- Use `TBD(design): ...` for UI, content, or interaction questions.
- Use `TBD(admin policy): ...` for moderation, approval, permissions, and operational policy questions.
