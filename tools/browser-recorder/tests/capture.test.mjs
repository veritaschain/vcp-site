import test from 'node:test';
import assert from 'node:assert/strict';
import { captureSelection } from '../extension/lib/capture.mjs';

// These doubles exercise the capture contract. Range intersection and inherited
// DOM editability are additionally covered by tests/browser/capture.test.mjs.
function page({ protocol = 'https:', text = '合成テキスト', collapsed = false,
  rangeCount = 1, designMode = 'off', start = {}, end = {}, ancestors = [],
  interior = [], shadowEndpoint = false, composedMismatch = false } = {}) {
  globalThis.location = { protocol, origin: 'https://fixture.test' };
  const document = globalThis.document = { designMode };
  function element({ tag = 'span', editable = null, effective = false, shadow = false } = {}, parent = null) {
    return { nodeType: 1, parentElement: parent, shadowRoot: shadow ? {} : null,
      isContentEditable: effective, getAttribute: () => editable,
      matches: selectors => selectors.split(',').includes(tag), getRootNode: () => document };
  }
  let parent = element({ tag: 'main' });
  for (const ancestor of ancestors) parent = element(ancestor, parent);
  const startElement = element(start, parent), endElement = element(end, parent);
  const first = { nodeType: 3, parentElement: startElement, getRootNode: () => shadowEndpoint ? {} : document };
  const last = { nodeType: 3, parentElement: endElement, getRootNode: () => document };
  const middle = interior.map(item => ({ element: element(item), intersects: item.intersects !== false }));
  const common = element({ tag: 'main' });
  common.querySelectorAll = () => middle.map(item => item.element);
  const intersections = new Map(middle.map(item => [item.element, item.intersects]));
  const range = { startContainer: first, startOffset: 0, endContainer: last, endOffset: 1,
    commonAncestorContainer: common, intersectsNode: candidate => intersections.get(candidate) };
  globalThis.NodeFilter = { SHOW_ELEMENT: 1, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };
  document.createTreeWalker = (scope, whatToShow, filter) => {
    assert.equal(scope, common); assert.equal(whatToShow, NodeFilter.SHOW_ELEMENT);
    let cursor = 0;
    return { nextNode() {
      while (cursor < middle.length) {
        const node = middle[cursor++].element;
        if (filter.acceptNode(node) === NodeFilter.FILTER_ACCEPT) return node;
      }
      return null;
    } };
  };
  globalThis.window = { getSelection: () => ({ isCollapsed: collapsed, rangeCount,
    anchorNode: first, focusNode: last, getRangeAt: () => range,
    getComposedRanges: () => [{ ...range, ...(composedMismatch ? { startOffset: 1 } : {}) }],
    toString: () => text }) };
}

test('capture returns only selected text and origin', () => {
  page(); assert.deepEqual(captureSelection(), { origin: 'https://fixture.test', text: '合成テキスト' });
});
test('ordinary endpoints cannot bypass an interior editor or form control', () => {
  for (const interior of [[{ editable: 'true' }], [{ editable: '' }], [{ editable: 'plaintext-only' }],
    [{ editable: 'TRUE' }], [{ tag: 'input' }], [{ tag: 'textarea' }]]) {
    page({ interior }); assert.throws(captureSelection, /編集領域/);
  }
});
test('editors outside the selected range do not prevent capture', () => {
  page({ interior: [{ editable: 'true', intersects: false }, { tag: 'textarea', intersects: false }] });
  assert.equal(captureSelection().text, '合成テキスト');
});
test('inherited editing and false islands inside an editing host are excluded', () => {
  for (const opts of [{ start: { effective: true } },
    { start: { editable: 'false' }, ancestors: [{ editable: 'true', effective: true }] },
    { ancestors: [{ editable: 'plaintext-only' }] }, { designMode: 'on' }]) {
    page(opts); assert.throws(captureSelection, /編集領域/);
  }
});
test('standalone noneditable region remains eligible', () => {
  page({ start: { editable: 'false' }, interior: [{ editable: 'false' }] });
  assert.equal(captureSelection().text, '合成テキスト');
});
test('recognized shadow and embedded regions are rejected', () => {
  for (const opts of [{ shadowEndpoint: true }, { composedMismatch: true },
    { interior: [{ shadow: true }] }, { interior: [{ tag: 'iframe' }] },
    { ancestors: [{ shadow: true }] }]) {
    page(opts); assert.throws(captureSelection, /対応外領域/);
  }
});
test('capture rejects absent or ambiguous selection and empty text', () => {
  for (const opts of [{ collapsed: true }, { rangeCount: 0 }, { rangeCount: 2 }, { text: '  ' }]) {
    page(opts); assert.throws(captureSelection);
  }
});
test('capture rejects protected schemes and oversized UTF-8 text', () => {
  for (const opts of [{ protocol: 'chrome:' }, { protocol: 'file:' }, { text: 'あ'.repeat(12000) }]) {
    page(opts); assert.throws(captureSelection);
  }
});
test('unselected elements do not consume the selected-element budget', () => {
  page({ interior: [...Array.from({ length: 20001 }, () => ({ intersects: false })), {}] });
  assert.equal(captureSelection().text, '合成テキスト');
});
test('20000 selected descendants are accepted but 20001 are rejected', () => {
  page({ interior: Array.from({ length: 20000 }, () => ({})) });
  assert.equal(captureSelection().text, '合成テキスト');
  page({ interior: Array.from({ length: 20001 }, () => ({})) });
  assert.throws(captureSelection, /DOMが多すぎ/);
});
