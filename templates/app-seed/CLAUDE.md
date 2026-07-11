# AI assistant bootstrap (this app)

Follow the shared toolkit and app-specific docs in this order:

1. **`ai_toolkit/INDEX.md`** — entrypoint, bootstrap modes, and task routing.
2. **`ai_toolkit/workflows/session/bootstrap-session.md`** — ordered session start (pair with lite/full modes described in `INDEX.md`).
3. **`ai_docs/`** — this app’s boundaries and naming (`architecture.md`, `conventions.md`). Extend these stubs when core vs feature layout or conventions change.
4. **`ai_specs/`** — active feature specs and phase plans for spec-driven work (create under this app as needed).

Claude Code users may refer to this playbook as *seed-context*; it is the single local entry — no duplicate workflow file required.

Keep this file thin: link into `ai_toolkit/` instead of copying rules or patterns here.
