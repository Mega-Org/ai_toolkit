# Conflict detection

Run this before any merge onto the user's branch. The target is `autopilot_base_branch` from the plan. The source is the Safe branch or the Cloud phase branch the user is considering.

If the base branch name was not recorded, stop and ask. Do not guess from `main`.

## Check

Do this from the work branch. Do not check out the target yet. Do not start a merge that touches the index until the user chooses merge.

1. Confirm the work you intend to merge is committed. If the tree is dirty, stop and say so. Do not merge uncommitted files.
2. Find the merge base and test the merge without writing the result into the checkout:

   ```
   git merge-tree $(git merge-base HEAD <base-branch>) HEAD <base-branch>
   ```

3. Read the output for conflict markers (`<<<<<<<`) or conflict notices from `git merge-tree`.

`git merge-tree` only detects overlap. It must not be followed by opening those files and choosing sides.

## If there are no conflicts

Say that the check is clean, then show the merge menu in [merge-strategies.md](merge-strategies.md). A clean check is not permission to merge. Wait for the user to pick merge, review diff, or abort.

## If there are conflicts

Stop. Do not auto-resolve. Do not commit a resolution. Do not pass `-X ours` or `-X theirs`.

Report:

- The base branch and the work branch.
- The paths that conflict, from the `merge-tree` output.
- That the autopilot branches were left as they are.

Then show the same menu, with merge disabled in practice until the conflicts are gone:

```
Conflicts with <base-branch>. Autopilot will not resolve them.
1. Merge — unavailable until conflicts are gone
2. Review diff
3. Abort
```

- **Review diff** shows `git diff <base-branch>...<work-branch>` and the conflicting paths. Then stop and wait.
- **Abort** leaves both branches unchanged.
- If the user still says merge, refuse and repeat that conflicts must be resolved outside this run. Do not start `git merge`.

## After the user resolves conflicts themselves

They may run autopilot again or ask for another check. Run `git merge-tree` again. Only a clean result re-enables the merge option. Still wait for an explicit merge choice.

## Never

- Never merge on a failed phase.
- Never push to make the remote match.
- Never force-push past the conflict.
- Never use `git reset --hard` or `git checkout --ours/--theirs` as the resolution.
