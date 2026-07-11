# Design Coverage Template

## Purpose

Track extraction completeness and conflicts: Figma frames ↔ design KB ↔ BRD ↔ implementation. Use this for senior review and agent honesty about gaps.

## Figma Frame → Design KB

| Frame (raw) | Slug | Feature | Classification | Status |
|-------------|------|---------|----------------|--------|
| Login V2 AR | auth_login | authentication | screen | mapped |
| Mystery Frame | — | — | unknown | orphan → TBD(design) |

## BRD Screen Inventory → Design

| BRD screen / module | Design slug | Gap |
|---------------------|-------------|-----|
| Login | auth_login | ok |
| KYC upload | — | TBD(design): not in Figma |

Skip this section if `ai_specs/brd/` is absent.

## Design → Implementation

| Slug | Feature README | Code route / name | Status |
|------|----------------|-------------------|--------|
| auth_login | `features/authentication/` | /login | not started |

## Conflicts

| Topic | BRD / product says | Figma shows | Decision |
|-------|--------------------|-------------|----------|
| OTP length | 6 | 4 boxes | TBD(product) |

## Unwired / Low-Confidence Edges

| From | Trigger | Confidence | Next action |
|------|---------|------------|-------------|
| profile | Settings | broken | Confirm target with design |

## Naming Debt

| Raw Figma name | Slug | Quality | Optional hygiene |
|----------------|------|---------|------------------|
| Frame 128 | home_root | noisy | Rename in Figma (optional) |

## Summary

- In-scope frames mapped:
- Orphans:
- BRD gaps:
- Open conflicts:
- Edges still `assumed` / `broken`:
