const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');

const html = fs.readFileSync('vap/cpp/veracheck/index.html', 'utf8');
const source = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes('async function verifyPack'));
assert.ok(source, 'Test the executable script shipped in the public viewer');

// Minimal DOM for the actual event handlers and rendering functions. Browser
// interaction/CSP tests exercise real parsing and layout separately.
function boot() {
  class Element {
    constructor(tag = 'div') { this.tag = tag; this.children = []; this.events = {}; this.className = ''; this.dataset = {}; this.value = ''; this._text = ''; }
    set textContent(value) { this._text = String(value); this.children = []; }
    get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
    set innerHTML(value) { this._html = String(value); this._text = ''; this.children = []; }
    get innerHTML() { return this._html || ''; }
    append(...nodes) { this.children.push(...nodes); }
    appendChild(node) { this.append(node); }
    replaceChildren(...nodes) { this.children = nodes; this._text = ''; }
    addEventListener(name, handler) { (this.events[name] ||= []).push(handler); }
    async click() { for (const handler of this.events.click || []) await handler({ target: this }); }
    focus() {}
    scrollIntoView() {}
    get classList() {
      const read = () => new Set(this.className.split(/\s+/).filter(Boolean));
      const write = values => { this.className = [...values].join(' '); };
      return {
        add: (...names) => { const values = read(); names.forEach(name => values.add(name)); write(values); },
        remove: (...names) => { const values = read(); names.forEach(name => values.delete(name)); write(values); },
        contains: name => read().has(name),
        toggle: name => { const values = read(); values.has(name) ? values.delete(name) : values.add(name); write(values); }
      };
    }
  }
  const nodes = new Map();
  const ready = [];
  const document = {
    documentElement: { lang: 'en', dataset: {} },
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); },
    createElement: tag => new Element(tag),
    querySelectorAll: () => [],
    addEventListener(name, handler) { if (name === 'DOMContentLoaded') ready.push(handler); }
  };
  const stored = new Map();
  const alerts = [];
  const context = vm.createContext({ document, TextEncoder, atob, crypto: crypto.webcrypto,
    console: { error() {} }, navigator: { language: 'en-US' },
    localStorage: { getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value) },
    matchMedia: () => ({ matches: false }), alert: value => alerts.push(value) });
  context.window = context;
  vm.runInContext(source, context);
  ready.forEach(handler => handler());
  const element = id => document.getElementById(id);
  const paste = async value => { element('jsonInput').value = JSON.stringify(value); await element('verifyJsonBtn').click(); };
  return { context, element, paste, alerts, translations: vm.runInContext('translations', context) };
}

function tds(overrides = {}) {
  return {
    eventId: '01932f5a-7b8c-7def-8abc-123456789012', eventType: 'INGEST',
    timestamp: '2026-11-19T00:00:00.000Z', prevHash: 'GENESIS',
    eventHash: 'a'.repeat(64), signature: Buffer.alloc(64, 1).toString('base64'), ...overrides
  };
}

function signedCPP({ algorithm = 'ES256', prefix = '' } = {}) {
  // Deliberately use independently ordered JSON and Node's signing primitive,
  // not the viewer's canonicalizer or verifier, to create a valid control.
  const event = {
    cpp_version: '1.0', device_id: 'urn:uuid:550e8400-e29b-41d4-a716-446655440000',
    event_id: '01932f5a-7b8c-7def-8abc-123456789012', event_type: 'CPP_CAPTURE',
    payload: { media_hash: 'sha256:' + 'a'.repeat(64), media_type: 'image/png' },
    prev_hash: 'sha256:' + '0'.repeat(64), sequence_number: 1, timestamp: '2026-11-19T00:00:00.000Z'
  };
  const ed25519 = algorithm === 'Ed25519';
  const keys = ed25519 ? crypto.generateKeyPairSync('ed25519') : crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const signature = crypto.sign(ed25519 ? null : 'sha256', Buffer.from(JSON.stringify(event)), { key: keys.privateKey, dsaEncoding: 'ieee-p1363' });
  event.signature = {
    algorithm, public_key: prefix + keys.publicKey.export({ type: 'spki', format: 'der' }).toString('base64'),
    value: prefix + signature.toString('base64')
  };
  return { verification_pack_version: '1.0', capture_event: event };
}

