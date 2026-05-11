# Core modal bottom sheets

## Purpose

How to **show**, **encapsulate**, and **wire state** for reusable bottom sheets in
this app (same spirit as `thoad`: static `show`, private widget constructors,
`showAppModalBottomSheet`). Aligns with
[`patterns/state/cubit-structure.md`](../state/cubit-structure.md) for Cubit
shape and listeners.

## When to use

- Global overlays (guest/unauthenticated, confirmations, pickers, legal/static
  pages) that are **not** full routes.
- Sheet owns a **short-lived** Cubit (logout-style submit, fetch static HTML,
  etc.).

## References (codebase)

- Wrapper: `lib/material/overlay/show_modal_bottom_sheet.dart` (`showAppModalBottomSheet`,
  optional `showAppTopModalSheet`).
- Cubit-backed examples:
  - `lib/src/features/_common/presentation/change_language/change_language_bottom_sheet.dart`
  - `lib/src/features/_common/presentation/menu/static_page/static_page_sheet.dart`
- No sheet Cubit (app blocs only):
  `lib/material/auth_states/unauthenticated_bottom_sheet.dart`
- Mirror reference project:
  `thoad/lib/src/authentication/presentation/logout/logout_bottom_sheet.dart`,
  `.../delete_account/delete_account_bottom_sheet.dart`

## Encapsulation

1. **Private constructor** on the sheet widget: `const MySheet._(...)` so callers
   cannot construct it except via `show`.
2. **Static `show` method** on the same class — single entry point for presentation
   and provider wiring.
3. Prefer **`StatelessWidget`** when the sheet UI is entirely driven by Cubit /
   callbacks. Use **`StatefulWidget`** when you need widget-local controllers
   (e.g. `ValidatorFieldController`, transient UI toggles) — see
   `StaticPageSheet` / `ChangeLanguageBottomSheet`.

Naming: optional `static const String routeName` when you need to dedupe or
match `RouteSettings.name` (e.g. avoid stacking the same sheet).

## Showing the sheet

- Always go through **`showAppModalBottomSheet`** (not raw `showModalBottomSheet`)
   unless you have a rare exception and document why.
- Pass the **caller's `BuildContext`** into `show` when the sheet must resolve
   theme, localization, or **app-wide** Blocs/Cubits from the tree under
   `MaterialApp` / router.
- **Global / no caller context**: use `appNavigatorKey.currentContext`, then guard
   with `context != null` and `context.mounted` before showing (see
   `UnAuthenticatedBottomSheet.show`).

Typical signature:

```dart
static Future<T?> show(BuildContext context, { /* params */ }) async =>
    showAppModalBottomSheet<T>(
      context: context,
      routeSettings: const RouteSettings(name: 'MySheet'),
      child: /* ... */,
    );
```

Use `routeSettings` for observable route names and analytics parity with `thoad`
logout/delete-account sheets.

## Sheet-scoped Cubit (provide on `show`)

If the sheet uses a **feature Cubit** that should live only while the sheet is
open:

- **`BlocProvider` must wrap the sheet body inside `show`** — create the Cubit
  in `create:` (or `BlocProvider.value` only when the instance is owned
  elsewhere and you explicitly want a longer lifetime — uncommon for sheets).

```dart
static Future<void> show(BuildContext context) async {
  await showAppModalBottomSheet<void>(
    context: context,
    child: BlocProvider(
      create: (_) => MyActionCubit(),
      child: const MySheet._(),
    ),
  );
}
```

Rules:

- Do **not** assume the **caller’s** subtree already provides this Cubit; the
  sheet file owns creation and disposal tied to the overlay route.
- Follow [`cubit-structure.md`](../state/cubit-structure.md): `SafeEmitMixin`,
  `Async<T>` for one-shot actions, `BlocListener` for navigation/toasts/overlay
  loading, `BlocBuilder` / `BlocSelector` for rebuilds.
- If the Cubit needs **parameters**, pass them into `create:` (see
  `StaticPageSheet`: `StaticPageCubit(type: pageType)..getData()`).

App-wide state (`AppAuthenticationBloc`, `AppLanguageCubit`, etc.) stays on
ancestors; use `context` **inside** the sheet `build` after the modal is open —
still the normal lookup. Sheet Cubit is **sibling** scope under the overlay for
that route only.

## Cubits “as pages” inside a sheet

Treat a Cubit-backed sheet like a **small page**:

| Concern | Pattern |
| --- | --- |
| Submit / delete / logout | `Async<void>` state, listener closes sheet + dispatches app events |
| Load remote body | `Async<String>` (or model) + `BlocBuilder` branches loading / error / success |
| Mixed UI + validation | `StatefulWidget` for local controllers + Cubit for async work |

Reuse the same listener patterns as in **Page usage** in
[`cubit-structure.md`](../state/cubit-structure.md) (loading overlay, pop,
toast on failure).

## Do not

- Do not expose `MySheet()` publicly without `show` unless it is a deliberate
  embedded widget used only inside another layout.
- Do not register sheet-only Cubits as global singletons in DI unless the
  product explicitly requires a single long-lived instance (rare for sheets).
- Do not skip `BlocProvider` for sheet Cubits and rely on a parent that might
  not exist when the sheet is opened from a different entry point.

## Relation to full pages

Full screens keep **`BlocProvider` at the page route**. Sheets keep **`BlocProvider`
inside `show`** so scope matches overlay lifetime. Cubit **code** (structure,
state types) is the same; only **provider placement** differs.

## Related

- Centered **dialogs / alerts** (same encapsulation, `showAppDialog`): [`core-alerts-dialogs.md`](core-alerts-dialogs.md)
