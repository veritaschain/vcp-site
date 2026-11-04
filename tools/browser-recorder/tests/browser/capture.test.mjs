// Real DOM selection tests on a loopback synthetic page. This runner does not
// load the extension or establish activeTab/ISOLATED-world behavior.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
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
  const fixture = await readFile(new URL('selection-fixture.html', import.meta.url));
  server = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(fixture);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await playwright.chromium.launch({ headless: true,
    ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}),
    args: ['--no-sandbox'] });
  page = await browser.newPage();
  console.log('Browser capture environment:', browser.version(), process.version);
}, { timeout: 60000 });
after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});
async function fresh() { await page.goto(base); }
async function select(startId, endId = startId) {
  await page.evaluate(([start, end]) => {
    const first = document.getElementById(start).firstChild, last = document.getElementById(end).lastChild;
    const range = document.createRange(); range.setStart(first, 0); range.setEnd(last, last.textContent.length);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }, [startId, endId]);
}
async function rejected(pattern = /編集領域/) { await assert.rejects(page.evaluate(captureSelection), pattern); }

test('ordinary multi-paragraph selection succeeds with a nearby unselected editor', async () => {
  await fresh(); await select('ordinary-start', 'ordinary-end');
  const expected = await page.evaluate(() => window.getSelection().toString());
  assert.deepEqual(await page.evaluate(captureSelection), { origin: base, text: expected });
});
test('ordinary endpoints surrounding an editor are rejected', async () => {
  await fresh(); await select('before', 'after'); await rejected();
});
test('all supported contenteditable host spellings are excluded inside the range', async () => {
  for (const value of ['', 'TRUE', 'plaintext-only']) {
    await fresh(); await page.locator('#middle').evaluate((node, value) => node.setAttribute('contenteditable', value), value);
    await select('before', 'after'); await rejected();
  }
});
test('interior input and textarea elements are excluded', async () => {
  for (const tag of ['input', 'textarea']) {
    await fresh(); await page.locator('#middle').evaluate((node, tag) => {
      const control = document.createElement(tag); control.value = 'Synthetic typed input'; node.replaceWith(control);
    }, tag);
    await select('before', 'after'); await rejected();
  }
});
test('inherited editability and a false island inside an editing host are rejected', async () => {
  for (const id of ['inherited-text', 'false-island']) { await fresh(); await select(id); await rejected(); }
});
test('standalone contenteditable=false remains eligible', async () => {
  await fresh(); await select('plain-false');
  assert.equal((await page.evaluate(captureSelection)).text, '通常の非編集部分');
});
test('document-wide designMode editing is rejected', async () => {
  await fresh(); await page.evaluate(() => { document.designMode = 'on'; });
  await select('ordinary-start'); await rejected();
});
test('selection endpoints within an open or closed shadow root are rejected', async () => {
  for (const mode of ['open', 'closed']) {
    await fresh(); await page.evaluate(mode => {
      const root = document.getElementById('shadow-host').attachShadow({ mode });
      root.innerHTML = '<span>Shadow synthetic text</span>';
      const range = document.createRange(); range.selectNodeContents(root.firstChild);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    }, mode);
    await rejected(/対応外領域|先に選択/);
  }
});
test('selection crossing an observable shadow host or iframe is rejected', async () => {
  await fresh(); await page.evaluate(() => { document.getElementById('shadow-host').attachShadow({ mode: 'open' }).innerHTML = '<span>Shadow synthetic text</span>'; });
  await select('shadow-before', 'shadow-after'); await rejected(/対応外領域/);
  await fresh(); await select('frame-before', 'frame-after'); await rejected(/対応外領域/);
});
test('empty and oversized selections are rejected', async () => {
  await fresh(); await rejected(/先に選択/);
  await page.locator('#ordinary-start').evaluate(node => { node.textContent = 'あ'.repeat(12000); });
  await select('ordinary-start'); await rejected(/32 KB/);
});
