# Bloc structure

## Purpose

How to structure full Bloc classes when a Bloc is truly needed. In this app,
Bloc is not the default feature state tool. Feature/page state normally uses
Cubit. Bloc is reserved for app-wide, event-driven state machines.

## Fill when

- A new app-wide Bloc is introduced.
- Authentication/session events or root state ownership changes.
- The team decides a feature genuinely needs event-based orchestration.

## References

- `lib/core/blocs/app_auth_bloc/app_authentication_bloc.dart`
- `rules/core/blocs-app-wide.md`
- `patterns/state/cubit-structure.md`
- `patterns/state/cubit-vs-bloc.md`

## Content

### When Bloc fits

Use Bloc only when state changes are best described as named events over time,
especially app-wide lifecycle flows.

Good fits:

- authentication/session lifecycle;
- app startup and restoration;
- logout and global cleanup;
- app-wide language/auth routing when events are meaningful;
- flows where many sources dispatch the same event vocabulary.

Do not use Bloc for normal feature actions like submit, delete, refresh, or page
step changes. Use a Cubit method for those.

### File shape

Keep Bloc files grouped by the app-wide concern:

```text
lib/core/blocs/temp_session_bloc/
  temp_session_bloc.dart
  temp_session_event.dart
  temp_session_state.dart
```

If the Bloc is part of the `core` library, follow the existing `part of core`
style used by core files. For feature-local code, prefer normal Dart imports and
parts as used by the surrounding feature.

### Dummy example

```dart
class TempSessionBloc extends Bloc<TempSessionEvent, TempSessionState> {
  TempSessionBloc() : super(TempSessionInitial()) {
    on<TempSessionStarted>(_onStarted);
    on<TempSessionLoggedIn>(_onLoggedIn);
    on<TempSessionLoggedOut>(_onLoggedOut);
  }

  Future<void> _onStarted(
    TempSessionStarted event,
    Emitter<TempSessionState> emit,
  ) async {
    final user = await _restoreUser();
    if (user == null) {
      emit(TempSessionUnauthenticated());
      return;
    }

    emit(TempSessionAuthenticated(user));
  }

  void _onLoggedIn(
    TempSessionLoggedIn event,
    Emitter<TempSessionState> emit,
  ) {
    emit(TempSessionAuthenticated(event.user));
  }

  Future<void> _onLoggedOut(
    TempSessionLoggedOut event,
    Emitter<TempSessionState> emit,
  ) async {
    await _clearSession();
    emit(TempSessionUnauthenticated());
  }
}
```

### Registration

- Register app-wide Blocs once near the app root.
- Do not create a new instance per feature route unless the Bloc is explicitly
  scoped to that route.
- Feature Cubits may read app-wide Bloc state or dispatch app-wide events, but
  they should not duplicate app session logic.

### Rules

- Bloc files should have clear event and state names.
- Events should represent real app-level transitions, not simple button method
  calls.
- Keep side effects inside event handlers or delegated use cases/services.
- Avoid adding feature submit/load flows to an app-wide Bloc.
