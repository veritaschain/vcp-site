'use strict';

// Fixed same-CSS controls distinguish capture/raster behavior from CSS changes.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { manifest, compileTheme, compact, sha256 } = require('./lib.cjs');
const { openPage, snapshot, settle, waitForImages, paintDocument, captureDocument, comparePixels, pixelSummary,
  paintTargetState, BASE_BROWSER_ARGS, BASE_PAINT_OPTIONS, CAPTURE_PAINT_OPTIONS } = require('./render-check.cjs');

const MOBILE = Object.freeze({ width: 390, height: 844 });
const CONTROL_GROUPS = Object.freeze({
  'mobile-clips': [
    { file: 'vap/cpp/verasnap/ja/index.html', viewport: MOBILE },
    { file: 'vap/cap/srp/zh/index.html', viewport: MOBILE },
    { file: 'vap/cap/srp/ja/index.html', viewport: MOBILE },
  ],
  'page-clips': [
    { file: 'vap/cap/index.html', viewport: MOBILE },
    { file: 'blog/ja/index.html', viewport: { width: 1440, height: 900 } },
  ],
  'scrolled-faq': [
    { file: 'certified/faq/index.html', viewport: MOBILE, state: 'faq-open' },
    { file: 'certified/faq/ja/index.html', viewport: MOBILE, state: 'faq-open' },
    { file: 'certified/faq/zh/index.html', viewport: MOBILE, state: 'faq-open' },
  ],
});
const PAINT_MODES = Object.freeze([
  { name: 'backdrop-only', options: BASE_PAINT_OPTIONS },
  { name: 'with-clips', options: { ...BASE_PAINT_OPTIONS, includeOverflowClips: true } },
  { name: 'with-restored-viewport', options: { ...BASE_PAINT_OPTIONS, paintRestoredViewport: true } },
  { name: 'with-both', options: { ...BASE_PAINT_OPTIONS, includeOverflowClips: true, paintRestoredViewport: true } },
  { name: 'with-both-coalesced', options: CAPTURE_PAINT_OPTIONS },
]);

async function rendererControls(man, output, report, entries) {
  // Two fresh contexts and exactly four captures each. These are observations,
  // never a search for a passing frame or a replacement for the full comparator.
  for (const mode of PAINT_MODES) {
    const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined,
      headless: true, args: [...BASE_BROWSER_ARGS] });
    try {
      for (const entry of entries) {
        const { file, viewport, state = 'initial' } = entry;
        const id = Object.keys(man.themes).find(id => man.themes[id].pages.includes(file));
        const sequences = [];
        for (let contextIndex = 0; contextIndex < 2; contextIndex++) {
          const instance = await openPage(browser, file, id, false, viewport, '');
          const name = 'renderer-' + mode.name + '-' + file.replace('/index.html', '').replaceAll('/', '-') +
            '-' + viewport.width + '-' + state + '-' + contextIndex;
          try {
            // The first preparation uses the same mode as every later frame.
            // In particular the old path never receives the new preparation.
            await paintDocument(instance.page, mode.options);
            if (state === 'faq-open') {
              await instance.page.locator('button[onclick="toggleFAQ(this)"]').first().click();
              await instance.page.locator('.faq-answer.active').waitFor({ state: 'visible' });
              await waitForImages(instance.page);
            }
            const buffers = [], states = [], frames = [], comparisons = [];
            const started = Date.now();
            for (let frame = 0; frame < 4; frame++) {
              await settle(instance.page);
              const before = await paintTargetState(instance.page);
              const paintPlan = {};
              const png = await captureDocument(instance.page, mode.options, paintPlan);
              const after = await paintTargetState(instance.page);
              const imageFile = name + '-' + frame + '.png';
              const stateFile = name + '-' + frame + '-state.json';
              fs.writeFileSync(path.join(output, imageFile), png);
              fs.writeFileSync(path.join(output, stateFile), JSON.stringify({ before, after, paintPlan }, null, 2) + '\n');
              frames.push({ file: imageFile, sha256: sha256(png), stateFile,
                stateUnchanged: JSON.stringify(before) === JSON.stringify(after) });
              if (buffers.length) comparisons.push(pixelSummary(comparePixels(buffers.at(-1), png)));
              buffers.push(png);
              states.push({ before, after });
            }
            sequences.push({ contextIndex, frames, comparisons, durationMs: Date.now() - started,
              errors: instance.errors, buffers, states });
          } finally { await instance.context.close(); }
        }
        const result = { name: mode.name, browser: browser.version(), browserArgs: BASE_BROWSER_ARGS,
          paintOptions: mode.options, file, viewport, state,
          contexts: sequences.map(({ buffers, states, ...record }) => record),
          betweenContexts: sequences[0].buffers.map((png, index) => ({
            frame: index, pixels: pixelSummary(comparePixels(png, sequences[1].buffers[index])),
            rawStatesEqual: JSON.stringify(sequences[0].states[index]) === JSON.stringify(sequences[1].states[index]),
          })) };
        report.rendererControls.push(result);
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
        console.log(JSON.stringify(result));
      }
    } finally { await browser.close(); }
  }
}

