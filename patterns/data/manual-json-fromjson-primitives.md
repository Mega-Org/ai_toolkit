# Manual `fromJson` primitive parsing

## Purpose

Single convention for **hand-written** `factory …fromJson(Map<String, dynamic> json)` on DTOs when **not** using `json_serializable` code generation. Use this **compact** shape consistently across this repo.

## When to load

- Adding or editing any **`fromJson`** factory on a **`data/models/`** type.
- Reviewing PRs that touch JSON → model mapping.

## References (code)

- **`ApiLoadTypeModel`**: `lib/src/features/_common/data/models/sections/load_type_model.dart` — **`int`**, strings, **`double`** (money).
- **`CityModel`**: `lib/src/features/_common/data/models/sections/city_model.dart` — **`int`** + **`String`**.

---

## Preferred pattern (this app)

Use direct indexing + **`…toString()`** + **`tryParse`** defaults:

```dart
// int (ids, counts)
id: int.tryParse(json['id'].toString()) ?? 0,

// String (names, units, descriptions)
name: (json['name'] ?? '').toString(),
description: (json['description'] ?? '').toString(),
unit: (json['unit'] ?? '').toString(),

// double / decimal money (API may send numbers or strings)
minPrice: double.tryParse(json['min_price'].toString()) ?? 0,
maxPrice: double.tryParse(json['max_price'].toString()) ?? 0,
```

**Rules**

- **`int` / `double`**: always route through **`json['key'].toString()`** then **`tryParse`** — handles JSON **`num`** and string forms without extra branches.
- **`String`**: **`(json['key'] ?? '').toString()`** — avoids **`null`** and coerces non-string JSON values safely.
- Missing keys: **`toString()`** on **`null`** yields **`"null"`**; **`tryParse`** fails → use **`?? 0`** (or change defaults only when the domain requires **`null`**).

---

## Relationship to codegen

If the model uses **`json_serializable`**, generation owns field decoding — see [`json-models-json-serializable.md`](json-models-json-serializable.md). For **manual** factories, use **this** document.
