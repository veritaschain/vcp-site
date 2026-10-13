const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/vcp-header.js', 'utf8');
let Header;
const location = { pathname: "/" };
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

test('language switches normalize explicit index files and trailing slashes', () => {
  location.pathname = '/ja/index.html';
  let urls = Header.prototype.generateLangUrls.call({});
  assert.equal(urls.en, '/');
  assert.equal(urls.ja, '/ja/');
  assert.equal(urls.zh, '/zh/');
  location.pathname = '/vap/zh';
  urls = Header.prototype.generateLangUrls.call({});
  assert.equal(urls.en, '/vap/');
  assert.equal(urls.ja, '/vap/ja/');
  assert.equal(urls.zh, '/vap/zh/');
});
