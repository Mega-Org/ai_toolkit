# Icons catalog template

## Purpose

Map noisy export / Figma layer names to canonical icon files and `AppIcons` getters. Include **description** and **where to use / avoid** so agents pick the right glyph during UI and Figma MCP work.

Copy to the app repo as:

```text
ai_specs/design/analysis/icons-catalog.md
```

Fill during [`../../workflows/maintenance/normalize-assets.md`](../../workflows/maintenance/normalize-assets.md). Merge updates; keep **Previous names** as search aliases.

## Convention

- Path pattern: `assets/icons/<name>-ic.svg` **or** `assets/icons/<name>_ic.svg` (lock one separator style in `ai_docs/conventions.md`)
- Code: `AppIcons.<getter>` via `assets_getters.dart` + project SVG wrapper
- Last normalized: YYYY-MM-DD
- Separator style: kebab | snake

## Index (quick)

| Canonical file | Getter | One-line use |
|----------------|--------|--------------|
| Example: `home-01-ic.svg` | `AppIcons.home01Ic` | Home tab / property home affordance |

## Catalog

### `home-01-ic` (example — replace with real icons)

- **File:** `assets/icons/home-01-ic.svg`
- **Getter:** `AppIcons.home01Ic`
- **Previous names:** `Home 01.svg`, `home01.svg`
- **Description:** Outline house mark; primary “home / property” glyph in chrome and listing rows.
- **Visual notes:** outline (not filled); pair with `home-filled-ic` for selected tab when that asset exists.
- **Use when:** bottom nav Home; property/home type chips; empty states about listings home.
- **Do not use when:** favorites (`heart-ic` / `favorite-*`); user profile (`user-ic`); office/building type (`building-0x-ic`).
- **Known screens / features:** `home`, `property_card` (slugs from design glossary when known)
- **Code examples (optional):** path to a representative Dart usage
- **Figma:** layer/export name; node id optional
- **Status:** `canonical` | `needs_rename` | `duplicate` | `deprecated`

<!-- Repeat one subsection per icon, or use the dense table below if the set is large. -->

## Dense table (optional alternative)

| Canonical file | Getter | Description | Use when | Avoid when | Features / screens | Previous names | Status |
|----------------|--------|-------------|----------|------------|--------------------|----------------|--------|
| `home-01-ic.svg` | `home01Ic` | Outline house… | Home tab, property home | Favorites, profile | `home` | `Home 01.svg` | canonical |

## Aliases

| Alias / avoid | Use canonical instead |
|---------------|------------------------|
| Example: `Home Icon` | `home-01-ic` |

## Naming rules (app)

- UI glyphs live under `assets/icons/` only.
- Always include the icon suffix (`-ic` / `_ic`).
- Prefer zero-padded variants (`-01`, `-02`) and explicit `filled` / `outline` when both exist.
- Do not rename a canonical file mid-project without updating this catalog, codegen, and Dart call sites.
