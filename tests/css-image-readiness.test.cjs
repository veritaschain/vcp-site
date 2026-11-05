'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const crypto = require('node:crypto');
const file = path.resolve(__dirname, '../tools/site-css/render-check.cjs');

// The regular CI job has no browser/build dependencies. Load the real capture
// helpers with only those unused dependencies stubbed; no browser is launched.
function helpers(images = [], outputDir, backdrop = false) {
  const module = { exports: {} };
  const element = { tagName: 'BODY', id: 'synthetic-dom', className: '', querySelectorAll: () => [],
    getAttribute: () => '', scrollHeight: 900, clientHeight: 900, scrollWidth: 10, clientWidth: 10,
    getBoundingClientRect: () => ({ x: 0, y: 0, top: 0, bottom: 10, width: 10, height: 10,
      toJSON() { return { x: this.x, y: this.y, top: this.top, bottom: this.bottom, width: this.width, height: this.height }; } }) };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    module, exports: module.exports, __dirname: path.dirname(file),
    process: { env: { ...process.env, ...(outputDir && { CSS_EVIDENCE_DIR: outputDir }) } },
    setTimeout, clearTimeout, requestAnimationFrame: callback => queueMicrotask(callback),
    getComputedStyle: () => backdrop ? { backdropFilter: 'blur(8px)', visibility: 'visible' } : ({}),
    scrollX: 0, scrollY: 0, innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, scrollTo: () => {},
    document: { images, fonts: { ready: Promise.resolve() }, documentElement: element, body: element,
      querySelectorAll: () => [], querySelector: () => null },
    require(name) {
      if (name === 'playwright') return { chromium: {} };
      if (name === 'pngjs') return { PNG: { sync: { read: bytes => JSON.parse(bytes.toString()) } } };
      if (name === './lib.cjs') return {
        sha256: bytes => crypto.createHash('sha256').update(bytes).digest('hex'),
      };
      return require(name);
    },
  }, { filename: file });
  return module.exports;
}

class ImageDouble extends EventTarget {
  constructor({ loading = 'lazy', complete = false, width = 0, decode = async () => {} } = {}) {
    super();
    this.attrs = new Map([['src', '/synthetic.png']]);
    if (loading !== null) this.attrs.set('loading', loading);
    this.complete = complete;
    this.naturalWidth = width;
    this.naturalHeight = width;
    this.currentSrc = '/synthetic.png';
    this.decode = decode;
    this.listeners = new Set();
  }
  get loading() { return this.attrs.get('loading') || 'auto'; }
  set loading(value) { this.attrs.set('loading', value); this.onEager?.(); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, value); }
  removeAttribute(name) { this.attrs.delete(name); }
  addEventListener(type, listener) { this.listeners.add(listener); super.addEventListener(type, listener); }
  removeEventListener(type, listener) { this.listeners.delete(listener); super.removeEventListener(type, listener); }
  loaded() { this.complete = true; this.naturalWidth = 100; this.naturalHeight = 100; this.dispatchEvent(new Event('load')); }
}

test('capture waits for both a native lazy image load and its unfinished decode, then restores loading', async () => {
  let finishDecode;
  const image = new ImageDouble({ decode: () => new Promise(resolve => { finishDecode = resolve; }) });
  image.onEager = () => queueMicrotask(() => image.loaded());
  let finished = false;
  const ready = helpers([image]).prepareDocumentImages(1000).then(result => { finished = true; return result; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(image.loading, 'eager');
  assert.equal(finished, false, 'The load event alone must not permit capture');
  finishDecode();
  const [result] = await ready;
  assert.equal(result.status, 'decoded');
  assert.equal(result.naturalWidth, 100);
  assert.equal(image.loading, 'lazy');
  assert.equal(image.listeners.size, 0);
});

test('an already-loaded image still waits for decode and retains an absent loading attribute', async () => {
  let decoded = false;
  const image = new ImageDouble({ loading: null, complete: true, width: 100, decode: async () => { decoded = true; } });
  const [result] = await helpers([image]).prepareDocumentImages(1000);
  assert.equal(decoded, true);
  assert.equal(result.status, 'decoded');
  assert.equal(image.getAttribute('loading'), null);
});

test('image load failures are recorded separately without being mistaken for decoded images', async () => {
  const image = new ImageDouble();
  image.onEager = () => queueMicrotask(() => { image.complete = true; image.dispatchEvent(new Event('error')); });
  const [result] = await helpers([image]).prepareDocumentImages(1000);
  assert.equal(result.status, 'error');
  assert.equal(result.phase, 'load');
  assert.equal(result.src, '/synthetic.png');
  assert.equal(image.loading, 'lazy');
  assert.equal(image.listeners.size, 0);
});

test('image decode errors retain their distinct error phase and message', async () => {
  const image = new ImageDouble({ complete: true, width: 100, decode: async () => { throw new Error('Synthetic decode failure'); } });
  const [result] = await helpers([image]).prepareDocumentImages(1000);
  assert.equal(result.status, 'error');
  assert.equal(result.phase, 'decode');
  assert.equal(result.error, 'Synthetic decode failure');
});

for (const phase of ['load', 'decode']) {
  test('a stalled image ' + phase + ' expires and cleans up listeners/loading', async () => {
    const image = new ImageDouble({ complete: phase === 'decode', width: phase === 'decode' ? 100 : 0,
      decode: () => new Promise(() => {}) });
    const [result] = await helpers([image]).prepareDocumentImages(5);
    assert.equal(result.status, 'timeout');
    assert.equal(result.phase, phase);
    assert.equal(result.timeoutMs, 5);
    assert.equal(image.loading, 'lazy');
    assert.equal(image.listeners.size, 0);
  });
}

test('the capture adapter fails on image timeout and retains every image result for evidence', async () => {
  const api = helpers();
  const images = [{ src: '/synthetic.png', status: 'timeout', phase: 'decode' }];
  await assert.rejects(api.waitForImages({ evaluate: async (fn, timeout) => {
    assert.equal(fn, api.prepareDocumentImages);
    assert.equal(timeout, 10000);
    return images;
  } }), error => /timed out/.test(error.message) && error.imagePreparation === images);
});

test('an image without a source does not create an artificial timeout', async () => {
  const image = new ImageDouble();
  image.attrs.delete('src');
  image.currentSrc = '';
  assert.equal((await helpers([image]).prepareDocumentImages(5)).length, 0);
});

