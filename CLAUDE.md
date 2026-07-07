# CLAUDE.md

Guidance for working in the Telivy documentation repo.

## What this is

Mintlify documentation site for the Telivy platform. Pages are `.mdx`; navigation and
theming live in `docs.json` (the current Mintlify schema — **not** `mint.json`, despite
what `README.md` says). Pushing to `main` auto-deploys to production via the Mintlify
GitHub App, so treat `main` as live.

## Local preview

```
npm i -g mintlify   # once
mintlify dev        # run from repo root (where docs.json lives)
mintlify broken-links   # validate internal links before opening a PR
```

## Structure

- `getting-started/` — intro, account setup, MFA
- `learning-center/` — security concept explainers (dark web, open ports, SSL/TLS, typo-squatting, disk encryption, vulnerability data sources)
- `products/` — core product docs: `external-assessments/`, `risk-assessments/`, `lead-magnet/`, `risk-monitoring/`
- `frequently-asked-questions/` — FAQ pages, built almost entirely from `<Accordion>`/`<AccordionGroup>`
- `scoring/` — risk-scoring, ai-scoring, m365, and legacy `telivycriteria`
- `integrations/` — nodeware, rewst, connectwise, autotask, webhooks
- `additional-information/release-notes.mdx` — uses `<Update>` blocks
- `images/`, `logo/` — assets referenced from pages
- `snippets/` — reusable `.mdx` fragments imported into pages

## Authoring rules

- **Every page needs frontmatter** with `title` and `description`. This is 100% consistent
  across the repo — match it.
  ```mdx
  ---
  title: Page Title
  description: 'One-line summary'
  ---
  ```
- **Navigation is manual.** A new `.mdx` file will not appear in the site until you add its
  path (without the `.mdx` extension) to the correct `group` in `docs.json`. Adding a page
  is a two-file change: the `.mdx` and `docs.json`.
- **No em dashes.** Recent commits deliberately strip `—` from the docs. Use commas,
  parentheses, or restructure the sentence instead.
- Use Mintlify components already established here: `<Accordion>`/`<AccordionGroup>`,
  `<Card>`/`<CardGroup>`, `<Steps>`/`<Step>`, `<Tabs>`/`<Tab>`, `<Frame>` (wrap images),
  `<Warning>`, and `<Update>` (release notes only).
- Internal links are root-relative and omit the extension: `/products/risk-assessments/overview`.
- Put images in `images/` and reference them with an absolute path (`/images/...`) — never
  at the repo root. Group per-page screenshots in a subfolder named after the page and number
  them: `images/<page-slug>/<page-slug>-N.png` (e.g. `images/nodeware/nodeware-1.png`).
- Give every image meaningful alt text (`![what it shows](/images/...)`), not the
  auto-generated filename. Optimize new screenshots before committing (cap width ~1600px,
  strip metadata).

## Gotchas / known cruft

- `README.md` is unedited Mintlify starter boilerplate — do not trust it (it references
  `mint.json`). `docs.json` is the source of truth.
- `getting-started/introduction.mdx` still contains starter placeholder copy — clean it if
  you touch that page.
- Loose screenshot PNGs and `pic*.png` sit in the repo root; prefer `images/` for new assets.

## PRs

Follow any `.github/pull_request_template.md` if present. Do not mention Claude/Claude Code
in commit messages or PR descriptions.
