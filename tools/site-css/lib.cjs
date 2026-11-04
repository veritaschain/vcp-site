'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const selectors = require('postcss-selector-parser');

const ROOT = path.resolve(__dirname, '../..');
const ASSET = 'assets/css/site-tailwind.css';
const LINK = `<link rel="stylesheet" href="/${ASSET}">`;
const SOURCE = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
const SKIP = new Set(['.git', 'node_modules', 'dist', 'maintenance']);

function filesUnder(dir = ROOT) {
  // Match the Jekyll exclusion without hiding other tools or public downloads.
  if (dir === path.join(ROOT, 'tools/browser-recorder')) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en')).flatMap(entry => {
    if (SKIP.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(file) : entry.isFile() ? [path.relative(ROOT, file).split(path.sep).join('/')] : [];
  });
}

function read(file) { return fs.readFileSync(path.join(ROOT, file), 'utf8'); }
function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}

function manifest() { return JSON.parse(read('tools/site-css/themes.json')); }

// The browser sees complete class strings added by these local scripts as well
// as initial HTML. Scan the same scripts at build time, without scanning vendor
// bundles that are unrelated to these pages.
function contentFiles(theme) {
  const result = new Set(theme.pages);
  for (const file of theme.pages) {
    for (const match of read(file).matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
      const url = new URL(match[1], `https://veritaschain.org/${file}`);
      if (url.origin !== 'https://veritaschain.org') continue;
      const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const absolute = path.resolve(ROOT, relative);
      if (!absolute.startsWith(ROOT + path.sep)) throw new Error(`Unsafe local script path: ${file}: ${match[1]}`);
      if (!fs.existsSync(absolute)) throw new Error(`Missing local script: ${file}: ${match[1]}`);
      result.add(relative);
      if (relative === 'vcc/demo/app.js') result.add('vcc/demo/app.jsx');
    }
  }
  return [...result].sort();
}

async function compileTheme(theme) {
  const content = contentFiles(theme).map(file => ({ raw: read(file), extension: path.extname(file).slice(1) }));
  const result = await postcss([tailwind({ ...theme.config, content })]).process(SOURCE, { from: undefined });
  return result.root;
}

function inKeyframes(rule) {
  for (let node = rule.parent; node; node = node.parent) {
    if (node.type === 'atrule' && /keyframes$/i.test(node.name)) return true;
  }
  return false;
}

// A target guard preserves the original selector's specificity, including root
// utilities, pseudo-elements and class-based dark mode on <html>. Prefixing with
// an ordinary attribute selector would change specificity; an ancestor-only
// guard would miss utilities on <html> itself.
function scopeSelector(selector, id) {
  const guard = selectors().astSync(`:where([data-tw-theme="${id}"],[data-tw-theme="${id}"] *)`).first.first;
  return selectors(root => {
    root.each(part => {
      let lastCombinator = -1;
      part.nodes.forEach((node, index) => { if (node.type === 'combinator') lastCombinator = index; });
      const pseudoElement = part.nodes.slice(lastCombinator + 1).find(node =>
        node.type === 'pseudo' && (node.value.startsWith('::') || [':before', ':after', ':first-line', ':first-letter'].includes(node.value)));
      if (pseudoElement) part.insertBefore(pseudoElement, guard.clone());
      else part.append(guard.clone());
    });
  }).processSync(selector);
}

function scoped(root, id) {
  const result = root.clone();
  result.walkRules(rule => { if (!inKeyframes(rule)) rule.selector = scopeSelector(rule.selector, id); });
  return result;
}

// Keyframes are global even when every selector is guarded. A page can define
// its own `pulse` without using Tailwind's animate-pulse utility; another page
// in the same compiled group must not replace that authored animation.
function namespaceKeyframes(root, id) {
  const result = root.clone();
  const names = new Map();
  result.walkAtRules(/keyframes$/, rule => {
    const name = rule.params.trim();
    if (!/^[-_a-zA-Z][-_a-zA-Z0-9]*$/.test(name)) throw new Error(`Review unsupported keyframe identifier: ${name}`);
    names.set(name, `vcp-tw-${id}-${name}`);
    rule.params = names.get(name);
  });
  const values = require('postcss-value-parser');
  result.walkDecls(/^(?:-webkit-)?animation(?:-name)?$/, declaration => {
    const value = values(declaration.value);
    value.walk(node => {
      if (['word', 'string'].includes(node.type) && names.has(node.value)) node.value = names.get(node.value);
    });
    declaration.value = value.toString();
  });
  return result;
}

// Remove formatting only; do not merge selectors, reorder declarations, or
// rewrite values. That keeps each page's Tailwind cascade intact.
function compact(root) {
  const result = root.clone();
  result.walkComments(comment => comment.remove());
  result.walk(node => {
    node.raws.before = '';
    node.raws.after = '';
    if (node.type === 'decl') node.raws.between = ':';
    if (node.type === 'rule' || node.type === 'atrule') node.raws.between = '';
    if (node.type === 'atrule' && node.params) node.raws.afterName = ' ';
  });
  result.raws.after = '';
  return result.toString();
}

function validate(man) {
  const known = new Map();
  for (const [id, theme] of Object.entries(man.themes)) {
    if (!/^(default|[a-f0-9]{8})$/.test(id)) throw new Error(`Invalid theme ID: ${id}`);
    for (const file of theme.pages) {
      if (known.has(file)) throw new Error(`Duplicate theme assignment: ${file}`);
      known.set(file, id);
      const text = read(file);
      if (!new RegExp(`<html\\b[^>]*\\bdata-tw-theme="${id}"`).test(text)) throw new Error(`Missing theme ${id}: ${file}`);
      if ((text.match(new RegExp(LINK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1) {
        throw new Error(`Expected one compiled CSS link: ${file}`);
      }
      const head = text.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
      if (!head?.trimEnd().endsWith(LINK)) throw new Error(`Compiled CSS must be the last head element: ${file}`);
    }
  }
  for (const file of filesUnder().filter(file => /\.(html|tsx)$/.test(file))) {
    const text = read(file);
    if (/cdn\.tailwindcss\.com|tailwind\.config\s*=/.test(text)) throw new Error(`Play CDN/config remains: ${file}`);
    if (/data-tw-theme|site-tailwind\.css/.test(text) && !known.has(file)) throw new Error(`Unregistered Tailwind page: ${file}`);
  }
  return known.size;
}

module.exports = { ROOT, ASSET, LINK, SOURCE, filesUnder, read, sha256, canonical, manifest, contentFiles, compileTheme, scopeSelector, scoped, namespaceKeyframes, compact, validate, inKeyframes };
