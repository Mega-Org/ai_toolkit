# App Surface Spec Template

## Surface Purpose

Describe what this app surface exists to support and which business outcomes it owns.

## Primary Actors

- List the actors who use this surface.
- Note secondary actors affected by this surface's actions.

## Main Journeys

1. Describe each primary journey from entry point to outcome.
2. Include approval, moderation, support, and notification handoffs.
3. Include cross-surface dependencies where one app surface changes another actor's experience.

## Screen Inventory

List required screens, dashboard modules, tabs, dialogs, or key sections. Keep this at business inventory level; leave Flutter layout and widgets to implementation specs.

| Screen or module | Purpose | Entry | Exit / next | BRD / design refs |
|------------------|---------|-------|-------------|-------------------|
| Example home | Landing after login | Auth success | Orders, profile | … |

- Use `TBD(design)` when a journey needs a screen that the BRD does not name.
- Link designs or implementation specs when available.

## Journey to Screen Map

| Journey | Ordered screens / modules | Notes |
|---------|---------------------------|-------|
| Example onboarding | splash → login → OTP → home | … |

- Every main journey should appear here.
- If a journey step has no screen, keep the step and mark the gap `TBD(design)`.

## Required Features

- Link feature business specs needed by this surface.
- Note whether each feature is read-only, editable, admin-managed, or externally triggered on this surface.

## Shared Business Rules

- Link global business rules from `analysis/`.
- Add surface-specific visibility, permissions, copy, RTL, or localization constraints.

## MVP Surface Scope

- List what this surface must support for the first release.

## Future Scope

- List deferred modules, journeys, integrations, or automation.

## Related Feature Specs

- Link related feature files, BRD analysis files, glossary, implementation specs, designs, or API docs.
