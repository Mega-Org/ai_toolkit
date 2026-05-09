# Pattern: absolute imports

Always use absolute (package) imports. Never use relative imports.

## Rule

```dart
// correct
import 'package:my_app/features/auth/bloc/auth_bloc.dart';
import 'package:my_app/core/network/dio_client.dart';

// wrong — never do this
import '../../bloc/auth_bloc.dart';
import '../../../core/network/dio_client.dart';
```

## Why

Relative imports break when files are moved or refactored.
Absolute imports are always unambiguous regardless of file location.
Claude Code should never suggest or write a relative import under any circumstance.

## Applies to

- All feature files (blocs, cubits, pages, widgets)
- All core files (network, di, utils, constants)
- All model files (freezed, json_serializable)
- Test files under test/

## Enforcement

If you ever see a relative import in existing code while editing a file,
replace it with the absolute equivalent before proceeding.