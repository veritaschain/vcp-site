'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { manifest, compileTheme, compact, read, ASSET } = require('./lib.cjs');
const { openPage, settle } = require('./render-check.cjs');

const cases = [
  ['media', '.stat-badge', 'boxShadow'],
  ['standardization', '.step-current', 'boxShadow'],
  ['vap/map', '.status-badge', 'opacity']
].flatMap(([dir, selector, property]) => ['', 'ja/', 'zh/'].map(lang => ({ file: `${dir}/${lang}index.html`, selector, property })));

async function frames(page, selector) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#css-render-freeze').evaluate(element => element.remove());
  await settle(page);
  return page.locator(selector).first().evaluate(element => {
    return element.getAnimations().map(animation => {
      animation.pause();
      animation.currentTime = Number(animation.effect.getTiming().duration) / 2;
      return { frames: animation.effect.getKeyframes(), duration: animation.effect.getTiming().duration,
        iterations: animation.effect.getTiming().iterations === Infinity ? 'infinite' : animation.effect.getTiming().iterations };
    });
  });
}

async function main() {
  const man = manifest();
  const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined, headless: true, args: ['--no-sandbox'] });
  let checked = 0;
  try {
    for (const test of cases) {
      const [id, theme] = Object.entries(man.themes).find(([, value]) => value.pages.includes(test.file));
      const css = compact(await compileTheme({ ...theme, pages: [test.file] }));
      const reference = await openPage(browser, test.file, id, true, { width: 1440, height: 900 }, css);
      const compiled = await openPage(browser, test.file, id, false, { width: 1440, height: 900 }, css);
      try {
        const expected = await frames(reference.page, test.selector);
        const actual = await frames(compiled.page, test.selector);
        assert.ok(expected.some(animation => animation.frames.some(frame => test.property in frame)), `Expected authored ${test.property} animation: ${test.file}`);
        assert.deepEqual(actual, expected, `Authored animation changed: ${test.file}`);
        console.log(`PASS active keyframes ${test.file}`);
        checked++;
        if (test.file === 'media/index.html') {
          await compiled.page.addStyleTag({ content: '@keyframes pulse { 50% { opacity: .5 } }' });
          await settle(compiled.page);
          const wrong = await compiled.page.locator(test.selector).first().evaluate(element => element.getAnimations().map(animation => animation.effect.getKeyframes()));
          assert.notDeepEqual(wrong, expected.map(animation => animation.frames), 'Collision negative control must change the actual browser keyframes');
          console.log('PASS negative control: global pulse replacement detected');
        }
      } finally { await reference.context.close(); await compiled.context.close(); }
    }
    const generatedNames = [...read(ASSET).matchAll(/@(?:-webkit-)?keyframes\s+([^\s{]+)/g)].map(match => match[1]);
    assert.ok(generatedNames.length > 0);
    assert.ok(generatedNames.every(name => /^vcp-tw-(?:default|[a-f0-9]{8})-/.test(name)), 'Every generated keyframe must be namespaced');
    console.log(JSON.stringify({ authoredAnimationPages: checked, collisionNegativeControls: 1, namespacedGeneratedKeyframes: generatedNames.length }));
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
