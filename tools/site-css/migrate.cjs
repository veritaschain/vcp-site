'use strict';

// One-time migration retained to make the configuration capture reviewable.
// It refuses to run after themes.json has been created.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { ROOT, LINK, filesUnder, read, sha256, canonical } = require('./lib.cjs');

const destination = path.join(__dirname, 'themes.json');
if (fs.existsSync(destination)) throw new Error('Migration already captured; edit themes.json for subsequent theme changes.');
const themes = { default: { config: {}, pages: [] } };
const originalScripts = {};
const pending = [];
function removeScript(text, markup) {
  const start = text.indexOf(markup);
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const end = start + markup.length;
  const lineEnd = text.indexOf('\n', end);
  if (/^[\t ]*$/.test(text.slice(lineStart, start)) && lineEnd !== -1 && /^[\t ]*$/.test(text.slice(end, lineEnd))) {
    return text.slice(0, lineStart) + text.slice(lineEnd + 1);
  }
  return text.replace(markup, '');
}
for (const file of filesUnder().filter(file => /\.(html|tsx)$/.test(file))) {
  let text = read(file);
  if (!/cdn\.tailwindcss\.com/.test(text)) continue;
  let config = {};
  const matches = [...text.matchAll(/<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].filter(match => /tailwind\.config\s*=/.test(match[1]));
  if (matches.length > 1) throw new Error(`Multiple Tailwind configurations: ${file}`);
  if (matches.length) {
    const sandbox = { tailwind: {} };
    vm.runInNewContext(matches[0][1], sandbox, { timeout: 100 });
    const json = JSON.stringify(sandbox.tailwind.config, (key, value) => {
      if (typeof value === 'function' || typeof value === 'undefined') throw new Error(`Non-JSON configuration: ${file}`);
      return value;
    });
    config = canonical(JSON.parse(json));
    originalScripts[file] = sha256(matches[0][1]);
    text = removeScript(text, matches[0][0]);
  }
  const id = Object.keys(config).length ? sha256(JSON.stringify(config)).slice(0, 8) : 'default';
  if (themes[id] && JSON.stringify(themes[id].config) !== JSON.stringify(config)) throw new Error(`Theme ID collision: ${id}`);
  themes[id] ||= { config, pages: [] };
  themes[id].pages.push(file);
  const before = text;
  for (const match of [...text.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']https:\/\/cdn\.tailwindcss\.com[^"']*["'][^>]*>\s*<\/script>/gi)]) text = removeScript(text, match[0]);
  if (text === before || /cdn\.tailwindcss\.com/.test(text)) throw new Error(`Unsupported CDN markup: ${file}`);
  if ((text.match(/<html\b/g) || []).length !== 1 || !/<\/head>/i.test(text)) throw new Error(`Unsupported document: ${file}`);
  text = text.replace(/<html\b/, `<html data-tw-theme="${id}"`);
  // Play CDN appended its compiled stylesheet in <head>. Keep utilities after
  // author head styles to preserve the existing cascade ordering.
  text = text.replace(/<\/head>/i, `    ${LINK}\n</head>`);
  pending.push([file, text]);
}
const man = {
  schemaVersion: 1,
  capturedFromCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(),
  compiler: 'tailwindcss@3.4.17',
  originalConfigScriptSha256: canonical(originalScripts),
  themes: Object.fromEntries(Object.entries(themes).sort(([a], [b]) => a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)))
};
for (const [file, text] of pending) fs.writeFileSync(path.join(ROOT, file), text);
fs.writeFileSync(destination, JSON.stringify(man, null, 2) + '\n');
console.log(`Migrated ${pending.length} pages/templates into ${Object.keys(themes).length} separately compiled themes.`);
