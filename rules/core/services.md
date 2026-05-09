# Core services

## Purpose
Thin wrappers for share, launcher, rate limiting, vibrator, and similar platform or infrastructure services.

## Fill when
- When shared service interfaces or implementations move.

## References
- flutter_base: `lib/core/services/` (`share/`, `launcher/`, `app_rate/`, `vibrator/`)
- vorma: share/url_launch patterns under `lib/core/utils/share_and_url_launch/` (same role, different folder)

## Content

### Pattern (flutter_base)

- **`ShareService`**: **`abstract base class`** with **static** methods — **`shareText`**, **`shareFile`**, **`shareFiles`**, **`shareUri`** using **`SharePlus`**, **`IoFileUtils`** for path/asset detection.
- **`UrlLauncherService`**: centralizes **`launchUrl`** / **`canLaunchUrl`** with **`LaunchMode`** handling.
- **`AppRateService`**: **`InAppReview`** wrapper for prompts.
- **`VibratorService`**: vibration patterns via **`Vibration`** package.

### vorma layout

- Uses **`share_utils.dart`**, **`url_launcher_utils.dart`** under **`utils/share_and_url_launch/`** instead of a dedicated **`services/`** folder — **same rule**: **thin static or injectable APIs**, **no business rules**.

### Rules

- **Services do not call repositories** unless explicitly designed as a façade; keep **platform I/O** only.
- **Errors**: log and optionally surface **`Failure`** at call site — **do not** silently swallow security-sensitive failures without logging.
- **New capability** (e.g. clipboard): add a **small wrapper** next to existing share/launcher patterns for consistency.
