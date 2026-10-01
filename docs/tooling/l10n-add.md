# Add localization keys (`l10n-add`)

Insert message keys at the **end of a named `@-SECTION-`**, in the same place in `app_en.arb` and `app_ar.arb`. Existing keys and formatting are left alone.

**Always dry-run first.** The agent shows **one preview per phase**. Write only after you say yes (`--apply`). Then the script runs `flutter gen-l10n`.

## Command

From the app root (Makefile is the documented runner when the repo has one):

```bash
make l10n-add ARGS='--section BUTTONS --key foo --en "Foo" --ar "فو"'
make l10n-add ARGS='--section BUTTONS --key foo --en "Foo" --ar "فو" --apply'
```

Direct:

```bash
./ai_toolkit/bin/l10n-add --section BUTTONS --key foo --en "Foo" --ar "فو"
./ai_toolkit/bin/l10n-add --list-sections
```

## Rules

- Section names match ARB headers: `@-BUTTONS-`, `@-AUTHENTICATION-`, and so on. `--section BUTTONS` is accepted.
- Insert at the **end of that section** in both locale files. Nothing else is rewritten.
- **Placeholders** (`--placeholder name:Type` or JSON `placeholders`) go in the **English** file only (`@key` metadata). Arabic gets the message string with the same `{name}` tokens.
- **Duplicates** (message key or `@key`) stop the command with exit 2. No writes.
- A **new section** is created only with `--confirm-new-section` (after you confirm). It is appended before the root closing `}`.
- Without `--apply`, nothing is written.

## Batch JSON

```json
{
  "section": "AUTHENTICATION",
  "entries": [
    { "key": "authFoo", "en": "Foo", "ar": "فو" },
    {
      "key": "authHello",
      "en": "Hello {name}",
      "ar": "مرحبا {name}",
      "placeholders": { "name": { "type": "String" } }
    }
  ]
}
```

A JSON list of `{section, entries}` objects is also accepted.

```bash
make l10n-add ARGS='--file /tmp/keys.json'
make l10n-add ARGS='--file /tmp/keys.json --apply'
```

## Agent

1. Dry-run (default).
2. Paste one preview for the phase.
3. Wait for yes.
4. `--apply` (runs `flutter gen-l10n` unless `--no-gen-l10n`).

ARB layout: [`../../rules/core/localization.md`](../../rules/core/localization.md).
