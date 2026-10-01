# Cloud mode

Parent also loads `features/commit-strategies.md`. Do not open other links. Merge files only if the user asks to merge after the run. One phase per subagent.

## Purpose

Give each phase its own branch, stacked on the previous phase branch. After a phase succeeds, **ask** before committing it. The user's branch is not updated unless they later confirm a merge.

Commit strategy: **Auto** (per phase, on the phase branch, **ask first**). See [../features/commit-strategies.md](../features/commit-strategies.md).

"Cloud" names the branch-per-phase layout. It does not by itself push, open a remote, or require a cloud agent. A nested branch is the required shape. A cloud worktree that uses the same branch names is acceptable when the user already asked for worktrees. Do not create worktrees on your own.

## When to use

- You want each phase's commit separate from the next phase.
- You may stop midway and keep earlier phases as real commits.
- You want the option to merge only after you see how the phase branches relate to your branch.

## Git behavior

1. Record `autopilot_mode: cloud` and `autopilot_base_branch` (the branch checked out at the start) in the plan.
2. Do not implement on the user's branch.
3. Phase 1: create `autopilot/<plan-slug>/phase-1` from the starting HEAD. Check it out.
4. Run the phase with `--no-commits`. The phase agent does not commit.
5. If the phase succeeds and the plan status is updated, show files + a proposed message and ask. Commit on `phase-1` only after yes. Include only this phase's files. Hooks run. Do not push. On no: stop; leave dirty; do not start phase 2.
6. Phase 2: create `autopilot/<plan-slug>/phase-2` from the phase-1 branch (the new commit). Repeat: implement with `--no-commits`, then ask before the parent commits on `phase-2`.
7. Each later phase branches from the previous phase branch, not from the user's branch and not from phase 1.

`<plan-slug>` matches Safe mode: basename, lowercased, punctuation to hyphens; if the file is `plan.md`, prefix the feature directory (`autopilot/client-profile-plan/phase-1`).

Do not push. Do not merge onto `autopilot_base_branch` unless the user confirms after conflict detection. See [../features/conflict-detection.md](../features/conflict-detection.md) and [../features/merge-strategies.md](../features/merge-strategies.md).

If a phase branch for this plan already exists and that phase is `completed` or `done`, do not recreate it. The next phase branches from the latest completed phase branch.

## What the agent must not do

- Must not commit a phase that failed.
- Must not commit a successful phase before the user confirms files + message.
- Must not let the phase agent run commit-before-work or commit-after-phase (pass `--no-commits`; the parent commits after yes).
- Must not put two phases on one branch.
- Must not branch phase N+1 before phase N is committed.
- Must not push.
- Must not merge to the user's branch without an explicit merge choice after a clean conflict check.
- Must not force-push, skip hooks, or amend unless the user asked and the commit is local, authored by the agent, and unpushed.
- Must not continue after a failure.

## Failure behavior

Stop on the failed phase's branch. Do not commit that phase. Do not create the next phase branch. Do not merge. Earlier phase branches keep their commits. Report the failed phase, its branch, the last successful phase branch, and the base branch.

A pause for user input is not a success. Do not commit and do not start the next phase until the phase finishes successfully.

## Example

User is on `feature/orders` and runs:

```
/autopilot-plan @ai_specs/features/orders/plan.md cloud
```

The agent records `autopilot_base_branch: feature/orders` and creates `autopilot/orders-plan/phase-1` from that HEAD. Phase 1 succeeds; the parent shows files + message; the user says yes; it commits on `phase-1`. It creates `autopilot/orders-plan/phase-2` from that commit. Phase 2 fails. The agent stops. `phase-2` has no commit. `phase-3` does not exist. `feature/orders` is unchanged. Nothing is pushed.
