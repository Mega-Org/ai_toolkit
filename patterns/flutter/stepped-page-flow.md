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
- A Figma flow where each frame is one state of the same route.

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
│   ├── <flow>_step_enum.dart
│   └── <flow>_tab_enum.dart
├── models/                        # optional: presentation-only draft/config models
│   ├── <flow>_first_step_draft.dart
│   └── <flow>_step_config.dart
├── steps/
│   ├── <flow>_first_step.dart
│   ├── <flow>_second_step.dart
│   └── <flow>_third_step.dart
└── widgets/
    ├── <flow>_scaffold.dart
    ├── <flow>_step_switcher.dart
    └── <flow>_step_header.dart
```

For large route UI, prefer making `<flow>_page.dart` the `part` library host and
put step/widgets files under `part` files. Keep `cubit/state` as their own
library pair.

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
- Submit/loading state using the app `Async<T>` pattern.

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
      AddVehicleDocumentTabEnum.insurance => appLocalizer.vehicleInsuranceTab,
      AddVehicleDocumentTabEnum.inspection => appLocalizer.vehicleInspectionTab,
      AddVehicleDocumentTabEnum.registration => appLocalizer.vehicleRegistrationTab,
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

## Step widgets

Step widgets should be mostly dumb:

- Read their step draft with `BlocSelector` when only one step should rebuild.
- Render fields and sections.
- Call Cubit methods for updates, next, previous, tab selection, and submit.
- Avoid duplicating navigation decisions inside the step widget.

Each step should validate only its own form. Cross-step validation belongs in the
Cubit or in a final submit builder method that creates the use-case params.

## Back and submit behavior

Back behavior must be explicit and tested by reading the Cubit code:

1. Nested tab back, if the current step has tabs.
2. Previous main step.
3. Route pop only when already at the beginning.

Submit should build a single use-case param from the step drafts. Keep request
field names in the use-case param `toMap`, not in widgets.

## Shared widgets

Keep flow-specific visual pieces under `presentation/<flow>/widgets/`. Move
widgets to shared `_common/presentation/` only when they are useful outside the
flow, such as catalog dropdowns or reusable picker fields.

## Localization and direction

- Every visible string must use l10n.
- For Figma frames in Arabic, treat right/left layout as RTL intent first.
- Prefer `AlignmentDirectional`, `EdgeInsetsDirectional`, and Flutter
  `Directionality` defaults over hardcoded `left` / `right`.

## Checklist

- [ ] Public page is thin and the real view is below `BlocProvider`.
- [ ] Cubit owns current step/tab and back behavior.
- [ ] Each form step has its own form key or validation boundary.
- [ ] Draft models with controllers implement `dispose()`.
- [ ] Step widgets render UI and delegate flow decisions to the Cubit.
- [ ] Flow-local widgets stay under `widgets/`; shared dropdowns/pickers move to
      `_common/presentation/`.
- [ ] Text is localized and directional APIs are used for RTL/LTR safety.

## References

- Page shell: [`page-bloc-provider.md`](page-bloc-provider.md)
- Field naming: [`presentation-field-naming.md`](presentation-field-naming.md)
- Large route parts: [`../dart/part-part-of-library.md`](../dart/part-part-of-library.md)
- State patterns: [`../state/cubit-structure.md`](../state/cubit-structure.md), [`../state/cubit-and-use-case.md`](../state/cubit-and-use-case.md)
- Figma direction and l10n: [`../../rules/flutter/design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md), [`../../rules/core/localization.md`](../../rules/core/localization.md)
