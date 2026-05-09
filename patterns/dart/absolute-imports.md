# Absolute Dart imports

## Purpose
Require package imports everywhere; forbid relative imports so refactors stay safe and unambiguous.

## Fill when
- When analyzer policy or import migration guidance changes.
- When extending enforcement to new folders or generated code.

## References
- `rules/dart/imports-and-analysis.md`

## Content

Always use absolute (package) imports. Never use relative imports.

### Rule

```dart
// correct
import 'package:my_app/features/auth/bloc/auth_bloc.dart';
import 'package:my_app/core/network/dio_client.dart';

// wrong — never do this
import '../../bloc/auth_bloc.dart';
import '../../../core/network/dio_client.dart';
```

### Why

Relative imports break when files are moved or refactored.
Absolute imports are always unambiguous regardless of file location.
Agents should never suggest or write a relative import under any circumstance.

### Applies to

- All feature files (blocs, cubits, pages, widgets)
- All core files (network, di, utils, constants)
- All model files (json_serializable and generated parts)
- Test files under `test/`

### Enforcement

If you ever see a relative import in existing code while editing a file,
replace it with the absolute equivalent before proceeding.
