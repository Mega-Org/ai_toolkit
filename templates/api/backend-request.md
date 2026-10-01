# Backend contract request: `<feature>` — `<topic>`

Copy to: `ai_specs/api/contracts/YYYY-MM-DD-<feature>-<topic>/request.md`

Keep this file **≤ 25 KB**. Do not paste full snapshots, Figma dumps, or collection JSON.

<!-- Section order is locked. Do not reorder. -->

## Meta

| Field | Value |
|-------|--------|
| Status | draft \| sent \| answered \| partially-answered |
| Request ID | `YYYY-MM-DD-<feature>-<topic>` |
| Feature | `<feature>` |
| Topic | `<topic>` |
| Scope | |
| Out of scope | |
| Auth | |
| Base URL | |
| `lang` | |
| Register | [`../INDEX.md`](../INDEX.md) |
| Flutter spec | `ai_specs/features/<feature>/README.md` |
| Design | `ai_specs/design/features/<feature>.md` |
| Collection KB | `ai_specs/api/features/<feature>/` |

---

## How you must reply

<!-- PASTE THIS BLOCK VERBATIM. Do not paraphrase. The backend has no repo access. -->

```text
Reply in one Markdown file in the same folder as this request (reply.md, or reply-N.md if this is a follow-up). Chat is not a reply. An incomplete reply means we wait.

Also required: updated Postman or Apidog examples for every service and scenario you answer (real JSON, no ellipsis).

Answer every ID in this request (CH, L, D, SM, SV, F, SC, N, E, Q). Put the answer matrix first: ID, verdict (Accepted | Different | Not supported | Need info), note.

If the verdict is Different, include real JSON for that ID (JSON-n). Do not use "…" or unnamed fields.

Enums are objects {value, name, label}. Label follows Lang (Arabic and English). FCM data values are strings.

We will not start Flutter implement-phase on this topic until the reply matches this shape and we mark the register row agreed.
```

---

## ملخص للباكند

<!-- Full Arabic summary for backend. Same substance as today: what we need, independent states, access rules, banners, hide rules, what the MD reply must cover. Do not drop this section. -->

نحتاج عقداً لـ **`<topic>`** في ميزة **`<feature>`**.

- …

نرجو إرجاع ملف MD يغطي كل المعرّفات (CH / L / D / SM / SV / F / SC / N / E / Q)، مع أمثلة المجموعة المحدّثة.

---

## App view — logic (`L`)

Source only (no new analysis): README `Feature Logic`, `Navigation flow`, `UI And UX`; `design/features/<f>.md` and `design/screens/*`. Round 2: page files from the code map for screens already built.

Each step: what the app does, the rule, and the field / status / service it depends on. If nothing exists for a screen, add a `Q` item instead of inventing.

### L1 — `<flow name>`

1. …
2. … — depends on `F?` / `SV?`

---

## App view — design (`D`)

Screen-by-state tables. Screenshot paths optional. Arabic copy is language intent, not a string key. Screens with no description: name + Figma link only.

Figma MCP only with `+figma` and only for screens the user names.

| ID | Screen | State | User sees | Driving field | Action | Figma |
|----|--------|-------|-----------|---------------|--------|-------|
| D1 | | | | F? | | |
| D2 | | | | | | |

---

## App changes (`CH`)

What we will change in the app once you confirm. Reasons required.

| ID | Change | Reason | Depends on |
|----|--------|--------|------------|
| CH1 | | | SV? / F? / SM? |

---

## State machines (`SM`)

| ID | Machine | States | Transitions | Notes |
|----|---------|--------|-------------|-------|
| SM1 | | | | |

---

## Services (`SV`)

| ID | Method | Path | Auth | Why we need it | Request | Success `data` | Errors |
|----|--------|------|------|----------------|---------|----------------|--------|
| SV1 | | | | | | | E? |

---

## Fields (`F`)

| ID | Path / object | Field | Type | Null | Reason |
|----|---------------|-------|------|------|--------|
| F1 | | | | | |

---

## Proposed JSON

One **base** object. Variants as **differences** only (which fields change). No `…`. Named fields only.

### JSON-base — `<name>`

```json
{}
```

### JSON-variant — `<when>`

Differs from base: …

```json
{}
```

---

## Scenarios (`SC`)

| ID | When | Expect | Services | Errors |
|----|------|--------|----------|--------|
| SC1 | | | SV? | E? |

---

## Notifications (`N`)

| ID | When | Not when | FCM `data` (string values) | DB row |
|----|------|----------|----------------------------|--------|
| N1 | | | | |

---

## Errors (`E`)

| ID | HTTP | `key` / `response_status` | When | App does |
|----|------|---------------------------|------|----------|
| E1 | | | | |

---

## Questions (`Q`)

Options we can accept. Screens with no design/logic source get a `Q` here.

| ID | Ask | Options we can accept | Blocks |
|----|-----|------------------------|--------|
| Q1 | | A / B / … | SC? / L? / D? |

---

## Collection examples to update

Required in the reply. List operation + which example (success / error / empty).

| Operation | Example to update | Related IDs |
|-----------|-------------------|-------------|
| `METHOD /path` | | SV? / SC? |

---

## After your reply

1. We run `/backend-contract check` on this folder (missing IDs and `Different` without real JSON → `gaps-N.md`).
2. After a complete reply we run `/backend-contract apply` (README Contract, plan Inputs, gaps append, register → `agreed`).
3. Incomplete reply: status stays `partially-answered`; we wait. Chat is not a reply.
