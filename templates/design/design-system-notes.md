# Design System Notes Template

## Purpose

Shared visual and component inventory extracted from Figma. Descriptive only — map to `AppTheme`, `TextStyles`, and shared widgets during implementation. Do not invent token names that contradict existing app theme docs.

## Direction Default

- Default for in-scope mocks: RTL | LTR | mixed | per `ai_docs/conventions.md`

## Color Intents

| Figma name / swatch | Intent | App token (TBD if unknown) |
|---------------------|--------|----------------------------|
| Example Primary | Primary CTA fill | primary500? |

## Typography Intents

| Figma style | Size / weight | Map to TextStyles (nearest) |
|-------------|---------------|------------------------------|
| Example Title/Bold | 20 / Bold | bold20 or nearest |

## Spacing / Layout Intents

- Common paddings, radii, list gaps (descriptive):
- Safe area / bottom bar notes:

## Recurring Components

| Name | Used by features | Notes |
|------|------------------|-------|
| Example PrimaryButton | most | loading variant |
| Example AppTopBar | home, orders | back vs menu |
| Example TabBar | home shell | tab count |

## Shared Chrome

- App bars, tab shells, snackbars, dialogs patterns:

## Out of Scope

- Archive / exploratory frames
- One-off marketing art not used in app routes

## Related Rules

- Theme: app `ai_docs` + toolkit `rules/core/theme.md`, `app-theme-color-tokens.md`, `text-styles.md`
- Direction: `rules/flutter/design-direction-and-localization.md`
