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
function helpers(images = [], outputDir, backdrop = false, { globals = {}, adapters = {} } = {}) {
  const module = { exports: {} };
  const element = { tagName: 'BODY', id: 'synthetic-dom', className: '', querySelectorAll: () => [],
    getAttribute: () => '', scrollHeight: 900, clientHeight: 900, scrollWidth: 10, clientWidth: 10,
    getBoundingClientRect: () => ({ x: 0, y: 0, top: 0, bottom: 10, width: 10, height: 10,
      toJSON() { return { x: this.x, y: this.y, top: this.top, bottom: this.bottom, width: this.width, height: this.height }; } }) };
  const context = {
    module, exports: module.exports, __dirname: path.dirname(file),
    process: { env: { ...process.env, ...(outputDir && { CSS_EVIDENCE_DIR: outputDir }) } },
    setTimeout, clearTimeout, requestAnimationFrame: callback => queueMicrotask(callback),
    getComputedStyle: () => backdrop ? { backdropFilter: 'blur(8px)', visibility: 'visible' } : ({}),
    scrollX: 0, scrollY: 0, innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, scrollTo: () => {},
    document: { images, fonts: { ready: Promise.resolve() }, documentElement: element, body: element,
      querySelectorAll: () => [], querySelector: () => null },
    ...globals,
    require(name) {
      if (name === 'playwright') return { chromium: {} };
      if (name === 'pngjs') return { PNG: { sync: { read: bytes => JSON.parse(bytes.toString()) } } };
      if (name === './lib.cjs') return {
        sha256: bytes => crypto.createHash('sha256').update(bytes).digest('hex'),
      };
      return require(name);
    },
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  Object.assign(context, adapters);
  return { ...module.exports, compare: context.compare };
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

test('failure evidence preserves both supplied frames, exact pixel counts/bounds and case state', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vcp-capture-evidence-test-'));
  try {
    const prefix = path.join(dir, 'synthetic-compiled-unstable');
    const previous = Buffer.from('synthetic penultimate PNG bytes');
    const current = Buffer.from('synthetic final PNG bytes');
    const metadata = { file: 'synthetic/index.html', side: 'compiled', viewport: { width: 1440, height: 900 },
      captures: 4, comparisons: 3, dom: [{ id: 'target', rect: [0, 0, 10, 10] }], images: [{ complete: true }] };
    helpers().saveScreenshotFailure(prefix, metadata, previous, current, {
      changedPixels: 4, aboveTolerancePixels: 3, maxChannelDelta: 7,
      aboveTolerancePoints: [{ x: 30, y: 20 }, { x: 12, y: 27 }, { x: 16, y: 23 }],
    });
    assert.deepEqual(fs.readFileSync(prefix + '-previous.png'), previous);
    assert.deepEqual(fs.readFileSync(prefix + '-current.png'), current);
    const saved = JSON.parse(fs.readFileSync(prefix + '.json', 'utf8'));
    assert.equal(saved.file, metadata.file);
    assert.equal(saved.side, 'compiled');
    assert.deepEqual(saved.dom, metadata.dom);
    assert.deepEqual(saved.images, metadata.images);
    assert.deepEqual(saved.pixels, { changedPixels: 4, aboveTolerancePixels: 3, maxChannelDelta: 7,
      aboveToleranceBounds: { left: 12, top: 20, right: 30, bottom: 27 } });
    assert.equal(saved.screenshots.previous.sha256, crypto.createHash('sha256').update(previous).digest('hex'));
    assert.equal(saved.screenshots.current.sha256, crypto.createHash('sha256').update(current).digest('hex'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('unstable capture still stops after four frames and saves exactly its last pair', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vcp-unstable-capture-test-'));
  try {
    // Synthetic decoded PNG payloads exercise the real pixel comparator and
    // capture loop without requiring a browser or a PNG dependency in base CI.
    const frames = [0, 2, 4, 6].map(red => Buffer.from(JSON.stringify({ width: 1, height: 1, data: [red, 0, 0, 255] })));
    let captures = 0;
    const page = { screenshot: async options => options.fullPage ? frames[captures++] : Buffer.from('synthetic viewport paint'),
      evaluate: async (fn, arg) => fn(arg) };
    await assert.rejects(helpers([], dir).stableScreenshot(page, {
      name: 'synthetic-1440-initial', file: 'synthetic/index.html', side: 'compiled', viewport: { width: 1440, height: 900 },
    }), /did not stabilize.*synthetic-1440-initial compiled/);
    assert.equal(captures, 4, 'Do not increase capture attempts to hide instability');
    const prefix = path.join(dir, 'synthetic-1440-initial-compiled-unstable');
    assert.deepEqual(fs.readFileSync(prefix + '-previous.png'), frames[2]);
    assert.deepEqual(fs.readFileSync(prefix + '-current.png'), frames[3]);
    const saved = JSON.parse(fs.readFileSync(prefix + '.json', 'utf8'));
    assert.equal(saved.comparisons, 3);
    assert.equal(saved.pixels.aboveTolerancePixels, 1);
    assert.equal(saved.pixels.maxChannelDelta, 2);
    assert.equal(saved.dom[0].id, 'synthetic-dom');
    assert.deepEqual(saved.images, []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('every compared full-page frame paints its backdrop and restored viewport without increasing attempts', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vcp-per-frame-paint-test-'));
  try {
    const frames = [0, 2, 4, 6].map(red => Buffer.from(JSON.stringify({ width: 1, height: 1, data: [red, 0, 0, 255] })));
    let captures = 0, paints = 0;
    const page = { evaluate: async (fn, arg) => fn(arg), screenshot: async options => {
      if (!options.fullPage) { paints++; return Buffer.from('synthetic viewport paint'); }
      assert.equal(paints, (captures + 1) * 2, 'Prepare the surface and restored viewport before every full-page frame');
      return frames[captures++];
    } };
    await assert.rejects(helpers([], dir, true).stableScreenshot(page, {
      name: 'synthetic-backdrop', file: 'synthetic/index.html', side: 'compiled', viewport: { width: 1440, height: 900 },
    }), /did not stabilize/);
    assert.equal(captures, 4);
    assert.equal(paints, 8);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

function viewportUnion(stops, height) {
  const ranges = [];
  for (const y of [...stops].sort((a, b) => a - b)) {
    const previous = ranges.at(-1);
    if (previous && y <= previous[1]) previous[1] = Math.max(previous[1], y + height);
    else ranges.push([y, y + height]);
  }
  return ranges;
}

test('paint-stop coalescing preserves overlap edges, gaps and clamped document boundaries', () => {
  const api = helpers();
  for (const [stops, height, maxScroll, expected] of [
    [[0, 500], 844, 2000, [0, 500]],
    [[0, 200, 500], 844, 2000, [0, 500]],
    [[0, 400, 800], 844, 2000, [0, 400, 800]],
    [[0, 850], 844, 2000, [0, 850]],
    [[0, 100, 200, 900, 1000, 2500], 844, 3000, [0, 200, 900, 1000, 2500]],
    [[1600, 900, 0, 500, -50, 900], 844, 900, [0, 500, 900]],
    [[0, 500, 900], 844, 0, [0]],
    [[], 844, 900, []],
  ]) {
    const actual = Array.from(api.coalescePaintStops(stops, height, maxScroll));
    const original = Array.from(api.normalizePaintStops(stops, maxScroll));
    assert.deepEqual(actual, expected);
    assert.ok(actual.every(y => original.includes(y)), 'Never synthesize a new viewport position');
    assert.deepEqual(viewportUnion(actual, height), viewportUnion(original, height));
  }
});

test('paint-stop selection preserves the complete original viewport union over varied geometry', () => {
  const api = helpers();
  let seed = 893714;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  for (const height of [1, 64, 128, 844, 900, 1440]) {
    for (const maxScroll of [0, 1, 100, 850, 5000, 20000]) {
      for (let sample = 0; sample < 30; sample++) {
        const stops = Array.from({ length: 1 + Math.floor(random() * 40) },
          () => Math.floor((random() * 1.4 - 0.2) * (maxScroll + height)));
        const original = Array.from(api.normalizePaintStops(stops, maxScroll));
        const selected = Array.from(api.coalescePaintStops(stops, height, maxScroll));
        assert.ok(selected.every(y => original.includes(y)));
        assert.deepEqual(viewportUnion(selected, height), viewportUnion(original, height));
        for (let index = 1; index < selected.length; index++) {
          if (selected[index] - selected[index - 1] > Math.max(1, height - 128)) {
            assert.equal(original.indexOf(selected[index]), original.indexOf(selected[index - 1]) + 1,
              'Coalescing must not introduce a gap wider than the original viewport-overlap step');
          }
        }
      }
    }
  }
});

test('the baseline and candidate preparation retain their separate fixed viewport-paint policies', async () => {
  const api = helpers([], undefined, true);
  for (const [options, expectedPaints] of [[api.BASE_PAINT_OPTIONS, 1], [api.CAPTURE_PAINT_OPTIONS, 2]]) {
    let viewportPaints = 0, fullPagePaints = 0;
    const trace = {};
    const page = { evaluate: async (fn, arg) => fn(arg), screenshot: async options => {
      if (options.fullPage) fullPagePaints++;
      else viewportPaints++;
      return Buffer.from('synthetic paint');
    } };
    await api.captureDocument(page, options, trace);
    assert.equal(viewportPaints, expectedPaints);
    assert.equal(fullPagePaints, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(trace.original)), { x: 0, y: 0 });
    assert.deepEqual(JSON.parse(JSON.stringify(trace.restored)), { x: 0, y: 0 });
    assert.equal(trace.options, options);
  }
});

test('computed-style evidence ignores enumeration order while retaining every value and value change', async () => {
  const values = { '--tw-ordinal': '  ', '--vcp-shadow-lg': '0 12px 24px rgb(0 0 0 / 0.15)',
    visibility: 'visible', borderTopLeftRadius: '6px', borderTopRightRadius: '6px',
    borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' };
  const element = { tagName: 'A', id: '', className: 'lang-link active',
    classList: { contains: name => name === 'lang-link' },
    getAttribute: () => 'lang-link active', clientWidth: 30, clientHeight: 20,
    scrollWidth: 30, scrollHeight: 20, scrollLeft: 0, scrollTop: 0,
    getBoundingClientRect: () => ({ x: 10, y: 20, left: 10, top: 20, right: 40, bottom: 40,
      width: 30, height: 20, toJSON() { return { x: 10, y: 20, width: 30, height: 20 }; } }) };
  async function capture(order, changedValues = values) {
    const api = helpers([], undefined, false, { globals: {
      window: { devicePixelRatio: 1, scrollX: 0, scrollY: 0 },
      document: { querySelectorAll: () => [element], querySelector: () => null },
      getComputedStyle: () => ({ ...changedValues, [Symbol.iterator]: () => order[Symbol.iterator](),
        getPropertyValue: name => changedValues[name] }),
    } });
    const page = { evaluate: async fn => fn() };
    return { target: await api.paintTargetState(page), corners: await api.languageCornerGeometry(page) };
  }
  const order = Object.keys(values);
  const first = await capture(order);
  const reordered = await capture([...order].reverse());
  assert.equal(JSON.stringify(first), JSON.stringify(reordered),
    'CSSStyleDeclaration enumeration order must not change saved evidence');
  for (const computed of [first.target.targets[0].computed, first.target.targets[0].before,
    first.target.targets[0].after, first.corners.targets[0].computed]) {
    assert.deepEqual(JSON.parse(JSON.stringify(computed)), values, 'Keep every property and its exact value');
  }
  const changed = await capture([...order].reverse(), { ...values, '--tw-ordinal': 'ordinal' });
  assert.notEqual(JSON.stringify(first.target), JSON.stringify(changed.target), 'Do not hide changed custom properties');
  assert.notEqual(JSON.stringify(first.corners), JSON.stringify(changed.corners), 'Keep real language-target style differences');
  assert.deepEqual(JSON.parse(JSON.stringify(first.corners.regions)), JSON.parse(JSON.stringify(changed.corners.regions)));
});

test('a pixel-equal comparison saves both complete target states when a captured value differs', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vcp-target-state-evidence-test-'));
  try {
    const reference = { viewport: { width: 390, height: 844, devicePixelRatio: 1, scrollX: 0, scrollY: 936 },
      targets: [{ class: 'lang-link active', rect: { x: 200, y: 84, width: 71, height: 26 },
        computed: { '--tw-ordinal': ' ', '--vcp-shadow-lg': 'none' }, before: { content: 'none' }, after: { content: 'none' } }] };
    const compiled = structuredClone(reference);
    compiled.targets[0].computed['--tw-ordinal'] = 'ordinal';
    const states = [reference, compiled];
    let opened = 0, closed = 0;
    const png = Buffer.from(JSON.stringify({ width: 1, height: 1, data: [0, 0, 0, 255] }));
    const api = helpers([], dir, false, { adapters: {
      openPage: async () => ({ page: { state: states[opened++] }, errors: [], blocked: new Set(),
        context: { close: async () => { closed++; } } }),
      paintDocument: async () => [], settle: async () => {}, stableScreenshot: async () => png,
      snapshot: async () => [{ id: 'same-dom' }], languageCornerGeometry: async () => ({ regions: [], targets: [] }),
      paintTargetState: async page => page.state,
    } });
    const result = await api.compare({}, { file: 'synthetic/index.html', id: 'default', state: 'faq-open',
      viewport: { width: 390, height: 844 } }, new Map());
    assert.equal(result.differences, 0);
    assert.equal(result.pixelsEqual, true);
    assert.equal(result.errorsEqual, true);
    assert.equal(result.targetStatesEqual, false);
    assert.notEqual(result.targetStateSha256.reference, result.targetStateSha256.compiled);
    assert.equal(closed, 2);
    const saved = JSON.parse(fs.readFileSync(path.join(dir, 'default-synthetic-390-faq-open-differences.json'), 'utf8'));
    assert.equal(saved.pixelsEqual, true);
    assert.equal(saved.targetStatesEqual, false);
    assert.deepEqual(saved.differences, []);
    assert.deepEqual(saved.targetStates, { reference, compiled });
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
