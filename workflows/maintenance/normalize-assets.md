# Normalize assets workflow

## Purpose

Selectively rename and standardize **referenced** app assets (icons, images, optionally illustrations), then write or update design-side catalogs so agents and Figma/MCP sessions use stable filenames, getters, descriptions, and usage guidance.

**Not** a blind rewrite of every file under `assets/`. The user always scopes **kind** + **which files** (or “only files that fail convention”).

## Fill when

- Filename / folder conventions, catalog paths, codegen steps, or invocation modes change.
- New asset kinds (e.g. lotties) join this playbook.

## References

- Asset / flutter_gen rules: [`../../rules/core/config.md`](../../rules/core/config.md)
- SVG UI wrapper: [`../../rules/flutter/ui-composition.md`](../../rules/flutter/ui-composition.md) + app `ai_docs/conventions.md`
- Design KB layout: [`../product-analysis/figma-analysis.md`](../product-analysis/figma-analysis.md)
- Catalog templates: [`../../templates/design/icons-catalog.md`](../../templates/design/icons-catalog.md), [`../../templates/design/images-catalog.md`](../../templates/design/images-catalog.md)
- Bootstrap: [`../session/bootstrap-session.md`](../session/bootstrap-session.md)
- Commit before work: [`../git/commit-before-work.md`](../git/commit-before-work.md)
- App paths (when present): `assets/`, `lib/core/configs/values/assets_getters.dart`, `ai_docs/conventions.md`, `ai_specs/design/`

## How to invoke (users)

**When to use** — Exports or drops use mixed case, spaces, missing `-ic` / `_ic`, typos, or unclear names; or you need an AI-readable catalog before design/implement work.

**What you say** — Natural language or shorthand:

| Invocation | Meaning |
|------------|---------|
| `normalize-assets icons: …` | Mode A — only listed icon files (or paths) |
| `normalize-assets images: …` | Mode A — only listed image files / folders |
| `normalize-assets icons --failing` | Mode B — scan `assets/icons/` for convention failures only |
| `normalize-assets images --area onboarding` | Mode B — scan one images area folder |
| `normalize-assets icons --dry-run: …` | Propose renames + catalog rows; **do not** rename or codegen |
| `normalize-assets catalog-only icons` | Mode C — refresh catalog from disk + code usages; no renames |
| `normalize-assets --no-commits` | Skip commit-before-work |

Always name the **kind** (`icons` | `images` | `illustrations`). Never imply “all of `assets/`” unless the user explicitly asks for a full-tree pass for one kind.

## Inputs

1. **Kind** — `icons` | `images` | `illustrations` (maps to `assets/<kind>/`; do not touch `launcher_icon/`, `native_splash/`, `popular_sites_icons/` unless the user names them).
2. **Scope** — Explicit file list, paths, or Mode B scan filter. Optional: Figma layer/export names for catalog aliases.
3. **App convention** — Load `ai_docs/conventions.md` when present. If it locks **kebab** (`home-01-ic.svg`) or **snake** (`home_01_ic.svg`), follow that. Else use [`../../rules/core/config.md`](../../rules/core/config.md) default (**snake** + `_ic` for icons).
4. **Existing catalog** — `ai_specs/design/analysis/icons-catalog.md` and/or `images-catalog.md` when present (merge; do not wipe history of old names).

## Output shape (app repo)

```text
assets/icons/                    # renamed files (icons mode)
assets/images/<area>/            # renamed files (images mode)
ai_specs/design/analysis/
  icons-catalog.md               # required after icons work
  images-catalog.md              # required after images work
ai_specs/design/INDEX.md         # link catalogs under Cross-Cutting Analysis
lib/core/configs/values/
  assets.gen.dart                # regenerated — do not hand-edit
  assets_getters.dart            # AppIcons / AppImages aliases as needed
```

Optional later if catalogs grow: `ai_specs/design/analysis/assets/icons-catalog.md` (still under design `analysis/`).

## Naming conventions (final)

### Icons (`assets/icons/`)

| Rule | Value |
|------|--------|
| Role | UI glyphs only |
| Format | Prefer **SVG** |
| Case | lowercase ASCII `a-z`, `0-9`, separators only |
| Separator | **One style per app**: kebab `-` **or** snake `_` (see conventions / config) |
| Suffix | Always **`-ic`** (kebab) or **`_ic`** (snake) before extension |
| Pattern | `<meaning>[-_]<variant>[-_]<nn>[-_]?ic.svg` |
| Numbers | zero-padded `01`, `02` |
| Variants | `outline`, `filled`, `ios`, etc. when needed |

**Examples (kebab app):** `home-01-ic.svg`, `chat-bubble-03-ic.svg`, `building-02-filled-ic.svg`  
**Examples (snake app):** `home_01_ic.svg`, `chat_bubble_03_ic.svg`, `building_02_filled_ic.svg`

**Must-not:** spaces; `PascalCase` / mixed case (`…-Ic.svg`); missing icon suffix; vague names (`icon1.svg`); putting UI glyphs under `images/`.

**Code:** `AppIcons.<flutter_genCamel>` via `assets_getters.dart` + project SVG wrapper (`AppSvgIcon` / conventions).

### Images (`assets/images/`)

| Rule | Value |
|------|--------|
| Role | Photos, banners, onboarding art, brand rasters — **not** UI glyphs |
| Suffix | **No** `-ic` / `_ic` |
| Layout | `assets/images/<area>/<area>-<role>[-nn].<ext>` |
| Case | lowercase kebab (or snake if the app locks snake everywhere) |
| Formats | `png` / `jpg` / `webp` (typical); SVG only if it is brand/image art, not a chrome icon |

**Examples:** `assets/images/onboarding/onboarding-01.png`, `assets/images/splash/splash-bg.jpg`, `assets/images/home/daily-bookings.png`

