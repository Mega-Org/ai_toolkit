# Dart `part` / `part of` library (feature UI)

## Purpose

Split a **large presentation surface** (route page, main tab shell) into multiple files while keeping **one import surface** and **shared private symbols** across parts.

## When to use

| Use `part` libraries | Prefer separate libraries instead |
|----------------------|-----------------------------------|
| One route with many private widgets/helpers tied to that screen | Reusable widgets imported by multiple features |
| Screen-local formatters, tokens, row primitives | Domain/data/cubit layers (unless cubit+state pair — see below) |
| Keeping `_PrivateView` and section widgets in one private scope | `core.dart`-style app barrels (use a **named library** — see exceptions) |

## Example layout (dummy feature)

```
lib/src/features/bookings/presentation/summary/
├── booking_summary_page.dart          ← library (imports + part directives + page)
└── widgets/
    ├── booking_summary_design_tokens.dart
    ├── booking_summary_ui_formatters.dart
    ├── booking_summary_metric_row.dart
    └── booking_summary_guest_section.dart
```

## Library file (the `part` host)

1. **All `package:` imports** live only on the library file (see [`absolute-imports.md`](absolute-imports.md)).
2. Declare **`part` directives** immediately after imports, before the first declaration.
3. Use **relative paths** from the library file to each part file.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart' as intl;
import 'package:my_app/core/core.dart';
import 'package:my_app/core/localization/l10n/app_localizations.dart';
import 'package:my_app/material/loading/spin_kit_loading_widget.dart';
import 'package:my_app/src/features/bookings/domain/entity/booking_entity.dart';
import 'package:my_app/src/features/bookings/presentation/summary/booking_summary_cubit.dart';

part 'widgets/booking_summary_design_tokens.dart';
part 'widgets/booking_summary_ui_formatters.dart';
part 'widgets/booking_summary_metric_row.dart';
part 'widgets/booking_summary_guest_section.dart';

class BookingSummaryPage extends StatelessWidget {
  const BookingSummaryPage({super.key, required this.bookingId});

  final String bookingId;

  @override
  Widget build(final BuildContext context) {
    return BlocProvider(
      create: (_) => injector<BookingSummaryCubit>(param1: bookingId)..load(),
      child: Scaffold(
        appBar: AppBar(
          title: Text(AppLocalizations.of(context).bookingSummaryTitle),
        ),
        body: BlocBuilder<BookingSummaryCubit, BookingSummaryState>(
          builder: (final BuildContext context, final BookingSummaryState state) {
            if (state.isLoading) {
              return const SpinKitLoadingWidget.medium();
            }
            final BookingEntity? booking = state.data;
            if (booking == null) {
              return const SizedBox.shrink();
            }
            return _BookingSummaryView(booking: booking);
          },
        ),
      ),
    );
  }
}

class _BookingSummaryView extends StatelessWidget {
  const _BookingSummaryView({required this.booking});

  final BookingEntity booking;

  @override
  Widget build(final BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(Dimensions.p20),
      children: <Widget>[
        Text(
          formatBookingCheckInLine(booking.checkIn),
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: Dimensions.p12),
        BookingSummaryGuestSection(guestName: booking.guestName),
        const SizedBox(height: Dimensions.p8),
        BookingSummaryMetricRow(
          label: AppLocalizations.of(context).bookingNightsLabel,
          value: formatBookingNightCount(booking.nightCount),
        ),
      ],
    );
  }
}
```

## Part files (`part of`)

1. First line only: **`part of`** back to the library, with a **relative path** (not `package:`).
2. **No `import` lines** in part files — they inherit the library’s imports.
3. Prefer a **`widgets/`** subfolder under the screen folder.

```dart
part of '../booking_summary_page.dart';
```

### `part of` path cheat sheet

| Part file location | `part of` line |
|--------------------|----------------|
| `summary/widgets/guest_section.dart` → `summary/booking_summary_page.dart` | `part of '../booking_summary_page.dart';` |
| `summary/booking_summary_body.dart` → `summary/booking_summary_page.dart` (sibling) | `part of 'booking_summary_page.dart';` |
| `main/widgets/tab_bar.dart` → `main/home_main_page.dart` | `part of '../home_main_page.dart';` |

## Recommended part order

Order `part` directives on the library file **bottom-up** (dependencies first):

1. **Design tokens** — screen-only colors, radii.
2. **UI formatters** — `intl`, date/money/label helpers.
3. **Primitives** — rows, shells, small stateless building blocks.
4. **Composites** — cards that compose primitives.
5. **Sections** — larger screen sections.

Later parts may call top-level functions and constants from earlier parts in the same library.

### 1. Design tokens part

`widgets/booking_summary_design_tokens.dart`:

```dart
part of '../booking_summary_page.dart';

const Color kBookingSummaryAccent = Color(0xFF2E7D32);
const double kBookingSummaryCardRadius = 12;
```

### 2. UI formatters part (default)

`widgets/booking_summary_ui_formatters.dart`:

```dart
part of '../booking_summary_page.dart';

String formatBookingCheckInLine(final DateTime checkIn) {
  final String date = intl.DateFormat(
    'd MMM yyyy',
    getLocale.languageCode,
  ).format(checkIn);
  return '$date · ${intl.DateFormat.jm(getLocale.toLanguageTag()).format(checkIn)}';
}

String formatBookingNightCount(final int nights) {
  return intl.NumberFormat.decimalPattern(getLocale.languageCode).format(nights);
}
```

- Top-level functions (no class wrapper unless many related helpers).
- Use **`getLocale`** / **`appLocalizer`** from the library imports — import `intl` once on the library file.

### 3. Primitive part

`widgets/booking_summary_metric_row.dart`:

```dart
part of '../booking_summary_page.dart';

class BookingSummaryMetricRow extends StatelessWidget {
  const BookingSummaryMetricRow({
    super.key,
    required this.label,
    required this.value,
  });

  final String label;
  final String value;

  @override
  Widget build(final BuildContext context) {
    return Row(
      children: <Widget>[
        Expanded(child: Text(label)),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
      ],
    );
  }
}
```

### 4. Section part (uses formatters + tokens)

`widgets/booking_summary_guest_section.dart`:

```dart
part of '../booking_summary_page.dart';

class BookingSummaryGuestSection extends StatelessWidget {
  const BookingSummaryGuestSection({super.key, required this.guestName});

  final String guestName;

  @override
  Widget build(final BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: kBookingSummaryAccent.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(kBookingSummaryCardRadius),
      ),
      child: Padding(
        padding: const EdgeInsets.all(Dimensions.p16),
        child: Text(guestName),
      ),
    );
  }
}
```

## Naming

- Library file: `<feature>_<screen>_page.dart` or `<feature>_main_page.dart`.
- Parts: `<screen>_<role>.dart` under `widgets/` (e.g. `booking_summary_guest_section.dart`).
- Prefix widgets with the screen name when they are only used inside this library (`BookingSummaryGuestSection`).

## Related patterns (exceptions)

| Pattern | `part of` style |
|---------|-----------------|
| Cubit + state/event parts | `part of 'booking_summary_cubit.dart';` (sibling file, same folder) |
| Named barrel (`core.dart`, `app_pagination.dart`) | `part of core;` / `part of app_pagination;` (library **name**, not a path) |
| Generated `*.g.dart` / `*.freezed.dart` | Follow generator output |

## References

- Rule: [`../../rules/dart/part-part-of.md`](../../rules/dart/part-part-of.md)
- Imports: [`absolute-imports.md`](absolute-imports.md)
- Page shell: [`../flutter/page-bloc-provider.md`](../flutter/page-bloc-provider.md)
