# Flutter rules

Six Cursor templates cover page structure, shared widgets, flavors, localization, remote data sources, and Figma layout. Index: [overview](overview.md).

## Page and Bloc

**Template:** [`flutter-page-bloc.mdc.template`](../../templates/cursor-rules/flutter-page-bloc.mdc.template)

**Toolkit:** [`widgets-and-performance.md`](../../rules/flutter/widgets-and-performance.md). How-to: [`page-bloc-provider.md`](../../patterns/flutter/page-bloc-provider.md), [`presentation-field-naming.md`](../../patterns/flutter/presentation-field-naming.md).

**What it requires.** A screen that owns a feature-scoped `Bloc` or `Cubit` is a public `StatelessWidget`. Its `build` returns `BlocProvider` and a private `_View`. Controllers, focus nodes, and `TickerProvider` live on that view’s `State`, under the provider, so `context.read` sees the cubit. Runtime cubit arguments stay on the public page and pass into `create:`. State fields are private, use the full `Controller` suffix, and take a role-based name. `dispose` releases them.

**When it applies.** `lib/**/*.dart` (`alwaysApply: false`). Use it when a screen introduces its own `BlocProvider`.

## Shared widgets

**Template:** [`flutter-shared-widgets.mdc.template`](../../templates/cursor-rules/flutter-shared-widgets.mdc.template)

**Toolkit:** [`ui-composition.md`](../../rules/flutter/ui-composition.md). Tokens: [`theme.md`](../../rules/core/theme.md), [`app-theme-color-tokens.md`](../../rules/core/app-theme-color-tokens.md), [`config.md`](../../rules/core/config.md), [`text-styles.md`](../../rules/core/text-styles.md). Names in this app: [`conventions.md`](../../../ai_docs/conventions.md).

