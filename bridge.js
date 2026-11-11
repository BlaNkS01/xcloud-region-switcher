(() => {
 const channel='__xcr_bridge_v2';
 const send=()=>chrome.storage.local.get({region:'nearest',bypass:false},v=>window.postMessage({channel,type:'config',value:v},location.origin));
 window.addEventListener('message',e=>{
  if(e.source!==window||e.origin!==location.origin||e.data?.channel!==channel)return;
  if(e.data.type==='ready')send();
  if(e.data.type==='regions'&&Array.isArray(e.data.value)){
   const safe=e.data.value.filter(x=>x&&typeof x.name==='string'&&x.name.length<80).slice(0,100);
   chrome.storage.local.set({regions:safe,lastSeen:Date.now()});
  }
  if(e.data.type==='actual'&&e.data.value&&typeof e.data.value.name==='string'){
   chrome.storage.local.set({actual:e.data.value,actualSeen:Date.now()});
  }
  if(e.data.type==='selection'&&e.data.value&&typeof e.data.value.name==='string'){
   chrome.storage.local.set({selection:e.data.value,selectionSeen:Date.now()});
  }
 });
 chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&(changes.region||changes.bypass))send();});
 send();
})();