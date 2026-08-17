# Docs authoring guide

Guidance for working in the Telivy documentation repo. Imported by the root `CLAUDE.md`,
which stays thin because Mintlify publishes every root-level Markdown file as a page.

## What this is

Mintlify documentation site for the Telivy platform. Pages are `.mdx`; navigation and
theming live in `docs.json` (the current Mintlify schema, **not** `mint.json`). Pushing to
`main` auto-deploys to https://support.telivy.com via the Mintlify GitHub App, so treat
`main` as live. Each PR gets its own preview deployment posted as a check.

## Local preview

```
npm i -g mint              # once; package is `mint`, `mintlify` is the legacy name
mint dev                   # run from repo root (where docs.json lives)
node scripts/validate-docs.mjs   # the CI gate: frontmatter, em dashes, links, alt text
mint broken-links          # advisory link check
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
- `scripts/validate-docs.mjs` — authoring-rule validator, run by CI on every PR
- `scripts/report-stale.mjs` — weekly report of pages nobody has touched in a year

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
- Give every image meaningful alt text, on both `![what it shows](/images/...)` and
  `<img alt="what it shows" ...>`. CI fails on a bare image. Never hotlink an image from
  another host (one such GIF already rotted away). Optimize new screenshots before
  committing (cap width ~1600px, strip metadata).
- **Renaming or deleting a page needs a `redirects` entry** in `docs.json` (`source`,
  `destination`, `permanent: true`). Old URLs live on in bookmarks, Zendesk articles, and
  search results.

## Gotchas / known cruft

- `getting-started/welcome.mdx` is the site's home: it is the first page in `docs.json`, so
  the root URL redirects to it. Keep it first, and keep it a signpost rather than a page
  that explains things itself.
- PRs have been stacked on each other in the past (`#15` and `#17` merged into another
  feature branch, not `main`), which quietly kept finished pages off the live site. Base
  every PR on `main`.

## PRs

Follow any `.github/pull_request_template.md` if present. Do not mention Claude/Claude Code
in commit messages or PR descriptions.
