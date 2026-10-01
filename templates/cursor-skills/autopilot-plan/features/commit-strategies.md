# Commit strategies

The mode picks the strategy. Do not commit under a strategy the user did not choose. Phase implementation is always invoked with `--no-commits`, so commit-before-work and commit-after-phase do not commit. Only the parent agent commits, and only when this file says so.

| Strategy | Mode | When a commit is created |
|----------|------|--------------------------|
| Manual | Direct | Never by autopilot. The user commits later. |
| Batch | Safe | Once, after every phase has succeeded, and only if the user confirms. |
| Auto | Cloud | After each successful phase, show files + message; commit only after yes, on that phase branch. A no stops the run. |

## Manual (Direct)

- Do not `git add`, `git commit`, or commit via a phase workflow.
- Leave the working tree dirty.
- The end summary tells the user the tree is dirty and that committing is theirs to do.

## Batch (Safe)

- No commit between phases.
- After the last phase succeeds, show what will be included and ask: "Create one commit on `autopilot/<plan-slug>`?"
- On **no**: stop. Leave the temp branch dirty. Do not merge.
- On **yes**: one commit on that branch. Stage only files that belong to the run. Do not stage secrets (`.env`, credentials, keystores). Message covers why the plan's work landed, in one or two sentences.
- Do not push.
- A yes here does not authorize a merge. See [merge-strategies.md](merge-strategies.md).

If any phase failed, skip the question. There is no batch commit.

## Auto (Cloud)

- After a phase succeeds and its plan status is `completed` or `done`, show the files and a proposed message. Ask. Commit on that phase branch **only after yes**.
- On **no**: stop. Leave the phase branch dirty. Do not start the next phase.
- Stage only that phase's files. Do not stage secrets.
- Message states which phase and why, not a file list.
- If the phase failed or is waiting on the user, do not commit it and do not start the next phase.
- Do not push. Do not merge those commits onto the user's branch unless they choose merge after conflict detection.

## Git safety (all strategies)

- Never force-push (`--force`, `--force-with-lease` included).
- Never skip hooks (`--no-verify` and hook bypasses).
- Never amend unless all of these are true: the user explicitly asked to amend, the HEAD commit was created by the agent in this run, and the commit has not been pushed.
- If a hook rejects a commit, fix the cause and make a new commit. Do not amend a rejected commit to slip past the hook.
- Do not commit files that are secrets. Warn the user if they ask to include them.
- Do not change git config.
- Do not use interactive git (`git rebase -i`, `git add -i`).

These rules apply even when the user says the branch is "theirs" or the run is local.
