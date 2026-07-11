# Feature Design Spec Template

## Purpose

Describe the design/UI contract for this feature: screens, local navigation, states, and Figma pointers. Business rules belong in BRD; implementation detail belongs in `ai_specs/features/<feature>/`.

## Meta

- Feature slug:
- Surfaces: customer | provider | admin | …
- Status: MVP | future | mixed
- Design direction: RTL | LTR | mixed/TBD
- BRD feature file (when present): `ai_specs/brd/features/<feature>.md`
- Implementation spec (when present): `ai_specs/features/<feature>/README.md`

## Purpose (UI)

What user-visible problem this feature's screens solve.

## Screen Nodes

| Slug | Role | Type | Figma |
|------|------|------|-------|
| auth_login | Phone entry | screen | URL + node-id |

Link each slug to `screens/<slug>.md`.

## Feature Subgraph

Summarize local edges (happy path). Full graph remains in `analysis/navigation-graph.md`.

```text
example: splash → auth_login → auth_otp → home_root
```

| From | Trigger | To | Confidence |
|------|---------|----|------------|
| | | | |

## States Required

| State | Covered by frame / note |
|-------|-------------------------|
| Default | |
| Loading | |
| Empty | |
| Error / validation | |
| … | TBD(design) if missing |

## Shared Components Used

- Link names from `analysis/design-system.md` when useful.

## Flows That Include This Feature

- `flows/<flow>.md`

## BRD Alignment

- Status: aligns | extends BRD | conflicts | BRD missing detail | no BRD
- Notes / conflicts:

## Open Questions

- `TBD(design): ...`
- `TBD(product): ...`
- `TBD(backend): ...`

## Related Specs

- Screen nodes, flows, navigation-graph, glossary, BRD, implementation README
