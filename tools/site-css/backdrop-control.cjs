'use strict';

// Fixed same-CSS observations, not retries of the theme comparator.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { manifest, sha256 } = require('./lib.cjs');
const { openPage, captureDocument, paintTargetState, snapshot, comparePixels,
  pixelSummary, BASE_BROWSER_ARGS, CAPTURE_BROWSER_ARGS, CAPTURE_PAINT_OPTIONS } = require('./render-check.cjs');

const MODES = Object.freeze({ baseline: BASE_BROWSER_ARGS, candidate: CAPTURE_BROWSER_ARGS });
const FILES = ['blog/index.html', 'blog/zh/index.html'];
const PAIRS = 10;
const FRAMES = 2;

async function main() {
  const mode = process.env.CSS_BACKDROP_CONTROL_MODE || 'candidate';
  if (!Object.hasOwn(MODES, mode)) throw new Error(`Unknown mode: ${mode}`);
  const output = path.join(process.env.CSS_EVIDENCE_DIR || '/tmp/css-evidence', 'backdrop-controls', mode);
  fs.mkdirSync(output, { recursive: true });
  const man = manifest();
  const args = [...MODES[mode]];
  const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined, headless: true, args });
  const report = { mode, args, browser: browser.version(), pairsPerPage: PAIRS, framesPerContext: FRAMES,
    description: 'Fresh compiled-CSS contexts on both sides; fixed counts; no threshold allowances or pass-seeking retries.', cases: [] };
  const save = () => fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  try {
    for (const file of FILES) {
      const id = Object.keys(man.themes).find(theme => man.themes[theme].pages.includes(file));
      for (let pair = 0; pair < PAIRS; pair++) {
        const sides = [];
        for (let side = 0; side < 2; side++) {
          const instance = await openPage(browser, file, id, false, { width: 1440, height: 900 }, '');
          try {
            const frames = [], buffers = [];
            for (let frame = 0; frame < FRAMES; frame++) {
              const name = `${file.replaceAll('/', '-')}-${pair}-${side}-${frame}`;
              const paintPlan = {};
              const png = await captureDocument(instance.page, CAPTURE_PAINT_OPTIONS, paintPlan);
              const targetState = await paintTargetState(instance.page);
              const dom = await snapshot(instance.page);
              fs.writeFileSync(path.join(output, name + '.png'), png);
              fs.writeFileSync(path.join(output, name + '.json'), JSON.stringify({ targetState, dom, paintPlan }, null, 2) + '\n');
              frames.push({ name, pngSha256: sha256(png), targetSha256: sha256(JSON.stringify(targetState)), domSha256: sha256(JSON.stringify(dom)) });
              buffers.push(png);
            }
            sides.push({ frames, buffers, errors: instance.errors });
          } finally { await instance.context.close(); }
        }
        const result = { file, pair,
          sides: sides.map(({ buffers, ...side }) => side),
          withinContexts: sides.map(side => pixelSummary(comparePixels(side.buffers[0], side.buffers[1]))),
          betweenContexts: sides[0].buffers.map((png, frame) => ({ frame,
            pixels: pixelSummary(comparePixels(png, sides[1].buffers[frame])),
            targetStatesEqual: sides[0].frames[frame].targetSha256 === sides[1].frames[frame].targetSha256,
            domEqual: sides[0].frames[frame].domSha256 === sides[1].frames[frame].domSha256 })) };
        report.cases.push(result);
        save();
        console.log(JSON.stringify(result));
      }
    }
  } finally { await browser.close(); save(); }
  const cross = report.cases.flatMap(entry => entry.betweenContexts);
  const within = report.cases.flatMap(entry => entry.withinContexts);
  const failures = cross.filter(entry => entry.pixels.aboveTolerancePixels || !entry.domEqual || !entry.targetStatesEqual).length +
    within.filter(entry => entry.aboveTolerancePixels).length +
    report.cases.flatMap(entry => entry.sides).filter(side => side.errors.length).length;
  report.summary = { mode, pairs: report.cases.length, crossContextComparisons: cross.length,
    withinContextComparisons: within.length, failures, outcome: mode === 'baseline' ? 'observation only' : (failures ? 'FAIL' : 'PASS') };
  save();
  console.log(JSON.stringify(report.summary));
  assert.equal(report.cases.length, FILES.length * PAIRS, 'Every fixed pair must be recorded');
  if (mode === 'candidate') assert.equal(failures, 0, 'Same-CSS candidate captures must agree at the original base tolerance');
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
