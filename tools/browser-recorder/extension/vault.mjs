import {getState,getPack,resetVault} from './lib/store.mjs';
import {checkpoint,verifyPack,strictParse,sha256,decode64,LIMIT,FORMAT,exact} from './lib/core.mjs';
const $=id=>document.getElementById(id);let exportedCheckpoint=null;
function download(name,object){const url=URL.createObjectURL(new Blob([JSON.stringify(object)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function refresh(){
  const state=await getState();$('count').textContent=state?.events.length??0;$('records').replaceChildren();
  $('fingerprint').textContent=state?await sha256(decode64(state.public_key,32)):'まだ記録がありません。';
  for(const e of (state?.events??[]).slice(-10).reverse()){
    const li=document.createElement('li');const title=document.createElement('strong');title.textContent='#'+e.body.sequence+' · '+e.body.origin;
    const date=document.createElement('small');date.textContent=e.body.captured_at+' / 端末時刻';
    const snippet=document.createElement('p');snippet.textContent=e.body.text.slice(0,160);li.append(title,date,snippet);$('records').append(li);
  }
}
$('export').addEventListener('click',async()=>{
  $('export').disabled=true;
  try{const pack=await getPack();exportedCheckpoint=await checkpoint(pack);download('vap-observations-'+pack.manifest.ledger_id+'.json',pack);$('checkpoint').disabled=false;$('export-status').textContent='ダウンロードを開始しました。続けて同じ記録の照合票を保存できます。';await refresh();}
  catch(e){$('export-status').textContent=e.message;}
  finally{$('export').disabled=false;}
});
$('checkpoint').addEventListener('click',()=>{if(exportedCheckpoint)download('vap-checkpoint-'+exportedCheckpoint.ledger_id+'.json',exportedCheckpoint);});
async function readJSON(file){if(!file)throw Error('記録JSONを選択してください。');if(file.size>LIMIT)throw Error('ファイルは4 MiB以下にしてください。');const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await file.arrayBuffer());return strictParse(text);}
$('verify').addEventListener('click',async()=>{
  $('verify').disabled=true;$('verify-result').textContent='検証中…';
  try{
    const pack=await readJSON($('pack-file').files[0]);const pinFile=$('pin-file').files[0];let pins={};
    if(pinFile){const pin=await readJSON(pinFile);exact(pin,['format','ledger_id','event_count','key_fingerprint','pack_digest'],'checkpoint');if(pin.format!==FORMAT+'-checkpoint'||pin.ledger_id!==pack.manifest?.ledger_id||pin.event_count!==pack.events?.length)throw Error('照合票の記録ID・件数が一致しません。');if(!/^[0-9a-f]{64}$/.test(pin.key_fingerprint)||!/^[0-9a-f]{64}$/.test(pin.pack_digest))throw Error('照合票のハッシュ形式が不正です。');pins=pin;}
    const result=await verifyPack(pack,pins);
    $('verify-result').textContent='整合性チェック：一致\n'+result.event_count+' 件 / 署名・順序・本文ハッシュ・Merkleルート\n'+(result.key_pin_matched?'別途指定した照合票：鍵・記録全体とも一致':'鍵の信頼：未確認（ファイル内の鍵のみ使用）')+'\n\n外部アンカー：未確立\nAI提供者の出所：未確立\n会話全体の完全性：未確立\n信頼できる時刻：未確立\nVAP準拠：未確立';
  }catch(e){$('verify-result').textContent='検証不成立\n'+e.message;}
  finally{$('verify').disabled=false;}
});
$('reset-confirm').addEventListener('change',()=>{$('reset').disabled=!$('reset-confirm').checked;});
$('reset').addEventListener('click',async()=>{if(!$('reset-confirm').checked)return;$('reset').disabled=true;try{await resetVault();exportedCheckpoint=null;$('checkpoint').disabled=true;$('reset-confirm').checked=false;$('export-status').textContent='新しい記録庫を作成しました。';await refresh();}catch(e){$('export-status').textContent=e.message;$('reset').disabled=false;}});
refresh().catch(e=>{$('export-status').textContent=e.message;});
