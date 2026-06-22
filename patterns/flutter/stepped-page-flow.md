# Stepped Page Flow

## Purpose

Use this pattern for a route that collects or presents data across multiple steps,
tabs, or wizard-like screens while staying in one feature flow. It keeps the
page shell thin, navigation explicit, and form state easy to validate and
dispose.

## When to use

Use this for:

- Multi-step forms such as registration, add vehicle, onboarding, or setup.
- A page with nested step tabs where back behavior should move through tabs or
  steps before leaving the route.
- A design flow where each frame is one state of the same route.

Do not force this structure for a simple one-screen form. Start small, then split
when the flow has multiple steps, multiple private widgets, reusable local UI
models, or non-trivial back/submit behavior.

## Preferred layout

This is the scalable layout. Folders marked optional should be added only when
they help ownership and navigation.

```text
lib/src/features/<feature>/presentation/<flow>/
├── <flow>_page.dart
├── <flow>_cubit.dart
├── <flow>_state.dart
├── enums/                         # optional: step, tab, mode, type enums
│   └── <flow>_step_enum.dart
├── models/                        # optional: presentation-only draft/config models
│   ├── <flow>_details_draft.dart
│   └── 3_<flow>_team_draft.dart   # indexed when flow has ≥ 3 steps
├── steps/                         # part files — see “Step switcher part library”
│   ├── 1_<flow>_details_step.dart
│   ├── 2_<flow>_attachments_step.dart
│   └── 3_<flow>_review_step.dart
└── widgets/
    ├── <flow>_scaffold.dart
    ├── <flow>_step_switcher.dart  # part library host for steps
    └── <flow>_step_header.dart
```

Keep `cubit` / `state` as their own library pair. For other large route UI,
`<flow>_page.dart` may also host `part` files — see
[`../dart/part-part-of-library.md`](../dart/part-part-of-library.md).

## Step switcher part library

For flows with multiple steps, the **default** layout is a **`part` library** hosted
by `widgets/<flow>_step_switcher.dart`:

1. The switcher file holds **all `package:` imports** and **`part` directives**.
2. Each step lives under `steps/` as a **`part of '../widgets/<flow>_step_switcher.dart'`**
   file.
3. Step widgets are **private** (`class _<Flow>DetailsStep`) and selected from a
   small switcher body (`AnimatedSwitcher` + step enum).

```dart
// widgets/<flow>_step_switcher.dart (library host)
import 'package:flutter/material.dart';
// … other imports …

part '../steps/1_<flow>_details_step.dart';
part '../steps/2_<flow>_review_step.dart';

class <Flow>StepSwitcher extends StatelessWidget { /* … */ }
```

```dart
// steps/1_<flow>_details_step.dart
part of '../widgets/<flow>_step_switcher.dart';

class _<Flow>DetailsStep extends StatelessWidget { /* … */ }
```

Use a standalone step library only when the step is reused outside the flow
(rare).

## File naming (step index)

When a flow has **three or more** main steps:

- Prefix **step** files with a **1-based index** matching step enum order:
  `1_<flow>_details_step.dart`, `2_…`, `3_…`.
- Apply the **same index** to **per-step draft** files in `models/` when one
  draft maps to one step (`3_<flow>_team_draft.dart`).

For **one- or two-step** flows, descriptive names without a numeric prefix are
fine (`<flow>_details_step.dart`, `<flow>_review_step.dart`).

## Page and Cubit shape

Follow the normal page-provider pattern:

1. Public page is a thin `StatelessWidget`.
2. The page returns `BlocProvider` or `MultiBlocProvider`.
3. A private `_View` widget lives under the provider and owns listeners,
   callbacks, and UI composition.
4. The Cubit owns the current step/tab, step navigation, submit state, and back
   behavior.

```dart
class AddVehiclePage extends StatelessWidget {
  const AddVehiclePage({super.key});

  @override
  Widget build(final BuildContext context) {
    return BlocProvider(
      create: (_) => injector<AddVehicleCubit>(),
      child: const _AddVehicleView(),
    );
  }
}
```

Use `AnimatedSwitcher`, `PageTransitionSwitcher`, or a small flow-local switcher
widget for transitions. Keep animation details in `widgets/<flow>_step_switcher.dart`
instead of scattering them across each step.

## State ownership

The Cubit state should hold:

- Current main step, preferably as a step enum when labels or metadata are
  needed; an `int` is acceptable for tiny flows.
- Current nested tab when a step has tabs.
- One draft/model object per step.
- Submit/loading state using the app’s async state pattern (e.g. `Async<T>`).

Step draft objects may own UI controllers when they are presentation-only:

- `GlobalKey<FormState>`
- `TextEditingController`
- `FocusNode`
- `ValidatorFieldController<T>`

These draft objects must expose `validate()` and `dispose()` methods when they
own form keys or disposable fields.

## `enums/` vs `models/`

Use `enums/` for identity and finite choices:

