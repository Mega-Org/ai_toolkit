# Figma / Design Analysis Workflow

## Purpose

Create an app-specific design knowledge base from a Figma (or similar) source. The output is a set of concise Markdown contracts under the app repo's `ai_specs/design/`, while this reusable workflow and its templates remain in `ai_toolkit/`.

The design KB is **UI / navigation / screen truth**. It sits beside BRD business truth and feeds feature implementation specs. It does not replace BRD or `ai_specs/features/<feature>/`.

## Fill When

- A project has a Figma file (whole app or major surfaces) that should become durable AI-readable context.
- Feature planning or UI implementation needs a stable screen inventory, navigation graph, and feature clustering before coding.
- Existing `ai_specs/` need to be checked against design sources.
- Design frames are poorly named or poorly wired and need a normalized slug + graph layer without blocking on a Figma rewrite.

## Inputs

1. **Figma sources** — File URL(s), file keys, page names in scope, optional version/date. Prefer links with `node-id`. Store pointers under the app repo, for example `ai_specs/design/source/`.
2. **App context** — `ai_docs/`, existing `ai_specs/INDEX.md`, `ai_specs/brd/` when present, localization or RTL conventions, known app surfaces (customer / provider / admin).
3. **Templates** — Use [`../../templates/design/`](../../templates/design/_index.md): design index, glossary, figma sources, design-system notes, navigation graph, coverage, feature design spec, flow spec, screen node, app-surface design.

## Output Shape

Use this structure in the app repo unless the project already has a compatible design analysis layout:

```text
ai_specs/design/
  README.md
  INDEX.md
  source/
    figma-sources.md
  analysis/
    glossary.md
    design-system.md
    navigation-graph.md
    coverage.md
    figma-hygiene.md          # optional; design-facing backlog
    icons-catalog.md          # optional; from normalize-assets workflow
    images-catalog.md         # optional; from normalize-assets workflow
  features/
  flows/
  screens/
  app_surfaces/
```

Keep reusable extraction guidance in `ai_toolkit/`. Keep project-specific screen facts, edges, uncertainties, and Figma URLs in `ai_specs/design/`.
When the app uses a root `ai_specs/INDEX.md`, add or update its Design entry so future agents route through the project-level specs map before loading design details.

## Invocation Modes

### Mode A — Full project analysis

Use when starting from a Figma file (or major redesign). Run all Steps below.

Examples: `figma-analysis https://www.figma.com/design/...`, `Analyze Figma for the whole customer app`.

### Mode B — Refresh feature

Use when Figma changed for one feature area. Re-inventory that feature's frames, update glossary rows, screen nodes, feature file, related flow edges, navigation-graph rows, and coverage. Do not rewrite unrelated features.

Examples: `figma-analysis refresh feature authentication`.

### Mode C — Refresh page

Use when one Figma page changed. Re-inventory that page only; merge into glossary, screens, graph, and coverage.

Examples: `figma-analysis --pages "Customer App"`.

### Mode D — Align with BRD

Use when `ai_specs/brd/` already exists. Fill coverage BRD ↔ design; do not rewrite BRD files. Report gaps and conflicts.

## Steps

1. **Prepare sources** — Record file URL(s), file key(s), pages in scope, MVP vs ignore/archive pages, surfaces, and last synced date in `source/figma-sources.md`. Prefer stable `node-id` links over page names alone.
2. **Inventory frames** — Via Figma MCP (`get_metadata` / page walk) or an explicit frame list from the user. Capture every top-level frame (and distinct modal/sheet frames) used as UI. Do not invent screens that are not in Figma.
3. **Classify every frame** — Assign one of: `screen`, `modal`, `sheet`, `tab-shell`, `component`, `variant`, `archive`, `junk`. Only `screen` / `modal` / `sheet` / `tab-shell` become navigation nodes. Attach variants to a parent screen. Keep archive/junk out of the graph; list them once in coverage.
4. **Build the glossary first** — Create `analysis/glossary.md` before naming features or writing screen files. Map noisy Figma names (`Frame 128`, `Login V2 AR`) to stable English canonical slugs (`auth_login`). Record naming quality (`good` | `noisy` | `duplicate` | `unknown`). Freeze those slugs for the project; do not rename mid-extraction without updating the glossary and links.
5. **Write screen nodes** — Create one file per navigable node under `screens/` using `screen-node.md`. Fill purpose, Figma URL (`node-id`), direction (`RTL` / `LTR` / `mixed/TBD`), entry/exit edges, states/variants, primary actions, components used, and open `TBD`s. Keep files thin; do not dump layout trees or pixel CSS.
6. **Build the navigation graph** — Create `analysis/navigation-graph.md` with **all** nodes and **all** edges. Prefer prototype links when present. When wiring is missing, infer edges from visible primary CTAs, tabs, and back affordances. Set edge **confidence**: `prototype` | `inferred` | `assumed` | `broken`. List broken targets and orphan nodes. Do not treat `assumed` or `broken` edges as approved routes for implementation unless the user accepts them.
7. **Cluster by feature** — Group nodes by domain (auth, home, orders, …). Align feature names with BRD glossary canonical names when both exist. Write one file per feature under `features/` using `feature-design-spec.md` (purpose, nodes, local subgraph, states, direction, components, BRD alignment, implementation handoff).
8. **Write flow specs** — Create journey files under `flows/` using `flow-spec.md` for cross-screen paths (happy path ordered nodes, branches, related features). Flows reference node slugs; they do not duplicate full screen contracts.
9. **Write app-surface design files** — Create customer / provider / admin (or other) files under `app_surfaces/` using `app-surface-design.md`. Fill Figma pages, journey links, screen inventory, and features on that surface.
10. **Design-system pass** — Create `analysis/design-system.md` for shared color/type/spacing intents, recurring components, and chrome. Descriptive inventory only; map to `AppTheme` / `TextStyles` later during implementation. Do not invent token names that contradict existing app theme docs.
11. **Coverage and contradiction pass** — Create `analysis/coverage.md`. Map every in-scope Figma frame → slug/feature or orphan. Map BRD screen inventory (when present) → design slug or `TBD(design)`. Map design slugs → feature README / route when known. Record BRD vs Figma conflicts without silently picking a winner. Optionally write `analysis/figma-hygiene.md` as a design-facing rename/rewire backlog (never a blocker for analysis).
12. **Build the design index** — Use `design-index.md` for `INDEX.md` and a short `README.md`. Route future agents from tasks to glossary, feature, flow, screen, and graph files. Record source notes and ambiguity policy.
13. **Wire project indexes** — Update root `ai_specs/INDEX.md` Design entry when present. When creating or updating `ai_specs/features/<feature>/README.md`, point **Figma References** at design feature files and screen node URLs (URLs only; load Figma via MCP at UI implement time).
14. **Review for scope leakage** — Remove Flutter widget trees, API payloads, and business-rule essays from design files. Keep UI/nav/screen contracts and AI notes needed to avoid misinterpretation. Point to BRD for business rules and to feature `README.md` / `plan.md` for implementation.

