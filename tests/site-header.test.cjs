const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/vcp-header.js', 'utf8');
let Header;
const location = { pathname: "/" };
test('versioned header loads styles and motion at valid versioned URLs', () => {
  for (const query of ['', '?v=20261014']) {
    const assets = [];
    vm.runInNewContext(source, {
      URL, HTMLElement: class {}, window: { location },
      document: {
        currentScript: { src: `https://veritaschain.org/assets/js/vcp-header.js${query}` },
        getElementById: () => null,
        createElement: () => ({}),
        head: { appendChild: element => assets.push(element) }
      },
      customElements: { define() {} }
    });
    assert.deepEqual(assets.map(asset => asset.href || asset.src), [
      `https://veritaschain.org/assets/css/vcp-header.css${query}`,
      `https://veritaschain.org/assets/css/site-motion.css${query}`,
      `https://veritaschain.org/assets/js/site-motion.js${query}`
    ]);
    assert.equal(assets[2].defer, true);
  }
});
vm.runInNewContext(source, {
  URL, HTMLElement: class {}, window: { location },
  document: { currentScript: { src: 'https://veritaschain.org/assets/js/vcp-header.js' }, getElementById: () => ({}) },
  customElements: { define(name, element) { Header = element; } }
});
function linksFor(language) {
  const paths = [...new Set([...source.matchAll(/href="(\/[^"$#]*)"/g)].map(match => match[1]))];
  const links = paths.map(path => ({ path, getAttribute() { return this.path; }, setAttribute(_, value) { this.path = value; } }));
  Header.prototype.localizeNavigation.call({ querySelectorAll() { return links; } }, language);
  return links;
}
test('translated navigation retains language and every destination exists', () => {
  for (const language of ['ja', 'zh']) {
    const links = linksFor(language);
    assert.ok(links.some(link => link.path === `/vap/${language}/`));
    assert.ok(links.some(link => link.path === `/certified/${language}/`));
    assert.ok(links.some(link => link.path === '/vcp/specification/'));
    assert.ok(links.some(link => link.path === '/explorer/app/'));
    for (const link of links) assert.ok(fs.existsSync(`.${link.path}index.html`), link.path);
  }
});
test('English navigation keeps canonical base routes', () => {
  const links = linksFor('en');
  assert.ok(links.some(link => link.path === '/vap/'));
  assert.ok(links.every(link => !/\/(ja|zh)\/$/.test(link.path)));
});

test('guides use Japanese translations and retain English for unavailable Chinese', () => {
  for (const route of ['ai-governance', 'ai-audit-trail', 'ai-agent-audit-log']) {
    assert.ok(linksFor('ja').some(link => link.path === `/guides/${route}/ja/`));
    assert.ok(linksFor('zh').some(link => link.path === `/guides/${route}/`));
    assert.ok(!linksFor('zh').some(link => link.path === `/guides/${route}/zh/`));
  }
});

test('language switches normalize explicit index files and trailing slashes', () => {
  location.pathname = '/ja/index.html';
  let urls = Header.prototype.generateLangUrls.call({ getAttribute: () => null });
  assert.equal(urls.en, '/');
  assert.equal(urls.ja, '/ja/');
  assert.equal(urls.zh, '/zh/');
  location.pathname = '/vap/zh';
  urls = Header.prototype.generateLangUrls.call({ getAttribute: () => null });
  assert.equal(urls.en, '/vap/');
  assert.equal(urls.ja, '/vap/ja/');
  assert.equal(urls.zh, '/vap/zh/');
});

test('Japanese language switch can point directly to EVIDECT', () => {
  location.pathname = '/use-cases/security-research/';
  const urls = Header.prototype.generateLangUrls.call({ getAttribute: name => name === 'ja-url' ? 'https://evidect.veritaschain.org/' : null });
  assert.equal(urls.en, '/use-cases/security-research/');
  assert.equal(urls.ja, 'https://evidect.veritaschain.org/');
});
