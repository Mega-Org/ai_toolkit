# Refactor workflow

## Purpose

Safe refactors across features without changing product behavior.

## Fill when

Architecture moves or large rename conventions change.

## References

- App layout: `ai_docs/architecture.md`
- Ask gate: [`../../docs/workflows/working-rules.md`](../../docs/workflows/working-rules.md)

## Content

1. **Scope** — Name folders/files in and out; confirm no spec/API contract change unless user approved.
2. **Load** — `ai_docs/architecture.md`, affected feature `README.md` + `plan.md` (or fix spec).
3. **Incremental** — Small commits optional (user asks); prefer series of analyzer-clean steps.
4. **Search** — Broad symbol search → `explore` subagent; do not load full `INDEX.md` trees.
5. **Verify** — `make analyze` on touched paths; run tests only if user asked.
6. **Handoff** — List renamed symbols for feature `memory.md` replace rows.