## Quality Rules

- Keep files small enough for selective context loading.
- Put stable global design truth in `analysis/` (glossary, graph, design-system, coverage).
- Put feature-specific UI inventory in `features/`.
- Put ordered journeys in `flows/`.
- Put leaf navigable units in `screens/`.
- Put actor/surface inventories in `app_surfaces/`.
- Prefer English canonical slugs from the glossary in file names, headings, and cross-links; keep raw Figma names in the glossary.
- Prefer URLs + `node-id` in specs; load design details via Figma MCP during UI implementation phases, not as full dumps inside Markdown.
- Treat Figma copy as **l10n intent**, not hardcoded final strings. Record direction per [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md).
- Do not invent missing screens, flows, or validation. Use `TBD(owner)`.
- Do not silently resolve contradictions between Figma and BRD, or between Figma pages. Report the difference and ask which source wins unless the user already gave priority.
- Treat archive / exploratory / optional frames as Future or out-of-scope unless the user marks them MVP.
- Bad Figma names are fixed in the **glossary**, not by blocking analysis. Bad wires are fixed in the **graph** with confidence + `TBD(design)`.

## AI Decision Cases

| Case | Required behavior |
|------|-------------------|
| Frame named `Frame N` or noisy duplicate | Assign canonical slug; keep raw name in glossary; naming quality `noisy` or `duplicate`; do not wait for Figma rename |
| No prototype links on a page | Infer edges from primary CTAs / tabs / back; mark `inferred`; list gaps under broken/incomplete |
| CTA with no clear target | Edge `to: TBD(design)`; confidence `broken` |
| Weak guess at destination | confidence `assumed`; do not implement as a route until confirmed or user accepts |
| Two frames for the same screen | Pick MVP node; mark other `archive` or `variant`; one slug |
| Component-only / library page | Extract into design-system only; do not create fake routes |
| Conflict between Figma and BRD | Record both in coverage; do not pick a winner unless the user already prioritized |
| Conflict between Figma pages / versions | Prefer page marked MVP / latest synced in figma-sources; otherwise report both |
| Journey step with no frame | Keep the flow step; add `TBD(design)` in screen inventory / graph |
| Direction unclear | Explicit note → visible copy → `ai_docs/conventions.md` default; else `mixed/TBD` |
| User-visible copy in Figma | Capture meaning and locale/direction; do not hardcode strings in specs or code |
| Optional / exploratory frames | Future scope or archive; not MVP nodes |

## Before Implementation

When a project has `ai_specs/design/`, load the design `INDEX.md` before planning or coding UI for a feature. Then load the glossary (when present), the routed feature design file, relevant screen nodes, and `analysis/navigation-graph.md` for routing. Summarize which design references were used and call out whether the work extends, conflicts with, or leaves gaps in the design KB or BRD.

For presentation phases, load Figma via MCP from screen-node URLs and follow [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md) and [`../../rules/core/localization.md`](../../rules/core/localization.md).

**Route gate:** do not implement navigation for edges still marked `assumed` or `broken` unless the user explicitly accepts them or design confirms the target.

## Handoff to Feature Delivery

1. Design analysis complete for the feature (or stubs + explicit `TBD(design)`).
2. Align with BRD when present (`Mode D` coverage).
3. Run [`../feature-delivery/make-plan.md`](../feature-delivery/make-plan.md) — feature `README.md` links design feature file + screen Figma URLs; `plan.md` phases reference design-direction rules for UI phases.
4. Run [`../feature-delivery/implement-phase.md`](../feature-delivery/implement-phase.md) — load Figma MCP only when the phase includes UI.
