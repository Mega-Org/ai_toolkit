# Module patterns (`patterns/modules/`)

## Purpose

**Self-contained Dart modules** under `lib/src/_*` that integrate with Firebase Remote Config, local admin tooling, or other cross-cutting infrastructure. These are not feature screens — they ship as library + `part` files and wire into the app shell.

## Patterns

| File | Module | Topic |
|------|--------|--------|
| [`remote-config-store-review.md`](remote-config-store-review.md) | `lib/src/_store_review/` | Hide/replace UI during store review |
| [`remote-config-store-updater.md`](remote-config-store-updater.md) | `lib/src/_store_updater/` | Min-version and force-update prompts |

## References

- Integration workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- RC admin tooling: [`../tooling/rc-admin-panel.md`](../tooling/rc-admin-panel.md)
- Patterns index: [`../_index.md`](../_index.md)