async function legacyControls(man, output, report) {
  const file = 'vap/cpp/verasnap/zh/index.html';
  const id = Object.keys(man.themes).find(id => man.themes[id].pages.includes(file));
  const css = compact(await compileTheme({ ...man.themes[id], pages: [file] }));
  const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined,
    headless: true, args: [...BASE_BROWSER_ARGS] });
  Object.assign(report, { file, browser: browser.version() });
  const modes = [
    { name: 'unpainted-reference-compiled', sides: [true, false], painted: false },
    { name: 'unpainted-compiled-compiled', sides: [false, false], painted: false },
    { name: 'painted-reference-compiled', sides: [true, false], painted: true },
    { name: 'painted-compiled-compiled', sides: [false, false], painted: true }
  ];
  try {
    for (const mode of modes) {
      const captures = [];
      for (const [i, reference] of mode.sides.entries()) {
        const instance = await openPage(browser, file, id, reference, { width: 1440, height: 900 }, css);
        try {
          if (mode.painted) await paintDocument(instance.page, BASE_PAINT_OPTIONS);
          await settle(instance.page);
          const png = await instance.page.screenshot({ fullPage: true, animations: 'disabled' });
          fs.writeFileSync(path.join(output, `${mode.name}-${i}.png`), png);
          const dom = await snapshot(instance.page);
          const styles = await instance.page.locator('#world-first').evaluate(section =>
            [section, ...section.querySelectorAll('*')].map(element => {
              const style = getComputedStyle(element);
              return Object.fromEntries([...style].sort().map(name => [name, style.getPropertyValue(name)]));
            }));
          // Capture the affected cards in their actual viewport as a separate
          // observation; this happens only after the original full-page PNG.
          await instance.page.locator('#world-first .grid').first().screenshot({
            path: path.join(output, `${mode.name}-${i}-cards.png`), animations: 'disabled'
          });
          captures.push({ png, dom, styles, errors: instance.errors });
        } finally { await instance.context.close(); }
      }
      const [a, b] = captures;
      const pixels = comparePixels(a.png, b.png);
      delete pixels.aboveTolerancePoints;
      const result = { name: mode.name, pixels, snapshotsEqual: JSON.stringify(a.dom) === JSON.stringify(b.dom),
        allCardComputedStylesEqual: JSON.stringify(a.styles) === JSON.stringify(b.styles),
        stylesSha256: captures.map(c => sha256(JSON.stringify(c.styles))), errors: captures.map(c => c.errors) };
      report.pairs.push(result);
      fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
      console.log(JSON.stringify(result));
    }
    // A one-frame pair cannot observe a later screenshot dropping an already
    // painted surface. Compare fixed four-frame sequences on identical CSS.
    // The original path stays as a diagnostic, not a retry-until-green loop.
    for (const mode of [
      { name: 'repeat-prepare-once', eachFrame: false, options: BASE_PAINT_OPTIONS },
      { name: 'repeat-prepare-each-frame', eachFrame: true, options: BASE_PAINT_OPTIONS },
      { name: 'repeat-candidate-preparation', eachFrame: true, options: CAPTURE_PAINT_OPTIONS },
    ]) {
      const { name } = mode;
      const instance = await openPage(browser, file, id, false, { width: 1440, height: 900 }, css);
      try {
        await paintDocument(instance.page, mode.options);
        const before = await snapshot(instance.page);
        const started = Date.now();
        const frames = [], comparisons = [];
        let previous;
        for (let frame = 0; frame < 4; frame++) {
          await settle(instance.page);
          const png = mode.eachFrame ? await captureDocument(instance.page, mode.options)
            : await instance.page.screenshot({ fullPage: true, animations: 'disabled' });
          const filename = name + '-' + frame + '.png';
          fs.writeFileSync(path.join(output, filename), png);
          frames.push({ file: filename, sha256: sha256(png) });
          if (previous) comparisons.push(pixelSummary(comparePixels(previous, png)));
          previous = png;
        }
        const result = { name, paintOptions: mode.options, captures: 4, comparisons, frames, durationMs: Date.now() - started,
          snapshotsEqual: JSON.stringify(before) === JSON.stringify(await snapshot(instance.page)),
          errors: instance.errors };
        // Separate actual-viewport observation, after all four full-page frames.
        await instance.page.locator('#world-first .grid').first().screenshot({
          path: path.join(output, name + '-cards.png'), animations: 'disabled'
        });
        report.repeatedCaptures.push(result);
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
        console.log(JSON.stringify(result));
      } finally { await instance.context.close(); }
    }
  } finally { await browser.close(); }
}

async function main() {
  const group = process.env.CSS_CAPTURE_CONTROL_GROUP || 'all';
  if (group !== 'all' && !Object.hasOwn(CONTROL_GROUPS, group)) throw new Error('Unknown capture control group: ' + group);
  const entries = group === 'all' ? Object.values(CONTROL_GROUPS).flat() : CONTROL_GROUPS[group];
  const man = manifest();
  const output = path.join(process.env.CSS_EVIDENCE_DIR || '/tmp/vcp-site-css-render', 'capture-controls');
  fs.mkdirSync(output, { recursive: true });
  const report = { group, browserArgs: BASE_BROWSER_ARGS, expectedRendererFrames: entries.length * PAINT_MODES.length * 2 * 4,
    pairs: [], repeatedCaptures: [], rendererControls: [] };
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  if (group === 'all' || group === 'mobile-clips') await legacyControls(man, output, report);
  await rendererControls(man, output, report, entries);
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { CONTROL_GROUPS, PAINT_MODES, main };