test('empty, unrelated, scalar, array and malformed wrapper inputs are invalid', async () => {
  const { context } = boot();
  for (const input of [{}, { unrelated: 'data' }, null, [], 1, 'text', true,
    { capture_event: null }, { capture_event: [] }, { capture_event: 'text' },
    { capture_event: tds(), captureEvent: tds() }]) {
    const result = await context.verifyPack(input);
    assert.equal(result.outcome, 'invalid', JSON.stringify(input));
    assert.equal(result.results[0].status, 'fail');
    assert.equal(context.extractMetadata(input).conformanceLevel, 'Not assessed');
  }
});

test('recognized events with missing fields are incomplete, including missing signatures or hashes', async () => {
  const { context } = boot();
  for (const field of ['eventId', 'timestamp', 'prevHash', 'eventHash', 'signature']) {
    const event = tds(); delete event[field];
    const result = await context.verifyPack({ capture_event: event });
    assert.equal(result.outcome, 'incomplete', field);
    assert.ok(result.results[0].message.includes(field));
  }
  const pack = signedCPP(); delete pack.capture_event.signature.public_key;
  const result = await context.verifyPack(pack);
  assert.equal(result.outcome, 'incomplete');
  assert.ok(result.results[0].message.includes('signature.public_key'));
});

test('unsupported versions/types and present malformed required fields are invalid', async () => {
  const { context } = boot();
  for (const event of [tds({ eventType: 'UNKNOWN' }), tds({ eventId: [] }),
    tds({ timestamp: 'not-a-time' }), tds({ signature: {} }), tds({ signature: 'short' }),
    tds({ eventHash: false })]) {
    assert.equal((await context.verifyPack(event)).outcome, 'invalid');
  }
  for (const [field, value] of [['cpp_version', '99.0'], ['sequence_number', 0], ['payload', []], ['signature', 'text']]) {
    const pack = signedCPP(); pack.capture_event[field] = value;
    assert.equal((await context.verifyPack(pack)).outcome, 'invalid', field);
  }
  assert.equal((await context.verifyPack({ verification_pack_version: '99.0', capture_event: tds() })).outcome, 'invalid');
});

test('supported TDS events and wrapper aliases remain viewable but never fully verified', async () => {
  const { context } = boot();
  for (const eventType of ['INGEST', 'EXPORT', 'TOMBSTONE']) {
    const event = tds({ eventType });
    for (const input of [event, { capture_event: event }, { captureEvent: event }]) {
      const result = await context.verifyPack(input);
      assert.equal(result.outcome, 'unchecked');
      assert.ok(result.results.every(item => item.status !== 'pass'));
    }
  }
  const suppliedAttestation = {
    capture_event: tds({ captureContext: { humanAttestation: { method: 'BIOMETRIC_FACEID' } } }),
    external_anchor: { timestamp_token: 'unverified-token' }
  };
  assert.equal((await context.verifyPack(suppliedAttestation)).outcome, 'unchecked');
  assert.equal(context.extractMetadata(suppliedAttestation).conformanceLevel, 'Not assessed');
});

test('actual ES256/ECDSA-P256 matches remain individual passes without whole-pack success', async () => {
  const { context } = boot();
  for (const algorithm of ['ES256', 'ECDSA-P256']) {
    for (const prefix of ['', 'base64:']) {
      const pack = signedCPP({ algorithm, prefix });
      const result = await context.verifyPack(pack);
      assert.equal(result.results.find(item => item.type === 'signature').status, 'pass');
      assert.equal(result.outcome, 'unchecked');
      assert.equal(context.extractMetadata(pack).conformanceLevel, 'Not assessed');
    }
  }
});