**What it requires.** Feature UI uses `AppButton`, `AppImage` (`circle`, `rounded`, `defaultImage`), and `AppSvgIcon`. Button text comes from `AppLocalizations`. Leave `textStyle`, `textColor`, and `buttonColor` unset so `elevatedButtonTheme` supplies label and fill. A thin private `AppButton.onPressed` is a tear-off; guards and extra logic use a closure ([callbacks](dart-rules.md#callbacks)). `isLoading` follows cubit `Async` state. Equal gaps on a `Row` or `Column` use `spacing: Dimensions.*`. `SizedBox` covers unequal gaps and plain size. `Container` covers decoration. Colors, spacing, radii, and type come from theme tokens.

**When it applies.** `lib/**/*.dart`.

## Flavors

**Template:** [`flutter-flavors.mdc.template`](../../templates/cursor-rules/flutter-flavors.mdc.template)

**Toolkit:** generic matrix in [`flavors.md`](../../setup/flavors.md). This app: [`architecture.md`](../../../ai_docs/architecture.md), [`flutter-flavors`](../../../ai_specs/features/flutter-flavors/README.md). Commands: [`alias/flutter.md`](../../alias/flutter.md) and the root `Makefile`.

**What it requires.** `AppEnvironmentEnum` in `lib/config/environment_config.dart` is the flavor list. Each flavor has a full `lib/main_<flavor>.dart` with the shared bootstrap sequence, and that file is the only place that constructs `EnvironmentsConfig`. The shell is `lib/apps/_<flavor>_app.dart` with public class `<Flavor>App`. Each flavor keeps a complete tree. Flavor-scoped symbols are prefixed. Home and tabs live under `lib/src/features/<flavor>/main_page/`. The shell reads the display title from `EnvironmentsConfig.appTitle` or localization. Firebase options are `lib/src/firebase_options_<flavor>.dart` for project `sanad-sa-app`. Native Firebase files stay in the flavor source sets. Launcher icons follow `flutter_launcher_icons-<flavor>.yaml` and `AppIcon-<PascalCase>`. Run and build commands go through Makefile targets.

Adding a flavor follows the checklist in the template:

1. Add the enum value.
2. Add `lib/main_<flavor>.dart` from an existing entrypoint.
3. Add the shell and the prefixed `main_page/` tree.
4. Add the Android product flavor and source set.
5. Add the iOS xcconfig, build configurations, scheme, icon set, and plist copy script.
6. Add launcher-icon and splash configs, then regenerate assets.
7. Run `flutterfire configure` into the flavor options file.
8. Append the flavor to `FLAVORS` in the Makefile and extend [`flavors.md`](../../setup/flavors.md).

**When it applies.** `alwaysApply: true`. Any flavor, entrypoint, shell, Firebase, icon, or run-command change.

## Localization

**Template:** [`flutter-localization.mdc.template`](../../templates/cursor-rules/flutter-localization.mdc.template)

**Toolkit:** [`localization.md`](../../rules/core/localization.md). Enum copy: [`enums-l10n.md`](../../rules/dart/enums-l10n.md). Direction: [`design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md) and [Figma and RTL](#figma-and-rtl).

**What it requires.** User-facing strings come from localization. A widget with `BuildContext` calls `AppLocalizations.of(context)` at each use. One `build` that repeats many keys may hold `final l10n = AppLocalizations.of(context)`. Context-less code uses `appLocalizer`. Enum display copy is a `String` getter on the enum that reads `appLocalizer`. Current locale reads use `getLocale` and `getLocaleTypeEnum`. Language persistence goes through `LocalizationContainer` or `AppLanguageCubit`. Figma copy is language intent.

A new string:

1. Add the key to `app_en.arb` and `app_ar.arb` under the matching `@-SECTION-` header.
2. Keep keys `camelCase` and in sync across ARBs.
3. Let `flutter gen-l10n` generate the Dart files.
4. Read the key through `AppLocalizations.of(context)` or `appLocalizer`.

**When it applies.** `lib/**/*.dart`.

## Remote data sources

**Template:** [`flutter-remote-datasources.mdc.template`](../../templates/cursor-rules/flutter-remote-datasources.mdc.template)

**Toolkit:** [`remote-data-sources.md`](../../rules/flutter/remote-data-sources.md). Example: [`remote-data-source-inline.md`](../../patterns/data/remote-data-source-inline.md). Request logging: [No request prints](dart-rules.md#no-request-prints).

**What it requires.** Each public method on `*RemoteDataSourceImpl` calls `DioHelper` in that method and parses the envelope there. A private helper is for wiring shared by several public methods. Request maps come from `NoParams.toMap` or the feature param `toMap`. When the API expects `lang` in the body, that param `toMap` adds it through `getLocaleTypeEnum`. Request URLs, bodies, and responses stay out of `print` and `debugPrint`. `PrettyDioLogger` on `DioHelper` logs them in dev.

**When it applies.** `lib/**/*remote_data_source*.dart` and `lib/**/*_remote_data_source*.dart`.

## Figma and RTL

**Template:** [`figma-arabic-rtl.mdc.template`](../../templates/cursor-rules/figma-arabic-rtl.mdc.template)

**Toolkit:** [`design-direction-and-localization.md`](../../rules/flutter/design-direction-and-localization.md). App notes: [`conventions.md`](../../../ai_docs/conventions.md) (Design / Figma).

**What it requires.** Figma copy is Arabic by default, so layout intent is RTL unless the frame says LTR. With an Arabic `MaterialApp` locale, Flutter `Directionality` supplies alignment and padding. Explicit direction uses `TextAlign.start`, `AlignmentDirectional`, `EdgeInsetsDirectional`, and `PositionedDirectional` so LTR still works after a language switch. Physical `left` and `right` are for an element that stays on the same screen edge in every locale. Visible text uses app l10n, and Figma strings are key meaning. Watch long Arabic lines, latin or numeric runs inside RTL text, and mirroring of chevrons, back arrows, and trailing actions.

**When it applies.** `alwaysApply: true`. Any UI taken from Figma, or any layout-direction change.
