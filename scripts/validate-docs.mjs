#!/usr/bin/env node
// Repo-specific documentation validator for the Telivy Mintlify docs.
// Enforces the authoring rules in CLAUDE.md deterministically so a PR fails
// before it can auto-deploy to production from main.
//
// Checks (errors fail CI):
//   1. Every page has frontmatter with `title` and `description`.
//   2. No em dashes anywhere in page content.
//   3. Every page listed in docs.json resolves to a real .mdx file.
//   4. Every internal link (/path and href="/path") resolves to a page,
//      section directory, or asset that exists.
// Warnings (reported, do not fail): pages on disk not wired into docs.json.
//
// Usage: node scripts/validate-docs.mjs

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
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const allMdx = walk(ROOT);
const rel = (f) => relative(ROOT, f);
const isSnippet = (f) => rel(f).startsWith('snippets/');

// --- 1 & 2: frontmatter + em dashes -----------------------------------------
for (const file of allMdx) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  if (!isSnippet(file)) {
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) {
      errors.push(`${rel(file)}: missing frontmatter block`);
    } else {
      if (!/^title:\s*\S/m.test(fm[1])) errors.push(`${rel(file)}: frontmatter missing \`title\``);
      if (!/^description:\s*\S/m.test(fm[1])) errors.push(`${rel(file)}: frontmatter missing \`description\``);
    }
  }

  lines.forEach((line, i) => {
    if (line.includes('—')) errors.push(`${rel(file)}:${i + 1}: contains an em dash (—); use commas, parentheses, or restructure`);
  });
}

// --- collect docs.json pages ------------------------------------------------
const docsJson = JSON.parse(readFileSync(join(ROOT, 'docs.json'), 'utf8'));
const navPages = new Set();
// Only strings that are direct elements of a `pages` array are page slugs.
// Group titles, anchor names, and icons are not pages and must be ignored.
(function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect);
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.pages)) {
    for (const p of node.pages) {
      if (typeof p === 'string') {
        if (!/^https?:\/\//.test(p)) navPages.add(p);
      } else {
        collect(p); // nested { group, pages } object
      }
    }
  }
  for (const [k, v] of Object.entries(node)) if (k !== 'pages') collect(v);
})(docsJson.navigation);

// --- 3: docs.json pages exist on disk ---------------------------------------
for (const p of navPages) {
  if (!existsSync(join(ROOT, `${p}.mdx`))) errors.push(`docs.json references "${p}" but ${p}.mdx does not exist`);
}

// --- warn: orphan pages not in docs.json ------------------------------------
for (const file of allMdx) {
  if (isSnippet(file)) continue;
  const slug = rel(file).replace(/\.mdx$/, '');
  if (!navPages.has(slug)) warnings.push(`${rel(file)}: not referenced in docs.json navigation (orphan page)`);
}

// --- 4: internal links resolve ----------------------------------------------
const linkRe = /(?:\]\(|href=")(\/[^)"#\s]+)/g;
function resolves(target) {
  if (existsSync(join(ROOT, target.slice(1)))) return true;              // asset (image/logo) or exact file
  if (existsSync(join(ROOT, `${target.slice(1)}.mdx`))) return true;     // page
  const dir = join(ROOT, target.slice(1));
  if (existsSync(dir) && statSync(dir).isDirectory()) return true;       // section group path
  return false;
}
for (const file of allMdx) {
  const text = readFileSync(file, 'utf8');
  let m;
  while ((m = linkRe.exec(text)) !== null) {
    const target = m[1];
    if (!resolves(target)) errors.push(`${rel(file)}: internal link "${target}" does not resolve to a page, section, or asset`);
  }
}

// --- report -----------------------------------------------------------------
for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`\n${allMdx.length} pages checked · ${errors.length} error(s) · ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
