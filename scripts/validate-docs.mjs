#!/usr/bin/env node
// Enforces the CLAUDE.md authoring rules: frontmatter title+description, no em
// dashes, docs.json <-> file consistency, and internal links that resolve.
// Errors fail CI; orphan pages (on disk but not in docs.json) only warn.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const allMdx = walk(ROOT);
const rel = (f) => relative(ROOT, f);
const isSnippet = (f) => rel(f).startsWith('snippets/');

// Frontmatter + em dashes
for (const file of allMdx) {
  const text = readFileSync(file, 'utf8');
  if (!isSnippet(file)) {
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) errors.push(`${rel(file)}: missing frontmatter block`);
    else {
      if (!/^title:\s*\S/m.test(fm[1])) errors.push(`${rel(file)}: frontmatter missing \`title\``);
      if (!/^description:\s*\S/m.test(fm[1])) errors.push(`${rel(file)}: frontmatter missing \`description\``);
    }
  }
  text.split('\n').forEach((line, i) => {
    if (line.includes('—')) errors.push(`${rel(file)}:${i + 1}: contains an em dash (—)`);
  });
}

// Collect page slugs (strings that are direct elements of a `pages` array)
const docsJson = JSON.parse(readFileSync(join(ROOT, 'docs.json'), 'utf8'));
const navPages = new Set();
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.pages)) {
    for (const p of node.pages) {
      if (typeof p === 'string') { if (!/^https?:\/\//.test(p)) navPages.add(p); }
      else collect(p);
    }
  }
  for (const [k, v] of Object.entries(node)) if (k !== 'pages') collect(v);
})(docsJson.navigation);

// Every docs.json page exists; warn on orphan files
for (const p of navPages) {
  if (!existsSync(join(ROOT, `${p}.mdx`))) errors.push(`docs.json references "${p}" but ${p}.mdx does not exist`);
}
for (const file of allMdx) {
  if (isSnippet(file)) continue;
  const slug = rel(file).replace(/\.mdx$/, '');
  if (!navPages.has(slug)) warnings.push(`${rel(file)}: not referenced in docs.json (orphan page)`);
}

// Internal links and image sources resolve to an asset, section directory, or page
const linkRe = /(?:\]\(|(?:href|src)=")(\/[^)"#\s]+)/g;
const resolves = (t) =>
  existsSync(join(ROOT, t.slice(1))) || existsSync(join(ROOT, `${t.slice(1)}.mdx`));
for (const file of allMdx) {
  const text = readFileSync(file, 'utf8');
  let m;
  while ((m = linkRe.exec(text)) !== null) {
    if (!resolves(m[1])) errors.push(`${rel(file)}: internal link "${m[1]}" does not resolve`);
  }
}

// Every image needs alt text, and images are served from this repo, not a third party
for (const file of allMdx) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const where = `${rel(file)}:${i + 1}`;
      for (const tag of line.match(/<img\s[^>]*>/g) ?? []) {
        if (!/\salt="[^"]+"/.test(tag)) errors.push(`${where}: <img> without alt text`);
        if (/\ssrc="https?:\/\//.test(tag)) errors.push(`${where}: <img> hotlinks an external host`);
      }
      for (const img of line.match(/!\[[^\]]*\]\([^)]+\)/g) ?? []) {
        if (img.startsWith('![]')) errors.push(`${where}: image without alt text`);
        if (/\((https?:\/\/)/.test(img)) errors.push(`${where}: image hotlinks an external host`);
      }
    });
}

for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`\n${allMdx.length} pages checked · ${errors.length} error(s) · ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
