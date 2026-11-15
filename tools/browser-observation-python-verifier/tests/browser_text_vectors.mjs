// Test-only producer. The standalone Python verifier never invokes this code.
// Use the actual checked-out Recorder implementation, not a second JS verifier.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  FORMAT, appendObservation, bytes64, canonical, checkpoint, createState,
  digest, exportPack, merkleRoot, validateObservation, verifyPack,
} from '../../browser-recorder/extension/lib/core.mjs';

const vectors = JSON.parse(await readFile(
  new URL('../fixtures/text-validation-vectors.json', import.meta.url), 'utf8'));
assert.equal(vectors.format, 'browser-observation-text-vectors/1');
assert.equal(new Set(vectors.cases.map(row => row.id)).size, vectors.cases.length);
const rows = [];

for (const vector of vectors.cases) {
  const draft = {
    origin: 'https://example.test', text: vector.text,
    captured_at: '2026-11-06T00:00:00.000Z',
  };
  let accepted = true;
  try { validateObservation(draft); } catch { accepted = false; }
  assert.equal(accepted, vector.accepted, vector.id + ': browser validation');

  const state = await appendObservation(await createState(), {
    ...draft, text: accepted ? vector.text : 'synthetic signing control',
  });
  const pack = await exportPack(state);
  if (!accepted) {
    // Produce correctly signed invalid text, so rejection cannot be attributed
    // to a stale hash or broken signature. Normal append/export reject it.
    const sign = async (kind, value) => {
      const prefix = new TextEncoder().encode(FORMAT + '\n' + kind + '\n');
      const body = canonical(value);
      const message = new Uint8Array(prefix.length + body.length);
      message.set(prefix); message.set(body, prefix.length);
      return bytes64(await crypto.subtle.sign('Ed25519', state.keys.privateKey, message));
    };
    const body = { ...pack.events[0].body, text: vector.text };
    const unsigned = { body, event_hash: await digest(body) };
    pack.events = [{ ...unsigned, signature: await sign('event', unsigned) }];
    pack.manifest.head_hash = unsigned.event_hash;
    pack.manifest.merkle_root = await merkleRoot(pack.events);
    pack.signature = await sign('manifest', pack.manifest);
  }
  const pin = await checkpoint(pack);
  let result = null, error = null;
  try { result = await verifyPack(pack, pin); }
  catch (failure) { error = failure.message; }
  if (accepted) assert.equal(result?.verdict, 'INTEGRITY_OK', vector.id);
  else assert.equal(error, 'Select 1–32768 UTF-8 bytes of text', vector.id);
  rows.push({
    id: vector.id, accepted, pack, pin, result, error,
    canonical_hex: Buffer.from(canonical(pack)).toString('hex'),
  });
}
process.stdout.write(JSON.stringify(rows));
