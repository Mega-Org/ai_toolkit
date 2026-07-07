# QA intake (this app)

Optional app-specific note: copy to `ai_docs/qa-intake.md` and fill with project facts. The bugfix workflow loads this file when present to map external reports into the canonical tester-bug-report shape.

## Source

- Primary channel: Excel | Google Sheets | Jira | Linear | other
- Contact / owner:
- Typical delivery: (e.g. shared `.xlsx` file, Jira project export, WhatsApp paste)

## Column or field mapping

Map your team’s headers to [`../specs/tester-bug-report.md`](../specs/tester-bug-report.md) fields.

| Your column / field | Tester report field |
|---------------------|---------------------|
| | External reference |
| | Summary |
| | Steps to reproduce |
| | Expected result |
| | Actual result |
| | Environment → build |
| | Environment → platform |
| | Environment → flavor |
| | Severity |

## Conventions

- One row or ticket = one bugfix run (default).
- Required from QA before dev starts: (list minimum fields your team enforces)
- Retest: copy **Retest for QA** from fix `README.md` back into the sheet or ticket when done.

## Notes

- Locale defaults:
- Flavors in this app:
- Staging vs production build names:
