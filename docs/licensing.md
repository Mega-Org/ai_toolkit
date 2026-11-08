# Licensing

This toolkit is licensed under the **Apache License, Version 2.0**. See
[`LICENSE`](../LICENSE) for the full text, [`NOTICE`](../NOTICE) for attribution
and third-party details, and [`TRADEMARK.md`](../TRADEMARK.md) for the name.

Copyright 2026 Magdy Ebrahim.

## Why Apache-2.0

The toolkit ships executable shell and JavaScript, and it is copied into app
repositories that are themselves often proprietary. That ruled out the extremes
and favored a license with an explicit patent grant.

| License | Verdict | Reason |
|---|---|---|
| **Apache-2.0** | **Chosen** | Patent grant, `NOTICE` as an attribution channel that survives forks, trademark protection in Section 6, and a modification-marking duty. Corporate reviewers recognize it. |
| MIT | Rejected | Shortest and most permissive, but has no patent grant, no `NOTICE` mechanism, and no trademark clause. With executable tooling in the mix, the missing patent grant is the real loss. |
| GPL / AGPL | Rejected | `setup/install.sh` **copies** toolkit files into app repos. A copyleft reading could reach the host application's code and kill adoption. |
| MPL-2.0 | Rejected | File-level copyleft is a reasonable middle ground, but still imposes obligations on modified toolkit files inside a proprietary app, for no benefit we need. |
| CC-BY-4.0 | Rejected | Written for prose and artwork, not software; no patent grant and awkward for executable files. |

## What the license requires of you

Apache-2.0 is permissive: use it commercially, modify it, redistribute it, keep
your own code closed. In return, Section 4 asks that redistributions:

1. **Keep the license.** Ship a copy of `LICENSE` with anything you distribute.
2. **Keep attribution.** Retain `NOTICE` and any copyright statements.
3. **Mark changes.** State that you modified files, if you did.
4. **Do not imply endorsement.** See [`TRADEMARK.md`](../TRADEMARK.md).

There is no copyleft, so your app code stays under whatever license you choose.

## How attribution is enforced here

The distribution model is the whole problem: this kit is **copied**, not packaged,
so nothing forces a consumer to carry the license forward. Attribution is
therefore enforced mechanically at install time.

- **`setup/install.sh`** copies `LICENSE` and `NOTICE` into the consuming project
  root when they are absent (never overwriting an existing file), and writes
  `.cursor/.ai_toolkit_license`:

  ```
  SPDX-License-Identifier: Apache-2.0
  Copyright 2026 Magdy Ebrahim
  Toolkit-Version: 2.2.0
  License-Text: LICENSE
  ```

- **`setup/verify-setup.sh`** treats a **missing** marker as a warning — that just
  means the installer has not run in this app yet. A **tampered** marker, or a
  `LICENSE` that does not look like Apache-2.0, is a hard failure. The
  distinction matters: existing app repos must not break merely for being
  un-migrated.

- **[`.github/workflows/license-check.yml`](../.github/workflows/license-check.yml)**
  runs six checks on pull requests and pushes to `main`: attribution files exist,
  `LICENSE` is genuinely Apache-2.0, every `.sh`/`.js` file carries an SPDX
  header, `VERSION` agrees with the newest `CHANGELOG.md` release, and PR commits
  carry a DCO sign-off.

## File headers

Shell and JavaScript files start with two SPDX lines:

```bash
# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Magdy Ebrahim
```

Markdown files deliberately carry **no** header. There are over 230 rule,
pattern, and workflow documents; a banner on each would hurt readability while
adding nothing `LICENSE` does not already cover. `LICENSE` plus `NOTICE` covers
documentation.

## Relicensing policy

**Never retroactive.** A version that shipped under Apache-2.0 stays available
under Apache-2.0. If a future version changes license, the new terms apply only
to that version and later — anyone may continue using the older version under the
terms it was published with. This is a promise, not just a legal observation, and
it is why the license lives in `LICENSE` (a file that travels with every copy)
rather than only in prose here.

## Contributing

Contributions use the DCO, not a CLA — you keep your copyright. See
[`CONTRIBUTING.md`](../CONTRIBUTING.md) for `git commit -s` and the sign-off
recovery steps.
