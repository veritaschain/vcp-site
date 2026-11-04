// Actual hash-pinned 0.1.0 / 0.1.1 unpacked installation -> 0.1.2 via runtime.reload().
// Uses only the hash-pinned historical archive, synthetic text and a temporary
// profile. A separate installation path is the storage-isolation negative control.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdtemp, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyPack } from '../../extension/lib/core.mjs';
import { until, openExtensionAction, capture, save } from './extension-harness.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require(process.env.PW_MODULE || 'playwright'); }
catch (error) {
  if (process.env.PW_MODULE || !process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = require(join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'));
}
const BASELINE_VERSION = process.env.BASELINE_VERSION || '0.1.0';
const BASELINE_HASHES = {
  '0.1.0': 'd17496cf9b096da85546a1e343e791138a1c807f1a37c518b28c140e424ffcf4',
  '0.1.1': '3a3e4a9fdd91b990b0361fa30234eec724a7a2e557fd2cb2bd2cedcbb13dbbb3',
};
assert.ok(Object.hasOwn(BASELINE_HASHES, BASELINE_VERSION), 'use one of the two retained historical archives');
const BASELINE_SHA = BASELINE_HASHES[BASELINE_VERSION];
const CURRENT_VERSION = '0.1.2';
const baselineArchive = process.env.BASELINE_ARCHIVE ? resolve(process.env.BASELINE_ARCHIVE) : fileURLToPath(
  new URL(`../../../../vso/announcements/2026-10-31-vap-browser-recorder-preview/downloads/VAP_Browser_Recorder_v${BASELINE_VERSION}.zip`, import.meta.url));
const currentExtension = fileURLToPath(new URL('../../extension/', import.meta.url));
const evidenceDirectory = process.env.BROWSER_EVIDENCE_DIR ? resolve(process.env.BROWSER_EVIDENCE_DIR) : null;
const legacyText = '旧版で保存した合成テキストです。🙂';
const updatedText = '更新後に追加した合成テキストです。🙂';
let work, installation, context, cdp, server, source, vault, base, extensionId;
let previousPack, previousPin, updatedPack, updatedPin, originalFingerprint;
const evidence = {
  scope: 'FIRST_PARTY_SYNTHETIC_HEADLESS_UNPACKED_UPGRADE',
  from_version: BASELINE_VERSION, to_version: CURRENT_VERSION, baseline_archive_sha256: BASELINE_SHA,
  update_mechanism: 'SAME_PATH_RUNTIME_RELOAD', node_version: process.version,
  cases: [], status: 'NOT_COMPLETED',
  manual_extension_manager: 'NOT_TESTED', web_store_update: 'NOT_TESTED',
  real_service_adapters: 'NOT_TESTED', other_operating_systems: 'NOT_TESTED',
  minimum_chrome_version: 'NOT_TESTED',
};

async function openVault(id, expectKey = true) {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${id}/vault.html`);
  await page.waitForFunction(() => document.querySelector('#count').textContent !== '—');
  if (expectKey) await page.waitForFunction(() => /^[0-9a-f]{64}$/.test(document.querySelector('#fingerprint').textContent));
  return page;
}

async function select(first, last = first) {
  await source.evaluate(([first, last]) => {
    const start = document.getElementById(first).firstChild;
    const end = document.getElementById(last).lastChild;
    const range = document.createRange();
    range.setStart(start, 0); range.setEnd(end, end.textContent.length);
    const selected = getSelection(); selected.removeAllRanges(); selected.addRange(range);
  }, [first, last]);
}

async function captureAndSave(id, expectedText) {
  await select(id);
  const popup = await openExtensionAction({ cdp, source, extensionId });
  try {
    const result = await capture(popup);
    assert.equal(result.preview, expectedText);
    assert.equal(result.hidden, false);
    assert.equal(result.disabled, true, 'consent is required before saving');
    await save(popup);
  } finally { await popup.close(); }
}

async function downloadPair(page) {
  const packDownload = page.waitForEvent('download');
  await page.locator('#export').click();
  const pack = JSON.parse(await readFile(await (await packDownload).path(), 'utf8'));
  const pinDownload = page.waitForEvent('download');
  await page.locator('#checkpoint').click();
  const pin = JSON.parse(await readFile(await (await pinDownload).path(), 'utf8'));
  return { pack, pin };
}

async function verifyInVault(page, pack, pin) {
  const file = (name, value) => ({ name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value)) });
  await page.locator('#pack-file').setInputFiles(file('synthetic-observations.json', pack));
  await page.locator('#pin-file').setInputFiles(file('synthetic-checkpoint.json', pin));
  await page.locator('#verify').click();
  await page.waitForFunction(() => document.querySelector('#verify-result').textContent.includes('整合性チェック：一致'));
}

async function checkStoredKey(page) {
  return page.evaluate(async () => {
    const state = await (await import('./lib/store.mjs')).getState();
    if (!state) throw Error('Expected an existing vault');
    let exportRejected = false;
    try { await crypto.subtle.exportKey('pkcs8', state.keys.privateKey); }
    catch { exportRejected = true; }
    return { ledger_id: state.ledger_id, public_key: state.public_key,
      extractable: state.keys.privateKey.extractable, exportRejected };
  });
}

async function fileList(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await fileList(directory, path));
    else { assert.equal(entry.isFile(), true, 'installation contains regular files only'); files.push(path); }
  }
  return files.sort();
}

before(async () => {
  work = await mkdtemp(join(tmpdir(), 'vap-extension-upgrade-'));
  installation = join(work, 'installed', 'extension');
  if (evidenceDirectory) await mkdir(evidenceDirectory, { recursive: true });
  const archiveBytes = await readFile(baselineArchive);
  assert.equal(createHash('sha256').update(archiveBytes).digest('hex'), BASELINE_SHA, 'historical ZIP checksum');
  // Extract only the original extension bytes. No reconstructed historical fixture,
  // symlinks, traversal paths, repository source or user profile is involved.
  execFileSync('python3', ['-c', `
from pathlib import Path, PurePosixPath
import stat, sys, zipfile
target = Path(sys.argv[2])
count = 0
with zipfile.ZipFile(sys.argv[1]) as archive:
    for info in archive.infolist():
        path = PurePosixPath(info.filename)
        if path.is_absolute() or '..' in path.parts or stat.S_ISLNK(info.external_attr >> 16):
            raise ValueError('Unsafe ZIP member')
        if info.is_dir() or path.parts[:2] != ('vap-chrome-recorder', 'extension'):
            continue
        destination = target.joinpath(*path.parts[2:])
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(archive.read(info))
        count += 1
if count == 0:
    raise ValueError('No legacy extension files')
`, baselineArchive, installation], { stdio: 'pipe' });
  assert.equal(JSON.parse(await readFile(join(installation, 'manifest.json'), 'utf8')).version, BASELINE_VERSION);
  assert.equal(JSON.parse(await readFile(join(currentExtension, 'manifest.json'), 'utf8')).version, CURRENT_VERSION);
  server = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(`<!doctype html><title>Synthetic upgrade fixture</title>
      <p id="legacy">${legacyText}</p><p id="updated">${updatedText}</p>
      <p id="before">公開の開始部分</p><div contenteditable="true">合成の編集中テキスト</div><p id="after">公開の終了部分</p>`);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
  context = await playwright.chromium.launchPersistentContext(join(work, 'profile'), {
    headless: true, acceptDownloads: true,
    ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : { channel: 'chromium' }),
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--enable-unsafe-extension-debugging', '--no-sandbox'],
  });
  evidence.browser_version = context.browser().version();
  cdp = await context.browser().newBrowserCDPSession();
  // Follow the unpacked-installation prerequisite in the user guide. CDP can
  // initially load without this UI setting, but a normal runtime reload must
  // remain subject to Chrome's developer-extension checks.
  const manager = await context.newPage();
  await manager.goto('chrome://extensions/');
  const developerMode = manager.locator('#devMode');
  await developerMode.waitFor({ state: 'attached' });
  if (!await developerMode.evaluate(element => element.checked)) await developerMode.click();
  await until(() => developerMode.evaluate(element => element.checked), 'developer mode enabled in extension manager');
  evidence.developer_mode = 'ENABLED_THROUGH_EXTENSION_MANAGER';
  await manager.close();
  ({ id: extensionId } = await cdp.send('Extensions.loadUnpacked', { path: installation }));
  source = await context.newPage(); await source.goto(base + '/synthetic-upgrade');
  console.log('Upgrade browser environment:', evidence.browser_version, process.version);
}, { timeout: 30000 });

after(async () => {
  const cleanupErrors = [];
  try { await context?.close(); } catch (error) { cleanupErrors.push(error); }
  try { if (server?.listening) await new Promise(resolve => server.close(resolve)); }
  catch (error) { cleanupErrors.push(error); }
  try { if (work) await rm(work, { recursive: true, force: true }); }
  catch (error) { cleanupErrors.push(error); }
  evidence.status = evidence.cases.length === 2 && !cleanupErrors.length ? 'PASSED' : 'FAILED';
  if (cleanupErrors.length) evidence.cleanup_errors = cleanupErrors.map(error => String(error));
  if (evidenceDirectory) await writeFile(join(evidenceDirectory, 'browser-upgrade.json'), JSON.stringify(evidence, null, 2) + '\n', { mode: 0o600 });
  if (cleanupErrors.length) throw new AggregateError(cleanupErrors, 'Upgrade test cleanup failed');
});

test(`historical ${BASELINE_VERSION} updates in place to ${CURRENT_VERSION} and retains its key, records and usable exports`, { timeout: 60000 }, async () => {
  const registered = (await cdp.send('Extensions.getExtensions')).extensions.find(item => item.id === extensionId);
  assert.equal(registered.enabled, true); assert.equal(registered.version, BASELINE_VERSION);
  await captureAndSave('legacy', legacyText);
  vault = await openVault(extensionId);
  assert.equal(await vault.evaluate(() => chrome.runtime.getManifest().version), BASELINE_VERSION);
  assert.equal(await vault.locator('#count').innerText(), '1');
  originalFingerprint = await vault.locator('#fingerprint').innerText();
  const originalKey = await checkStoredKey(vault);
  assert.equal(originalKey.extractable, false); assert.equal(originalKey.exportRejected, true);
  ({ pack: previousPack, pin: previousPin } = await downloadPair(vault));
  const previousResult = await verifyPack(previousPack, previousPin);
  assert.equal(previousResult.event_count, 1); assert.equal(previousResult.key_fingerprint, originalFingerprint);
  assert.equal(previousPack.manifest.ledger_id, originalKey.ledger_id);
  assert.equal(previousPack.manifest.public_key, originalKey.public_key);

  // Replace the contents in the existing directory while Chrome keeps running.
  // Keep the loaded directory itself in place, as the documented user update does.
  const currentFiles = await fileList(currentExtension);
  for (const file of await fileList(installation)) {
    if (!currentFiles.includes(file)) await rm(join(installation, file));
  }
  await cp(currentExtension, installation, { recursive: true, force: true });
  assert.deepEqual(await fileList(installation), currentFiles);
  for (const file of currentFiles) assert.deepEqual(await readFile(join(installation, file)), await readFile(join(currentExtension, file)));
  await vault.evaluate(() => { setTimeout(() => chrome.runtime.reload(), 50); });
  let registeredAfterReload;
  try {
    await until(async () => {
      registeredAfterReload = (await cdp.send('Extensions.getExtensions')).extensions;
      return registeredAfterReload.some(item => item.id === extensionId && item.enabled && item.version === CURRENT_VERSION);
    }, `same extension updated to ${CURRENT_VERSION}`);
  } catch (error) {
    error.message += '\nRegistered extensions after reload: ' + JSON.stringify(registeredAfterReload);
    throw error;
  }
  if (!vault.isClosed()) await vault.close();
  vault = await openVault(extensionId);
  assert.equal(await vault.evaluate(() => chrome.runtime.getManifest().version), CURRENT_VERSION);
  assert.equal(await vault.evaluate(() => chrome.runtime.id), extensionId);
  assert.equal(await vault.locator('#count').innerText(), '1');
  assert.equal(await vault.locator('#fingerprint').innerText(), originalFingerprint);
  assert.deepEqual(await checkStoredKey(vault), originalKey);
  const carriedPack = await vault.evaluate(async () => (await import('./lib/store.mjs')).getPack());
  assert.deepEqual(carriedPack, previousPack, 'the old signed pack is unchanged before appending');
  await verifyInVault(vault, previousPack, previousPin);

  // Version metadata alone is insufficient: exercise the inherited editor repair.
  await select('before', 'after');
  const rejected = await openExtensionAction({ cdp, source, extensionId });
  try {
    const result = await capture(rejected);
    assert.match(result.status, /編集領域/);
    assert.equal(result.hidden, true); assert.equal(result.disabled, true);
  } finally { await rejected.close(); }
  assert.equal(await vault.evaluate(async () => (await (await import('./lib/store.mjs')).getState()).events.length), 1);

  // Exercise 0.1.2's large-page fix through the installed action / ISOLATED path.
  // The unrelated nodes are ordinary light DOM, and no extra observation is saved.
  await source.evaluate(() => {
    const scope = document.createElement('section'); scope.id = 'large-scope';
    for (const id of ['large-first', 'large-last']) {
      const paragraph = document.createElement('p'); paragraph.id = id;
      paragraph.textContent = 'Synthetic large-page answer ' + id; scope.append(paragraph);
    }
    for (const side of ['before', 'after']) {
      const unrelated = document.createElement('section');
      for (let i = 0; i < 25001; i++) unrelated.append(document.createElement('span'));
      side === 'before' ? scope.prepend(unrelated) : scope.append(unrelated);
    }
    document.body.append(scope);
  });
  await select('large-first', 'large-last');
  const selectedLargeText = await source.evaluate(() => getSelection().toString());
  const largePopup = await openExtensionAction({ cdp, source, extensionId });
  try {
    const result = await capture(largePopup);
    assert.equal(result.hidden, false); assert.equal(result.disabled, true);
    assert.equal(result.preview, selectedLargeText);
  } finally { await largePopup.close(); }
  assert.equal(await vault.evaluate(async () => (await (await import('./lib/store.mjs')).getState()).events.length), 1);

  await captureAndSave('updated', updatedText);
  ({ pack: updatedPack, pin: updatedPin } = await downloadPair(vault));
  assert.equal(updatedPack.events.length, 2);
  assert.deepEqual(updatedPack.events.slice(0, 1), previousPack.events, 'old event bytes and signature survive append');
  assert.equal(updatedPack.manifest.ledger_id, previousPack.manifest.ledger_id);
  assert.equal(updatedPack.manifest.public_key, previousPack.manifest.public_key);
  assert.equal(updatedPack.events[1].body.sequence, 2);
  assert.equal(updatedPack.events[1].body.previous_hash, previousPack.events[0].event_hash);
  assert.equal(updatedPack.events[1].body.text, updatedText);
  const updatedResult = await verifyPack(updatedPack, updatedPin);
  assert.equal(updatedResult.key_fingerprint, originalFingerprint);
  assert.equal(updatedResult.pack_pin_matched, true);
  await verifyInVault(vault, updatedPack, updatedPin);
  assert.equal((await verifyPack(previousPack, previousPin)).pack_pin_matched, true);
  await assert.rejects(verifyPack(updatedPack, previousPin), /pinned pack digest/);
  await assert.rejects(verifyPack(previousPack, updatedPin), /pinned pack digest/);
  if (evidenceDirectory) {
    for (const [name, value] of Object.entries({
      'upgrade-before-pack': previousPack, 'upgrade-before-checkpoint': previousPin,
      'upgrade-after-pack': updatedPack, 'upgrade-after-checkpoint': updatedPin,
    })) await writeFile(join(evidenceDirectory, name + '.json'), JSON.stringify(value), { mode: 0o600 });
  }
  evidence.cases.push('same_path_runtime_reload_preserves_key_history_and_export_compatibility');
});

test('a separately loaded path has a different identity and empty vault without changing the upgraded vault', { timeout: 20000 }, async () => {
  assert.ok(updatedPack && evidence.cases.length === 1, 'the in-place update flow must complete first');
  const separateInstallation = join(work, 'other-install', 'extension');
  await cp(currentExtension, separateInstallation, { recursive: true });
  const { id } = await cdp.send('Extensions.loadUnpacked', { path: separateInstallation });
  assert.notEqual(id, extensionId);
  const separateVault = await openVault(id, false);
  assert.equal(await separateVault.evaluate(() => chrome.runtime.getManifest().version), CURRENT_VERSION);
  assert.equal(await separateVault.locator('#count').innerText(), '0');
  assert.equal(await separateVault.evaluate(async () => (await import('./lib/store.mjs')).getState()), null);
  assert.match(await separateVault.locator('#fingerprint').innerText(), /まだ記録がありません/);
  const retainedPack = await vault.evaluate(async () => (await import('./lib/store.mjs')).getPack());
  assert.deepEqual(retainedPack, updatedPack);
  assert.equal((await verifyPack(retainedPack, updatedPin)).key_fingerprint, originalFingerprint);
  await separateVault.close();
  evidence.cases.push('different_path_isolates_storage_and_preserves_original_vault');
});
