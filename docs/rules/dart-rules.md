# Dart rules

Four Cursor templates cover imports, UI callbacks, `part` libraries, and HTTP logging. Index: [overview](overview.md).

`no-request-prints` is documented here because it is a Dart logging rule for `print` and `debugPrint`.

## Imports

**Template:** [`dart-imports.mdc.template`](../../templates/cursor-rules/dart-imports.mdc.template)

**Toolkit:** convention in [`absolute-imports.md`](../../patterns/dart/absolute-imports.md). Analyzer leaf: [`imports-and-analysis.md`](../../rules/dart/imports-and-analysis.md) (stub; the template still marks it planned). `part` paths: [`part-part-of.md`](../../rules/dart/part-part-of.md), [`part-part-of-library.md`](../../patterns/dart/part-part-of-library.md).

**What it requires.** `import` lines use absolute `package:` URIs, including inside the same feature. A file you edit gets any relative `import` converted to `package:` before the edit is done. `part` and `part of` stay relative. `part of` points at the library file with a relative path. See [Part libraries](#part-libraries).

**When it applies.** `lib/**/*.dart` and `test/**/*.dart`.

## Callbacks

**Template:** [`dart-callbacks.mdc.template`](../../templates/cursor-rules/dart-callbacks.mdc.template)

**Toolkit:** [`callbacks.md`](../../rules/dart/callbacks.md). The `AppButton` case also appears in [shared widgets](flutter-rules.md#shared-widgets).

**What it requires.** UI callback parameters (`onPressed`, `onTap`, `onChanged`, `listener`, `builder`, and similar) wrap a call to a private or instance method in an explicit closure. That keeps the call visible, keeps the breakpoint on the call site, and leaves room for a later guard. `AppButton.onPressed` may tear off a private, zero-argument method when the call site has no guard. Switch back to a closure when the handler needs a `mounted` check, an `if` guard, or other inline logic. Constructor tear-offs (`MyWidget.new`), `Iterable` and `Future` callbacks, and top-level or static one-shot handlers stay tear-offs.

**When it applies.** `lib/**/*.dart`.

## Part libraries

**Template:** [`dart-part-part-of.mdc.template`](../../templates/cursor-rules/dart-part-part-of.mdc.template)

**Toolkit:** [`part-part-of.md`](../../rules/dart/part-part-of.md). Walkthrough: [`part-part-of-library.md`](../../patterns/dart/part-part-of-library.md).

**What it requires.** A large route or tab screen splits into a library file plus `part` files under `widgets/`. Every `package:` import lives on the library file. `part` directives follow the imports in this order: tokens, formatters, primitives, sections. Each part file starts with `part of '../…page.dart';` and has no imports of its own. Screen-local formatters live in their own part. A widget reused outside that screen is a normal library with a `package:` import. Pair this with [Imports](#imports): relative paths are the `part` / `part of` form.

**When it applies.** `lib/**/*.dart`, when a route or tab screen is large enough to split.

## No request prints

**Template:** [`no-request-prints.mdc.template`](../../templates/cursor-rules/no-request-prints.mdc.template)

**Toolkit:** [`network.md`](../../rules/core/network.md) (`PrettyDioLogger`) and [`remote-data-sources.md`](../../rules/flutter/remote-data-sources.md). The logging rule itself is this template. Data-source cross-link: [Remote data sources](flutter-rules.md#remote-data-sources).

**What it requires.** `DioHelper` already installs `PrettyDioLogger` for request headers, body, response, and errors. `print` and `debugPrint` stay off request URLs, bodies, headers, params, responses, and status codes. Skip a `package:flutter/foundation.dart` import whose only job is to log a request. `debugPrint` remains available for local diagnostics that are not HTTP (maps, animations, lifecycle). Failures surface through typed exceptions from `exception_mapper.dart` and through `Async.failure` or `AppToasts.error`. A structured logger, when telemetry needs it, stays with the network layer. Remove a request log when you find one, and drop the foundation import if the file no longer needs it.

**When it applies.** `lib/**/*.dart` and `test/**/*.dart`.
