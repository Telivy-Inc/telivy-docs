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

Install the Mintlify CLI once:

```bash
npm i -g mintlify
```

Run the preview server from the repo root (the folder containing `docs.json`):

```bash
mintlify dev
```

Validate internal links before opening a PR:

```bash
mintlify broken-links
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
| `snippets/` | Reusable `.mdx` fragments imported into pages |

## Authoring

A few conventions the whole repo follows (see [`CLAUDE.md`](CLAUDE.md) for the full guide):

- **Every page needs frontmatter** with `title` and `description`.
- **Adding a page is a two-file change** — create the `.mdx`, then register its path
  (without the extension) under the right `group` in `docs.json`. Navigation is manual.
- **No em dashes** in content. Use commas, parentheses, or restructure the sentence.
- Internal links are root-relative and omit the extension: `/products/risk-assessments/overview`.
- Put images in `images/` and reference them with an absolute path (`/images/...`), with
  meaningful alt text.

## Publishing

Changes merged to `main` deploy to production automatically via the Mintlify GitHub App.
**Treat `main` as live.**

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `mintlify dev` won't start | Run `mintlify install` to reinstall dependencies |
| Page loads as a 404 | Make sure you are running from the folder containing `docs.json` |
| New page not showing | Confirm its path is added to the correct `group` in `docs.json` |
