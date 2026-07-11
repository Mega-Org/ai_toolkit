# Feature Name

Status: draft
Type: feature
Related BRD: `ai_specs/brd/features/<feature>.md`
Related design: `ai_specs/design/features/<feature>.md`
Surfaces: customer | provider | admin
Owner: product | design | backend | frontend
Last updated: YYYY-MM-DD

> **Execution plan:** [`plan.md`](plan.md) — phased delivery, progress, and verification. This file is requirements and contracts.

## Requirements

- User-facing goals:
- Non-goals:

## Feature Logic

- Happy path:
- Alternate paths:
- Error/blocked paths:

## Services And Integrations

- APIs, SDKs, Firebase, push, maps, payments, etc.
- Stub vs real HTTP scope (e.g. `Future.delayed` first, Dio later):

## API And Data Contract

- Endpoints, payloads, repository behavior:
- Cache/session rules:
- Feature API path constants location (`<feature>/data/api/`):
- `TBD(backend): ...`

## UI And UX

- Screens and navigation:
- State (Bloc/Cubit):
- Empty/loading/error:
- Localization and RTL:

## Figma References

- Prefer design KB when present: `ai_specs/design/features/<feature>.md` and linked `screens/<slug>.md` (URLs + node-ids there).
- Screen/flow name: `https://www.figma.com/design/...` (only if design KB is absent or incomplete)
- Load via Figma MCP during UI implementation phases; keep URLs here, not full design dumps.
- Navigation: follow `ai_specs/design/analysis/navigation-graph.md`; do not implement `assumed` / `broken` edges unless accepted.

## Business Alignment

- BRD feature file:
- App-surface files:
- BRD differences: `none` | `Spec extends BRD` | `Spec conflicts with BRD` | `BRD has missing detail`

## Design Alignment

- Design feature file:
- Screen slugs:
- Design differences: `none` | `Spec extends design` | `Spec conflicts with design` | `Design has missing detail` | `Unwired edges`

## Open Questions

- `TBD(product): ...`

## Related Files

- Code paths:
- BRD links:
