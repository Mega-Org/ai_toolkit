# Images catalog template

## Purpose

Map noisy export names to canonical image paths and `AppImages` getters. Include **description** and **where to use / avoid** for banners, onboarding art, splash, and other non-glyph media.

Copy to the app repo as:

```text
ai_specs/design/analysis/images-catalog.md
```

Fill during [`../../workflows/maintenance/normalize-assets.md`](../../workflows/maintenance/normalize-assets.md). Merge updates; keep **Previous names** as search aliases.

**Not for UI icons** — those belong in [`icons-catalog.md`](icons-catalog.md) under `assets/icons/`.

## Convention

- Path pattern: `assets/images/<area>/<area>-<role>[-nn].<ext>`
- No `-ic` / `_ic` suffix on image files
- Code: `AppImages…` via `assets_getters.dart` + project image wrapper (`AppImage` / conventions)
- Last normalized: YYYY-MM-DD
- Optional: include `assets/illustrations/` rows in a separate section below

## Index (quick)

| Canonical path | Getter | One-line use |
|----------------|--------|--------------|
| Example: `images/onboarding/onboarding-01.png` | `(AppImages…)` | Onboarding page 1 hero |

## Catalog

### `onboarding-01` (example — replace with real images)

- **File:** `assets/images/onboarding/onboarding-01.png`
- **Getter:** document the flutter_gen / `AppImages` path used in this app
- **Previous names:** `Frame 128.png`, `onboarding1.PNG`
- **Description:** First onboarding hero illustrating the primary product pitch.
- **Visual notes:** full-bleed friendly; RTL-aware crop if needed
- **Use when:** onboarding step 1 only
- **Do not use when:** splash branding; in-app empty states (prefer illustrations); UI chrome icons
- **Known screens / features:** `onboarding_01`
- **Figma:** frame/export name; node id optional
- **Status:** `canonical` | `needs_rename` | `duplicate` | `deprecated`

## Dense table (optional alternative)

| Canonical path | Getter | Description | Use when | Avoid when | Features / screens | Previous names | Status |
|----------------|--------|-------------|----------|------------|--------------------|----------------|--------|
| `images/onboarding/onboarding-01.png` | … | Onboarding hero 1 | Step 1 | Splash, icons | `onboarding_01` | `Frame 128.png` | canonical |

## Illustrations (optional section)

| Canonical path | Getter | Description | Use when | Avoid when | Previous names | Status |
|----------------|--------|-------------|----------|------------|----------------|--------|
| `illustrations/empty-listings.png` | … | Empty my-listings state | Empty list | Onboarding heroes | … | canonical |

## Aliases

| Alias / avoid | Use canonical instead |
|---------------|------------------------|
| Example: `IMG_2938` | `images/home/promo-banner.png` |

## Naming rules (app)

- Group by `<area>` folder (`splash`, `onboarding`, `home`, `logo`, …).
- Kebab (or app-locked snake), lowercase, meaningful names — no `IMG_…` or `Frame N`.
- Do not place UI glyphs here; move them to `assets/icons/` via the normalize-assets workflow.
