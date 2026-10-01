# Feature Name

Status: draft
Type: feature
Related BRD: `ai_specs/brd/features/<feature>.md` or `none`
Related design: `ai_specs/design/features/<feature>.md` or `none`
Related API: `ai_specs/api/features/<feature>/` or `none`
Surfaces: customer | provider | admin
Owner: product | design | backend | frontend
Last updated: YYYY-MM-DD

> **Execution:** [`plan.md`](plan.md) · **History:** [`history.md`](history.md)

<!-- Budget: keep ## Contract at 6 KB or less. Agents load this section first. Put background and alignment below it. -->

## Contract

Agreed facts for implementation. Prefer contract replies over collection snapshots (newer date wins within the same kind).

- **Endpoints:** method, path, auth
- **Fields:** request / response fields the app uses (name, type, nullability)
- **Rules:** app behavior that depends on those fields (status, eligibility, errors)
- **TBDs:** `TBD(owner): …` only after the user chooses TBD
- **l10n:** ARB section name (`@-SECTION-<name>-`)
- **Contracts:** `ai_specs/api/contracts/INDEX.md` — register rows for this slug (request / reply / gaps)

## Requirements

- User-facing goals:
- Non-goals:

## Feature Logic

- Happy path:
- Alternate paths:
- Error/blocked paths:

## Services And Integrations

- APIs, SDKs, Firebase, push, maps, payments, etc.
- Stub vs real HTTP scope:

## UI And UX

- Screens and navigation:
- State (Bloc/Cubit):
- Empty/loading/error:
- Localization and RTL:

## Figma References

- Prefer design KB: `ai_specs/design/features/<feature>.md` and linked `screens/<slug>.md`.
- Load Figma MCP only during UI phases; keep URLs here, not full dumps.
- Navigation: `ai_specs/design/analysis/navigation-graph.md`; do not implement `assumed` / `broken` edges unless accepted.

## Alignment

Links and difference flags only. Do not paste BRD / design / API body text here.

- BRD: `ai_specs/brd/features/<feature>.md` — differences: `none` | `Spec extends BRD` | `Spec conflicts with BRD` | `BRD has missing detail`
- Design: `ai_specs/design/features/<feature>.md` — differences: `none` | `Spec extends design` | `Spec conflicts with design` | `Design has missing detail` | `Unwired edges`
- API: `ai_specs/api/features/<feature>/` — differences: `none` | `Spec extends API` | `Spec conflicts with API` | `API has missing detail` | `Collection gaps`

## Open Questions

- `TBD(product): ...`

## Related Files

- Code paths:
- Contract replies:
