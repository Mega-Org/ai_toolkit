# Core services

## Purpose

Thin wrappers for share, launcher, rate limiting, vibrator, and similar platform or infrastructure services.

## Fill when

- When shared service interfaces or implementations move.

## References

- This app: **`lib/core/services/share/share_service.dart`**, **`lib/core/services/launcher/url_launcher_service.dart`**, **`lib/core/services/app_rate/app_rate_service.dart`**, **`lib/core/services/vibrator/vibrator_service.dart`** (**`part of core`** where applicable)

## Content

### Typical capabilities (names vary)

- **Share**: text, files, URIs via the project’s share helper (e.g. `SharePlus` + path/asset utilities where used).
- **URL launch**: `launchUrl` / `canLaunchUrl` with `LaunchMode` handling centralized in launcher utils.
- **In-app review / vibration**: small wrappers when present — **platform I/O only**.

### Layout in this repo

- Prefer **`lib/core/services/<capability>/`** — **thin static or injectable APIs**, **no business rules**. Add new capabilities as small files next to existing services.

### Rules

- **Services do not call repositories** unless explicitly designed as a façade; keep **platform I/O** only.
- **Errors**: log and optionally surface **`Failure`** at call site — **do not** silently swallow security-sensitive failures without logging.
- **New capability** (e.g. clipboard): add a **small wrapper** next to existing share/launcher patterns for consistency.
