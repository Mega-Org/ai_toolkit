# Integration spec template — Remote Config store-ops

Optional feature folder: **`ai_specs/features/remote-config-store-ops/`**

Use when tracking phased delivery. For ops-only repos where modules already exist, the integration manifest alone may suffice.

## README.md skeleton

Copy sections into `ai_specs/features/remote-config-store-ops/README.md`:

```markdown
# Remote Config store-ops

**Status:** complete | in-progress  
**Integration manifest:** [`ai_docs/integrations/remote-config-store-ops.md`](../../../ai_docs/integrations/remote-config-store-ops.md)

## Scope

- Store review UI gating via Firebase RC
- Min-version / force-update prompts
- Local RC admin panel (`tool/firebase/rc-admin/`)

## Non-goals

- Hosted RC admin (local 127.0.0.1 only in v1)
- Per-environment Firebase projects (unless documented)

## Dependencies

- `firebase_remote_config`, `package_info_plus`, `pub_semver`, `url_launcher`
- Firebase initialized before RC fetch

## References

- Workflow: `ai_toolkit/workflows/integration/remote-config-store-ops.md`
- Patterns: `ai_toolkit/patterns/modules/`
```

## plan.md skeleton

```markdown
# Plan — Remote Config store-ops

| Phase | Status | Notes |
|-------|--------|-------|
| 0 Analyze | done | Manifest in ai_docs/integrations/ |
| 1 Dart modules | done | _store_review, _store_updater |
| 2 App shell | done | BlocProvider + UpdateViewModel.init |
| 3 RC admin | done | tool/firebase/rc-admin |
| 4 Build wiring | done | Makefile targets |
| 5 Firebase Console | pending | Publish 8 keys in groups |
| 6 Verify | pending | Checklist |

## Verification

- [ ] See ai_toolkit/reference/checklist-remote-config-store-ops.md
```

## References

- Workflow: [`../../workflows/integration/remote-config-store-ops.md`](../../workflows/integration/remote-config-store-ops.md)
- Manifest: [`../docs/integration-manifest.md`](../docs/integration-manifest.md)
