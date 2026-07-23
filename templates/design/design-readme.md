# Design Knowledge Base

## Purpose

UI, screen inventory, navigation graph, and feature-clustered design contracts for this app. Extracted from Figma (or similar) via the toolkit workflow `workflows/product-analysis/figma-analysis.md`.

## Not This Folder

- Business rules, eligibility, MVP product scope → `ai_specs/brd/` when present.
- **Build** layer (implementation requirements, APIs, Bloc/Cubit, phased plans) → root `ai_specs/features/<feature>/` (`README.md` + `plan.md`) — not this folder’s `features/<slug>.md`.
- Flutter widgets, token Dart code, and layout trees → app source; map from design-system notes at implement time.

## Start Here

1. Read [`INDEX.md`](INDEX.md) for task routing.
2. Load `analysis/glossary.md` and `analysis/navigation-graph.md` when naming or routing.
3. Load the feature design file and only the screen nodes needed for the task.

## Source

- See [`source/figma-sources.md`](source/figma-sources.md).
