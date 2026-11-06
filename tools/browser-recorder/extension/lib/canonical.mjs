// Adapted from VSO vap-spec verify_node.mjs at a2a9f6a25906db4be23e6ecd3796eab144d9ac99.
// CC BY 4.0. Changes: browser byte APIs, Unicode strings, 4 MiB input limit.
// This module implements our restricted local format, not the upstream demo contract.
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_DEPTH = 16;
function reject(message) { throw new Error(message); }
function printable(value, label) {
  if (typeof value !== 'string' || value.length > 32768 || !value.isWellFormed())
    reject(label + ': string must be well-formed Unicode, <=32768 UTF-16 units');
}
function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Encode the constrained JSON value domain independently of native object order.
 * Integer token spelling is additionally enforced by strictParse on file input.
 */
export function canonical(value) {
  function encode(current, depth) {
    if (depth > MAX_DEPTH) reject('JSON nesting exceeds 16');
    if (current === null) return 'null';
    if (typeof current === 'string') {
      printable(current, 'JSON string');
      return JSON.stringify(current);
    }
    if (typeof current === 'boolean') return current ? 'true' : 'false';
    if (typeof current === 'number') {
      if (!Number.isSafeInteger(current) || Object.is(current, -0)) {
        reject('JSON numbers must be safe integers, excluding negative zero');
      }
      return String(current);
    }
    if (Array.isArray(current)) {
      if (Reflect.ownKeys(current).length !== current.length + 1) {
        reject('JSON arrays cannot have missing or additional properties');
      }
      const values = [];
      for (let index = 0; index < current.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(current, String(index));
        if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
          reject('JSON arrays must contain ordinary values at every index');
        }
        values.push(encode(descriptor.value, depth + 1));
      }
      return '[' + values.join(',') + ']';
    }
    if (isPlainObject(current)) {
      const keys = Reflect.ownKeys(current);
      if (keys.some((key) => typeof key !== 'string')) reject('JSON object keys must be strings');
      keys.sort();
      const members = [];
      for (const key of keys) {
        printable(key, 'JSON object key');
        const descriptor = Object.getOwnPropertyDescriptor(current, key);
        if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
          reject('JSON objects must contain ordinary enumerable values');
        }
        members.push(JSON.stringify(key) + ':' + encode(descriptor.value, depth + 1));
      }
      return '{' + members.join(',') + '}';
    }
    reject('unsupported JSON value type');
  }
  return new TextEncoder().encode(encode(value, 0));
}

/**
 * Parse JSON while retaining enough lexical information to reject duplicate keys,
 * fractional/exponent forms, unsafe integers and negative zero before coercion.
 */
export function strictParse(text) {
  if (typeof text !== 'string') reject('JSON input must be text');
  if (new TextEncoder().encode(text).length > MAX_BYTES) reject('JSON input exceeds 2 MiB');
  if (text.charCodeAt(0) === 0xfeff) reject('UTF-8 BOM is not permitted');
  let offset = 0;

  function syntax(message) {
    reject(message + ' at character ' + offset);
  }

  function whitespace() {
    while (offset < text.length &&
           (text[offset] === ' ' || text[offset] === '\n' ||
            text[offset] === '\r' || text[offset] === '\t')) {
      offset += 1;
    }
  }

  function stringValue() {
    if (text[offset] !== '"') syntax('expected JSON string');
    const beginning = offset;
    offset += 1;
    while (offset < text.length) {
      const character = text[offset];
      offset += 1;
      if (character === '"') {
        let result;
        try {
          // The enclosing parser handles object membership and duplicates.
          // Native JSON parsing is used only for one isolated string token.
          result = JSON.parse(text.slice(beginning, offset));
        } catch {
          syntax('invalid JSON string escape or control character');
        }
        printable(result, 'JSON string');
        return result;
      }
      if (character === '\\') offset += 1;
    }
    syntax('unterminated JSON string');
  }

  function numberValue() {
    const beginning = offset;
    if (text[offset] === '-') offset += 1;
    if (text[offset] === '0') {
      offset += 1;
      if (/[0-9]/.test(text[offset] || '')) syntax('leading zero is not permitted');
    } else {
      if (!/[1-9]/.test(text[offset] || '')) syntax('expected integer digits');
      while (/[0-9]/.test(text[offset] || '')) offset += 1;
    }
    if (text[offset] === '.' || text[offset] === 'e' || text[offset] === 'E') {
      syntax('fractional and exponent number tokens are not permitted');
    }
    const token = text.slice(beginning, offset);
    if (token === '-0') syntax('negative zero is not permitted');
    const result = Number(token);
    if (!Number.isSafeInteger(result)) syntax('integer is outside the safe range');
    return result;
  }

  function value(depth) {
    whitespace();
    if (depth > MAX_DEPTH) syntax('JSON nesting exceeds 16');
    const character = text[offset];
    if (character === '"') return stringValue();
    if (character === '{') {
      offset += 1;
      whitespace();
      const object = Object.create(null);
      const seen = new Set();
      if (text[offset] === '}') {
        offset += 1;
        return object;
      }
      while (true) {
        whitespace();
        const key = stringValue();
        if (seen.has(key)) syntax('duplicate JSON object key');
        seen.add(key);
        whitespace();
        if (text[offset] !== ':') syntax('expected colon');
        offset += 1;
        object[key] = value(depth + 1);
        whitespace();
        if (text[offset] === '}') {
          offset += 1;
          return object;
        }
        if (text[offset] !== ',') syntax('expected comma or closing brace');
        offset += 1;
      }
    }
    if (character === '[') {
      offset += 1;
      whitespace();
      const array = [];
      if (text[offset] === ']') {
        offset += 1;
        return array;
      }
      while (true) {
        array.push(value(depth + 1));
        whitespace();
        if (text[offset] === ']') {
          offset += 1;
          return array;
        }
        if (text[offset] !== ',') syntax('expected comma or closing bracket');
        offset += 1;
      }
    }
    for (const [token, result] of [['true', true], ['false', false], ['null', null]]) {
      if (text.startsWith(token, offset)) {
        offset += token.length;
        return result;
      }
    }
    if (character === '-' || /[0-9]/.test(character || '')) return numberValue();
    syntax('expected JSON value');
  }

  const result = value(0);
  whitespace();
  if (offset !== text.length) syntax('unexpected trailing input');
  return result;
}

