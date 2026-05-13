# Enum wire parsing

## Rule

- Map wire strings into enhanced **`enum`**s with a **named `factory`** (e.g. `fromApi`), not a freestanding `static` helper, when a factory is enough.
- **`fromApi`-style factories** in this repo use **`values.firstWhere`** with a **block-bodied** predicate: `return element.value == <input>;` — **without `orElse`** on the enum.
- When **`null` / empty / unknown** must not throw, **guard in the model or DTO** (or a private helper next to `fromJson`) and only call **`fromApi`** with a string you treat as valid; do not silently widen the enum factory unless explicitly agreed.

## References

- Pattern and examples: [`../../patterns/dart/enums-wire-parsing.md`](../../patterns/dart/enums-wire-parsing.md)
