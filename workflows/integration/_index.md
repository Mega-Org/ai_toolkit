# Integration workflows (`workflows/integration/`)

## Purpose

**Cross-cutting integration playbooks** that wire multiple modules, tooling, and Firebase (or other backends) into a Flutter app. Unlike feature delivery, these workflows span `lib/src/_*`, local admin tools, Makefile targets, and app-specific manifests under `ai_docs/integrations/`.

## Workflows

| File | Topic |
|------|--------|
| [`link-ai-toolkit.md`](link-ai-toolkit.md) | Add or migrate `ai_toolkit` submodule, seed files, Makefile targets |
| [`remote-config-store-ops.md`](remote-config-store-ops.md) | Store review UI gating, force-update prompts, and local RC admin panel |

## References

- Toolkit entrypoint: [`INDEX.md`](../../INDEX.md)
- Setup guides: [`setup/_index.md`](../../setup/_index.md)
- Patterns: [`patterns/_index.md`](../../patterns/_index.md)
