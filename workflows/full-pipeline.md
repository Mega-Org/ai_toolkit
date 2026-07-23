# Full Pipeline: From Sources to Shipped Feature

## Purpose

This is the **new-user map** for the whole toolkit. It shows how every workflow fits together — from raw sources (BRD, Figma, API collection) to a built, verified feature — and exactly **what to say** at each stage.

If you only read one file to understand "what order do I do things in", read this one.

## The mental model: 3 phases

```text
┌── ANALYSIS ────────────┐   ┌── API ─────────────────┐   ┌── BUILD ───────────────┐
│ turn sources into      │   │ get the real API right │   │ plan + write the code  │
│ AI-readable specs      │   │ and capture examples   │   │ one phase at a time    │
└────────────────────────┘   └────────────────────────┘   └────────────────────────┘
```

Each stage writes to its **own folder** in the app repo's `ai_specs/`, so nothing overwrites anything else.

## The full order (what runs when)

```text
 1. brd-analysis          →  ai_specs/brd/                  (business truth)
 2. figma-analysis        →  ai_specs/design/               (UI / navigation truth)
 3. screen-data-analysis  →  ai_specs/api/screen-requirements/  (what each screen NEEDS)
        │
        ▼   (send needs to backend so the API can be built/documented)
 4. ingest-collection     →  ai_specs/api/source/snapshot.json
 5. analyze-collection    →  ai_specs/api/features/*/gaps.md + edit-brief.md
 6. pack-collection-handoff → ai_specs/api/COLLECTION_HANDOFF.md   ← send THIS to backend
        │
        ▼   (backend answers questions + fixes the collection)
 7. reanalyze-collection  →  updated gaps (should shrink)
 8. test-and-capture      →  real response examples saved into the collection
        │
        ▼
 9. make-plan             →  ai_specs/features/<slug>/README.md + plan.md
10. implement-phase       →  code (one phase at a time)
11. verify-and-pr         →  PR when all phases are done
```

Steps 1–3 can run in any order (they are independent sources). Steps 4–8 are the API loop. Steps 9–11 are the build loop, run **per feature**.

## What to say at each step

| # | Goal | Say to the AI | Workflow | Writes to |
|---|------|---------------|----------|-----------|
| 1 | Business rules from a BRD/doc | `Analyze BRD` | [`product-analysis/brd-analysis.md`](product-analysis/brd-analysis.md) | `ai_specs/brd/` |
| 2 | Screens/flows/nav from Figma | `Analyze Figma for <app>` | [`product-analysis/figma-analysis.md`](product-analysis/figma-analysis.md) | `ai_specs/design/` |
| 3 | What each screen needs from the API | `Screen data analysis` | [`product-analysis/screen-data-analysis.md`](product-analysis/screen-data-analysis.md) | `ai_specs/api/screen-requirements/` |
| 4 | Import the API collection | `Ingest API collection` | [`api-analysis/ingest-collection.md`](api-analysis/ingest-collection.md) | `ai_specs/api/source/` |
| 5 | Full API gap analysis | `Analyze API collection` | [`api-analysis/analyze-collection.md`](api-analysis/analyze-collection.md) | `ai_specs/api/features/` |
| 6 | Build the file for backend | `Pack collection handoff` | [`api-analysis/pack-collection-handoff.md`](api-analysis/pack-collection-handoff.md) | `ai_specs/api/COLLECTION_HANDOFF.md` |
| 7 | Recheck after backend fixes | `Reanalyze API collection` | [`api-analysis/reanalyze-collection.md`](api-analysis/reanalyze-collection.md) | updated `api/features/` |
| 8 | Run endpoints + save real examples | `Test and capture API responses` | [`api-analysis/test-and-capture.md`](api-analysis/test-and-capture.md) | `api/features/*/captured/` + collection |
| 9 | Plan a feature to build | `make-plan feature <slug>` | [`feature-delivery/make-plan.md`](feature-delivery/make-plan.md) | `ai_specs/features/<slug>/` |
| 10 | Build one phase | `implement-phase` | [`feature-delivery/implement-phase.md`](feature-delivery/implement-phase.md) | code |
| 11 | Verify + open PR | `verify and PR` | [`feature-delivery/verify-and-pr.md`](feature-delivery/verify-and-pr.md) | PR |