**Code:** `AppImages…` via `assets_getters.dart` + `AppImage` (or app equivalent).

### Illustrations (`assets/illustrations/`)

Same naming spirit as images (no `-ic`). Catalog as a section in `images-catalog.md` or a dedicated file only if the app already treats illustrations separately.

## Invocation modes

### Mode A — Explicit list (default)

User names files or paths. Normalize **only** those. Prefer this when adding exports from Figma/design.

### Mode B — Failing convention scan

Scan the kind’s tree (or one `images/<area>/`) and select files that fail rules (wrong case, missing `-ic`/`_ic`, spaces, non-ASCII, inconsistent separators, obvious typos the user accepts fixing). Present the candidate list; wait for confirmation unless the user already said “apply all failing”.

### Mode C — Catalog only

No renames. Rebuild/enrich catalog rows from current disk names, flutter_gen getters, and code usages (`AppIcons.` / `AppImages.`).

### Dry-run

Any mode with `--dry-run`: print proposed renames, getter impact, and catalog diffs. Stop before filesystem renames and codegen.

## Preflight

1. **Bootstrap** — Lite for a short explicit list; Full if many renames or Dart call-site churn ([`../session/bootstrap-session.md`](../session/bootstrap-session.md)).
2. **Commit before work** — [`../git/commit-before-work.md`](../git/commit-before-work.md) unless `--no-commits` or dry-run.
3. **Load rules** — [`../../rules/core/config.md`](../../rules/core/config.md); app `ai_docs/conventions.md` for separator style and SVG wrapper.
4. **Confirm kind + scope** — If the user said “all assets” without a kind, ask once: icons, images, or both (separate passes).

## Steps

1. **Resolve convention** — Kebab vs snake; icon suffix; images folder layout. Record the choice in the catalog header if missing.
2. **Collect targets** — From user list (Mode A), scan (Mode B), or all catalogued files (Mode C). Exclude launcher/splash/popular_sites unless named.
3. **Propose canonical names** — For each target: old path → new path → expected getter. Fix clear typos (`cencel` → `cancel`) only when in scope; note breaking getter renames. **Dry-run stops here** after printing the table.
4. **User gate (Mode B / large Mode A)** — If more than a handful of files or any typo/semantic rename, show the table and proceed only after confirmation (or prior “apply all”).
5. **Rename files** — Apply filesystem renames. Prefer `git mv` when the tree is tracked.
6. **Update Dart references** — Grep old paths and old `AppIcons` / `AppImages` getters; update call sites. Do not leave raw `assets/…` strings in feature UI when a getter should exist.
7. **Regenerate assets** — From app root:

   ```bash
   dart run build_runner build --delete-conflicting-outputs
   ```

   Or the app’s documented alias (`fgen`, `make …`). Fix pubspec / flutter_gen errors if codegen fails; re-run.
8. **Wire getters** — Ensure `assets_getters.dart` still exposes `AppIcons` / `AppImages` (and any new aliases the app pattern requires). Do not teach features to import `assets.gen.dart`.
9. **Write / merge catalogs** — Create or update:
   - Icons → `ai_specs/design/analysis/icons-catalog.md` from [`icons-catalog.md`](../../templates/design/icons-catalog.md)
   - Images → `ai_specs/design/analysis/images-catalog.md` from [`images-catalog.md`](../../templates/design/images-catalog.md)

   For every touched asset, fill **description**, **use when**, **do not use when**, **features/screens**, **previous names**, and **getter**. Keep previous names as aliases so MCP/AI still find noisy exports. Merge; do not delete unrelated rows.
10. **Enrich usage** — Draft description/usage from filename + Figma context (if provided) + grep of getter usages. Mark uncertain rows `TBD` rather than inventing product meaning.
11. **Wire design INDEX** — Add catalog links under Cross-Cutting Analysis in `ai_specs/design/INDEX.md` (and README “How to use” if present). Point `ai_docs/conventions.md` at the catalog in one line when conventions exist.
12. **Verify** — Analyzer clean on touched Dart; spot-check a screen that uses a renamed icon; confirm catalog paths match disk.
13. **Handoff** — Summarize renames (old → new → getter), catalog path, and any `TBD` usage rows for the user to confirm.

## Catalog quality rules

- Catalogs live under **`ai_specs/design/analysis/`** (same cross-cutting layer as the design glossary).
- Prefer **description + use when + avoid when** so agents pick icons by meaning, not fuzzy filenames.
- Keep an **Index** table for quick scan and a **Catalog** section (or dense table) with full fields.
- Status values: `canonical` | `needs_rename` | `duplicate` | `deprecated`.
- Do not treat the catalog as business policy; it is UI asset truth for implementation and MCP design sessions.

## Agent loading order (after this workflow)

When starting UI / Figma MCP work that needs icons or images:

1. `ai_specs/design/INDEX.md`
2. `analysis/glossary.md` (screens)
3. **`analysis/icons-catalog.md`** and/or **`analysis/images-catalog.md`**
4. Feature + screen specs

## Out of scope

- Regenerating launcher icons / native splash pipelines (`flutter_launcher_icons`, splash YAML).
- Converting PNG icons to SVG (ask the user; do not invent vectors).
- Renaming files already matching convention unless the user wants semantic/typo fixes.
- Committing unless the user asks (follow git workflows separately).

## Done when

- [ ] Only in-scope files were renamed (or Mode C / dry-run completed as requested)
- [ ] Names match the app’s locked convention
- [ ] Codegen ran; call sites and getters updated
- [ ] Catalog MD updated with descriptions and usage guidance
- [ ] Design INDEX (and conventions pointer) wired
- [ ] User received old → new → getter summary + TBD list
