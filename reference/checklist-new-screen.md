# Checklist: new screen

## Purpose

Lightweight checklist when adding a new screen or route.

## Fill when

Navigation, page scaffold, or DI patterns change.

## References

- Page + Cubit: [`../patterns/flutter/page-bloc-provider.md`](../patterns/flutter/page-bloc-provider.md)
- Router: [`../rules/core/router.md`](../rules/core/router.md)
- Design screen file: `ai_specs/design/screens/<surface>/<slug>.md` (read before Figma MCP)

## Content

1. **Spec** — Row in feature `README.md` / phase `Touches`; Figma node in design KB when UI is new.
2. **Route** — `AppRouter` static `open()` + route name constant; no raw `Navigator.push` except nested/dialog cases (comment why).
3. **Page** — `StatelessWidget` page + `_View` `State` when controllers/pagination needed; `BlocProvider` at page root.
4. **State** — Cubit + `SafeEmitMixin`; `Async<T>` or composite state per [`../patterns/state/cubit-structure.md`](../patterns/state/cubit-structure.md).
5. **Data** — Use case → repository → inline remote DS per [`../patterns/data/feature-data-layer.md`](../patterns/data/feature-data-layer.md).
6. **DI** — `@injectable` / `@lazySingleton` as siblings do; run build_runner when registrations change.
7. **l10n** — User-visible strings in ARB (`@-SECTION-`); one dry-run preview before `make l10n-add --apply`.
8. **RTL** — Directional padding/alignment; Figma copy → l10n keys, not literals.
9. **Verify** — the app's command from `ai_docs/conventions.md` (for example `make analyze`) on touched files; manual happy/empty/error if the phase lists them.