test('failed signature remains invalid without Gold from supplied anchor/attestation fields', async () => {
  const { context } = boot();
  const pack = signedCPP();
  pack.capture_event.payload.media_hash = 'sha256:' + 'b'.repeat(64);
  pack.capture_event.captureContext = { humanAttestation: {} };
  pack.external_anchor = {};
  const result = await context.verifyPack(pack);
  assert.equal(result.outcome, 'invalid');
  assert.equal(result.results.find(item => item.type === 'signature').status, 'fail');
  assert.equal(context.extractMetadata(pack).conformanceLevel, 'Not assessed');
});

test('unsupported signature algorithms are not incorrectly sent to the ES256 verifier', async () => {
  const { context } = boot();
  const result = await context.verifyPack(signedCPP({ algorithm: 'Ed25519', prefix: 'base64:' }));
  assert.equal(result.outcome, 'unchecked');
  assert.equal(result.results.find(item => item.type === 'signature').status, 'info');
});

test('real paste and file handlers render invalid input and neutral conformance', async () => {
  const b = boot();
  await b.paste({});
  assert.equal(b.element('summary').className, 'summary invalid');
  assert.equal(b.element('rawData').textContent, '{}');
  const fakeGold = { capture_event: { captureContext: { humanAttestation: {} } }, external_anchor: {} };
  await b.context.handleFile({ text: async () => JSON.stringify(fakeGold) });
  assert.equal(b.element('summary').className, 'summary invalid');
  assert.equal(b.element('metadata').children[0].children[1].children[0].className, 'conformance-level unassessed');
  assert.equal(b.element('metadata').children[0].children[1].textContent, 'Not assessed');
  assert.equal(b.alerts.length, 0);
});

test('literal metadata remains safe and incomplete input has no green summary', async () => {
  const b = boot();
  const code = 'case <b>12</b>';
  const device = 'Test camera <em>west</em> & unit 7';
  await b.paste({ verification_code: code, capture_event: { eventType: 'INGEST', captureContext: { deviceModel: device } } });
  assert.equal(b.element('summary').className, 'summary incomplete');
  const values = b.element('metadata').children.map(item => item.children[1]);
  assert.ok(values.some(value => value.textContent === code && value.children.length === 0));
  assert.ok(values.some(value => value.textContent === device && value.children.length === 0));
  assert.ok(values.every(value => value.innerHTML === ''));
});

test('all ten languages render explicit outcomes and unassessed conformance without fallback', async () => {
  const b = boot();
  const languages = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'ko', 'de', 'fr', 'es', 'pt', 'ar'];
  assert.deepEqual(Object.keys(b.translations), languages);
  const required = ['summary.invalid.title', 'summary.incomplete.title', 'summary.unchecked.title',
    'summary.incomplete.text', 'summary.unchecked.text', 'result.structure.title',
    'result.structure.invalid', 'result.structure.incomplete', 'result.structure.unchecked',
    'result.signature.missing', 'meta.conformanceLevel.unassessed', 'upload.privacy', 'disclaimer.text'];
  for (const language of languages) {
    for (const key of required) assert.ok(Object.hasOwn(b.translations[language], key), language + ': ' + key);
    assert.equal(Object.hasOwn(b.translations[language], 'summary.valid.title'), false);
    b.context.setLanguage(language);
    for (const [input, outcome] of [[{}, 'invalid'], [{ eventType: 'INGEST' }, 'incomplete'], [tds(), 'unchecked']]) {
      await b.paste(input);
      assert.equal(b.element('summary').className, 'summary ' + outcome);
      assert.equal(b.element('summaryTitle').textContent, b.translations[language]['summary.' + outcome + '.title']);
      assert.equal(b.context.extractMetadata(input).conformanceLevel, b.translations[language]['meta.conformanceLevel.unassessed']);
    }
  }
});
