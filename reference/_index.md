# Reference (`reference/`)

## Purpose

**Supporting checklists and release notes** that are not full rules or step-by-step workflows. Use for quick verification (new screen checklist) or tracking breaking-change reminders across Flutter/Dart upgrades.

## Contents

| File | Topic |
|------|--------|
| [`checklist-new-screen.md`](checklist-new-screen.md) | Items to verify when adding a new screen |
| [`checklist-remote-config-store-ops.md`](checklist-remote-config-store-ops.md) | Store review, updater, RC admin integration |
| [`breaking-changes-notes.md`](breaking-changes-notes.md) | Notes on upstream breaking changes affecting the stack |

## Cursor Agent Skills (portable templates)

Reusable `SKILL.md` files for Cursor (and similar tools) live under **`reference/agent-skills/`**. Copy a skill folder into the app repo’s **`.agents/skills/<name>/`** so the IDE can discover it; long-form guidance stays in `ai_toolkit/patterns/` and `ai_toolkit/rules/`.

| Folder | Topic |
|--------|--------|
| [`agent-skills/flutter-pagination-paginated-list/`](agent-skills/flutter-pagination-paginated-list/SKILL.md) | Infinite scroll: `PaginationController` + `PaginatedListView` → pattern [`../patterns/flutter/pagination-paginated-list-view.md`](../patterns/flutter/pagination-paginated-list-view.md) |
| [`agent-skills/remote-config-store-ops/`](agent-skills/remote-config-store-ops/SKILL.md) | Store review + force update + RC admin → workflow [`../workflows/integration/remote-config-store-ops.md`](../workflows/integration/remote-config-store-ops.md) |

## References

- Feature delivery verification: [`workflows/feature-delivery/verify-and-pr.md`](../workflows/feature-delivery/verify-and-pr.md)
- Maintenance upgrades: [`workflows/maintenance/dependency-upgrade.md`](../workflows/maintenance/dependency-upgrade.md)
- Toolkit entrypoint: [`INDEX.md`](../INDEX.md)
