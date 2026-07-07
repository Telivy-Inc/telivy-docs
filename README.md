# Telivy Documentation

Source for the Telivy documentation site, built with [Mintlify](https://mintlify.com).
Content lives in `.mdx` pages; site navigation and theming are configured in `docs.json`.

## Local development

Install the Mintlify CLI:

```
npm i -g mintlify
```

Run the preview server from the repo root (where `docs.json` lives):

```
mintlify dev
```

Check for broken internal links before opening a PR:

```
mintlify broken-links
```

## Publishing

Changes merged to the `main` branch deploy to production automatically via the Mintlify
GitHub App. Treat `main` as live.

## Troubleshooting

- `mintlify dev` not running — run `mintlify install` to reinstall dependencies.
- Page loads as a 404 — make sure you are running from the folder containing `docs.json`.
