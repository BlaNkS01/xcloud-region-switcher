const bypass=document.getElementById('bypass');
const region=document.getElementById('region'),status=document.getElementById('status'),hint=document.getElementById('hint');
chrome.storage.local.get({region:'nearest',bypass:false,regions:[],lastSeen:0,selection:null,selectionSeen:0,actual:null,actualSeen:0},s=>{
 bypass.checked=s.bypass;
 if(s.actual?.name){document.getElementById('actual').textContent=s.actual.name;document.getElementById('actualreason').textContent='Reported by Xbox · '+new Date(s.actualSeen).toLocaleString('en-GB');}
 for(const item of s.regions){if(!item||typeof item.name!=='string')continue;const o=document.createElement('option');o.value=item.name;o.textContent=item.name+(item.default?' (Xbox default)':'');region.append(o);}
 if(s.region!=='nearest'&&s.region!=='latency'&&s.region!=='auto'&&!Array.from(region.options).some(o=>o.value===s.region)){const o=document.createElement('option');o.value=s.region;o.textContent=s.region+' (currently unavailable)';region.append(o);}
 region.value=s.region;
 if(s.regions.length)hint.textContent='Regions detected during your most recent xCloud sign-in.';
 if(s.selection){document.getElementById('current').textContent=s.selection.name||'Xbox (region unknown)';document.getElementById('reason').textContent=(s.selection.applied?'Preferred region requested. ':'Xbox default selection. ')+(s.selection.reason||'')+(s.selectionSeen?' · '+new Date(s.selectionSeen).toLocaleString('en-GB'):'');}
});
document.getElementById('apply').addEventListener('click',()=>{
 chrome.storage.local.set({region:region.value,bypass:bypass.checked,selection:null,selectionSeen:0,actual:null,actualSeen:0},()=>{
  status.textContent='Settings saved successfully.';
  chrome.tabs.query({active:true,currentWindow:true},tabs=>{
   const t=tabs[0];if(t?.id&&/^https:\/\/(?:www\.)?xbox\.com\/|^https:\/\/play\.xbox\.com\//.test(t.url||''))chrome.tabs.reload(t.id);
   else status.textContent='Settings saved. Open or refresh xCloud.';
  });
 });
});