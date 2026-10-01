## Agent card

**LOADMAP tags:** `codegen`
**Read rest of this file:** yes when changing injectable/json_serializable setup or CI codegen steps.

### Must
- Treat this card as the load target for `+codegen`. Do not invent a build_runner policy.
- After adding/renaming `@injectable` / generated models, follow the **app** Makefile / existing scripts (`make` targets) if present.
- Do not hand-edit `*.config.dart` / `*.g.dart`.

### Must not
- Hand-edit `*.config.dart` / `*.g.dart`.
- Load testing or extra tooling indexes for codegen.

### When to load the rest
- Changing injectable / json_serializable setup, CI codegen steps, the generate command, or which generated files to commit.

### Related (cards first)
- `+di` for injectable registration; app `ai_docs` if it documents the generate command.

### Card protocol
- Default: this card is enough. Use `limit: 60` so you do not ingest the full leaf.
- Read the rest of **this** file only when **Read rest** is yes, or **When to load the rest** matches.
- Do not open `INDEX.md`, `rules/_index.md`, or `patterns/_index.md` to rediscover this leaf.
- Related files: open their **Agent cards** first; skip them if the other tag was not requested.
- No `tests` tag. Do not write or run tests. Do not commit unless the user asks.
- Edit in place; do not rewrite the whole leaf to “clean it up.”
- If the body is a stub (`Fill in later`), stop after this card; do not invent policy.
- Indexes, templates, and untagged leaves are not part of this tag.
- Spec templates, skills, and backend-contract work belong to later plan todos — not this card.

# build_runner and generated code

## Purpose
Rules for running build_runner, checking in generated files, and safe regeneration workflows.

## Fill when
- When codegen packages or `build.yaml` conventions change.

## References
- Optional paths in **your app repos** (not copied here): e.g. `build.yaml`, `pubspec.yaml`

## Content

### This app

Run after new/changed `@injectable` registrations, `@JsonSerializable` models (when used), or other `build_runner` targets:

```bash
dart run build_runner build --delete-conflicting-outputs
```

Packages: `build_runner`, `injectable_generator` in `pubspec.yaml`. Commit generated `*.config.dart` / `*.g.dart` with the hand-written change. **Do not** hand-edit generated files.

### Verify

Run the app's command from `ai_docs/conventions.md` (for example `make analyze`) on touched `lib/` paths after codegen.
