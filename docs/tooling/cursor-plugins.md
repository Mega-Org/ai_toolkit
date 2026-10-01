# Cursor plugins (manual)

Install scripts do **not** change Cursor Settings. Do this once per machine so unused MCP tools are not loaded into every chat.

## Disable unused plugins

Open **Customize** in the sidebar (plugins, MCP servers, rules, and skills; filter by user or workspace). Open a plugin and **Uninstall** it, or turn off just its MCP server with the toggle. Turn off anything this app does not use. Typical extras if you are only working in this Flutter repo:

- Slack
- Postman (unless you are calling collections)
- GitLab (unless you are opening MRs)
- Firebase MCP (unless you are changing Firebase from chat)
- Browser tools (unless you are verifying a web surface)

Leave Dart/Flutter MCP enabled for analyzer and package lookups.

## Duplicate Figma plugin

Figma often appears twice:

1. Cursor’s Figma plugin (MCP tools such as `get_design_context`)
2. A second copy under **`~/.claude`** (Claude Code plugin cache, e.g. `~/.claude/plugins/cache/claude-plugins-official/figma`)

Keep **one** Figma MCP enabled. Two Figma servers double tool noise and token cost.

- **Not using Claude Code configs in Cursor:** turn off **Cursor Settings → Agents → Third-Party Imports → Include Third-Party Plugins, Skills, and Other Configs**. It is all-or-nothing (Claude Code / Codex plugins, skills, hooks, MCP).
- **Need other `~/.claude` items:** keep the import on and disable the plugin in Claude Code instead (`enabledPlugins` in `~/.claude/settings.json`, e.g. `"figma@claude-plugins-official": false`).

This is a **manual Cursor Settings step**. Do not delete plugin caches from the terminal unless you intend to uninstall Claude Code plugins.

## After changing plugins

Start a new agent chat so the tool list refreshes. Ignore files (`.cursorignore`, `.cursorindexingignore`) are separate: those come from [`install-ignore.sh`](../../setup/install-ignore.sh).
