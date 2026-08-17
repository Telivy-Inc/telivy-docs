<div align="center">
  <img src="logo/logo.svg" alt="Telivy" width="220" />

  <h1>Telivy Documentation</h1>

  <p>Source for the <a href="https://www.telivy.com/">Telivy</a> platform documentation site.</p>

  <p>
    <a href="https://mintlify.com"><img alt="Built with Mintlify" src="https://img.shields.io/badge/Built%20with-Mintlify-18E299?style=flat-square&logo=mintlify&logoColor=white" /></a>
    <img alt="Content: MDX" src="https://img.shields.io/badge/Content-MDX-1B1F24?style=flat-square&logo=mdx&logoColor=white" />
    <img alt="Deploys from main" src="https://img.shields.io/badge/Deploys-main%20%E2%86%92%20production-516AE7?style=flat-square&logo=githubactions&logoColor=white" />
    <img alt="Config: docs.json" src="https://img.shields.io/badge/Config-docs.json-516AE7?style=flat-square" />
  </p>
</div>

---

Documentation is written in `.mdx` pages. Site navigation, theming, and the navbar are
configured in [`docs.json`](docs.json) (the current Mintlify schema, **not** `mint.json`).

## Quick start

Install the Mintlify CLI once (the package is `mint`; `mintlify` is the legacy name):

```bash
npm i -g mint
```

Run the preview server from the repo root (the folder containing `docs.json`):

```bash
mint dev
```

Validate before opening a PR:

```bash
node scripts/validate-docs.mjs   # frontmatter, em dashes, links, alt text, docs.json consistency (CI gate)
mint broken-links                # advisory link check
```

## Repository structure

| Path | Contents |
| --- | --- |
| [`docs.json`](docs.json) | Navigation, theming, navbar, footer — the source of truth |
| `getting-started/` | Intro, account setup, MFA |
| `learning-center/` | Security concept explainers (dark web, open ports, SSL/TLS, typo-squatting, disk encryption, vulnerability data sources) |
| `products/` | Core product docs: external assessments, risk assessments, lead magnet, risk monitoring |
| `frequently-asked-questions/` | FAQ pages built from `<Accordion>` / `<AccordionGroup>` |
| `scoring/` | Risk scoring, AI scoring, M365, and legacy criteria |
| `integrations/` | Nodeware, Rewst, ConnectWise, Autotask, webhooks |
| `additional-information/` | Release notes (`<Update>` blocks) |
| `images/`, `logo/` | Assets referenced from pages |
| `scripts/validate-docs.mjs` | Authoring-rule validator run by CI on every PR |
| `scripts/report-stale.mjs` | Weekly report of pages that have gone a year without an update |

## Authoring

A few conventions the whole repo follows (see [`.github/DOCS_AUTHORING.md`](.github/DOCS_AUTHORING.md) for the full guide):

- **Every page needs frontmatter** with `title` and `description`.
- **Adding a page is a two-file change** — create the `.mdx`, then register its path
  (without the extension) under the right `group` in `docs.json`. Navigation is manual.
- **No em dashes** in content. Use commas, parentheses, or restructure the sentence.
- Internal links are root-relative and omit the extension: `/products/risk-assessments/overview`.
- Put images in `images/` and reference them with an absolute path (`/images/...`), with
  meaningful alt text. Never hotlink an image from another host.
- **Renaming or deleting a page needs a `redirects` entry** in `docs.json`, or the old URL
  starts 404ing for everyone who bookmarked it.

## Publishing

Changes merged to `main` deploy to **https://support.telivy.com** automatically via the
Mintlify GitHub App. **Treat `main` as live.** Every PR gets its own preview deployment,
posted as a check on the PR.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `mint dev` won't start | Run `mint update` to refresh the CLI |
| Page loads as a 404 | Make sure you are running from the folder containing `docs.json` |
| New page not showing | Confirm its path is added to the correct `group` in `docs.json` |
