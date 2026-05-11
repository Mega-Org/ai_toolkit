# Shared media and buttons (neutral pattern)

## Purpose

Implementation-oriented guidance for **using** project-standard image, SVG, and button widgets. Class names and imports differ per app — always resolve them from **`ai_docs/conventions.md`** in the repo you are editing.

## When to load

- Implementing or refactoring screens, dialogs, and shared UI that show images, icons, or primary actions.
- After reading [`../../rules/flutter/ui-composition.md`](../../rules/flutter/ui-composition.md).

## References

- Enforceable rules: [`../../rules/flutter/ui-composition.md`](../../rules/flutter/ui-composition.md)
- Theme and tokens: [`../../rules/core/theme.md`](../../rules/core/theme.md), [`../../rules/core/config.md`](../../rules/core/config.md)
- Responsive layout: [`responsive-and-layout.md`](responsive-and-layout.md)

## Neutral patterns (replace types with your app’s names)

### Raster / network / asset images

- Use the app’s **image wrapper** for URLs and asset paths so caching, memory hints, and error UI stay consistent.
- If the design calls for a circle or rounded card treatment, use **named constructors or factories** on that wrapper when the app provides them (avatar, thumbnail with radius), instead of re-wrapping `Image` with ad-hoc `ClipRRect` in every feature.

### SVG

- Use the app’s **SVG wrapper** for vector icons and illustrations from assets or URLs.
- Pass explicit **size** (`size` or `height`/`width`) and optional **color** when the design specifies them; prefer theme or config tokens for colors where possible.

### Primary actions

- Use the app’s **standard button** with **`text`**, **`onPressed`**, and flags for **loading** / **enabled** as defined by that widget.
- Put async work in the Cubit/Bloc (or use case); drive **`loading`** from state rather than inventing a second spinner layer on the button unless the shared API requires it.

### Layout hygiene

- Spacing-only gaps: **`SizedBox`** with height/width (or the app’s spacing extensions if documented).
- Decorative surfaces: **`Container`** (or themed surfaces) with **`BoxDecoration`** as needed — do not use `Container` with only a fixed size and no decoration when `SizedBox` suffices.

## Checklist (before merge)

- [ ] No raw `Image.network` / ad-hoc SVG in feature UI unless `ai_docs/conventions.md` allows it.
- [ ] Buttons use the app’s shared API; loading/disabled behavior matches state.
- [ ] No redundant `Container` where `SizedBox` is enough.
- [ ] Concrete widget names and imports match **`ai_docs/conventions.md`** for this repository.
