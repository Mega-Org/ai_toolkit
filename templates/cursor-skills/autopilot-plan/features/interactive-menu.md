# Interactive menu

Show the menu only when the user did not name a mode. If the command includes `direct`, `safe`, or `cloud`, skip the menu and use that mode.

## When the mode is omitted

Stop before any phase and before any branch or commit. Send:

```
Autopilot mode?
1. Direct — current branch, no commits
2. Safe — temp branch, one commit at the end (asks first)
3. Cloud — per-phase branches, ask before each phase commit
```

Accept `1` / `direct`, `2` / `safe`, or `3` / `cloud`. Wait for the answer. Do not default the git actions to Safe or Cloud while you wait.

Option 1 is the behavior of this repo's current live skill: Direct, `--no-commits`, no commits. Naming no mode is not a silent Direct run either — the menu is required — but you still must not commit before a choice.

If a resume was detected, ask the resume question (continue in the same mode, or restart) instead of offering a fresh mode menu. See [auto-detection.md](auto-detection.md). Offer this menu only if the user is starting over or no mode was recorded.

## When the user already named a mode

Skip the menu. Examples that skip it:

```
/autopilot-plan @ai_specs/features/orders/plan.md direct
/autopilot-plan ai_specs/features/orders/plan.md safe
/autopilot-plan @.cursor/plans/client_profile_make-plan_0f5b3327.plan.md cloud
```

An unknown word is not a mode. Show the menu and say which token you ignored.

## Record the choice

Write the choice into the plan file so a later session can read it. Do not put it in a side file.

**Plan has YAML frontmatter:** set these keys. Leave every other key as it is.

```yaml
autopilot_mode: direct
autopilot_base_branch: feature/orders
```

`autopilot_mode` is `direct`, `safe`, or `cloud`. `autopilot_base_branch` is the branch the user had checked out when the run started. Cloud and Safe need that name for the merge check. Direct records it so the report can name the branch.

**Plan has no frontmatter:** add one HTML comment directly under the document title. Do not add a new frontmatter block that would swallow the title.

```markdown
<!-- autopilot_mode: safe -->
<!-- autopilot_base_branch: main -->
```

Update those lines if the user changes mode. Do not record the choice only in the chat.

Then read the matching mode file and follow it:

- [../modes/direct-mode.md](../modes/direct-mode.md)
- [../modes/safe-mode.md](../modes/safe-mode.md)
- [../modes/cloud-mode.md](../modes/cloud-mode.md)
