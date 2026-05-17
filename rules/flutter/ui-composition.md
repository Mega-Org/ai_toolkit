# UI composition (shared wrappers and layout)

## Purpose

Must / must-not guidance for **presentation-layer** widgets: prefer project-standard wrappers for images, SVG, and primary buttons; prefer minimal layout primitives when nothing is being decorated.

## Fill when

- When stack-wide expectations for media, icons, or buttons change.
- When you add or rename shared widgets documented per app in `ai_docs/conventions.md`.

## References

- Per-app class names and import paths: **`ai_docs/conventions.md`** in each repository (not duplicated here).
- Examples and neutral patterns: [`patterns/flutter/shared-media-and-buttons.md`](../../patterns/flutter/shared-media-and-buttons.md).

## Content

### Images and SVG

**Must:** In feature and shared UI code, load raster and network images through the **project’s image wrapper** (caching, placeholders, error handling) named in **`ai_docs/conventions.md`**. Do not use raw `Image.network` in screens/widgets unless **`ai_docs/conventions.md`** documents an exception.

**Must:** Render SVG assets and SVG URLs through the **project’s SVG wrapper** from **`ai_docs/conventions.md`**. Avoid scattering `SvgPicture.asset` / `SvgPicture.network` in feature UI unless extending that wrapper or an documented exception exists.

**Must-not:** Introduce a second ad-hoc image or SVG code path for the same concern without updating **`ai_docs/conventions.md`** or the shared widget.

### Buttons and primary actions

**Must:** Use the **project’s standard button(s)** for primary/secondary actions as listed in **`ai_docs/conventions.md`** (loading state, disabled state, theme). Prefer that over one-off `ElevatedButton` / `TextButton` composition unless the design system already exposes a variant or **`ai_docs/conventions.md`** allows raw Material buttons for a specific case.

### `Row` / `Column` uniform gaps (`spacing`)

**Must:** When **every** gap between **adjacent** children in a `Row` or `Column` is the **same**, set **`spacing`** on that flex widget (use **`Dimensions.*`** tokens). Do **not** interleave `SizedBox(width: …)` / `SizedBox(height: …)` between children for equal gaps.

```dart
Row(
  crossAxisAlignment: CrossAxisAlignment.start,
  spacing: Dimensions.p16,
  children: <Widget>[
    Expanded(child: column),
    Switch.adaptive(value: on, onChanged: onChanged),
  ],
)

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  spacing: Dimensions.p4,
  children: <Widget>[
    Text(title),
    Text(subtitle),
    if (showHint) Text(hint),
  ],
)
```

**Must-not:** Repeat the same `SizedBox` gap between every child when `spacing` on the parent applies.

**May:** Use `SizedBox` (or padding on a single child) when gaps **differ** between siblings, when only **some** pairs need space, or for space **outside** the flex (before the `Row`/`Column`, after the last child, or between unrelated subtrees).

**Should:** For `Wrap`, use **`spacing`** and **`runSpacing`** the same way when gaps are uniform along each axis.

### `SizedBox` vs `Container`

**Must:** Prefer **`SizedBox`** (or `SizedBox.shrink`) when you only need width/height constraints, spacing **outside** a uniform-gap `Row`/`Column`, or an empty gap **and** you do not need decoration, clip with decoration, `foregroundDecoration`, or non-trivial alignment responsibilities carried by `Container`.

**Must:** Use **`Container`** when you need **`BoxDecoration`** (color, border, radius, shadow), **`foregroundDecoration`**, or **`clipBehavior`** tied to that decoration, or when the widget’s role is explicitly “decorated box.”

**Should:** Prefer theme tokens and shared extensions (see [`../core/theme.md`](../core/theme.md), [`../core/config.md`](../core/config.md)) for colors, padding, and radii instead of hard-coded literals in new UI.
