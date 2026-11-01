import { canonical, strictParse } from './canonical.mjs';
export { canonical, strictParse };
export const FORMAT = 'vap-browser-observation/0.1.0';
export const POLICY = 'org.veritaschain.experimental.browser-selected-text.v1';
export const LIMIT = 4 * 1024 * 1024;
const enc = new TextEncoder();
const hex = bytes => Array.from(new Uint8Array(bytes), v => v.toString(16).padStart(2, '0')).join('');
export const bytes64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
export function decode64(value, length) {
  if (typeof value !== 'string' || value.length > 128) throw Error('Invalid base64');
  let bytes; try { bytes = Uint8Array.from(atob(value), c => c.charCodeAt(0)); } catch { throw Error('Invalid base64'); }
  if (bytes.length !== length || bytes64(bytes) !== value) throw Error('Noncanonical base64 / wrong length');
  return bytes;
}
export const sha256 = async bytes => hex(await crypto.subtle.digest('SHA-256', bytes));
export const digest = async value => sha256(canonical(value));
const join = (...arrays) => { const out = new Uint8Array(arrays.reduce((n,a) => n+a.length,0)); let i=0; for(const a of arrays){out.set(a,i);i+=a.length;} return out; };
const domain = (kind, value) => join(enc.encode(FORMAT + '\n' + kind + '\n'), canonical(value));
export async function merkleRoot(events) {
  async function tree(items) {
    if (!items.length) return new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array()));
    if (items.length === 1) return new Uint8Array(await crypto.subtle.digest('SHA-256', join(new Uint8Array([0]), canonical(items[0]))));
    let k=1; while(k*2<items.length) k*=2;
    return new Uint8Array(await crypto.subtle.digest('SHA-256', join(new Uint8Array([1]), await tree(items.slice(0,k)), await tree(items.slice(k)))));
  }
  return hex(await tree(events));
}
export function exact(value, fields, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== fields.length || Object.keys(value).some(k=>!fields.includes(k))) throw Error('Unsupported fields: '+label);
}
const eq=(a,b,label)=>{if(a!==b)throw Error('Mismatch: '+label);};
const uuid = value => {if(typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value)) throw Error('Invalid UUID');};
const hash = value => {if(typeof value!=='string'|| !/^[0-9a-f]{64}$/.test(value)) throw Error('Invalid hash');};
function timestamp(value) {
  if(typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString()!==value) throw Error('Invalid local timestamp');
}
function origin(value) {
  if(typeof value !== 'string' || value.length>2048) throw Error('Invalid origin');
  const u=new URL(value); if(!['http:','https:'].includes(u.protocol)||u.origin!==value) throw Error('Origin must not include path, credentials or query');
}
export function validateObservation(draft) {
  exact(draft,['origin','text','captured_at'],'draft'); origin(draft.origin); timestamp(draft.captured_at);
  if(typeof draft.text!=='string'||!draft.text.trim()||!draft.text.isWellFormed()||enc.encode(draft.text).length>32768) throw Error('Select 1–32768 UTF-8 bytes of text');
}
export async function createState() {
  const keys=await crypto.subtle.generateKey({name:'Ed25519'},false,['sign','verify']);
  return {ledger_id:crypto.randomUUID(), keys, public_key:bytes64(await crypto.subtle.exportKey('raw',keys.publicKey)), events:[]};
}
export async function appendObservation(state, draft) {
  validateObservation(draft);
  if(state.events.length>=500)throw Error('500件に達しました。書き出して新しい記録庫を作成してください。');
  const body={format:FORMAT,policy_id:POLICY,ledger_id:state.ledger_id,event_id:crypto.randomUUID(),sequence:state.events.length+1,previous_hash:state.events.at(-1)?.event_hash??null,kind:'USER_SELECTED_DOM_TEXT',origin:draft.origin,text:draft.text,captured_at:draft.captured_at};
  const event_hash=await digest(body);
  const unsigned={body,event_hash};
  const event={...unsigned,signature:bytes64(await crypto.subtle.sign('Ed25519',state.keys.privateKey,domain('event',unsigned)))};
  const next={...state,events:[...state.events,event]};
  if(canonical(next.events).length>LIMIT-16384)throw Error('容量上限です。書き出して新しい記録庫を作成してください。');
  return next;
}
export async function exportPack(state) {
  if(!state.events.length)throw Error('保存された記録がありません。');
  const manifest={format:FORMAT,policy_id:POLICY,canonicalization:'BROWSER-UNICODE-SAFEINT-JSON-v1',hash_algorithm:'SHA-256',signature_algorithm:'Ed25519',merkle_algorithm:'RFC6962-SHA256',ledger_id:state.ledger_id,public_key:state.public_key,event_count:state.events.length,first_event_id:state.events[0].body.event_id,last_event_id:state.events.at(-1).body.event_id,head_hash:state.events.at(-1).event_hash,merkle_root:await merkleRoot(state.events),coverage:'USER_SELECTED_TEXT_ONLY',clock:'LOCAL_UNTRUSTED',external_anchor:'NONE',provider_attestation:'NONE'};
  const pack={manifest,events:state.events,signature:bytes64(await crypto.subtle.sign('Ed25519',state.keys.privateKey,domain('manifest',manifest)))};
  await verifyPack(pack);
  return pack;
}
export async function checkpoint(pack) {
  return {format:FORMAT+'-checkpoint',ledger_id:pack.manifest.ledger_id,event_count:pack.events.length,key_fingerprint:await sha256(decode64(pack.manifest.public_key,32)),pack_digest:await digest(pack)};
}
export async function verifyPack(pack, pins={}) {
  // Reject schema ambiguity before crypto. Embedded key verification is NOT trust establishment.
  if(canonical(pack).length>LIMIT)throw Error('Pack exceeds 4 MiB');
  exact(pack,['manifest','events','signature'],'pack');
  const m=pack.manifest;
  exact(m,['format','policy_id','canonicalization','hash_algorithm','signature_algorithm','merkle_algorithm','ledger_id','public_key','event_count','first_event_id','last_event_id','head_hash','merkle_root','coverage','clock','external_anchor','provider_attestation'],'manifest');
  for(const [field,value] of Object.entries({format:FORMAT,policy_id:POLICY,canonicalization:'BROWSER-UNICODE-SAFEINT-JSON-v1',hash_algorithm:'SHA-256',signature_algorithm:'Ed25519',merkle_algorithm:'RFC6962-SHA256',coverage:'USER_SELECTED_TEXT_ONLY',clock:'LOCAL_UNTRUSTED',external_anchor:'NONE',provider_attestation:'NONE'}))eq(m[field],value,field);
  uuid(m.ledger_id); uuid(m.first_event_id);uuid(m.last_event_id);hash(m.head_hash);hash(m.merkle_root);
  if(!Number.isSafeInteger(m.event_count)||m.event_count<1||m.event_count>500||!Array.isArray(pack.events))throw Error('Invalid event count');
  eq(m.event_count,pack.events.length,'event count');
  const keyBytes=decode64(m.public_key,32); const fingerprint=await sha256(keyBytes);
  if(pins.key_fingerprint){hash(pins.key_fingerprint);eq(fingerprint,pins.key_fingerprint,'pinned key');}
  const key=await crypto.subtle.importKey('raw',keyBytes,'Ed25519',false,['verify']);
  if(!await crypto.subtle.verify('Ed25519',key,decode64(pack.signature,64),domain('manifest',m)))throw Error('Invalid manifest signature');
  let previous=null; const ids=new Set();
  for(let i=0;i<pack.events.length;i++){
    const e=pack.events[i];exact(e,['body','event_hash','signature'],'event'); const b=e.body;
    exact(b,['format','policy_id','ledger_id','event_id','sequence','previous_hash','kind','origin','text','captured_at'],'event body');
    eq(b.format,FORMAT,'event format');eq(b.policy_id,POLICY,'policy');eq(b.ledger_id,m.ledger_id,'ledger');eq(b.kind,'USER_SELECTED_DOM_TEXT','kind');
    uuid(b.event_id);if(ids.has(b.event_id))throw Error('Duplicate event ID');ids.add(b.event_id);
    eq(b.sequence,i+1,'sequence');eq(b.previous_hash,previous,'previous hash');hash(e.event_hash);
    validateObservation({origin:b.origin,text:b.text,captured_at:b.captured_at});
    eq(await digest(b),e.event_hash,'event hash');
    if(!await crypto.subtle.verify('Ed25519',key,decode64(e.signature,64),domain('event',{body:b,event_hash:e.event_hash})))throw Error('Invalid event signature');
    previous=e.event_hash;
  }
  eq(m.head_hash,previous,'head hash');eq(m.first_event_id,pack.events[0].body.event_id,'first event');eq(m.last_event_id,pack.events.at(-1).body.event_id,'last event');
  eq(m.merkle_root,await merkleRoot(pack.events),'Merkle root');
  const packDigest=await digest(pack);
  if(pins.pack_digest){hash(pins.pack_digest);eq(packDigest,pins.pack_digest,'pinned pack digest');}
  return {verdict:'INTEGRITY_OK',event_count:pack.events.length,key_fingerprint:fingerprint,pack_digest:packDigest,key_pin_matched:!!pins.key_fingerprint,pack_pin_matched:!!pins.pack_digest,external_anchor:'NOT_ESTABLISHED',provider_identity:'NOT_ESTABLISHED',source_completeness:'NOT_ESTABLISHED',trusted_time:'NOT_ESTABLISHED',vap_conformance:'NOT_ESTABLISHED'};
}