- Main steps.
- Nested tabs.
- View modes.
- UI-only selectable types.

Put l10n labels on enums when the enum is displayed by the UI:

```dart
enum AddVehicleDocumentTabEnum {
  insurance,
  inspection,
  registration;

  String get title {
    return switch (this) {
      AddVehicleDocumentTabEnum.insurance => l10n.vehicleInsuranceTab,
      AddVehicleDocumentTabEnum.inspection => l10n.vehicleInspectionTab,
      AddVehicleDocumentTabEnum.registration => l10n.vehicleRegistrationTab,
    };
  }
}
```

Use `models/` for presentation-only data:

- Step draft objects with controllers and form keys.
- Step configuration objects used only to render the flow.
- UI view models that combine local labels, icons, enabled state, or hints.

Do not put API models, repository params, persisted domain data, or shared
business entities in `presentation/<flow>/models/`. Move those to the domain or
data layer.

### Sub-models (draft helpers)

Keep sub-model placement flexible:

| Situation | Prefer |
|-----------|--------|
| Small type used only inside one step’s draft | **Nested or private class** in the parent draft file |
| Type used in **review**, **submit params**, or **another step** | **Separate file** in `models/` |
| Type grows beyond a simple row/entry shape | **Separate file** in `models/` |

When the flow has ≥ 3 steps and the sub-model belongs to one step, use the same
**index prefix** as that step’s draft file.

## Step widgets

Step widgets should be mostly dumb:

- Read their step draft with `BlocSelector` when only one step should rebuild.
- Render fields and sections.
- Call Cubit methods for updates, next, previous, tab selection, and submit.
- Avoid duplicating navigation decisions inside the step widget.

Each step should validate only its own form. Cross-step validation belongs in the
Cubit or in a final submit builder method that creates the use-case params.

### Step-local private widgets

Widgets used **only inside one step** (section headers, row layouts, bottom-sheet
bodies) stay in that step’s **`part` file** as **`class _…` private widgets**.
Do not promote them to `widgets/` unless a second step or another flow needs them.

| Location | Use for |
|----------|---------|
| `steps/<n>_*_step.dart` | Step widget + step-only private helpers |
| `widgets/` | Shared across steps in the same flow (scaffold, stepper header, attachment field) |
| Shared feature / common presentation | Reusable outside this flow (catalog dropdowns, pickers) |

## Back and submit behavior

Back behavior must be explicit and tested by reading the Cubit code:

1. Nested tab back, if the current step has tabs.
2. Previous main step.
3. Route pop only when already at the beginning.

Submit should build a single **`XxxParams`** from the step drafts in the Cubit.
Keep request field names in the use-case param **`toMap`**, not in widgets.

For param field design traceability (doc comments, entity vs id), follow
[`../data/use-case-and-domain-service-type.md`](../data/use-case-and-domain-service-type.md).
Per-app locale wording for comments lives in each repo’s **`ai_docs/conventions.md`**.

## Shared widgets

Keep flow-specific visual pieces under `presentation/<flow>/widgets/`. Move
widgets to a shared presentation folder only when they are useful outside the
flow, such as catalog dropdowns or reusable picker fields.

## Localization and direction

- Every visible string must use l10n.
- Map design copy to l10n keys; treat mockup text as **wording intent**, not
  inline strings in widgets.
- Prefer `AlignmentDirectional`, `EdgeInsetsDirectional`, and Flutter
  `Directionality` defaults over hardcoded `left` / `right`.

See [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md)
for design-to-code direction and l10n intake.

## Checklist

- [ ] Public page is thin and the real view is below `BlocProvider`.
- [ ] Cubit owns current step/tab and back behavior.
- [ ] Step switcher is the `part` library host; steps are `part` files under `steps/`.
- [ ] When ≥ 3 steps, step and per-step draft files use a 1-based index prefix.
- [ ] Each form step has its own form key or validation boundary.
- [ ] Draft models with controllers implement `dispose()`.
- [ ] Step widgets render UI and delegate flow decisions to the Cubit.
- [ ] Step-only UI helpers are private classes in the step `part` file.
- [ ] Flow-local widgets stay under `widgets/`; shared pickers/dropdowns move up.
- [ ] Submit builds `XxxParams` in the Cubit; API keys only in `toMap`.
- [ ] Text is localized and directional APIs are used for RTL/LTR safety.

## References

- Page shell: [`page-bloc-provider.md`](page-bloc-provider.md)
- Field naming: [`presentation-field-naming.md`](presentation-field-naming.md)
- Part libraries: [`../dart/part-part-of-library.md`](../dart/part-part-of-library.md)
- Use-case params: [`../data/use-case-and-domain-service-type.md`](../data/use-case-and-domain-service-type.md)
- State patterns: [`../state/cubit-structure.md`](../state/cubit-structure.md), [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md)
- Design direction and l10n: [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md), [`../../rules/core/localization.md`](../../rules/core/localization.md)
