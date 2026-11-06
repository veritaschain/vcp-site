// Loopback-only synthetic DOM regressions. No provider page or account is used.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { captureSelection } from '../../extension/lib/capture.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require(process.env.PW_MODULE || 'playwright'); }
catch (error) {
  if (process.env.PW_MODULE || !process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = require(join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'));
}
let browser, server, page, base;
before(async () => {
  server = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end('<!doctype html><meta charset="utf-8"><main id="scope"><p id="first">Synthetic first answer</p><p id="last">Synthetic second answer</p></main>');
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await playwright.chromium.launch({ headless: true,
    ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}),
    args: ['--no-sandbox'] });
  page = await browser.newPage();
  console.log('Large-DOM environment:', browser.version(), process.version);
}, { timeout: 60000 });
after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});
async function fixture({ nested = true, count = 25001, unsafe = null, selectedCount = 0 } = {}) {
  await page.goto(base);
  await page.evaluate(({ nested, count, unsafe, selectedCount }) => {
    const scope = document.getElementById('scope');
    function unselected() {
      const out = document.createDocumentFragment();
      for (let i = 0; i < count; i++) out.append(document.createElement('span'));
      if (!nested) return out;
      const container = document.createElement('section'); container.append(out); return container;
    }
    scope.prepend(unselected()); scope.append(unselected());
    const last = document.getElementById('last');
    for (let i = 0; i < selectedCount; i++) scope.insertBefore(document.createElement('span'), last);
    if (unsafe) {
      const node = document.createElement(['input', 'textarea', 'iframe'].includes(unsafe) ? unsafe : 'div');
      if (unsafe === 'editor') { node.contentEditable = 'true'; node.textContent = 'Synthetic private draft'; }
      if (unsafe === 'shadow') node.attachShadow({ mode: 'open' }).innerHTML = '<span>Unsupported synthetic tree</span>';
      if (unsafe === 'iframe') node.srcdoc = '<p>Synthetic embedded frame</p>';
      scope.insertBefore(node, last);
    }
    const range = document.createRange();
    range.setStart(document.getElementById('first').firstChild, 0);
    range.setEnd(last.firstChild, last.firstChild.length);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }, { nested, count, unsafe, selectedCount });
}

test('short selection ignores 50002 unrelated elements in neighboring subtrees', async () => {
  await fixture();
  const expected = await page.evaluate(() => window.getSelection().toString());
  assert.deepEqual(await page.evaluate(captureSelection), { origin: base, text: expected });
});
test('short selection ignores 50002 unrelated flat sibling elements', async () => {
  await fixture({ nested: false });
  const expected = await page.evaluate(() => window.getSelection().toString());
  assert.deepEqual(await page.evaluate(captureSelection), { origin: base, text: expected });
});
test('unselected subtree descendants are pruned rather than fully enumerated', async () => {
  await fixture();
  await page.evaluate(() => {
    window.intersectionChecks = 0;
    const original = Range.prototype.intersectsNode;
    Range.prototype.intersectsNode = function(node) { window.intersectionChecks++; return original.call(this, node); };
  });
  assert.equal((await page.evaluate(captureSelection)).origin, base);
  assert.ok(await page.evaluate(() => window.intersectionChecks) < 20, 'Only the two paragraphs and neighboring subtree roots need intersection checks');
});
test('selected editable regions remain rejected on a large page', async () => {
  for (const unsafe of ['editor', 'input', 'textarea']) {
    await fixture({ unsafe });
    await assert.rejects(page.evaluate(captureSelection), /編集領域/);
  }
});
test('selected shadow hosts and embedded frames remain rejected on a large page', async () => {
  for (const unsafe of ['shadow', 'iframe']) {
    await fixture({ unsafe });
    await assert.rejects(page.evaluate(captureSelection), /対応外領域/);
  }
});
test('more than 20000 selected elements still fails closed', async () => {
  await fixture({ count: 0, selectedCount: 20001 });
  await assert.rejects(page.evaluate(captureSelection), /DOMが多すぎ/);
});
test('structured capture result preserves large-page success and rejection reasons', async () => {
  await fixture();
  const success = await page.evaluate(captureSelection, { structuredResult: true });
  assert.equal(success.ok, true); assert.equal(success.observation.origin, base);
  await fixture({ unsafe: 'editor' });
  const failure = await page.evaluate(captureSelection, { structuredResult: true });
  assert.equal(failure.ok, false); assert.match(failure.error, /編集領域/);
});
