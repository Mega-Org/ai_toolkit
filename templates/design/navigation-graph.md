# Navigation Graph Template

## Purpose

Single source of truth for all navigable design nodes and the edges between them. Feature files may repeat a **subgraph**; this file owns the full map.

## Nodes

| ID (slug) | Type | Feature | Surface | MVP | Direction | Figma URL | Screen file |
|-----------|------|---------|---------|-----|-----------|-----------|-------------|
| auth_login | screen | authentication | customer | yes | RTL | `https://www.figma.com/design/...?node-id=` | `screens/auth_login.md` |

Types: `screen` | `modal` | `sheet` | `tab-shell`

## Edges

| From | Trigger | To | Nav type | Guard / notes | Confidence |
|------|---------|----|----------|---------------|------------|
| auth_login | Tap Continue | auth_otp | push | Valid phone | prototype |
| auth_otp | System back | auth_login | pop | | inferred |
| profile | Tap Settings | TBD(design) | push | No target frame | broken |

Nav types (examples): `push` | `replace` | `pop` | `tab` | `present-modal` | `present-sheet` | `dismiss` | `deep-link`

Confidence:

| Value | Meaning |
|-------|---------|
| `prototype` | Figma prototype wire exists |
| `inferred` | From visible CTA, tab, or back affordance |
| `assumed` | Weak guess — needs design confirm; do not implement as route until accepted |
| `broken` | Missing or invalid target |

## Broken / Incomplete

| Issue | From / frame | Owner |
|-------|--------------|-------|
| Example: CTA has no target | profile → Settings | TBD(design) |

## Orphan Nodes

Frames classified as nodes but not referenced by any edge (and not intentional roots):

| ID | Action |
|----|--------|
| old_login_v1 | archive / out of scope |

## Intentional Roots / Entry Points

| ID | Why |
|----|-----|
| splash | App cold start |
| home_root | Post-auth root |

## Related

- Glossary: `analysis/glossary.md`
- Coverage: `analysis/coverage.md`
- Feature subgraphs: `features/*.md`
