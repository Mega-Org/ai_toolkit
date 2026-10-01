# Commit before work (opt-in)

**Commit:** false (default). Do **not** run this playbook at the start of make-plan, implement-phase, bugfix, backend-contract, verify-and-pr, or autopilot Direct. `--no-commits` means the same as the default (skip).

## Purpose

Optional baseline commit of an **already-dirty** tree, only when the user passed `--commit` **before** starting, or asked in words to commit current WIP first.

## Fill when

- When default commit behavior, flags, or safety checks change.

## References

- After-phase commits: [`commit-after-phase.md`](commit-after-phase.md)
- Git rules: [`../../rules/git/_index.md`](../../rules/git/_index.md)

---

## How to use it (for humans)

Default: the agent **does not** commit and **does not** ask you to commit first.

| What you say | Meaning |
|--------------|---------|
| `--commit` (on the skill) | After the work (see [`commit-after-phase.md`](commit-after-phase.md)). Not a silent pre-commit. |
| “Commit this dirty tree first” | Run **this** playbook: show files + message, wait for yes, then start the task. |
| `--no-commits` | Same as default: skip. |

---

## Agent steps

Run **only** if the user asked to commit existing uncommitted files **before** the task. `--commit` on make-plan / implement-phase / bugfix / verify-and-pr is **after** work, not this file.

1. **Detect skip** — No explicit “commit first” request → **stop**. Leave the tree as it is. Do not recommend a pre-commit.
2. **Inspect git** — `git status` (read-only). Clean tree → continue the task.
3. **If dirty** — List files (high level). Propose **one** conventional message.
4. **Ask** — Commit with that message / Continue without committing / Stop. Do **not** treat commit as the recommended default.
5. **Commit only after an explicit yes.** Stage only the files the user accepted. No secrets. Hooks run. Do not push. Do not amend unless git safety allows (user asked; local; agent-authored; unpushed).

If git is unavailable, describe the commands and wait.

---

## Defaults summary

| Situation | Agent behavior |
|-----------|----------------|
| Default / `--no-commits` | Do not commit. Proceed. |
| User asked to commit first | Show files + message → wait for yes → then proceed. |
| `--commit` on a skill | After the task: [`commit-after-phase.md`](commit-after-phase.md). |
