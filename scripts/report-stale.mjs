#!/usr/bin/env node
// Lists pages nobody has touched in a while, so drift from the product gets noticed
// before a partner does. Reports only; it never fails a build.
// Needs full git history (actions/checkout with fetch-depth: 0).

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const MONTHS = Number(process.env.STALE_MONTHS ?? 12);
const cutoff = Date.now() - MONTHS * 30 * 24 * 60 * 60 * 1000;

const pages = execFileSync('git', ['ls-files', '*.mdx'], { encoding: 'utf8' }).trim().split('\n');

const stale = pages
  .map((page) => {
    const ts = execFileSync('git', ['log', '-1', '--format=%ct', '--', page], { encoding: 'utf8' }).trim();
    return { page, at: Number(ts) * 1000 };
  })
  .filter(({ at }) => at && at < cutoff)
  .sort((a, b) => a.at - b.at);

const day = (at) => new Date(at).toISOString().slice(0, 10);
const lines = stale.length
  ? [
      `## ${stale.length} page(s) untouched for over ${MONTHS} months`,
      '',
      '| Last updated | Page |',
      '| --- | --- |',
      ...stale.map(({ page, at }) => `| ${day(at)} | \`${page}\` |`),
      '',
      'Check these against the current product before a partner does.',
    ]
  : [`## All ${pages.length} pages have been updated within ${MONTHS} months`];

const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
