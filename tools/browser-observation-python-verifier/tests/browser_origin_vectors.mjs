// Test-only producer using the checked-out Recorder, never invoked at runtime.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  FORMAT, appendObservation, bytes64, canonical, checkpoint, createState,
  digest, exportPack, merkleRoot, validateObservation, verifyPack,
} from '../../browser-recorder/extension/lib/core.mjs';

const vectors = JSON.parse(await readFile(
  new URL('../fixtures/origin-validation-vectors.json', import.meta.url), 'utf8'));
assert.equal(vectors.format, 'browser-observation-origin-vectors/1');
assert.equal(new Set(vectors.cases.map(row => row.id)).size, vectors.cases.length);
const rows = [];
for (const vector of vectors.cases) {
  const draft = {
    origin: vector.origin, text: 'Synthetic origin validation control',
    captured_at: '2026-11-15T00:00:00.000Z',
  };
  let accepted = true;
  try { validateObservation(draft); } catch { accepted = false; }
  assert.equal(accepted, vector.accepted, vector.id + ': browser validation');
  const state = await appendObservation(await createState(), {
    ...draft, origin: accepted ? vector.origin : 'https://example.test',
  });
  const pack = await exportPack(state);
  if (!accepted) {
    // Re-sign with a real private key and repair every derived commitment.
    // Rejection must concern the origin, not a stale signature/hash/checkpoint.
    const sign = async (kind, value) => {
      const prefix = new TextEncoder().encode(FORMAT + '\n' + kind + '\n');
      const body = canonical(value);
      const message = new Uint8Array(prefix.length + body.length);
      message.set(prefix); message.set(body, prefix.length);
      return bytes64(await crypto.subtle.sign('Ed25519', state.keys.privateKey, message));
    };
    const body = { ...pack.events[0].body, origin: vector.origin };
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
  else assert.ok(error, vector.id + ': signed pack must be rejected by Recorder');
  rows.push({
    id: vector.id, accepted, pack, pin, result, error,
    canonical_hex: Buffer.from(canonical(pack)).toString('hex'),
  });
}
process.stdout.write(JSON.stringify(rows));
