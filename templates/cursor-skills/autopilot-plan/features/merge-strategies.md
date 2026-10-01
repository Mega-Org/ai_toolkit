# Merge strategies

Merging is optional and separate from committing. Direct has nothing to merge. Safe and Cloud leave commits on autopilot branches until the user chooses a merge.

Never merge when a phase has failed or is still waiting on the user. Never merge to hide a dirty tree. Never push as part of a merge.

Run [conflict-detection.md](conflict-detection.md) first. If it reports conflicts, do not merge. Show the menu and wait.

## When to offer the menu

Offer it only after a successful run (or a successful prefix the user explicitly wants to merge) when the work is committed on an autopilot branch:

- **Safe** — the user already confirmed the batch commit, so the temp branch has that commit.
- **Cloud** — the successful phase branches have their commits. The default merge source is the latest successful phase branch (it contains the earlier phase commits as ancestors).

Do not offer merge for Direct. Tell the user the changes are uncommitted on the current branch.

A Safe batch-commit confirmation is not a merge confirmation. Ask separately.

## Menu

```
Merge autopilot work onto <base-branch>?
1. Merge
2. Review diff
3. Abort
```

`<base-branch>` is `autopilot_base_branch` recorded in the plan.

### Merge

Only when conflict detection reported no conflicts, and the user picked merge.

1. Check out `<base-branch>`.
2. `git merge --no-ff <work-branch>`.
3. If the merge stops with conflicts, `git merge --abort`, check out the work branch again, and stop. Do not edit conflict markers. Do not commit the merge.
4. If the merge succeeds, do not push. Report the merge commit and both branch names.

### Review diff

Show `git diff <base-branch>...<work-branch>` (or a short stat plus the paths) and wait. Do not merge while the review is open. After they answer, show the menu again.

### Abort

Leave every branch as it is. Do not delete the autopilot branch. Do not reset the base branch. Report where the commits sit.

## What not to do

- Do not fast-forward or merge "to clean up" without this menu.
- Do not rebase the user's branch.
- Do not force-push the merge result.
- Do not skip hooks on the merge commit.
- Do not merge a failed phase branch that has no successful commit.
- Do not auto-resolve conflicts. See [conflict-detection.md](conflict-detection.md).
