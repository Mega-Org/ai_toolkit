# Templates (`templates/`)

## Purpose

Reusable Markdown skeletons for app-specific specs and documentation. Templates define structure only; project-specific facts belong in each app repo.

## Contents

| Folder | Topic |
|--------|-------|
| [`brd/`](brd/_index.md) | BRD knowledge base, feature business contract, and app-surface spec templates |
| [`design/`](design/_index.md) | Figma/design knowledge base, navigation graph, screen nodes, and feature design templates |
| [`api/`](api/_index.md) | API collection KB, per-feature gaps/edit-briefs, and collection handoff template |
| [`specs/`](specs/_index.md) | Root `ai_specs/` routing, feature implementation, fix, change, and integration spec templates |
| [`worklog/`](worklog/_index.md) | Root `ai_worklog/` daily tracking, TODOs, and saved reports |
| [`tooling/rc-admin/`](tooling/rc-admin/README.md) | Local Firebase RC admin scaffold (store review + updater) |
| [`docs/integration-manifest.md`](docs/integration-manifest.md) | App integration manifest for RC store-ops |
| [`docs/qa-intake.md`](docs/qa-intake.md) | Optional `ai_docs/qa-intake.md` — Excel/Jira column mapping for bugfix Mode B |
| [`app-seed/`](app-seed/README.md) | Thin `CLAUDE.md` / `AGENTS.md` / Cursor rule / Makefile snippet for each app |

## References

- Toolkit entrypoint: [`../INDEX.md`](../INDEX.md)
- BRD analysis workflow: [`../workflows/product-analysis/brd-analysis.md`](../workflows/product-analysis/brd-analysis.md)
- Design / Figma analysis workflow: [`../workflows/product-analysis/figma-analysis.md`](../workflows/product-analysis/figma-analysis.md)
- API collection analysis workflow: [`../workflows/api-analysis/_index.md`](../workflows/api-analysis/_index.md)
