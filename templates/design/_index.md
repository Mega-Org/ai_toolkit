# Templates: Design (`templates/design/`)

## Purpose

Reusable skeletons for app-specific design knowledge bases extracted from Figma (or similar). Copy these into the app repo's `ai_specs/design/` area and fill them with project-specific screen, flow, and navigation facts.

## Contents

| File | Topic |
|------|--------|
| [`design-index.md`](design-index.md) | Master index and task routing skeleton → `ai_specs/design/INDEX.md` |
| [`design-readme.md`](design-readme.md) | Short folder README skeleton → `ai_specs/design/README.md` |
| [`figma-sources.md`](figma-sources.md) | Figma file/page pointers → `source/figma-sources.md` |
| [`glossary.md`](glossary.md) | Raw Figma name → canonical slug glossary |
| [`design-system-notes.md`](design-system-notes.md) | Shared tokens/components inventory → `analysis/design-system.md` |
| [`navigation-graph.md`](navigation-graph.md) | All nodes + edges with confidence |
| [`coverage.md`](coverage.md) | Frame ↔ feature ↔ BRD ↔ implementation matrix |
| [`figma-hygiene.md`](figma-hygiene.md) | Optional design-facing rename/rewire backlog |
| [`feature-design-spec.md`](feature-design-spec.md) | Per-feature design contract → `features/<feature>.md` |
| [`flow-spec.md`](flow-spec.md) | Cross-screen journey → `flows/<flow>.md` |
| [`screen-node.md`](screen-node.md) | Leaf screen/modal/sheet → `screens/<slug>.md` |
| [`app-surface-design.md`](app-surface-design.md) | Per-surface design inventory → `app_surfaces/<surface>.md` |

## References

- Design workflow: [`../../workflows/product-analysis/figma-analysis.md`](../../workflows/product-analysis/figma-analysis.md)
- BRD templates (business side): [`../brd/_index.md`](../brd/_index.md)
- Design direction rule: [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md)
