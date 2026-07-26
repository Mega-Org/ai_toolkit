# App theme color tokens (`AppTheme` / `AppColors`)

## Purpose

Define **how to name and place new colors** in `lib/core/configs/theme/values/app_theme.dart` so tokens stay **app-wide and reusable**. Agents and humans should not introduce **feature- or screen-specific names** (e.g. `authHeaderBlue`, `checkoutBanner`) on `AppTheme`.

## Fill when

- Adding or renaming a color on `AppTheme`.
- Replacing hard-coded `Color(0x…)` in UI with `AppColors`.

## References

- Implementation: `lib/core/configs/theme/values/app_theme.dart`
- Access pattern: `lib/core/configs/values/colors.dart` (`AppColors` → `ThemeManager.instance.theme`)
- Related: [`theme.md`](theme.md), [`config.md`](config.md)

## Naming rules

1. **Single source** — Add colors as `final Color` fields on `AppTheme` (or `abstract final` where light/dark must diverge). Read them via **`AppColors.tokenName`** in UI.

2. **No feature/screen prefixes** — Prefer semantic, reusable roles: surface, background step, text tone, or an existing **scale** (primary, secondary, success, red, …).

3. **Backgrounds / surfaces**
   - Main scaffold: use existing **`backgroundColor`**, **`canvasBackgroundColor`**, **`cardColor`**, **`bgGreyColor`** when appropriate.
   - Extra muted layers: **`background1`**, **`background2`**, … for stepped neutrals (same hue family, increasing “lift” or separation from base).
   - Strong contrast bands (dark hero, inverse bar): **`surfaceDark`** or similar **role-based** names, not tied to one flow.

4. **Text / foreground neutrals**
   - Theme-driven copy: keep using **`text`**, **`text1`**, **`text2`**, **`text3`**, **`hintColor`** when they match.
   - Additional muted / inactive greys: use **`unactive`**, **`secondary*`**, or **`neutral*`** stops. Prefer an existing scale stop over inventing a one-off tone name.

5. **Palette scales** (primary, secondary, success, red, warning, …)
   - Insert intermediate steps as **`success450`**, **`primary350`**, etc., **between** existing stops when design lands between two shades.
   - Do **not** duplicate the same hex under a second name.

6. **Light vs dark**
   - If a token must differ by theme, use **`abstract final`** in `AppTheme` and implement in `LightTheme` / `DarkTheme`. Static finals stay identical across themes until you split them.

7. **File organization**
   - Keep **`app_theme.dart`** grouped: abstract semantic colors → shared `final` scales (secondary greys, reds, success, …) → **app-wide static tokens** (background steps, `surfaceDark`, `unactive`) → gradients.
   - Short section comments are encouraged; avoid duplicating long essays in multiple repos—link here instead.

## Checklist before merging a new color

- [ ] Name is reusable app-wide (not feature-specific).
- [ ] Hex is not already exposed under another token.
- [ ] Placement matches the sections above; scales stay ordered numerically.
- [ ] Call sites use **`AppColors.*`**, not raw literals (unless explicitly exempted).
