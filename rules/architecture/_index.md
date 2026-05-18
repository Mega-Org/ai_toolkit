# Architecture rules (`rules/architecture/`)

## Purpose

Cross-layer boundaries for features: what may appear in **domain**, **data**, and **presentation** without duplicating full clean-architecture prose (see `ai_docs/architecture.md` when filled in).

## Contents

| File | Topic |
|------|--------|
| [`observer-presentation-only.md`](observer-presentation-only.md) | Broadcast observer hubs — presentation only; forbidden in `data/` and `domain/` |

## References

- Broadcast observer hub pattern: [`../../patterns/state/broadcast-observer-hub.md`](../../patterns/state/broadcast-observer-hub.md)
- Feature `data/` layout: [`../../patterns/data/feature-data-layer.md`](../../patterns/data/feature-data-layer.md)
- Rules overview: [`../_index.md`](../_index.md)
