# Core alerts and modal dialogs

## Purpose

How to **show**, **encapsulate**, and **wire state** for **centered** modal
dialogs (confirmations, short messages, blocking prompts) in this app. Same
encapsulation rules as
[`core-bottom-sheets.md`](core-bottom-sheets.md) (private `._()`, static
`show`). Aligns with
[`patterns/state/cubit-structure.md`](../state/cubit-structure.md) for Cubits.

## Dialog vs bottom sheet

| Prefer | When |
| --- | --- |
| **Bottom sheet** | Long content, scrollable lists, filters, inputs tied to keyboard; less visually “blocking”. See [`core-bottom-sheets.md`](core-bottom-sheets.md). |
| **Centered dialog** | Short confirmations, 1–3 actions, force-update style prompts, “modal card” look. |

## References (codebase)

- **Styled app dialog**: `lib/material/overlay/show_dialog.dart` — **`showAppDialog`**
  (`showGeneralDialog` + shared chrome: max width, header, fade/slide).
- **Feature dialog pattern**: `lib/src/_store_updater/views/update_dialog.dart`
  (`_AppUpdateDialog.show`, custom `showGeneralDialog` + `AlertDialog` — acceptable
  when you need a **different** transition or layout than `showAppDialog`).
- **Global blocking overlays** (not feature dialogs): `AppLoadingWidget.overlay`,
  `AppFailWidget.overlay` — raw `showDialog` + route name deduping; do not copy for
  normal CRUD/alerts unless you need the same semantics.

## Encapsulation

Same as sheets:

1. **`const MyDialog._(...)`** — private constructor.
2. **`static Future<T?> show(BuildContext context, …)`** — single entry; optional
   named `routeSettings` / `routeName` for navigation observability.
3. **`StatefulWidget`** only if you need local controllers; otherwise
   **`StatelessWidget`** + Cubit.

## Showing dialogs — prefer `showAppDialog`

For new **branded** dialogs that should match app chrome (padding, border-radius,
optional header):

```dart
static Future<bool?> show(BuildContext context) async {
  return showAppDialog<bool>(
    context: context,
    routeName: 'ConfirmDeleteDialog', // override default if needed
    headerText: appLocalizer.warning,
    child: const ConfirmDeleteDialog._(),
  );
}
```

Pass **`routeName`** (or rely on override of `showAppDialog`’s default) so routes
are identifiable in logs and tests.

Parameters worth knowing on `showAppDialog`: `isDismissible`, `useRootNavigator`,
`maxWidth`, `openAlign` (slide-from-edge vs centered fade — see
`show_dialog.dart`).

## Dialog-scoped Cubit

If the dialog performs async work (delete, submit):

- Wrap with **`BlocProvider` inside `show`**, same rule as sheets — scope equals
  overlay lifetime; see **Sheet-scoped Cubit** in
  [`core-bottom-sheets.md`](core-bottom-sheets.md#sheet-scoped-cubit-provide-on-show).

```dart
static Future<void> show(BuildContext context) async {
  await showAppDialog<void>(
    context: context,
    child: BlocProvider(
      create: (_) => ConfirmActionCubit(),
      child: const ConfirmActionDialog._(),
    ),
  );
}
```

Use **`BlocListener`** / **`BlocBuilder`** per [`cubit-structure.md`](../state/cubit-structure.md).

## When **not** to use `showAppDialog`

- **Loading / global error overlays** that must stack-dedupe by route name — follow
  existing patterns in `AppLoadingWidget` / `AppFailWidget` (root navigator,
  `PopScope`, non-dismissible).
- **Highly custom** motion or layout (e.g. slide-from-top update promo): **`showGeneralDialog`**
  + your widget tree is fine; still use **static `show`** on the widget class and
  keep **`RouteSettings(name: …)`** consistent.

## Do not

- Do not call **`showDialog`** with ad-hoc `AlertDialog` for every feature without
  checking whether **`showAppDialog`** already matches the product look.
- Do not provide dialog Cubits only from a parent screen — callers may open the
  dialog from different places; **create in `show`** unless there is a deliberate
  shared lifetime requirement.

## Related

- Bottom sheets: [`core-bottom-sheets.md`](core-bottom-sheets.md)
- Cubit shape and listeners: [`../state/cubit-structure.md`](../state/cubit-structure.md)
