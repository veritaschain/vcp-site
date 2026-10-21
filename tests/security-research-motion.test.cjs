const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('use-cases/security-research/security-research-motion.js', 'utf8');

function setup({ reduced = false, supported = true, stored = false, storageBlocked = false } = {}) {
  const classList = () => {
    const values = new Set();
    return { toggle(name, active) { active ? values.add(name) : values.delete(name); }, contains: name => values.has(name) };
  };
  const animations = [], observers = [], events = {};
  let onPreference, onClick, saved = String(stored);
  const body = { classList: classList() };
  const label = {}, icon = {};
  const control = { hidden: true, dataset: { pauseLabel: 'Pause animations', playLabel: 'Resume animations' },
    querySelector: tag => tag === 'span' ? label : icon,
    addEventListener: (_, handler) => { onClick = handler; } };
  const element = (top, height, classes = [], nested = false) => ({
    classList: classList(), parentElement: { closest: () => nested ? {} : null },
    matches: selector => classes.includes(selector),
    getBoundingClientRect: () => ({ top, height, bottom: top + height }),
    animate(frames, options) {
      const animation = { frames, options, cancelled: false, finished: new Promise(() => {}), cancel() { this.cancelled = true; } };
      animations.push(animation); return animation;
    }
  });
  const card = element(1000, 160), nested = element(1010, 30, [], true), tall = element(1300, 950);
  const later = element(2400, 100), illustration = element(250, 300, ['.sr-iso', '.sr-iso--hero']);
  const targets = [card, nested, tall, later, illustration];
  const document = { body, hidden: false, documentElement: { classList: classList() },
    querySelector: () => control, querySelectorAll: () => targets,
    addEventListener: (name, handler) => { events[name] = handler; } };
  const preference = { matches: reduced, addEventListener: (_, handler) => { onPreference = handler; } };
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
  }
  const window = { innerHeight: 800, matchMedia: () => preference,
    addEventListener: (name, handler) => { events[name] = handler; } };
  if (supported) window.IntersectionObserver = Observer;
  const sessionStorage = {
    getItem() { if (storageBlocked) throw Error('Blocked'); return saved; },
    setItem(_, value) { if (storageBlocked) throw Error('Blocked'); saved = value; }
  };
  vm.runInNewContext(source, { window, document, sessionStorage, IntersectionObserver: Observer,
    Element: { prototype: { animate() {} } }, performance: { now: () => 2000 }, Set, WeakSet });
  return { body, control, label, document, animations, observers, card, nested, tall, later, illustration,
    saved: () => saved, click: () => onClick(),
    intersect: (target, isIntersecting = true) => observers[0].callback([{ target, isIntersecting }]),
    reduce(value) { preference.matches = value; onPreference(); },
    visibility(hidden) { document.hidden = hidden; events.visibilitychange(); } };
}

test('reduced motion and missing browser support leave readable content static', () => {
  for (const options of [{ reduced: true }, { supported: false }]) {
    const env = setup(options);
    assert.equal(env.observers.length, 0);
    assert.equal(env.animations.length, 0);
    assert.equal(env.control.hidden, true);
    assert.equal(env.body.classList.contains('sr-motion-running'), false);
    assert.equal('style' in env.card, false);
  }
});

test('entrances run once, skip nested and long content, and track illustration visibility', () => {
  const env = setup();
  assert.equal(env.observers[0].targets.has(env.nested), false);
  env.intersect(env.card); env.intersect(env.card); env.intersect(env.tall);
  assert.equal(env.animations.length, 1);
  assert.equal(env.observers[0].targets.has(env.card), false);
  env.intersect(env.illustration);
  assert.equal(env.illustration.classList.contains('sr-in-view'), true);
  assert.equal(env.body.classList.contains('sr-hero-visible'), true);
  env.intersect(env.illustration, false);
  assert.equal(env.illustration.classList.contains('sr-in-view'), false);
  assert.equal(env.body.classList.contains('sr-hero-visible'), false);
});

test('pause cancels entrances, persists across language loads, and does not replay read content', () => {
  const env = setup();
  env.intersect(env.card);
  env.click();
  assert.equal(env.animations[0].cancelled, true);
  assert.equal(env.body.classList.contains('sr-motion-running'), false);
  assert.equal(env.label.textContent, 'Resume animations');
  assert.equal(env.saved(), 'true');
  env.intersect(env.later);
  env.click(); env.intersect(env.later);
  assert.equal(env.animations.length, 1);
  assert.equal(env.body.classList.contains('sr-motion-running'), true);
  const remembered = setup({ stored: true });
  assert.equal(remembered.label.textContent, 'Resume animations');
  assert.equal(remembered.body.classList.contains('sr-motion-running'), false);
});

test('background tabs and live preference changes stop motion without changing the saved choice', () => {
  const env = setup();
  env.intersect(env.card);
  env.visibility(true);
  assert.equal(env.animations[0].cancelled, true);
  assert.equal(env.body.classList.contains('sr-motion-running'), false);
  assert.equal(env.saved(), 'false');
  env.visibility(false);
  assert.equal(env.body.classList.contains('sr-motion-running'), true);
  env.reduce(true);
  assert.equal(env.control.hidden, true);
  assert.equal(env.body.classList.contains('sr-motion-running'), false);
  env.reduce(false);
  assert.equal(env.control.hidden, false);
  assert.equal(env.body.classList.contains('sr-motion-running'), true);
  const initiallyReduced = setup({ reduced: true });
  initiallyReduced.reduce(false);
  assert.equal(initiallyReduced.observers.length, 1);
});

test('blocked storage does not disable the pause control', () => {
  const env = setup({ storageBlocked: true });
  env.click();
  assert.equal(env.body.classList.contains('sr-motion-running'), false);
  env.click();
  assert.equal(env.body.classList.contains('sr-motion-running'), true);
});
