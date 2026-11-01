import {createState,appendObservation,exportPack} from './core.mjs';
const NAME='vap-browser-recorder-v01';
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore('vault');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function read(){const db=await openDB();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('vault','readonly');const r=tx.objectStore('vault').get('state');tx.oncomplete=()=>resolve(r.result??null);tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
async function write(state){const db=await openDB();try{await new Promise((resolve,reject)=>{const tx=db.transaction('vault','readwrite',{durability:'strict'});tx.objectStore('vault').put(state,'state');tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error??Error('Save aborted'));tx.onerror=()=>{};});}finally{db.close();}}
const locked=fn=>navigator.locks.request(NAME,fn);
export const getState=()=>locked(read);
export const saveObservation=draft=>locked(async()=>{const state=await read()??await createState();if(state.events.length)await exportPack(state);const next=await appendObservation(state,draft);await write(next);return next;});
export const getPack=()=>locked(async()=>{const state=await read();if(!state)throw Error('記録はまだありません。');return exportPack(state);});
export const resetVault=()=>locked(async()=>{const next=await createState();await write(next);});
