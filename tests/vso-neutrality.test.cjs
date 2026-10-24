// Site content rule: pages published under the VSO name must not carry
// sales proposals or exclusive offers addressed to a named company.
// Added 2026-10-24 after company-specific proposal pages were removed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'blog']);
const PATTERNS = [
  /Private Proposal/i,
  /Confidential PoC/i,
  /Exclusive Integration Demo/i,
  /Exclusive for [A-Z]/,
  /Custom Demo for [A-Z]/,
  /戦略提案/,
];

function htmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) htmlFiles(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

test('no company-specific proposal or exclusive-offer pages', () => {
  const hits = [];
  for (const file of htmlFiles('.')) {
    const text = fs.readFileSync(file, 'utf8');
    for (const pattern of PATTERNS) {
      if (pattern.test(text)) hits.push(`${file}: ${pattern}`);
    }
  }
  assert.deepEqual(hits, []);
});
