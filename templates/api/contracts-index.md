# API contracts register

Copy to: `ai_specs/api/contracts/INDEX.md`

One register for **contract folders** and **backend reference docs** (intake). Do not duplicate file bodies here.

**Source order:** agreed contract reply > backend reference doc > collection snapshot. Within the same kind, the newer date wins.

Folder per contract:

```text
ai_specs/api/contracts/YYYY-MM-DD-<feature>-<topic>/
  request.md
  reply.md          # or reply-2.md after a follow-up
  gaps-1.md         # from check; gaps-2.md if needed
```

Legacy requests may stay at `ai_specs/features/<feature>/backend-contract*.md` — list them here; do not rename or move them.

Statuses: `draft` | `sent` | `answered` | `partially-answered` | `agreed`.

## Contracts

| ID | Feature | Topic | Status | Request | Reply | Gaps | Collection synced |
|----|---------|-------|--------|---------|-------|------|-------------------|
| YYYY-MM-DD-feature-topic | | | draft | `[request.md](YYYY-MM-DD-feature-topic/request.md)` | | | no |

## Reference docs (intake)

Kind: `reply` | `reference`. Files stay where they are (usually `ai_specs/api/source/handoff/`). Intake adds a one-line HTML comment header only.

| ID | Kind | Features | Received | File | Supersedes |
|----|------|----------|----------|------|------------|
| | reference \| reply | | YYYY-MM-DD | | |
