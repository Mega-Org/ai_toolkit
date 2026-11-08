# Contributing

Contributions are accepted under the Apache License, Version 2.0 (see [`LICENSE`](LICENSE)).
This project uses a **Developer Certificate of Origin (DCO)**, not a Contributor
License Agreement. You keep your copyright; the DCO is your statement that you
had the right to submit the code.

## Sign off every commit

Commit with `-s` (or `--signoff`) so the trailer is appended for you:

```bash
git commit -s -m "Add store-updater retry limit"
```

That produces:

```
Add store-updater retry limit

Signed-off-by: Your Name <you@example.com>
```

Use your real name and a reachable address. The name and email must match your
git identity:

```bash
git config user.name
git config user.email
```

### Forgot the sign-off

A single commit:

```bash
git commit --amend -s --no-edit
```

Several commits on your branch, in one pass:

```bash
git rebase --signoff origin/main
git push --force-with-lease
```

`--signoff` adds the trailer to each replayed commit, so previously unsigned
commits pick it up. If a commit already has a matching `Signed-off-by`, it is not
duplicated.

Pull requests with unsigned commits fail the DCO step in
[`.github/workflows/license-check.yml`](.github/workflows/license-check.yml).

## File headers

Executable sources carry a two-line SPDX header, on the first lines of the file:

```bash
# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Magdy Ebrahim
```

For JavaScript:

```js
// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Magdy Ebrahim
```

Apply this to shell (`.sh`) and JavaScript (`.js`) files. The CI gate checks the
first three lines of every `.sh` and `.js` file outside `node_modules/`, so a new
script without a header fails the build.

**Markdown carries no header.** The license covers documentation through
`LICENSE` and `NOTICE`; a banner on every document would add noise and no legal
effect. This is deliberate, not an oversight.

## Scope

This repository is the shared toolkit: reusable rules, patterns, workflows,
templates, and setup scripts. Keep it product-neutral.

- **Belongs here:** general guidance, tooling, install scripts, templates that
  any consuming app can use.
- **Does not belong here:** app-specific architecture, client names, environment
  URLs, API keys, service accounts, or product prose. Those live in the consuming
  app under `ai_docs/` and `ai_specs/`.
- Never commit secrets. `.env` files and `node_modules/` are ignored by
  [`.gitignore`](.gitignore); keep it that way.

## Before opening a pull request

1. **Version and changelog.** `VERSION` must equal the newest released heading in
   [`CHANGELOG.md`](CHANGELOG.md) (e.g. `## [2.2.0] - 2026-11-08`). Note that
   `VERSION` uses the plain `MAJOR.MINOR.PATCH` form the CI gate compares.
2. **Scripts parse.** `bash -n` each changed shell script; `node --check` each
   changed JavaScript file.
3. **Installer still works.** Run `bash setup/install.sh` in a scratch project and
   confirm it copies `LICENSE`/`NOTICE` and writes `.cursor/.ai_toolkit_license`.
4. **Verify the attribution logic.** `bash setup/verify-setup.sh` should exit 0.
5. **Sign off.** Every commit carries `Signed-off-by`.

## Licensing of contributions

By signing off you agree that your contribution is licensed under Apache-2.0 and
may be redistributed under it. Do not contribute code you cannot license this way.
If you adapt third-party code, say so in the pull request and add the attribution
to [`NOTICE`](NOTICE).

Published versions keep the license they shipped with. See
[`docs/licensing.md`](docs/licensing.md) for the relicensing policy.
