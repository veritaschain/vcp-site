const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const origin = 'https://veritaschain.org';
const homePath = language => language === 'en' ? 'index.html' : language + '/index.html';
const localRoute = (route, language) => route + (language === 'en' ? '' : language + '/');
const homes = ['en', 'ja', 'zh'].map(language => ({
  language, file: homePath(language),
  html: fs.readFileSync(homePath(language), 'utf8')
}));
const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const escapeHtml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const preservedFragments = [
  'vap-home-title', 'vap-overview', 'vap-overview-title',
  'ai-guides', 'ai-guides-title', 'tokachi-kamimura', 'founder-name',
  'integrity-review-2026-10-24', 'news-container', 'vcp-rta',
  'domain-profiles', 'faq', 'faq-title'
];

test('existing homepage and announcement links retain fragment destinations', () => {
  for (const { language, file, html } of homes) {
    const allIds = ids(html);
    assert.equal(new Set(allIds).size, allIds.length, file + ': duplicate IDs');
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, file + ': one primary heading');
    const required = [...preservedFragments];
    if (language !== 'zh') required.push('security-research', 'security-research-title');
    const rows = JSON.parse(fs.readFileSync('data/announcements/' + language + '.json', 'utf8'));
    required.push(...rows.slice(0, 3).map(row => row.id));
    required.push(...rows.slice(3).flatMap(row => row.legacy_ids));
    for (const fragment of required) assert.ok(allIds.includes(fragment), file + '#' + fragment);
    const news = html.match(/<section class="section section-news"[\s\S]*?<\/section>/)[0];
    assert.equal((news.match(/class="news-row"/g) || []).length, 3, file + ': latest three announcements');
  }
});

test('homepage links, assets and fragment references resolve to published files', () => {
  for (const { file, html } of homes) {
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const url = new URL(match[1].replace(/&amp;/g, '&'), origin + '/' + file);
      if (url.origin !== origin) continue;
      let target = decodeURIComponent(url.pathname).replace(/^\//, '');
      if (!target || target.endsWith('/')) target += 'index.html';
      assert.ok(fs.existsSync(target), file + ': missing ' + target);
      if (url.hash && path.extname(target) === '.html') {
        assert.ok(ids(fs.readFileSync(target, 'utf8')).includes(decodeURIComponent(url.hash.slice(1))), file + ': missing fragment ' + match[1]);
      }
    }
  }
});

test('all languages offer the demo, current documentation and status disclosures', () => {
  for (const { language, file, html } of homes) {
    const main = html.slice(html.indexOf('<main'));
    const actions = main.match(/<div class="home-actions">[\s\S]*?<\/div>/)[0];
    assert.ok(actions.includes('href="/explorer/app/"'), file + ': demo entry');
    assert.ok(actions.includes('href="' + localRoute('/vcp/developers/', language) + '"'), file + ': localized developer entry');
    for (const route of ['/certified/', '/vso/corrections/', '/vso/policies/', '/vap/']) {
      assert.ok(main.includes('href="' + localRoute(route, language) + '"'), file + ': disclosure ' + route);
    }
    assert.ok(main.includes('href="https://github.com/veritaschain/vcp-spec/tree/main/spec/v1.2#known-issues-in-v12-informative"'), file + ': current known issues');
    assert.ok(main.includes('href="https://evidect.veritaschain.org/"'), file + ': EVIDECT service entry');
    assert.doesNotMatch(main, /spec\/v1\.1|RDMA ready|時系列順序保証|20\+年|20年以上/, file + ': retired technical claims');
    assert.doesNotMatch(main, /\son(?:click|load|mouseover)\s*=/i, file + ': inline event handler');
  }
});

test('visible FAQ answers agree with the homepage structured data', () => {
  for (const { file, html } of homes) {
    const identity = JSON.parse(html.match(/<script id="site-identity" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const faq = identity['@graph'].find(item => item['@type'] === 'FAQPage');
    const visible = html.slice(html.indexOf('<div class="home-faq"'), html.indexOf('<section class="home-section home-section-tinted" id="about-vso"'));
    for (const question of faq.mainEntity) {
      assert.ok(visible.includes(escapeHtml(question.name)), file + ': FAQ question');
      assert.ok(visible.includes(escapeHtml(question.acceptedAnswer.text)), file + ': FAQ answer');
    }
  }
});

