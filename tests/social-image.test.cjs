// Site content rule: words drawn inside the shared social preview image are
// public claims, but the HTML wording checks cannot read them. The image is
// therefore pinned by hash to a text record, and the record is checked.
// Added 2026-11-11 after the preview image was found to still say
// "Regulator-Ready" while the pages said the opposite.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');

const RECORD = 'assets/OGP.text.json';
const HOMEPAGES = ['index.html', 'ja/index.html', 'zh/index.html'];
const RESTRICTED = [
  /regulator[- ]ready/i,
  /regulatory[- ]grade/i,
  /production[- ]ready/i,
  /\bcompliant\b/i,
  /\bcertified\b/i,
  /\bguarantee/i,
  /tamper[- ]proof/i,
  /\bimmutable\b/i,
  /world'?s first/i,
  /\bprevent/i,
];

function meta(html, key) {
  const match = html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`));
  return match && match[1];
}

test('social preview image matches its reviewed text record', () => {
  const record = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  const bytes = fs.readFileSync(record.image);
  assert.equal(
    crypto.createHash('sha256').update(bytes).digest('hex'),
    record.sha256,
    `${record.image} changed: review the words in the image, then update ${RECORD}`,
  );
  // PNG stores width and height as big-endian integers at bytes 16 and 20.
  assert.equal(bytes.readUInt32BE(16), record.width);
  assert.equal(bytes.readUInt32BE(20), record.height);
  assert.ok(Array.isArray(record.text) && record.text.length > 0, 'The record lists the words in the image');
});

test('recorded image text carries no restricted claim', () => {
  const record = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  const hits = [];
  for (const line of record.text) {
    for (const pattern of RESTRICTED) {
      if (pattern.test(line)) hits.push(`${line}: ${pattern}`);
    }
  }
  assert.deepEqual(hits, []);
});

test('homepages use the recorded preview image and name the operating company', () => {
  const record = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  const expected = `https://veritaschain.org/${record.image}`;
  for (const file of HOMEPAGES) {
    const html = fs.readFileSync(file, 'utf8');
    assert.equal(meta(html, 'og:image'), expected, `${file}: og:image`);
    assert.equal(meta(html, 'twitter:image'), expected, `${file}: twitter:image`);
    const identity = html.match(/<script id="site-identity" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(identity, `${file}: site identity structured data`);
    const organization = JSON.parse(identity[1])['@graph'].find(node => node['@type'] === 'Organization');
    assert.equal(organization.parentOrganization.legalName, 'VeritasChain株式会社', `${file}: operating company`);
    assert.equal(organization.parentOrganization.identifier.value, '9011001174443', `${file}: corporate number`);
  }
});
