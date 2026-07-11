# Flow Spec Template

## Purpose

Ordered cross-screen journey. References canonical screen slugs; does not duplicate full screen contracts.

## Meta

- Flow slug:
- Actor:
- Surface: customer | provider | admin | …
- Start node:
- Success end node:
- MVP: yes | no | partial

## Happy Path (Ordered Nodes)

1. `slug_a`
2. `slug_b`
3. `slug_c`

## Branches

| At node | Condition | Path / result |
|---------|-----------|---------------|
| splash | Already logged in | splash → home_root |
| auth_otp | Wrong code | stay + error state |

## Failure / Exit Paths

| At node | Condition | Result |
|---------|-----------|--------|
| | | TBD(product) / TBD(design) |

## Related Features

- `features/<feature>.md`

## Graph Refs

- Edges for these node IDs live in `analysis/navigation-graph.md`.
- Screen contracts: `screens/<slug>.md`

## Open Questions

- `TBD(design): ...`
- `TBD(product): ...`
