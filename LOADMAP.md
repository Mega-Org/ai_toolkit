# LOADMAP

Resolve `+tag` / `-tag` / plan `Load:` to **leaf files**. Read each leaf’s **`## Agent card`** with `limit: 60`. Do **not** browse `INDEX.md`, `rules/_index.md`, `patterns/_index.md`, or spec indexes during a phase.

## Card protocol

1. Open only the files listed for the requested tags (paths relative to `ai_toolkit/` unless noted).
2. Read **lines 1–60** (the card). That is enough unless the card says **read the rest**.
3. Do not follow Related links until the card says they are required for this task.
4. `--full` loads every tagged leaf **card**; still skip untagged leaves and indexes.
5. There is **no `tests` tag**. Do not load testing rules unless the user asks.

## Tags → leaves

| Tag | Leaf files |
|-----|------------|
| `ui` | `rules/flutter/ui-composition.md`, `patterns/flutter/page-bloc-provider.md` |
| `figma` | `rules/flutter/design-direction-and-localization.md` |
| `l10n` | `rules/core/localization.md`, `rules/dart/enums-l10n.md` |
| `state` | `patterns/state/cubit-structure.md`, `patterns/state/cubit-and-use-case.md`, `rules/core/async.md` |
| `data` | `patterns/data/feature-data-layer.md`, `rules/core/network.md`, `rules/flutter/remote-data-sources.md` |
| `domain` | `rules/core/foundation.md`, `patterns/data/use-case-and-domain-service-type.md` |
| `di` | `rules/core/di.md` |
| `nav` | `rules/core/router.md` |
| `pagination` | `patterns/flutter/pagination-paginated-list-view.md` |
| `stepped` | `patterns/flutter/stepped-page-flow.md` |
| `observer` | `rules/architecture/observer-presentation-only.md`, `patterns/state/broadcast-observer-hub.md` |
| `parts` | `rules/dart/part-part-of.md`, `patterns/dart/part-part-of-library.md` |
| `enums` | `rules/dart/enums-wire-parsing.md`, `rules/dart/enums-l10n.md` |
| `theme` | `rules/core/theme.md` |
| `codegen` | `rules/tooling/build-runner.md` |
| `flavors` | `setup/flavors.md` |
| `app-memory` | `ai_docs/memory.md` (app repo, not under `ai_toolkit/`) |

## Notes

- **`app-memory`:** read app-repo `ai_docs/memory.md` in full (≤ 4 KB). It has no Agent card. Shared components and cross-feature gotchas only. Replace the matching row; do not append a duplicate. Verify commands stay in `ai_docs/conventions.md`. Skip the tag only when the file is missing.
- **Shared files:** `enums-l10n.md` is on both `l10n` and `enums` — read its card once.
- Unique tagged leaves today: **25** toolkit files with Agent cards, plus the app-repo `app-memory` path (no card). Cards exist only on those 25 files, not on indexes, templates, or untagged leaves.
- Tag intent: `ui` wrappers + page/`BlocProvider`; `figma` RTL/direction; `l10n` ARB + enum labels; `state` Cubit/`Async`; `data` feature `data/` + Dio + inline datasources; `domain` `IUseCase`/params; `di` GetIt; `nav` `AppRouter`; `pagination` list controller; `stepped` wizard route; `observer` presentation hubs; `parts` `part of`; `enums` wire + labels; `theme` `ThemeManager`; `codegen` build_runner generate command and committed outputs; `flavors` product flavors; `app-memory` shared component registry and cross-feature gotchas (`ai_docs/memory.md`, 4 KB, replace not append).
- Example: `implement-phase … +pagination +state` → pagination pattern card + the three `state` cards. Do not also open `INDEX.md`.
