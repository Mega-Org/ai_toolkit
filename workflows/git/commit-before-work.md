# Commit before plan or phase work

## Purpose

Before **making a feature plan** (`make-plan`) or **starting a phase** (`implement-phase`), ensure the repo has a **clear baseline**: either a **clean working tree** or an **explicit decision** to continue with uncommitted changes. Default behavior for agents is **commit first** (with an AI-generated message), then proceed.

This workflow is **tool-neutral**: users invoke it by natural language or by the shorthand flags below—not by a required shell script.

## Fill when

- When default commit behavior, flags, or safety checks change.

## References

- After-phase commits: [`commit-after-phase.md`](commit-after-phase.md)
- Git rules: [`../../rules/git/_index.md`](../../rules/git/_index.md)
- Feature planning: [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md)
- Implement phase: [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md)

---

## How to use it (for humans)

### Default (recommended)

When you ask the AI to **plan a feature** or **implement a phase**, you say nothing extra. The agent should:

1. Check **`git status`** (read-only first).
2. If there are **uncommitted changes**, propose a **short conventional commit message**, then ask whether to **commit now** before continuing.
3. **Prefer committing** so planning or coding starts from a known state.

### Skip commits for this run

If you **do not** want any commit-before-work step (e.g. local experiments, dirty tree on purpose), say so **up front** using **any** of these:

| What you say | Meaning |
|--------------|---------|
| `make-plan --no-commits` | Run planning workflow **without** requiring a clean tree or a commit. |
| `implement-phase --no-commits` | Run one phase **without** commit-before-work. |
| “Plan without committing first” / “Skip git before plan” | Same as `--no-commits` for planning. |
| “Don’t commit before starting” | Same for whichever workflow you are starting. |

Shorthand **`--no-commits`** is inspired by CLI flags; in Cursor/chat there is no real binary—treat it as a **clear opt-out** the agent must honor.

### After planning or after a phase

Commit cadence **after** work still follows [`commit-after-phase.md`](commit-after-phase.md) when you want phase-sized commits. **Commit-before-work** only addresses **dirty tree before you begin** the next chunk of plan or implementation.

---

## Agent steps (make-plan or implement-phase)

Run these **before** the first substantive step of `make-plan.md` or `implement-phase.md`, **unless** the user opted out with **`--no-commits`** or equivalent natural language.

1. **Detect opt-out** — If the user message includes `--no-commits` or an explicit “do not commit / skip git before starting” instruction, **skip** this entire workflow (optional: one-line reminder that the tree may be dirty).

2. **Inspect git** — Run `git status` (read-only). If working tree is **clean**, continue to planning or implementation.

3. **If dirty** — Summarize what changed (high level). Propose **one** conventional commit message (or split only if clearly separate concerns). Examples:
   - `chore: save WIP before feature planning`
   - `docs(ai_specs): draft checkout feature spec`
   - `refactor: extract helper before login phase`

4. **Ask the user** — Present options clearly, with **default recommendation = commit**:
   - **Commit** — Stage and commit with the proposed message (adjust if the user edits the message).
   - **Continue without committing** — Proceed with uncommitted changes; note that the plan/phase may mix with unrelated edits.
   - **Stop** — User handles git manually; resume when ready.

5. **After a successful commit** — Confirm clean or acceptable state, then proceed to `make-plan` or `implement-phase` content.

If git is unavailable or the sandbox blocks writes, describe what the user should run locally and wait for confirmation before continuing.

---

## Defaults summary

| Situation | Default agent behavior |
|-----------|-------------------------|
| Clean tree | Proceed. |
| Dirty tree, no `--no-commits` | Propose message → **recommend commit** → ask → then proceed. |
| User passed `--no-commits` | Do not commit; proceed (with optional warning). |

---

## Relationship to other workflows

| Workflow | Role |
|----------|------|
| **This file** | **Before** plan/phase: optional commit so context is clean. |
| [`commit-after-phase.md`](commit-after-phase.md) | **After** completing a phase: conventional commit of that phase’s work. |
| [`../feature-delivery/verify-and-pr.md`](../feature-delivery/verify-and-pr.md) | After feature: verify and PR. |
