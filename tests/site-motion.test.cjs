const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('assets/js/site-motion.js', 'utf8');

function setup({ reduced = false, support = true, loading = false } = {}) {
  let onPreference, onIntersect, observed = [], disconnected = false;
  const animations = [];
  const events = {};
  function element(top, height = 100) {
    return {
      dataset: {}, closest: () => null, parentElement: { closest: () => null },
      getBoundingClientRect: () => ({ top, height }),
      animate: () => {
        const animation = { cancelled: false, finished: new Promise(() => {}),
          cancel() { this.cancelled = true; }, finish() { this.completed = true; } };
        animations.push(animation); return animation;
      }
    };
  }
  const targets = [element(100), element(900), element(1000, 900), element(1100, 0)];
  const preference = { matches: reduced, addEventListener: (_, fn) => { onPreference = fn; } };
  const document = { hidden: false, readyState: loading ? 'loading' : 'complete',
    documentElement: { classList: { add() {} } }, querySelectorAll: () => targets,
    addEventListener: (name, fn) => { events[name] = fn; } };
  class Observer {
    constructor(fn) { onIntersect = fn; }
    observe(el) { observed.push(el); }
    unobserve(el) { observed = observed.filter(x => x !== el); }
    disconnect() { disconnected = true; observed = []; }
  }
  const window = { innerHeight: 800, matchMedia: () => preference };
  if (support) window.IntersectionObserver = Observer;
  vm.runInNewContext(source, { window, document, IntersectionObserver: Observer,
    Element: { prototype: { animate() {} } }, Set });
  return { targets, animations, document, events, preference,
    observed: () => observed, disconnected: () => disconnected,
    intersect: (el) => onIntersect([{ target: el, isIntersecting: true }]),
    reduce: () => { preference.matches = true; onPreference({ matches: true }); } };
}

test('reduced motion and unsupported browsers leave content untouched', () => {
  for (const options of [{ reduced: true }, { support: false }]) {
    const env = setup(options);
    assert.equal(env.observed().length, 0);
    assert.equal(env.animations.length, 0);
    assert.ok(env.targets.every(el => !('style' in el)));
  }
});
test('only small below-fold content is observed and each reveal is detached', () => {
  const env = setup();
  assert.deepEqual(env.observed(), [env.targets[1]]);
  env.intersect(env.targets[1]);
  assert.equal(env.observed().length, 0);
  assert.equal(env.animations.length, 1);
  env.reduce();
  assert.equal(env.animations[0].cancelled, true);
  assert.equal(env.disconnected(), true);
});
test('delayed initialization and hidden tabs never hide content', () => {
  const env = setup({ loading: true });
  assert.equal(env.observed().length, 0);
  env.events.DOMContentLoaded();
  assert.equal(env.observed().length, 1);
  env.document.hidden = true;
  env.intersect(env.targets[1]);
  assert.equal(env.animations.length, 0);
});
