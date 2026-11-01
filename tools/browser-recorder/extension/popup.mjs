import { captureSelection } from './lib/capture.mjs';
import { saveObservation } from './lib/store.mjs';
const $=id=>document.getElementById(id);let draft=null;
function status(s,error=false){$('status').textContent=s;$('status').className=error?'error':'status';}
$('consent').addEventListener('change',()=>{$('save').disabled=!$('consent').checked||!draft;});
$('capture').addEventListener('click',async()=>{
  draft=null;$('draft').hidden=true;$('save').disabled=true;$('consent').checked=false;$('capture').disabled=true;
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab||tab.incognito)throw Error('通常ウィンドウのHTTP/HTTPSページで使用してください。');
    const results=await chrome.scripting.executeScript({target:{tabId:tab.id},world:'ISOLATED',func:captureSelection,args:[{structuredResult:true}]});
    const result=results[0]?.result;
    if(result?.ok===false)throw Error(result.error);
    if(result?.ok!==true||!result.observation)throw Error('選択範囲を読み取れません。ページを確認してください。');
    draft={...result.observation,captured_at:new Date().toISOString()};
    $('origin').textContent=draft.origin;$('preview').textContent=draft.text;$('size').textContent=new TextEncoder().encode(draft.text).length+' bytes';$('draft').hidden=false;
    status('保存前に、本文に機密情報が含まれていないか確認してください。');
  }catch(e){status(e.message,true);}finally{$('capture').disabled=false;}
});
$('save').addEventListener('click',async()=>{
  if(!draft||!$('consent').checked)return;
  $('save').disabled=true;$('capture').disabled=true;
  try{const state=await saveObservation(draft);draft=null;$('draft').hidden=true;status('保存しました。記録庫に '+state.events.length+' 件あります。');}
  catch(e){status(e.message,true);$('save').disabled=false;}
  finally{$('capture').disabled=false;}
});
$('vault').addEventListener('click',()=>chrome.runtime.openOptionsPage());
