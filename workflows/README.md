# Workflows (`workflows/`)

## Purpose

**Ordered playbooks** for sessions, feature delivery, maintenance, and git-aligned commits. This folder uses **`workflows/`** (not `commands/`) so naming stays tool-neutral; intent matches command-style playbooks in some AI products. Task routing tables also appear in [`INDEX.md`](../INDEX.md).

## Subfolders by intent

| Subfolder | Role | Overview |
|-----------|------|----------|
| [`session/`](session/_index.md) | Start or resume a session; load context in a fixed order | [`session/_index.md`](session/_index.md) |
| [`feature-delivery/`](feature-delivery/_index.md) | Spec-driven planning, phased implementation, verify / PR — writes **build** layer `ai_specs/features/` | [`feature-delivery/_index.md`](feature-delivery/_index.md) |
| [`product-analysis/`](product-analysis/_index.md) | Turn BRDs, Figma, and product sources into app-specific AI-readable specs (`brd/`, `design/`) | [`product-analysis/_index.md`](product-analysis/_index.md) |
| [`api-analysis/`](api-analysis/_index.md) | Ingest/analyze/reanalyze API collections; pack collection handoff (questions + collection edits) | [`api-analysis/_index.md`](api-analysis/_index.md) |
| [`maintenance/`](maintenance/_index.md) | Bugs, refactors, dependency upgrades, normalize assets | [`maintenance/_index.md`](maintenance/_index.md) |
| [`git/`](git/_index.md) | Commit before plan/phase work; commits after phases | [`git/_index.md`](git/_index.md) |
| [`worklog/`](worklog/README.md) | Daily worklog, TODOs, management reports | [`worklog/README.md`](worklog/README.md) |
| [`integration/`](integration/_index.md) | Cross-cutting integrations (Firebase RC store-ops, etc.) | [`integration/_index.md`](integration/_index.md) |

**Naming:** this `workflows/` tree = agent playbooks. App file `ai_specs/api/analysis/workflows.md` = API **journeys**, not playbooks. Spec layer map: [`../templates/specs/spec-index.md`](../templates/specs/spec-index.md).

Add new workflow files under the closest subfolder. If something spans categories, note it here and in [`INDEX.md`](../INDEX.md) task routing.

## Fill when

- When you add a new workflow subfolder or rename workflow categories.

## References

- Toolkit entrypoint: [`INDEX.md`](../INDEX.md)
- Enforceable rules: [`rules/_index.md`](../rules/_index.md)
- Patterns / examples: [`patterns/_index.md`](../patterns/_index.md)