Supporting workflows you can run anytime: [`session/bootstrap-session.md`](session/bootstrap-session.md) (load context), [`git/commit-before-work.md`](git/commit-before-work.md), [`worklog/update-worklog.md`](worklog/update-worklog.md), [`maintenance/bugfix.md`](maintenance/bugfix.md).

## The API loop (steps 4–8), in detail

```text
        ┌──────────────────────────────────────────────────────────┐
        │                                                          │
   ingest ─→ analyze ─→ pack handoff ──(send COLLECTION_HANDOFF)──→ backend
        ▲        │                                                  │
        │        │                              answers questions   │
        │        │                              + fixes collection  │
        │        ▼                                                  ▼
        └──── reanalyze ←──────────────────────────────────────────┘
                 │
                 ▼  (once endpoints are callable + gaps mostly closed)
            test-and-capture  →  save real 200/400/401/404/422/5xx examples
```

- **Collection edits** in the handoff = doc/example/schema changes the backend applies **in Apidog/Postman** — not "rewrite the server".
- **Questions** in the handoff = things that need a real decision (may need a real API change; each item says which).
- Collections can come from **Apidog MCP**, **Postman MCP**, or a **raw OpenAPI/Postman JSON** — all handled by ingest.

## The golden rule: which file is "truth" during implementation

Because several folders use the same feature slug, agents follow a strict priority so they never get confused:

| During... | Load (truth) | Do NOT load |
|-----------|--------------|-------------|
| UI implementation | `design/` (screens, nav, components) | `api/screen-requirements/` |
| Data/integration implementation | `api/features/` (real endpoints) + captured examples | `api/screen-requirements/` |
| Any feature build | `features/<slug>/README.md` + `plan.md` (build contract) | analysis `*/features/` as a substitute |

`api/screen-requirements/` is **planning-only** (expected needs). Once `api/features/<feature>/` documents the real endpoints, the screen-requirement for that feature is **superseded** (mark `covered` or archive). This is why "what does this page need?" analysis never leaks a *guessed* endpoint into real code.

## Do I need every step?

| Situation | Minimum path |
|-----------|--------------|
| Have BRD + Figma, no API yet | 1 → 2 → 3 → (send to backend) → 9 (with `TBD(backend)`) |
| API collection already exists | 4 → 5 → 6 → 7 → 9 → 10 → 11 |
| API is live and you want real examples | add 8 after 7 |
| Just building one feature from existing specs | 9 → 10 → 11 |
| Fixing a bug | [`maintenance/bugfix.md`](maintenance/bugfix.md) |

## Where each stage lands in the repo

```text
ai_specs/
  brd/                     ← step 1
  design/                  ← step 2  (pure UI/nav truth)
  api/
    screen-requirements/   ← step 3  (expected needs; planning only)
    source/snapshot.json   ← step 4
    features/<slug>/        ← steps 5,7,8 (real endpoints, gaps, captured examples)
    COLLECTION_HANDOFF.md   ← step 6  (send to backend)
  features/<slug>/         ← steps 9–11 (README.md + plan.md = build layer)
```

## References

- Workflow overview: [`README.md`](README.md)
- Product analysis: [`product-analysis/_index.md`](product-analysis/_index.md)
- API analysis: [`api-analysis/_index.md`](api-analysis/_index.md)
- Feature delivery: [`feature-delivery/_index.md`](feature-delivery/_index.md)
- Spec layer map: [`../templates/specs/spec-index.md`](../templates/specs/spec-index.md)
- Toolkit entrypoint: [`../INDEX.md`](../INDEX.md)
