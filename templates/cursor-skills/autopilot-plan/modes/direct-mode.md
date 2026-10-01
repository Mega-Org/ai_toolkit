# Direct mode

Parent loads this file only. Do not open links from here.

## Purpose

The parent chat holds only status lines and phase reports.

Implement every pending phase on the branch that is already checked out. Do not commit. This is the behavior of this repo's current live autopilot skill, and it is the default git policy when a mode must match that skill.

Commit strategy: **Manual**. See [../features/commit-strategies.md](../features/commit-strategies.md).

## When to use

- The current branch is the branch that should receive the edits (typically a feature branch you already created).
- You want to review the full diff and commit it yourself.
- You do not want a temporary branch or per-phase commits.

Do not use Direct on a shared branch if other people are using that same checkout. The working tree will be dirty until you commit or discard the changes.

## Git behavior

- Stay on the current branch. Do not create a branch. Do not check out another branch.
- Pass `--no-commits` into phase implementation so commit-before-work and commit-after-phase do not run.
- Do not `git add` or `git commit` at the end of a phase or at the end of the run.
- Do not push. Do not merge. There is nothing to merge: the edits are already on the user's branch, uncommitted.
- Leave the working tree dirty, including every successful phase plus any partial work from a failed phase.
- Record `autopilot_mode: direct` and `autopilot_base_branch` (the current branch name) in the plan. See [../features/interactive-menu.md](../features/interactive-menu.md).

## What the agent must not do

- Must not create `autopilot/<plan-slug>` or phase branches.
- Must not commit "to be safe" or "so the next phase starts clean."
- Must not stash or reset the tree to hide phase work.
- Must not run `commit-before-work` or `commit-after-phase`.
- Must not push, force-push, skip hooks, or amend.
- Must not start the next phase after a failure.

## Failure behavior

Stop on the current branch. Do not continue. Do not commit the failed phase or the earlier successful phases. Report the phase number, the error, and that the working tree is dirty on purpose. Completed phases stay marked completed in the plan. The failed phase stays `pending` or `in_progress` / `in-progress`.

If the phase is paused for a user decision, wait. Do not commit and do not start the next phase.

## Example

User is on `feature/client-profile` and runs:

```
/autopilot-plan @ai_specs/features/client_profile/plan.md direct
```

Phase 1 runs in a fresh agent with `--no-commits`. The plan marks phase 1 done. The tree is dirty. Phase 2 runs the same way. After the last phase, the agent summarizes and leaves `feature/client-profile` dirty. The user reviews and commits later, outside autopilot.
