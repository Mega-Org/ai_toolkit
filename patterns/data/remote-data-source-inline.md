# Remote data source — inline HTTP and response parsing

## Purpose

Example shape for `*RemoteDataSourceImpl`: one public method owns the Dio call **and** any JSON envelope logic. No single-use private unwrap helpers.

## Simple POST (reference)

```dart
@override
Future<void> deleteAllNotifications() async {
  await _dioHelper.post(url: NotificationsApiPaths.deleteAll);
}
```

## Paginated GET with nested envelope

API shape: `data.notifications` holds Laravel `data` + `meta`. Keep unwrap + `ApiPaginatedData.fromJson` in **`getNotifications`**:

```dart
@override
Future<ApiPaginatedData<ApiNotificationModel>> getNotifications({
  required int page,
}) async {
  final Map<String, dynamic> response = await _dioHelper.get(
    url: NotificationsApiPaths.list,
    queryParameters: <String, dynamic>{'page': page},
  );
  final dynamic rootData = response['data'];
  final Map<String, dynamic> paginatedJson;
  if (rootData is Map<String, dynamic>) {
    final dynamic notifications = rootData['notifications'];
    if (notifications is Map<String, dynamic>) {
      paginatedJson = notifications;
    } else if (rootData.containsKey('meta') || rootData.containsKey('data')) {
      paginatedJson = rootData;
    } else {
      paginatedJson = response;
    }
  } else {
    paginatedJson = response;
  }
  return ApiPaginatedData.fromJson(
    paginatedJson,
    getData: (final List<dynamic> data) => data
        .map(
          (final dynamic e) => ApiNotificationModel.fromJson(
            e as Map<String, dynamic>,
          ),
        )
        .toList(),
  );
}
```

When the list lives directly under `response` (no extra nesting), pass `response` to `ApiPaginatedData.fromJson` — still inline, no helper.

## Do not

```dart
// Wrong — single-use private unwrap for one endpoint
Map<String, dynamic> _paginatedPayload(Map<String, dynamic> response) { ... }

Future<ApiPaginatedData<...>> getNotifications(...) async {
  final response = await _dioHelper.get(...);
  return ApiPaginatedData.fromJson(_paginatedPayload(response), ...);
}
```

## References

- Rule: [`../../rules/flutter/remote-data-sources.md`](../../rules/flutter/remote-data-sources.md)
- Layout: [`feature-data-layer.md`](feature-data-layer.md)
- Pagination module: `lib/src/_pagination/app_pagination.dart` (`ApiPaginatedData.fromJson`)
