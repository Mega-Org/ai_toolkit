# <Feature Name> Plan

Source spec: [`README.md`](README.md)
History (completed phases): [`history.md`](history.md)
Memory: [`memory.md`](memory.md)
Status: draft | in-progress | done | superseded
Last updated: YYYY-MM-DD

<!-- Budget: keep this file at 8 KB or less. When it exceeds that, move `Status: done` phases into history.md (see feature-history.md). Do not duplicate alignment prose here — link only. -->

## Planning Inputs

Record what make-plan used. Per-phase `Inputs` below are what implement-phase actually loads.

- Prompt summary:
- KB files: `ai_specs/brd/features/<feature>.md` | `ai_specs/design/features/<feature>.md` | `ai_specs/api/features/<feature>/`
- Contracts register: `ai_specs/api/contracts/INDEX.md`
- App docs: `ai_docs/`

## Ask-before-proceed decisions

Record blockers the user resolved. Do not invent rows.

| # | Issue | Sources (brd / design / api / contract) | User choice | Outcome |
|---|-------|-----------------------------------------|-------------|---------|
| 1 | | | decide-now \| TBD(owner) | |

## Alignment

Links only. Do not copy BRD / design / API / README alignment text into this file.

- README: [`README.md`](README.md)
- BRD: `ai_specs/brd/features/<feature>.md` or `none`
- Design: `ai_specs/design/features/<feature>.md` or `none`
- API: `ai_specs/api/features/<feature>/` or `none`
- Contracts: `ai_specs/api/contracts/INDEX.md` (rows for this slug)

## Scope Summary

- Goals:
- Non-goals:
- Acceptance criteria:

## Core Vs Feature Placement

| Core | Feature folder |
|------|----------------|
| | |

## Phase Checklist

Each phase must include `Load`, `Inputs`, `Touches`, `Effort`, and `Verification`. There is **no `Tests` field**. Do not add one. Skip leftover test steps in older plans unless the user asks.

`Load:` LOADMAP tags (`ui`, `figma`, `l10n`, `state`, `data`, `domain`, `di`, `nav`, `pagination`, `stepped`, `observer`, `parts`, `enums`, `theme`, `codegen`, `flavors`). `Inputs:` KB paths and contract reply IDs (for example `ai_specs/api/contracts/<id>/reply.md#SV3`). Legacy replies without IDs: cite a heading anchor (`file.md#heading-slug`); `toolkit context` reports unknown anchors. `Touches:` files or folders this phase may edit. `Effort:` `light` | `standard` | `deep`. `Verification:` analyzer on touched files, plus manual checks — never tests.

### Phase 1 — <title>
Status: pending | in-progress | done
Effort: light | standard | deep
Load: <tag, tag>
Inputs:
- `ai_specs/brd/features/<feature>.md`
- `ai_specs/design/screens/<slug>.md`
- `ai_specs/api/contracts/<id>/reply.md#SV3`
Touches:
- `lib/src/features/<feature>/`
Deliverables:
Verification:
- Analyzer: touched files
- Manual: success / empty / error
Notes:

### Phase 2 — <title>
Status: pending
Effort: standard
Load:
Inputs:
Touches:
Deliverables:
Verification:
- Analyzer:
- Manual:
Notes:

## Risks And Dependencies

-

## Decisions

- (Product/engineering decisions. Prefer the ask-before-proceed table for KB conflicts.)

## Done

Completed phases and closed notes live in [`history.md`](history.md). This file keeps only pending and in-progress phases plus the live checklist.

## Next

- Current phase:
- Blockers:
