# Design Glossary Template

## Purpose

Map noisy Figma frame/layer names to stable English canonical slugs used across `ai_specs/design/`. Build this early and keep it updated when new screens appear. Bad Figma names are normalized here; analysis does not block on a Figma rename.

## Source Notes

- Primary mock language: Arabic | English | mixed
- Default direction intent: RTL | LTR | mixed | per `ai_docs/conventions.md`
- Spec canonical language for slugs: English (default)

## Term Map

| Figma frame / layer name | Canonical slug | Type | Feature | Naming quality | Notes |
|--------------------------|----------------|------|---------|----------------|-------|
| Example: Login V2 AR | auth_login | screen | authentication | noisy | Arabic mock |
| Example: Frame 128 | home_root | screen | home | noisy | Confirm with design |
| Example: Bottom Sheet - Filters | orders_filters | sheet | orders | good | |

Types: `screen` | `modal` | `sheet` | `tab-shell` | `component` | `variant` | `archive` | `junk`  
Naming quality: `good` | `noisy` | `duplicate` | `unknown`

## Aliases

| Alias / avoid | Use canonical slug instead |
|---------------|----------------------------|
| Sign in | auth_login |

## Naming Rules

- Use canonical slugs in `screens/` filenames, feature files, flows, graph node IDs, and cross-links.
- Keep raw Figma names here and on screen nodes under **Figma** / raw name fields.
- Do not rename a canonical slug mid-project without updating this glossary, the graph, screen filenames/links, and feature files.
- If two frames map to one screen, pick one slug; mark the other as `archive` or `variant` in the type column.
