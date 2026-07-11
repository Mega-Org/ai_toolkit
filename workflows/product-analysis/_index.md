# Workflows: Product analysis (`workflows/product-analysis/`)

## Purpose

**Product and design-source analysis**: turn durable sources such as BRDs and Figma files into small, AI-readable contracts that app teams can use during planning and implementation.

## Contents

| File | Topic |
|------|--------|
| [`brd-analysis.md`](brd-analysis.md) | Extract, normalize, classify, and route BRD facts into app-specific `ai_specs/brd/` files |
| [`figma-analysis.md`](figma-analysis.md) | Extract screens, flows, navigation graph, and feature design contracts into `ai_specs/design/` |

## References

- BRD templates: [`../../templates/brd/`](../../templates/brd/)
- Design templates: [`../../templates/design/`](../../templates/design/)
- App specs live under each repo's `ai_specs/` (not in this toolkit).
- Workflow layout: [`../README.md`](../README.md)
- Feature handoff: [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md)
