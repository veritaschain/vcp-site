// One real-extension storage flow, usable without newer action-automation APIs.
// Four recorded checkpoints are not four independent tests. Capture, activeTab
// and service-page behavior belong to separate suites.
import test from 'node:test';
import assert from 'node:assert/strict';
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

test('real extension signs, persists across restart, serializes storage and verifies vault downloads', { timeout: 60000 }, async () => {
  const profile = await mkdtemp(join(tmpdir(), 'vap-browser-storage-'));
  const manifest = JSON.parse(await readFile(join(extensionPath, 'manifest.json'), 'utf8'));
  const report = {
    scope: 'FIRST_PARTY_SYNTHETIC_EXTENSION_MODULE_AND_VAULT',
    test_count: 1, result: 'FAILED', checks: [],
    node_version: process.version, platform: process.platform, architecture: process.arch,
    action_activeTab: 'NOT_TESTED', service_uis: 'NOT_TESTED', manual_toolbar: 'NOT_TESTED',
  };
  let context, extensionId, failure;

  async function launch() {
    context = await playwright.chromium.launchPersistentContext(profile, {
      headless: true, acceptDownloads: true,
      ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : { channel: 'chromium' }),
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--enable-unsafe-extension-debugging', '--no-sandbox'],
    });
    report.browser_version = context.browser().version();
    const cdp = await context.browser().newBrowserCDPSession();
    const { id } = await cdp.send('Extensions.loadUnpacked', { path: extensionPath });
    if (extensionId) assert.equal(id, extensionId, 'same extension path retains its identity');
    extensionId = id;
  }
  async function vault() {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/vault.html`);
    await page.waitForFunction(() => document.querySelector('#count').textContent !== '—');
    return page;
  }

  try {
    await launch();
    console.log('Extension storage environment:', report.browser_version, process.version);
    let page = await vault();
    report.extension_version = await page.evaluate(() => chrome.runtime.getManifest().version);
    assert.equal(report.extension_version, manifest.version);
    assert.equal(await page.evaluate(async () => (await import('./lib/store.mjs')).getState()), null);

    // Call the shipping storage module in its real extension origin. This is
    // intentionally separate from capture/popup/consent coverage.
    const first = await page.evaluate(async () => {
      const store = await import('./lib/store.mjs');
      const state = await store.saveObservation({ origin: 'http://127.0.0.1',
        text: '合成の保存試験です。🙂', captured_at: new Date().toISOString() });
      let exportDenied = false;
      try { await crypto.subtle.exportKey('pkcs8', state.keys.privateKey); }
      catch { exportDenied = true; }
      return { public_key: state.public_key, private_extractable: state.keys.privateKey.extractable,
        exportDenied, pack: await store.getPack() };
    });
    assert.equal(first.private_extractable, false);
    assert.equal(first.exportDenied, true);
    assert.equal((await verifyPack(first.pack)).event_count, 1);
    report.checks.push('ed25519_signing_and_nonextractable_key_storage');

    const second = await vault();
    await Promise.all([page, second].map((target, index) => target.evaluate(async index => {
      const store = await import('./lib/store.mjs');
      await Promise.all([0, 1].map(item => store.saveObservation({ origin: 'http://127.0.0.1',
        text: `Synthetic parallel ${index}/${item}`, captured_at: new Date().toISOString() })));
    }, index)));
    const before = await page.evaluate(async () => (await import('./lib/store.mjs')).getPack());
    assert.deepEqual(before.events.map(event => event.body.sequence), [1, 2, 3, 4, 5]);
    assert.equal((await verifyPack(before)).event_count, 5);
    report.checks.push('web_locks_and_indexeddb_parallel_pages');

    await context.close();
    await launch();
    page = await vault();
    const after = await page.evaluate(async () => {
      const store = await import('./lib/store.mjs');
      const state = await store.getState();
      const keys = { public_key: state.public_key, private_extractable: state.keys.privateKey.extractable };
      await store.saveObservation({ origin: 'http://127.0.0.1',
        text: 'Synthetic after restart', captured_at: new Date().toISOString() });
      return { ...keys, pack: await store.getPack() };
    });
    assert.equal(after.public_key, first.public_key);
    assert.equal(after.private_extractable, false);
    assert.deepEqual(after.pack.events.slice(0, 5), before.events);
    assert.equal((await verifyPack(after.pack)).event_count, 6);
    report.checks.push('same_profile_restart_retains_key_and_events_then_appends');

    const packWait = page.waitForEvent('download');
    await page.locator('#export').click();
    const pack = JSON.parse(await readFile(await (await packWait).path(), 'utf8'));
    const pinWait = page.waitForEvent('download');
    await page.locator('#checkpoint').click();
    const pin = JSON.parse(await readFile(await (await pinWait).path(), 'utf8'));
    assert.equal((await verifyPack(pack, pin)).pack_pin_matched, true);
    const file = (name, value) => ({ name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value)) });
    await page.locator('#pack-file').setInputFiles(file('synthetic.json', pack));
    await page.locator('#pin-file').setInputFiles(file('synthetic-pin.json', pin));
    await page.locator('#verify').click();
    await page.waitForFunction(() => document.querySelector('#verify-result').textContent.includes('整合性チェック：一致'));
    const altered = structuredClone(pack);
    altered.events[0].body.text += ' altered';
    await assert.rejects(verifyPack(altered, pin));
    await page.locator('#pack-file').setInputFiles(file('altered.json', altered));
    await page.locator('#verify').click();
    await page.waitForFunction(() => document.querySelector('#verify-result').textContent.includes('検証不成立'));
    report.checks.push('actual_vault_download_verification_and_tamper_rejection');
    assert.equal(report.checks.length, 4);
  } catch (error) {
    failure = error;
    report.error = String(error.stack || error);
  }

  try { await context?.close(); await rm(profile, { recursive: true, force: true }); }
  catch (error) { failure ||= error; report.cleanup_error = String(error.stack || error); }
  report.result = failure ? 'FAILED' : 'PASSED';
  if (evidenceDirectory) {
    await mkdir(evidenceDirectory, { recursive: true });
    await writeFile(join(evidenceDirectory, 'browser-storage.json'), JSON.stringify(report, null, 2) + '\n');
  }
  if (failure) throw failure;
});
