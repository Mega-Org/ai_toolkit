# Workflows: Product analysis (`workflows/product-analysis/`)

## Purpose

**Product and design-source analysis**: turn durable sources such as BRDs and Figma files into small, AI-readable contracts that app teams can use during planning and implementation.

These workflows write **analysis truth** under `ai_specs/brd/` and `ai_specs/design/` (and `ai_specs/api/screen-requirements/` for the design → API bridge). Flutter **build** specs (`README.md` + `plan.md`) stay under root `ai_specs/features/` via [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md).

## Contents

| File | Topic |
|------|--------|
| [`brd-analysis.md`](brd-analysis.md) | Extract, normalize, classify, and route BRD facts into app-specific `ai_specs/brd/` files |
| [`figma-analysis.md`](figma-analysis.md) | Extract screens, flows, navigation graph, and feature design contracts into `ai_specs/design/` |
| [`screen-data-analysis.md`](screen-data-analysis.md) | Derive per-screen data needs + expected API operations into `ai_specs/api/screen-requirements/` (design → API bridge; planning-only) |

Full end-to-end order (sources → build): [`../full-pipeline.md`](../full-pipeline.md).

## References

- BRD templates: [`../../templates/brd/`](../../templates/brd/)
- Design templates: [`../../templates/design/`](../../templates/design/)
- App specs live under each repo's `ai_specs/` (not in this toolkit). Layer map: [`../../templates/specs/spec-index.md`](../../templates/specs/spec-index.md).
- Workflow layout: [`../README.md`](../README.md)
- Feature handoff (build layer): [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md)
