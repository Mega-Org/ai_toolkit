# Feature Business Spec Template

## Purpose

Describe the business purpose of this feature and the user or operational problem it solves.

## Actors

- List primary and secondary actors.
- Note admin or external-service actors when they affect the feature.

## App Surfaces

- List customer, provider, admin, or other app surfaces that expose this feature.
- Link related app-surface specs.

## Business Flow

1. Describe the happy path in business terms.
2. Include approval, moderation, or notification points.
3. Include alternate paths that materially change user or admin outcomes.

## Business Rules

- Capture mandatory rules, eligibility, visibility, limits, ordering, validation, and policy constraints.
- Mark uncertain rules as `TBD(owner): question`.

## Statuses and Enums

- List canonical states and allowed transitions.
- Link shared statuses from `analysis/` when available.

## Data Concepts

- Name business entities and important fields without prescribing implementation classes.
- Note ownership, visibility, retention, and audit requirements when known.

## MVP Scope

- List behavior included in the first release.

## Future Scope

- List deferred, optional, or explicitly future behavior.

## Admin Controls

- List admin actions, moderation powers, approvals, reporting, and configuration related to this feature.

## Notifications

- List required customer, provider, admin, SMS, email, push, or in-app notifications.
- Note trigger events and recipient roles.

## Edge Cases

- List business-level edge cases such as blocked accounts, deleted content, expired subscriptions, invalid locations, or rejected approvals.

## AI Implementation Notes

- Point future agents to relevant BRD analysis files, app-surface specs, implementation specs, rules, and ambiguity notes.
- Include RTL or localization constraints when user-facing copy is involved.

## Related Specs

- Link related BRD feature files, app-surface files, implementation specs, designs, or API docs.
