# Testing rules index

## Purpose

Where tests live and when agents should run or author them.

## Fill when

Test layout or CI test gates change.

## References

- App policy: `ai_docs/preferences.md` (when present) — **tests off by default** for agents unless the user asks.

## Content

- **Out of scope by default:** agents do not write, run, or scaffold tests unless the user explicitly asks.
- **Existing tests:** leave `test/` untouched during feature delivery unless the phase or user requests coverage.
- **When asked:** mirror feature layout under `test/features/…`; use project test conventions and `flutter test <path>`.
- LOADMAP has **no `tests` tag** — do not load this file during implement-phase unless the user invokes testing work.
