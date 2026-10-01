# Core rules

Three Cursor templates cover navigation, when an agent stops to ask, and how a session loads the toolkit. Index: [overview](overview.md).

## App router

**Template:** [`app-router-navigation.mdc.template`](../../templates/cursor-rules/app-router-navigation.mdc.template)

**Toolkit:** [`router.md`](../../rules/core/router.md). Code: `lib/core/configs/router/app_router.dart` and `lib/core/configs/router/animated_routes.dart`.

**What it requires.** Push, named push, pop, pop-until, and the current route go through `AppRouter`. They share `appNavigatorKey`, so cubits and use cases can navigate, and feature call sites stay uniform. Animated pushes use `FadeTransitionRoute` or `SlideTransitionRoute` from `animated_routes.dart`. A call site that already has a `BuildContext` passes it into `pop` and `popUntil`. `appContext` is for cubits, services, and deep-link handlers, and only while the navigator is mounted. `rootNavigator` defaults to `true`. A nested navigator (a tab stack or a sheet) passes `false`. Pop results are typed, and the matching `push` awaits that type. Route names come from router or feature constants when those constants exist.

A nested `Navigator` may use the local navigator when that stack is the target; add a one-line comment. A framework callback that created a route (for example `showDialog`’s builder) may dismiss that same route with the context it received.

**When it applies.** `alwaysApply: true`. Any push, pop, or route transition.

## Decision gates

**Template:** [`agent-decision-gates.mdc.template`](../../templates/cursor-rules/agent-decision-gates.mdc.template)

**Toolkit:** the same ask-before-proceed gate is in [`make-plan.md`](../../workflows/feature-delivery/make-plan.md) and [`implement-phase.md`](../../workflows/feature-delivery/implement-phase.md). The agent rule itself is this template.

**What it requires.** Implementation continues when the spec, the existing pattern, or the task brief already answers the question. That includes mechanical layout, naming, shared widgets, and BLoC wiring, plus reversible polish once the contract is known, and gaps already recorded in `COLLECTION_ANSWERS-*.md`, `gaps.md`, or `edit-brief.md`.

Stop for one question, then wait, when any of these is true:

- The endpoint, method, auth, body, nullability, pagination, or error shape is missing from `ai_specs/api/`, the collection handoff, `COLLECTION_ANSWERS-*.md`, and existing models.
- Empty, error, offline, permission, or business behavior is missing from the message, the active `ai_specs/`, and `ai_docs/`.
- Two reasonable options would change architecture, a public API, the navigation graph, or visible behavior.

The question offers concrete options or the exact field or sample you need. A guessed response model, field, or business rule waits for that answer.

When a feature or API screen has an unclear finish line, state a short **done means** list (2–4 bullets) once, then implement. After the pass, the handoff lists assumptions (and the spec or model they came from), the done-means checks, and the success, empty, and error paths to run on device. A blocker mid-task stops that branch until it has an answer.

**When it applies.** `alwaysApply: true`. Every implementation turn.

## Core digest (always-on)

**Template:** [`core-digest.mdc.template`](../../templates/cursor-rules/core-digest.mdc.template)

**Toolkit:** [`LOADMAP.md`](../../LOADMAP.md), optional `ai_docs/memory.md` and `ai_docs/preferences.md`.

**What it requires.** Agents load tagged leaves only (not `INDEX.md` during phases). Ask/continue gate, AppRouter and RTL summaries, no commits/tests unless asked, API source order, edit-in-place. Retired always-on rules: `ai-toolkit-seed`, `agent-decision-gates` (content folded into digest + agent-requested rules).

**When it applies.** `alwaysApply: true`.
