# App Surface Design Template

## Surface Purpose

Describe what this app surface's UI exists to support (customer, provider, admin, …).

## Figma Pages

- List pages in scope for this surface (from `source/figma-sources.md`).

## Primary Actors

- Actors who use this surface's screens.

## Main Journeys

- Link `flows/<flow>.md` for each primary journey.
- Include cross-surface handoffs when a screen triggers another actor's UI.

## Screen Inventory

| Slug | Purpose | Entry | Exit / next | Figma |
|------|---------|-------|-------------|-------|
| example_home | Landing after login | Auth success | Orders, profile | URL |

- Use `TBD(design)` when a journey needs a screen that Figma does not name.
- Prefer glossary slugs; link `screens/<slug>.md`.

## Journey to Screen Map

| Journey (flow) | Ordered slugs | Notes |
|----------------|---------------|-------|
| onboarding | splash → auth_login → auth_otp → home_root | |

## Features on This Surface

| Feature design file | Role on this surface |
|---------------------|----------------------|
| `features/authentication.md` | editable | read-only | entry-only | …

## Shared Design Rules

- Direction / locale defaults for this surface
- Link `analysis/design-system.md` and global graph notes
- Surface-specific chrome (tab bar, drawer, admin shell)

## MVP Surface Scope

- Screens / flows required for first release

## Future Scope

- Deferred screens, flows, or Figma pages

## Related Specs

- BRD app-surface file when present: `ai_specs/brd/app_surfaces/<surface>.md`
- Navigation graph, glossary, feature design files
