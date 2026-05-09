# Core utilities

## Purpose

Extensions, validators, and helpers—without embedding business rules that belong in domain or features.

## Fill when

- When utility boundaries or shared helper ownership changes.

## References

- `lib/core/utils/` (extensions, picker, deep_link, pusher, share_and_url_launch, etc.)

## Content

### Extensions (`utils/extensions/`)

- **`BuildContext`**, **`String`**, **`DateTime`**, **`List`**, **`Set`**, **`File`**, **`TimeOfDay`**, **`Color`**, **`Formatter`** helpers — **pure transformations** and UI-adjacent conveniences.
- **Do not** import feature modules from core extensions; **keep dependencies upward-stable**.

### Validation (`utils/validations/validator.dart`)

- Shared **regex / input checks** — reusable across forms. **Product-specific validation rules** (e.g. “this SKU format”) belong in **feature** or **domain**, not core.

### Files & media

- File / media picker utilities — **path inspection**, temp files, picking — **no API calls**.

### Notifiers / timers

- **`TimerController`**, **`ResendTimerNotifier`**, etc. — **UI timing** helpers; keep free of domain rules.

### Additional clusters in this repo

- **`deep_link/`**, **`pusher/`**, **`distance_utils`** — treat as **infrastructure utilities**; they stay in **`utils/`** until promoted to a shared package. **Do not** move business workflows into these folders.

### Rule of thumb

- If a function encodes **“what this app considers valid business state”** for one feature, it **does not** belong in **`core/utils`**. If it is **string/date/formatting** useful across the whole app, it **does**.
