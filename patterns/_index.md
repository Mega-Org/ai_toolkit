# Patterns (`patterns/`)

## Purpose

**Implementation examples and stack conventions** (Cubit/Bloc files, Dio repositories, `json_serializable`, DI registration). Patterns are longer than rules; keep them **aligned** with [`rules/core/`](../rules/core/_index.md) and [`rules/dart/`](../rules/dart/_index.md) so they do not contradict enforceable guidance.

## Subfolders

| Folder | Role | Index |
|--------|------|--------|
| `patterns/dart/` | Imports, analysis-related how-tos, **enum wire parsing** | [`dart/_index.md`](dart/_index.md) |
| `patterns/state/` | Cubit-first state, Bloc choice, broadcast observer hub | [`state/_index.md`](state/_index.md) |
| `patterns/data/` | Models, Dio, `Either` / failures | [`data/_index.md`](data/_index.md) |
| `patterns/di/` | `get_it` + injectable examples | [`di/_index.md`](di/_index.md) |
| `patterns/flutter/` | Responsive layout, shared media/buttons, breakpoints, **stepped flows**, **pagination list** | [`flutter/_index.md`](flutter/_index.md) |
| `patterns/platform/` | iOS pods, native build notes | [`platform/_index.md`](platform/_index.md) |

## References

- Enforceable rules: [`rules/_index.md`](../rules/_index.md)
- Task routing: [`INDEX.md`](../INDEX.md)
- Default stack (serialization, DI, state): [`README.md`](../README.md)
