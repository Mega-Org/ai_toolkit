# Design Knowledge Base Index Template

## Source Documents

- List Figma file URL(s), file keys, pages in scope, versions, and last synced dates when known.
- Link `source/figma-sources.md`.
- Note primary mock language / direction default: Arabic RTL | English LTR | mixed | per `ai_docs/conventions.md`.
- Spec canonical language for slugs and contracts: English (default).

## How to Use This Knowledge Base

1. Start here before planning or implementing UI for a feature.
2. Load `analysis/glossary.md` when naming screens, routing, or matching Figma frame labels.
3. Load `analysis/navigation-graph.md` when adding or changing routes.
4. Load the routed feature design file, relevant screen nodes, and flow files.
5. Load BRD (`ai_specs/brd/`) for business rules; do not treat design files as business policy.
6. Treat this knowledge base as UI/nav truth unless a newer approved design or user decision overrides it.
7. Report conflicts, extensions, and missing frames before implementation.
8. Do not implement edges marked `assumed` or `broken` unless the user accepts them.

## Knowledge Map

### Cross-Cutting Analysis

- Link glossary, design-system, navigation-graph, coverage, and optional figma-hygiene.

### Feature Design Contracts

- Link each `features/<feature>.md`.

### Flows

- Link each `flows/<flow>.md`.

### App Surfaces

- Link each customer, provider, admin, or other app-surface design file.

### Screen Nodes

- Prefer routing via feature files. List high-traffic screens here only when helpful; full set lives under `screens/`.

## Feature Task Routing

| Task or feature area | Load these files |
|----------------------|------------------|
| Example authentication UI | `analysis/glossary.md`, `analysis/navigation-graph.md`, `features/authentication.md`, `screens/auth_*.md` |

## Flow Routing

| Journey | Load these files |
|---------|------------------|
| Example onboarding | `flows/onboarding.md`, related `features/…`, listed `screens/…`, `analysis/navigation-graph.md` |

## App-Surface Routing

| Surface | Load these files |
|---------|------------------|
| Example customer | `app_surfaces/customer.md`, related `features/…`, `flows/…`, `analysis/glossary.md` |

## Global Implementation Rules

- Keep Arabic-first and RTL-first assumptions when mock copy or `ai_docs/conventions.md` implies them.
- Use glossary canonical slugs in screen files, feature files, graph, and cross-links; keep raw Figma names in the glossary.
- Use app localization for user-facing strings; Figma copy is l10n intent only.
- Prefer URLs + `node-id` in specs; load Figma via MCP during UI phases.
- Preserve MVP vs future / archive boundaries unless the user explicitly changes scope.
- Link BRD and `ai_specs/features/<feature>/` instead of duplicating business or implementation detail here.
- Follow [`design-direction-and-localization`](../../rules/flutter/design-direction-and-localization.md) at implement time.

## Ambiguity and TBD Policy

- Use `TBD(design): ...` for missing frames, unwired CTAs, variants, or interaction detail.
- Use `TBD(product): ...` when UI implies a business rule not confirmed in BRD.
- Use `TBD(backend): ...` when UI implies API, session, or persistence behavior.
- Use `TBD(admin policy): ...` for moderation or ops-only UI questions.
