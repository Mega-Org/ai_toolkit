# Constructors and `super()`

## Purpose

Avoid redundant explicit superclass calls when the analyzer already implies the correct chain.

## Rule

When the **immediate superclass** has a single unnamed generative constructor that takes **no arguments** (for example `const NoParams()` in `lib/core/foundation/i_use_case.dart`), **do not** write `: super()` in subclasses.

Dart implicitly invokes that superclass constructor. Omitting `: super()` matches the rest of the codebase (e.g. `LoginParams extends NoParams` without an initializer list) and reduces noise.

**Keep** `: super(...)` when you must **pass arguments** to the superclass constructor, or when you use **`super.fieldName`** parameters that forward to the superclass.

## References

- [`rules/core/foundation.md`](../core/foundation.md) — `NoParams`, `IUseCase` params
- [`patterns/data/use-case-and-domain-service-type.md`](../../patterns/data/use-case-and-domain-service-type.md)
