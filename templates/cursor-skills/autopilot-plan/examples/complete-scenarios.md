# Complete scenarios

Four runs. Commands are what the user sends. The agent steps are what autopilot does. Plan path in the feature examples: `ai_specs/features/orders/plan.md` with phases 1–4, all `pending` at the start. Cursor plan example: `.cursor/plans/client_profile_make-plan_0f5b3327.plan.md`.

## 1. Direct, full run

User is on `feature/orders` with a clean tree.

```
/autopilot-plan @ai_specs/features/orders/plan.md direct
```

1. Mode is named. Skip the menu. Record `autopilot_mode: direct` and `autopilot_base_branch: feature/orders` in the plan.
2. No completed phases. This is not a resume.
3. Stay on `feature/orders`. Do not create a branch.
4. Phase 1 in a fresh agent: `/feature-implement-phase --no-commits 1 ai_specs/features/orders/plan.md`. No commit.
5. Plan marks phase 1 `done`. Phase 2 starts in a new agent the same way. Same for phases 3 and 4.
6. Summary: 4/4 done, mode Direct, branch `feature/orders`, working tree dirty, no commits, no push.

`git status` shows the phase files unstaged or uncommitted. `feature/orders` has no new commit.

## 2. Safe run with confirm

User is on `main`.

```
/autopilot-plan @.cursor/plans/client_profile_make-plan_0f5b3327.plan.md safe
```

1. Record `autopilot_mode: safe` and `autopilot_base_branch: main`.
2. Create and check out `autopilot/client-profile-make-plan-0f5b3327` from current HEAD.
3. Run each pending todo on that branch with `--no-commits`. Update each YAML todo from `pending` to `completed` before the next one. Do not commit between them.
4. All todos `completed`. Ask: "Create one commit on `autopilot/client-profile-make-plan-0f5b3327`?"
5. User says yes. One commit on that branch. Hooks run. `main` is unchanged. No push.
6. Offer the merge menu. User chooses abort. Both branches stay as they are. The summary says the commit is only on the temp branch.

If the user had said no at step 4, there would be no commit and no merge menu. The temp branch would stay dirty.

## 3. Cloud run stopped on phase failure

User is on `feature/orders`. Phases 1–4 are pending.

```
/autopilot-plan @ai_specs/features/orders/plan.md cloud
```

1. Record `autopilot_mode: cloud` and `autopilot_base_branch: feature/orders`.
2. Create `autopilot/orders-plan/phase-1` from `feature/orders`. Implement phase 1 with `--no-commits`. It succeeds. Parent shows files + message; user says yes; commit on `phase-1`. Plan phase 1 is `done`.
3. Create `autopilot/orders-plan/phase-2` from `phase-1`. Implement phase 2. The agent reports failure (verification failed).
4. Stop. Do not commit phase 2. Do not create `phase-3`. Do not merge. Do not push.
5. Summary: phase 1 committed on `autopilot/orders-plan/phase-1`. Phase 2 failed on `autopilot/orders-plan/phase-2` with a dirty tree and no commit. Phases 3 and 4 still `pending`. `feature/orders` unchanged.

## 4. Resume after a completed prefix

The orders plan already shows phase 1 and phase 2 `done`, phase 3 `pending`, phase 4 `pending`. Frontmatter has `autopilot_mode: direct` and `autopilot_base_branch: feature/orders`. The tree is dirty from the first two phases. User sends:

```
/autopilot-plan @ai_specs/features/orders/plan.md
```

1. Statuses are mixed (`done` and `pending`). This is a resume, even though no mode word was on the command. Do not show the fresh mode menu.
2. Ask whether to continue phase 3 in Direct, or restart. Do not commit the dirty tree while waiting.
3. User says continue.
4. Skip phases 1 and 2. Fresh agent runs phase 3 with `--no-commits` on `feature/orders`. Then phase 4 the same way.
5. No new branch and no commit. Summary lists phases 3 and 4 as the ones this session ran, and the tree still dirty.

If phase 3 had been `in-progress` instead of `pending`, continue would mean finish phase 3, not skip it.

If the user had said restart, the agent would confirm again before re-running phases 1 and 2. It would not clear `done` on its own.
