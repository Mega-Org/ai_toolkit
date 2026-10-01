# Autopilot execution modes

## Purpose

How an autopilot run uses branches, commits, and merges. These rules are tool-neutral. **Direct** is the default when the user does not name a mode.

## Direct Mode

- **Must** work on the current branch. No new branch.
- **Must not** auto-commit. Leave the working tree dirty, including work from phases that already succeeded.
- **Must** run phase implementation with `--no-commits` (skip commit-before-work and commit-after-phase).

## Safe Mode

- **Must** create one temporary branch from the current HEAD. All phases land on that branch.
- **Must** make one batch commit at the finish **only after** showing files + message and the user confirms.
- **Must not** push.
- **Must** stop on that branch when a phase fails. Do not merge.

## Cloud Mode

- **Must** use one nested branch (or worktree) per phase, based on the previous phase branch.
- **Must not** auto-commit. After each successful phase, show files + a proposed message and wait. Commit that phase branch only after an explicit yes. A no leaves that phase dirty; do not start the next phase.
- **Must not** push.
- **Must not** merge onto the user branch unless the user confirms after conflict detection.

## Commit Strategies

The mode picks the strategy. Do not commit under a strategy the user did not choose. Phase implementation always uses `--no-commits`. Only the run that owns the mode creates commits, and only when the strategy says so.

- **Manual (Direct):** no auto-commit. The user commits later.
- **Batch (Safe):** one commit at the finish, after every phase has succeeded and the user confirms. If any phase failed, there is no batch commit.
- **Auto (Cloud):** after each successful phase, show files + message and wait. One commit per yes, on that phase branch. Do not commit a failed phase. A no stops the run on that dirty phase branch.

### Git safety

These apply in every mode:

- **Must not** force-push.
- **Must not** skip hooks (`--no-verify` or other hook bypasses).
- **Must not** amend unless the user asked, and the commit is unpushed and was authored in this session.

## Merge Strategies

Merging is separate from committing. Direct has nothing to merge.

- **Must** run conflict detection before any merge.
- **Must** offer this menu and wait: merge, review the diff, or abort.
- **Must not** merge when a phase failed.
- **Must not** auto-resolve conflicts.

## Conflict detection

Before a merge, check overlap with the target branch. If conflicts exist, stop and show the merge menu. Do not merge until that check is clean, and do not resolve the conflicts in the run.

## References

- Sequential phase execution: [`../../workflows/feature-delivery/autopilot-phases.md`](../../workflows/feature-delivery/autopilot-phases.md)
