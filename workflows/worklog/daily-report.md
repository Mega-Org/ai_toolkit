# Daily report

## Purpose

Generate a management-ready daily report from the English worklog source. Output in chat by default; save to `ai_worklog/reports/` only when explicitly requested.

## Fill when

- Report sections, Slack format, or language/save rules change.

## References

- Sources: `ai_worklog/daily/YYYY-MM-DD.md`, `ai_worklog/TODOS.md`, optional `ai_worklog/SUMMARY.md`
- Saved template: [`../../templates/worklog/report-saved.md`](../../templates/worklog/report-saved.md)

## Usage

| Command | Language | Output |
|---------|----------|--------|
| `generate today report` | English | Chat only |
| `generate today report in Arabic` | Arabic | Chat only |
| `generate today report and save it` | English | Chat + `reports/YYYY-MM-DD-en.md` |
| `generate today report in Arabic and save it` | Arabic | Chat + `reports/YYYY-MM-DD-ar.md` |

Also triggered by: `export today report`, `save daily report`, `Slack report for today`.
If the command includes tomorrow's work (for example `tomorrow I will work on checkout API`), include that content in the report's **Tomorrow** section.

If `ai_worklog/` is missing, run [`setup-worklog.md`](setup-worklog.md) first.

## Steps

1. **Load sources** — Today's `daily/YYYY-MM-DD.md` and `TODOS.md`. Use `SUMMARY.md` for extra context if present.

2. **Detect language** — Default English. Use Arabic only when the user explicitly asks (`in Arabic`, `بالعربي`, etc.).

3. **Detect save** — Save only when the user says `save`, `export`, `store`, or `and save it`. Otherwise chat only.

4. **Extract tomorrow plan** — If the user attached or described tomorrow's planned work in the command, include it directly. Otherwise infer it from open TODOs, blockers, next pending phase, or use `No specific tomorrow plan provided.`.

5. **Compose report** with these sections:

   ### Standard report

   - **Today's Summary** — 2–4 sentences, management tone
   - **Completed** — bullet list from **Done**
   - **Open Items** — from daily **TODO** + `TODOS.md`
   - **Blockers** — from daily **Blockers** or "None"
   - **Tomorrow** — required; user-provided tomorrow plan first, otherwise inferred next work
   - **Follow-up** — waiting-on and next actions not already covered by Tomorrow

   ### Arabic report (when requested)

   Use the same sections in Arabic:

   - ملخص اليوم
   - ما تم إنجازه
   - النقاط المعلقة
   - المعوقات
   - ما سيتم العمل عليه غدًا
   - خطة المتابعة

   ### Slack-ready block

   Append a copy-paste block using Slack-friendly formatting:

   ```
   *Section title*
   • bullet item
   ```

   For Arabic Slack blocks, use Arabic section titles with `*` bold markers.

6. **Save (if requested)** — Write to:

   ```text
   ai_worklog/reports/YYYY-MM-DD-en.md
   ai_worklog/reports/YYYY-MM-DD-ar.md
   ```

   Use [`report-saved.md`](../../templates/worklog/report-saved.md) structure. Set **Language**, **Generated** timestamp, and **Source** paths in the header.

7. **Do not modify** English source files when generating Arabic reports.

## Done when

Report is shown in chat; if save was requested, the file exists under `ai_worklog/reports/`.
