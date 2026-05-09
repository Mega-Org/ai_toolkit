# Core services

## Purpose

Thin wrappers for share, launcher, rate limiting, vibrator, and similar platform or infrastructure services.

## Fill when

- When shared service interfaces or implementations move.

## References

- This app: share / URL launch helpers under `lib/core/utils/share_and_url_launch/` (`share_utils.dart`, `url_launcher_utils.dart`, etc.)

## Content

### Typical capabilities (names vary)

- **Share**: text, files, URIs via the project’s share helper (e.g. `SharePlus` + path/asset utilities where used).
- **URL launch**: `launchUrl` / `canLaunchUrl` with `LaunchMode` handling centralized in launcher utils.
- **In-app review / vibration**: small wrappers when present — **platform I/O only**.

### Layout in this repo

- Prefer **`utils/share_and_url_launch/`** (or adjacent small files) instead of a separate top-level **`services/`** folder unless the team introduces one — **same rule**: **thin static or injectable APIs**, **no business rules**.

### Rules

- **Services do not call repositories** unless explicitly designed as a façade; keep **platform I/O** only.
- **Errors**: log and optionally surface **`Failure`** at call site — **do not** silently swallow security-sensitive failures without logging.
- **New capability** (e.g. clipboard): add a **small wrapper** next to existing share/launcher patterns for consistency.
