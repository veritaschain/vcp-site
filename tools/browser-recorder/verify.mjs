import fs from 'node:fs/promises';
import {verifyPack,strictParse,exact,FORMAT,LIMIT} from './extension/lib/core.mjs';
async function load(path){const s=await fs.stat(path);if(s.size>LIMIT)throw Error('Input exceeds 4 MiB');return strictParse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await fs.readFile(path)));}
try{
  const args=process.argv.slice(2);if(![1,3].includes(args.length)||(args.length===3&&args[1]!=='--checkpoint'))throw Error('Usage: node verify.mjs PACK.json [--checkpoint CHECKPOINT.json]');
  const pack=await load(args[0]);let pins={};
  if(args.length===3){pins=await load(args[2]);exact(pins,['format','ledger_id','event_count','key_fingerprint','pack_digest'],'checkpoint');if(pins.format!==FORMAT+'-checkpoint'||pins.ledger_id!==pack.manifest?.ledger_id||pins.event_count!==pack.events?.length||!/^([a-f0-9]{64})$/.test(pins.key_fingerprint)||!/^([a-f0-9]{64})$/.test(pins.pack_digest))throw Error('Invalid or mismatched checkpoint');}
  console.log(JSON.stringify(await verifyPack(pack,pins),null,2));
}catch(e){console.error(JSON.stringify({verdict:'NOT_VERIFIED',error:e.message}));process.exitCode=1;}
