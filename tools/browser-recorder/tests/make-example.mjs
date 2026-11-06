import {mkdir,writeFile} from 'node:fs/promises';
import {createState,appendObservation,exportPack,checkpoint} from '../extension/lib/core.mjs';
let state=await createState();
for(const text of ['【合成データ】AIへの質問を保存する例です。','【合成データ】回答を保存する例です。実サービスの記録ではありません。'])
  state=await appendObservation(state,{origin:'https://example.test',text,captured_at:'2026-10-31T00:00:00.000Z'});
const pack=await exportPack(state);await mkdir('examples',{recursive:true});
await writeFile('examples/synthetic-pack.json',JSON.stringify(pack));
await writeFile('examples/synthetic-checkpoint.json',JSON.stringify(await checkpoint(pack)));
