# Templates (`templates/`)

## Purpose

Reusable Markdown skeletons for app-specific specs and documentation. Templates define structure only; project-specific facts belong in each app repo.

## Contents

| Folder | Topic |
|--------|-------|
| [`brd/`](brd/_index.md) | BRD knowledge base, feature business contract, and app-surface spec templates |
| [`design/`](design/_index.md) | Figma/design knowledge base, navigation graph, screen nodes, feature design templates, icon/image catalogs |
| [`api/`](api/_index.md) | API collection KB, backend contract request/reply/gaps/register, per-feature gaps/edit-briefs, collection handoff |
| [`specs/`](specs/_index.md) | Root `ai_specs/` README + compact INDEX, feature README/plan/history, fix, and integration templates |
| [`worklog/`](worklog/_index.md) | Root `ai_worklog/` daily tracking, TODOs, and saved reports |
| [`tooling/rc-admin/`](tooling/rc-admin/README.md) | Local Firebase RC admin scaffold (store review + updater) |
| [`docs/integration-manifest.md`](docs/integration-manifest.md) | App integration manifest for RC store-ops |
| [`docs/qa-intake.md`](docs/qa-intake.md) | Optional `ai_docs/qa-intake.md` — Excel/Jira column mapping for bugfix Mode B |
| [`app-seed/`](app-seed/README.md) | Thin `CLAUDE.md` / `AGENTS.md` / Cursor rule / Makefile snippet for each app |
| [`cursor-ignore/`](cursor-ignore/) | `.cursorignore` and `.cursorindexingignore` templates (installed by [`../setup/install-ignore.sh`](../setup/install-ignore.sh)) |

## References

- Toolkit entrypoint: [`../INDEX.md`](../INDEX.md)
- BRD analysis workflow: [`../workflows/product-analysis/brd-analysis.md`](../workflows/product-analysis/brd-analysis.md)
- Design / Figma analysis workflow: [`../workflows/product-analysis/figma-analysis.md`](../workflows/product-analysis/figma-analysis.md)
- API collection analysis workflow: [`../workflows/api-analysis/_index.md`](../workflows/api-analysis/_index.md)
