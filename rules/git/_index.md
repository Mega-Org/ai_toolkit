# Git conventions (toolkit)

## Purpose

Default git behavior for agents working in app repos that use this toolkit.

## Fill when

Remote host (GitHub vs GitLab), branch naming, or MR/PR workflow changes.

## References

- Commit opt-in: [`../../workflows/git/commit-after-phase.md`](../../workflows/git/commit-after-phase.md)
- Verify handoff: [`../../workflows/feature-delivery/verify-and-pr.md`](../../workflows/feature-delivery/verify-and-pr.md)

## Content

- **No commit** unless the user asks or approves `--commit` (show files + message first).
- **No push**, force-push, amend, or hook skips unless explicitly requested.
- Git host: `ai_docs/conventions.md`. When the host is GitLab, draft merge requests with `glab mr create` only when the user asks after verification.
- Feature branches: user-owned naming; autopilot Direct mode stays on the current branch with a dirty tree.
- Submodule `ai_toolkit/`: bump pointer in the app repo after `toolkit push` inside the submodule.
