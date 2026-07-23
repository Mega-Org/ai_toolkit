# App AI Specs

Copy to: `ai_specs/README.md`

App-specific spec workspace. Shared playbooks stay in `ai_toolkit/workflows/`. Project facts live here.

## Mental model

```text
Sources → Analysis KBs (truth)     → Build specs (delivery)   → Code
          brd/  design/  api/        features/<slug>/
                                     README.md + plan.md
```

| Folder | Role |
|--------|------|
| `brd/` | Business truth |
| `design/` | UI / navigation truth |
| `api/` | API collection truth |
| **`features/`** | **Build layer only** — Flutter requirements + phased plan |
| `fixes/` | Bug investigations |
| `archive/` | Superseded specs |

## Four `features/` trees (same slug, different job)

| Path | Job |
|------|-----|
| `brd/features/<slug>.md` | Product rules |
| `design/features/<slug>.md` | Screens / Figma |
| `api/features/<slug>/` | Collection contracts / gaps |
| `features/<slug>/` | What we implement + progress (`plan.md`) |

Agents: start at [`INDEX.md`](INDEX.md). Do not confuse toolkit `workflows/` (playbooks) with `api/analysis/workflows.md` (API journeys).

## Typical team flow

1. `brd-analysis` → `figma-analysis` → `api-analysis` (as needed)
2. `make-plan` → writes/updates `features/<slug>/` (asks you on gaps/conflicts: decide or TBD)
3. `implement-phase` → updates `plan.md` (same ask gate for phase blockers)
4. `bugfix` → `fixes/` when fixing defects
