// Real unpacked-extension lifecycle on synthetic loopback pages only.
// Chrome DevTools Extensions.triggerAction exercises the actual action/activeTab
// path; it is automated headless testing, not a manual toolbar or service test.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyPack } from '../../extension/lib/core.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require(process.env.PW_MODULE || 'playwright'); }
catch (error) {
  if (process.env.PW_MODULE || !process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = require(join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'));
}
const extensionPath = fileURLToPath(new URL('../../extension/', import.meta.url));
const evidenceDirectory = process.env.BROWSER_EVIDENCE_DIR ? resolve(process.env.BROWSER_EVIDENCE_DIR) : null;
let profile, server, context, cdp, base, extensionId, source, vault, oldKey, exported, pin;
let deniedRequests = 0;
const evidence = { scope: 'FIRST_PARTY_SYNTHETIC_HEADLESS_EXTENSION', cases: [],
  real_service_adapters: 'NOT_TESTED', manual_toolbar: 'NOT_TESTED', minimum_chrome_version: 'NOT_TESTED' };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(probe, message) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) { const result = await probe(); if (result) return result; await sleep(25); }
  throw Error('Timed out: ' + message);
}
async function launch() {
  context = await playwright.chromium.launchPersistentContext(profile, {
    headless: true, acceptDownloads: true,
    ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : { channel: 'chromium' }),
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--enable-unsafe-extension-debugging', '--no-sandbox'],
  });
  evidence.browser_version = context.browser().version();
  cdp = await context.browser().newBrowserCDPSession();
  const { id } = await cdp.send('Extensions.loadUnpacked', { path: extensionPath });
  if (extensionId) assert.equal(id, extensionId, 'same unpacked path keeps the same extension identity');
  extensionId = id;
}
async function newVault() {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/vault.html`);
  await page.waitForFunction(() => document.querySelector('#count').textContent !== '—');
  await page.waitForFunction(() => /^[0-9a-f]{64}$/.test(document.querySelector('#fingerprint').textContent));
  return page;
}
async function select(first = 'answer', last = first) {
  await source.evaluate(([first, last]) => {
    const start = document.getElementById(first).firstChild, end = document.getElementById(last).lastChild;
    const range = document.createRange(); range.setStart(start, 0); range.setEnd(end, end.textContent.length);
    const selected = getSelection(); selected.removeAllRanges(); selected.addRange(range);
  }, [first, last]);
}
async function action() {
  await source.bringToFront();
  const tabs = await cdp.send('Target.getTargets', { filter: [{ type: 'tab', exclude: false }] });
  const tab = tabs.targetInfos.find(target => target.url === source.url());
  assert.ok(tab, 'source tab target exists');
  await cdp.send('Extensions.triggerAction', { id: extensionId, targetId: tab.targetId });
  const popup = await until(async () => (await cdp.send('Target.getTargets')).targetInfos.find(
    target => target.url === `chrome-extension://${extensionId}/popup.html`), 'extension action popup');
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: popup.targetId, flatten: false });
  let sequence = 1;
  const raw = (method, params = {}) => new Promise((resolve, reject) => {
    const id = sequence++;
    const cleanup = () => { clearTimeout(timer); cdp.off('Target.receivedMessageFromTarget', listener); };
    const listener = event => {
      if (event.sessionId !== sessionId) return;
      const value = JSON.parse(event.message); if (value.id !== id) return;
      cleanup(); value.error ? reject(Error(JSON.stringify(value.error))) : resolve(value.result);
    };
    const timer = setTimeout(() => { cleanup(); reject(Error('Popup CDP request timed out')); }, 10000);
    cdp.on('Target.receivedMessageFromTarget', listener);
    cdp.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id, method, params }) })
      .catch(error => { cleanup(); reject(error); });
  });
  const evaluate = async expression => {
    const value = await raw('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (value.exceptionDetails) throw Error(JSON.stringify(value.exceptionDetails));
    return value.result.value;
  };
  await until(() => evaluate("document.readyState === 'complete' && !!document.querySelector('#capture')"), 'popup ready');
  return { evaluate, raw, close: () => cdp.send('Target.closeTarget', { targetId: popup.targetId }) };
}
async function capture(popup) {
  await popup.evaluate("document.querySelector('#capture').click()");
  await until(() => popup.evaluate("!document.querySelector('#capture').disabled"), 'capture completed');
  return popup.evaluate("({status:document.querySelector('#status').textContent,preview:document.querySelector('#preview').textContent,hidden:document.querySelector('#draft').hidden,disabled:document.querySelector('#save').disabled})");
}
async function save(popup) {
  await popup.evaluate("document.querySelector('#consent').click();document.querySelector('#save').click()");
  await until(() => popup.evaluate("!document.querySelector('#capture').disabled"), 'save completed');
  assert.match(await popup.evaluate("document.querySelector('#status').textContent"), /保存しました/);
}
before(async () => {
  profile = await mkdtemp(join(tmpdir(), 'vap-extension-lifecycle-'));
  if (evidenceDirectory) await mkdir(evidenceDirectory, { recursive: true });
  server = createServer((request, response) => {
    if (request.url === '/blocked-by-csp') deniedRequests++;
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end('<!doctype html><title>Synthetic recorder fixture</title><p id="answer">合成の回答です。🙂</p><p id="before">公開部分</p><div contenteditable="true">合成の編集中テキスト</div><p id="after">末尾</p>');
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
  await launch();
  source = await context.newPage(); await source.goto(base + '/selected?synthetic_query=omitted#fragment');
  console.log('Extension browser environment:', evidence.browser_version, process.version);
}, { timeout: 30000 });
after(async () => {
  await context?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  if (profile) await rm(profile, { recursive: true, force: true });
  if (evidenceDirectory) await writeFile(join(evidenceDirectory, 'browser-lifecycle.json'), JSON.stringify(evidence, null, 2) + '\n', { mode: 0o600 });
});

test('real action grants activeTab, previews the selected text and requires consent before save', { timeout: 20000 }, async () => {
  const registered = (await cdp.send('Extensions.getExtensions')).extensions.find(item => item.id === extensionId);
  assert.equal(registered.enabled, true); assert.equal(registered.version, '0.1.1');
  await select(); const popup = await action(); const result = await capture(popup);
  assert.equal(result.preview, '合成の回答です。🙂'); assert.equal(result.hidden, false); assert.equal(result.disabled, true);
  assert.equal(await popup.evaluate("document.querySelector('#origin').textContent"), base);
  await save(popup);
  if (evidenceDirectory) {
    const screenshot = await popup.raw('Page.captureScreenshot', { format: 'png' });
    await writeFile(join(evidenceDirectory, 'saved-popup.png'), Buffer.from(screenshot.data, 'base64'));
  }
  await popup.close(); vault = await newVault();
  assert.equal(await vault.locator('#count').innerText(), '1');
  oldKey = await vault.locator('#fingerprint').innerText();
  assert.equal(await vault.evaluate(async () => {
    const state = await (await import('./lib/store.mjs')).getState();
    if (state.keys.privateKey.extractable) return false;
    try { await crypto.subtle.exportKey('pkcs8', state.keys.privateKey); return false; } catch { return true; }
  }), true);
  evidence.cases.push('action_capture_consent_save_nonextractable_key');
});

test('actual ISOLATED-world capture rejects an interior editor without adding a record', { timeout: 20000 }, async () => {
  await select('before', 'after'); const popup = await action(); const result = await capture(popup);
  assert.match(result.status, /編集領域/); assert.equal(result.hidden, true); assert.equal(result.disabled, true);
  await popup.close(); await vault.reload(); await vault.waitForFunction(() => document.querySelector('#count').textContent === '1');
  evidence.cases.push('interior_editor_rejected_in_extension');
});

test('record and nonextractable signing key survive a full browser restart and sign another event', { timeout: 20000 }, async () => {
  await context.close(); await launch(); vault = await newVault();
  assert.equal(await vault.locator('#count').innerText(), '1');
  assert.equal(await vault.locator('#fingerprint').innerText(), oldKey);
  source = await context.newPage(); await source.goto(base + '/after-restart'); await select();
  const popup = await action(); await capture(popup); await save(popup); await popup.close();
  await vault.reload(); await vault.waitForFunction(() => document.querySelector('#count').textContent === '2');
  assert.equal(await vault.locator('#fingerprint').innerText(), oldKey);
  const pack = await vault.evaluate(async () => (await import('./lib/store.mjs')).getPack());
  assert.equal((await verifyPack(pack)).event_count, 2);
  evidence.cases.push('restart_key_and_records_reused');
});

test('separate extension pages serialize concurrent stores through actual Web Locks and IndexedDB', { timeout: 20000 }, async () => {
  const second = await newVault();
  await Promise.all([vault, second].map((page, index) => page.evaluate(async ({ base, index }) => {
    const store = await import('./lib/store.mjs');
    await Promise.all([0, 1, 2].map(i => store.saveObservation({ origin: base,
      text: `Synthetic parallel ${index}/${i}`, captured_at: new Date().toISOString() })));
  }, { base, index })));
  exported = await vault.evaluate(async () => (await import('./lib/store.mjs')).getPack());
  assert.equal(exported.events.length, 8);
  assert.deepEqual(exported.events.map(event => event.body.sequence), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal((await verifyPack(exported)).event_count, 8); await second.close();
  evidence.cases.push('parallel_pages_no_lost_events');
});

test('real downloads verify in the extension and Node; tampered text is rejected', { timeout: 20000 }, async () => {
  await vault.bringToFront();
  const packDownload = vault.waitForEvent('download'); await vault.locator('#export').click();
  exported = JSON.parse(await readFile(await (await packDownload).path(), 'utf8'));
  const pinDownload = vault.waitForEvent('download'); await vault.locator('#checkpoint').click();
  pin = JSON.parse(await readFile(await (await pinDownload).path(), 'utf8'));
  assert.equal((await verifyPack(exported, pin)).pack_pin_matched, true);
  const file = (name, value) => ({ name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value)) });
  await vault.locator('#pack-file').setInputFiles(file('observations.json', exported));
  await vault.locator('#pin-file').setInputFiles(file('checkpoint.json', pin));
  await vault.locator('#verify').click();
  await vault.waitForFunction(() => document.querySelector('#verify-result').textContent.includes('整合性チェック：一致'));
  const altered = structuredClone(exported); altered.events[0].body.text += ' changed';
  await assert.rejects(verifyPack(altered, pin));
  await vault.locator('#pack-file').setInputFiles(file('altered.json', altered)); await vault.locator('#verify').click();
  await vault.waitForFunction(() => document.querySelector('#verify-result').textContent.includes('検証不成立'));
  if (evidenceDirectory) {
    await writeFile(join(evidenceDirectory, 'synthetic-browser-pack.json'), JSON.stringify(exported), { mode: 0o600 });
    await writeFile(join(evidenceDirectory, 'synthetic-browser-checkpoint.json'), JSON.stringify(pin), { mode: 0o600 });
    await vault.screenshot({ path: join(evidenceDirectory, 'vault-verification.png'), fullPage: true });
  }
  evidence.cases.push('downloads_crosschecked_and_tamper_rejected');
});

test('shipping CSP blocks an extension-page fetch before it reaches the local server', async () => {
  const violation = await vault.evaluate(async url => {
    const policy = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { document.removeEventListener('securitypolicyviolation', listener); reject(Error('No CSP violation event')); }, 3000);
      const listener = event => {
        clearTimeout(timeout); document.removeEventListener('securitypolicyviolation', listener);
        resolve({ directive: event.effectiveDirective, blockedURI: event.blockedURI });
      };
      document.addEventListener('securitypolicyviolation', listener);
    });
    let denied = false; try { await fetch(url); } catch { denied = true; }
    return { denied, ...(await policy) };
  }, base + '/blocked-by-csp');
  assert.equal(violation.denied, true); assert.equal(violation.directive, 'connect-src');
  assert.equal(violation.blockedURI, base + '/blocked-by-csp'); assert.equal(deniedRequests, 0);
  evidence.cases.push('extension_fetch_blocked_by_csp');
});

test('consented reset replaces the key while old exported evidence still verifies', { timeout: 20000 }, async () => {
  assert.equal(await vault.locator('#reset').isDisabled(), true);
  await vault.locator('#reset-confirm').check(); await vault.locator('#reset').click();
  await vault.waitForFunction(() => document.querySelector('#count').textContent === '0');
  await vault.waitForFunction(oldKey => {
    const fingerprint = document.querySelector('#fingerprint').textContent;
    return /^[0-9a-f]{64}$/.test(fingerprint) && fingerprint !== oldKey;
  }, oldKey);
  const currentKey = await vault.locator('#fingerprint').innerText();
  assert.notEqual(currentKey, oldKey); assert.match(currentKey, /^[0-9a-f]{64}$/);
  assert.equal((await verifyPack(exported, pin)).pack_pin_matched, true);
  evidence.cases.push('reset_new_key_old_export_still_verifies');
});
