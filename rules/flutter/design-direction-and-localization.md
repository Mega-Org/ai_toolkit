## Agent card

**LOADMAP tags:** `figma`
**Read rest of this file:** no, unless verifying mixed RTL/LTR, physical left/right exceptions, or the post-impl checklist.

### Must
- Detect direction once per screen: spec/Figma note → dominant copy → `ai_docs/conventions.md` default.
- Treat Figma copy as **language intent**, not literal strings or ARB keys.
- Prefer Flutter `Directionality` defaults; omit `textAlign` / extra alignment when defaults match.
- When explicit direction is needed, use semantic APIs: `TextAlign.start`, `AlignmentDirectional`, `EdgeInsetsDirectional`, `PositionedDirectional`.
- Map all user-visible Figma copy to l10n keys in every locale ARB.
- Record `RTL`, `LTR`, or `mixed/TBD` in the spec or phase notes.

### Must not
- Add `textAlign: TextAlign.right`, `Alignment.centerRight`, `EdgeInsets.only(left/right)`, or `children.reversed` just to match an Arabic screenshot.
- Infer direction from English title case alone.
- Apply English title case to Arabic strings.
- Hardcode Arabic or English from the mockup (stub placeholders excepted).
- Use physical `left`/`right` unless the control must stay on that physical edge in all locales.

### When to load the rest
- Need the defaults table, mirroring of chevrons, or the agent checklist at the bottom.

### Related (cards first)
- `+l10n` for ARB / `appLocalizer`; `+ui` for wrappers.

### Card protocol
- Default: this card is enough. Use `limit: 60` so you do not ingest the full leaf.
- Read the rest of **this** file only when **Read rest** is yes, or **When to load the rest** matches.
- Do not open `INDEX.md`, `rules/_index.md`, or `patterns/_index.md` to rediscover this leaf.
- Related files: open their **Agent cards** first; skip them if the other tag was not requested.
- No `tests` tag. Do not write or run tests. Do not commit unless the user asks.
- Edit in place; do not rewrite the whole leaf to “clean it up.”
- If the body is a stub (`Fill in later`), stop after this card; do not invent policy.
- Indexes, templates, and untagged leaves are not part of this tag.
- Spec templates, skills, and backend-contract work belong to later plan todos — not this card.

# Design direction and localization (Figma → Flutter)

## Purpose

Must / must-not guidance when turning **Figma**, Code Connect, or MCP design output into Flutter UI. Covers **locale/direction detection**, **semantic layout**, and **when not to add explicit alignment**.

Load this rule for any presentation phase that implements from a design file. Pair with [`../core/localization.md`](../core/localization.md) for ARB and `AppLocalizations` wiring.

## When to update this rule

- Figma-to-code intake, direction detection, or layout conventions change.
- App-level defaults (e.g. Arabic-first) are documented in `ai_docs/conventions.md` — link from here, do not duplicate per-app policy in this file.

## References

- Localization pipeline: [`../core/localization.md`](../core/localization.md)
- UI composition: [`ui-composition.md`](ui-composition.md)
- Per-app design defaults (when present): **`ai_docs/conventions.md`** in each repository
- Design KB extraction: [`../../workflows/product-analysis/figma-analysis.md`](../../workflows/product-analysis/figma-analysis.md), templates [`../../templates/design/_index.md`](../../templates/design/_index.md)
- Feature planning / implementation: [`../../workflows/feature-delivery/make-plan.md`](../../workflows/feature-delivery/make-plan.md), [`../../workflows/feature-delivery/implement-phase.md`](../../workflows/feature-delivery/implement-phase.md)

## Detect design direction (before coding UI)

Run this intake **once per screen or frame group** before writing layout code:

1. **Explicit source** — design KB screen node / feature design file, frame name, spec note, annotation, or feature `README.md` entry (preferred).
2. **Visible copy** — dominant Arabic ⇒ RTL intent; dominant English ⇒ LTR intent. Treat copy as **language intent**, not literal strings or keys.
3. **App default** — when unclear, follow **`ai_docs/conventions.md`** (e.g. Arabic-first for this product).

Record the result in the feature spec or phase notes: `RTL`, `LTR`, or `mixed/TBD`.

**Must-not:** infer direction from English **title case** alone (Figma placeholders, brands, and mixed copy are unreliable).

## Implementation priority (defaults first)

When `MaterialApp` locale and `Directionality` already match the design:

1. **Prefer Flutter defaults** — omit alignment, padding direction, and row reversal when the default already matches the design.
2. **Semantic direction when needed** — use `start` / `end` APIs so layout follows the active locale when the user switches language.
3. **Physical left/right last** — only when the element must stay on the same **physical** screen edge in both Arabic and English (rare).

### Defaults — do not add unless required

| Situation | Prefer | Avoid (to match Arabic screenshots) |
|-----------|--------|-------------------------------------|
| Body/title text | `Text(l10n.key)` with no `textAlign` | `textAlign: TextAlign.right` |
| Text that must align to reading edge | `textAlign: TextAlign.start` | `TextAlign.right` / `TextAlign.left` |
| Horizontal alignment | `AlignmentDirectional.centerStart` | `Alignment.centerRight` / `Alignment.centerLeft` |
| Padding / insets | `EdgeInsetsDirectional.only(start: …, end: …)` | `EdgeInsets.only(left: …, right: …)` |
| Positioned children | `PositionedDirectional(start: …, end: …)` | `Positioned(left: …, right: …)` |
| Row child order | Normal `Row` under `Directionality` | Manual `children.reversed` to fake RTL |

**Must-not:** add explicit `textAlign`, `Alignment`, `EdgeInsets`, or row reversal **only** because Arabic Figma shows content on the right. Right in an Arabic screenshot usually means **`start`**, which Flutter resolves from `Directionality` — often with **no extra property**.

### When explicit direction is allowed

**May** add semantic direction when:

- A parent forces a different alignment (e.g. `Center`, `Align`, intrinsic width) and text must still start at the reading edge.
- A design system component requires an explicit `textAlign` or `crossAxisAlignment`.
- Icons or affordances need mirroring (back chevrons, trailing actions) per platform/RTL conventions.

**May** use physical `left` / `right` only when the spec says the control stays on that **physical** side in all locales.

## Strings and copy

**Must:** Map all user-visible Figma copy to **localization keys** in every locale ARB — never hardcode Arabic or English from the mockup (placeholders excepted during stub UI).

**Must-not:** apply English title case to Arabic strings. Arabic has no title case; casing is a content/l10n concern per locale.

## Verify after implementation

- [ ] Screen read in **Arabic** (RTL): matches design intent without hardcoded `right`/`left`.
- [ ] Screen read in **English** (LTR): layout mirrors correctly via `start`/`end` (or defaults).
- [ ] Long Arabic labels wrap/truncate; mixed Arabic + digits/Latin render correctly.
- [ ] Directional icons (back, chevrons, trailing actions) mirror per Flutter/iOS RTL conventions.

## Agent checklist (presentation phases)

1. Load this rule + [`../core/localization.md`](../core/localization.md) + app `ai_docs/conventions.md` when the phase includes UI/Figma.
2. Detect and note design direction (`RTL` / `LTR` / `mixed`).
3. Implement layout with defaults first; add semantic direction only when needed.
4. Add l10n keys for all user-visible strings.
5. Verify in both supported locales when the app supports Arabic and English.
