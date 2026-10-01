# Capture preferences

**Commit:** false. Write only after the user says yes.

## Purpose

Add one line to `ai_docs/preferences.md` when the user states a durable workflow preference in chat.

## Steps

1. Propose the exact markdown line (or bullet) and show which section it belongs under.
2. Wait for yes.
3. Replace or insert in `ai_docs/preferences.md` (keep file ≤ reasonable size; drop oldest bullet in a section if needed).
4. Do not mirror the full text into `core-digest.mdc` — digest keeps a three-line pointer to `preferences.md` only.

## Done when

User-approved preference is persisted or they decline.
