# Patterns: State (`patterns/state/`)

## Purpose

**Cubit-first** structure and decision guidance. Feature/page state uses Cubit by
default; full Bloc is reserved for app-wide event-driven state such as
authentication.

## Contents

| File | Topic |
|------|--------|
| [`cubit-structure.md`](cubit-structure.md) | Feature/page Cubit file layout and state conventions |
| [`bloc-structure.md`](bloc-structure.md) | Full Bloc layout for app-wide event state |
| [`cubit-vs-bloc.md`](cubit-vs-bloc.md) | When to prefer Cubit vs full Bloc |

## References

- App-wide blocs rules: [`../../rules/core/blocs-app-wide.md`](../../rules/core/blocs-app-wide.md)
- Async state rules: [`../../rules/core/async.md`](../../rules/core/async.md)
- DI for blocs/cubits: [`../../rules/core/di.md`](../../rules/core/di.md)
- Patterns overview: [`../_index.md`](../_index.md)
