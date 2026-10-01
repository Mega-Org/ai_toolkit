# Safe mode

Parent also loads `features/commit-strategies.md`. Do not open other links. Merge files only if the user asks to merge after the run.

## Purpose

Put the whole run on one new branch, then offer a single commit when every phase has succeeded. The user's original branch is unchanged unless they later choose to merge.

Commit strategy: **Batch**. See [../features/commit-strategies.md](../features/commit-strategies.md).

## When to use

- You want the work isolated from the branch you are on.
- You want one commit for the whole plan, and only after you confirm.
- You want a failed run to stop on a branch you can leave behind, without a commit and without a merge.

## Git behavior

1. Record the current branch name as `autopilot_base_branch` and the mode as `safe` in the plan.
2. From the current HEAD, create one branch and check it out:

   ```
   autopilot/<plan-slug>
   ```

   `<plan-slug>` is the plan filename without extension, lowercased, with non-alphanumerics collapsed to hyphens. `client_profile_make-plan_0f5b3327.plan.md` becomes `autopilot/client-profile-make-plan-0f5b3327`.

   When the file is named `plan.md`, prefix the parent directory so two features do not share a branch: `ai_specs/features/client_profile/plan.md` becomes `autopilot/client-profile-plan`.

3. If that branch already exists from an earlier Safe run of the same plan, check it out and continue. Do not create a second branch.
4. Implement every phase on that branch. Pass `--no-commits`. Do not commit between phases.
5. If every phase succeeds, show the diff summary and ask whether to create the one batch commit. Commit only after an explicit yes. Use a normal commit (hooks run). Do not push.
6. A yes to the commit is not a yes to merge. After the commit, you may offer the merge menu. Merge only if the user chooses merge, and only after conflict detection against `autopilot_base_branch`. See [../features/merge-strategies.md](../features/merge-strategies.md) and [../features/conflict-detection.md](../features/conflict-detection.md).

Uncommitted edits that were already in the working tree before the branch was created are not part of the branch until they are committed. Start Safe from a clean tree when you need those edits included; do not stash or reset them unless the user asks.

## What the agent must not do

- Must not commit after each phase.
- Must not make the batch commit if any phase failed.
- Must not make the batch commit before the user confirms.
- Must not push.
- Must not merge on failure.
- Must not treat commit confirmation as merge confirmation.
- Must not force-push, skip hooks, or amend unless the user asked and the commit is local, authored by the agent, and unpushed.
- Must not implement on the user's original branch.

## Failure behavior

Stop on `autopilot/<plan-slug>`. Do not start the next phase. Do not create the batch commit. Do not merge back to the base branch. Report the failed phase, the branch name, and the base branch. Earlier phase files remain as uncommitted changes on the temp branch. Plan statuses show which phases completed.

## Example

User is on `main` and runs:

```
/autopilot-plan @.cursor/plans/client_profile_make-plan_0f5b3327.plan.md safe
```

The agent creates `autopilot/client-profile-make-plan-0f5b3327` from `main` and records `autopilot_base_branch: main`. Phases run there with `--no-commits`. After the last phase succeeds, it asks to commit. The user says yes. One commit lands on the temp branch. `main` has no new commit. The agent does not push. It offers merge, review diff, or abort. The user says abort. The temp branch keeps the commit.
