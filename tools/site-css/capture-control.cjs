'use strict';

// Diagnostic controls for the offscreen backdrop-filter capture failure.
// Same-CSS pairs distinguish screenshot rasterization from stylesheet changes.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { manifest, compileTheme, compact, sha256 } = require('./lib.cjs');
const { openPage, snapshot, settle, paintDocument, captureDocument, comparePixels, pixelSummary } = require('./render-check.cjs');

async function main() {
  const file = 'vap/cpp/verasnap/zh/index.html';
  const man = manifest();
  const id = Object.keys(man.themes).find(id => man.themes[id].pages.includes(file));
  const css = compact(await compileTheme({ ...man.themes[id], pages: [file] }));
  const output = path.join(process.env.CSS_EVIDENCE_DIR || '/tmp/vcp-site-css-render', 'capture-controls');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined,
    headless: true, args: ['--no-sandbox', '--hide-scrollbars', '--disable-lcd-text', '--force-color-profile=srgb'] });
  const report = { file, browser: browser.version(), pairs: [], repeatedCaptures: [] };
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
          if (mode.painted) await paintDocument(instance.page);
          await settle(instance.page);
          const png = await instance.page.screenshot({ fullPage: true, animations: 'disabled' });
          fs.writeFileSync(path.join(output, `${mode.name}-${i}.png`), png);
          const dom = await snapshot(instance.page);
          const styles = await instance.page.locator('#world-first').evaluate(section =>
            [section, ...section.querySelectorAll('*')].map(element => {
              const style = getComputedStyle(element);
              return Object.fromEntries([...style].map(name => [name, style.getPropertyValue(name)]));
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
    for (const prepareEachFrame of [false, true]) {
      const name = prepareEachFrame ? 'repeat-prepare-each-frame' : 'repeat-prepare-once';
      const instance = await openPage(browser, file, id, false, { width: 1440, height: 900 }, css);
      try {
        await paintDocument(instance.page);
        const before = await snapshot(instance.page);
        const started = Date.now();
        const frames = [], comparisons = [];
        let previous;
        for (let frame = 0; frame < 4; frame++) {
          await settle(instance.page);
          const png = prepareEachFrame ? await captureDocument(instance.page)
            : await instance.page.screenshot({ fullPage: true, animations: 'disabled' });
          const filename = name + '-' + frame + '.png';
          fs.writeFileSync(path.join(output, filename), png);
          frames.push({ file: filename, sha256: sha256(png) });
          if (previous) comparisons.push(pixelSummary(comparePixels(previous, png)));
          previous = png;
        }
        const result = { name, captures: 4, comparisons, frames, durationMs: Date.now() - started,
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

main().catch(error => { console.error(error); process.exitCode = 1; });
