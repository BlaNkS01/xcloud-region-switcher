(() => {
  if (window.__xcrInstalled) return;
  Object.defineProperty(window, '__xcrInstalled', {value:true});
  const KEY='__xcr_bridge_v2';
  let config={region:'nearest',bypass:false};
  const originalFetch=window.fetch;
  // A region is reported as confirmed only if the session response explicitly identifies it.
  const sessionUrl=url=>/^https:\/\/xgpuweb(?:f2p)?\.gssv-play-prod\.xboxlive\.com\/v\d+\/sessions\//i.test(url);
  const observeSession=async (url,response)=>{
    if(!sessionUrl(url)||!response.ok)return;
    try{
      const data=await response.clone().json();
      // Do not guess from IP addresses, hostnames or the preferred region.
      const region=data?.serverRegion || data?.streamingRegion || data?.regionName || data?.session?.serverRegion;
      if(typeof region==='string' && region.length>1 && region.length<80)
        emit('actual',{name:region,source:'xCloud session response'});
    }catch(_){}
  };
  const isLogin=url => /^https:\/\/xgpuweb(?:f2p)?\.gssv-play-prod\.xboxlive\.com\/v2\/login\/user(?:[?#]|$)/i.test(url);
  const coordinates={
    'polandcentral':[52.23,21.01], 'poland':[52.23,21.01],
    'germanywestcentral':[50.11,8.68], 'germany':[50.11,8.68],
    'westeurope':[52.37,4.90], 'northeurope':[53.35,-6.26],
    'francecentral':[46.6,2.2], 'uksouth':[51.51,-0.13],
    'ukwest':[53.48,-2.24], 'swedencentral':[60.67,17.14],
    'norwayeast':[59.91,10.75], 'italynorth':[45.46,9.19],
    'spaincentral':[40.42,-3.70], 'switzerlandnorth':[47.38,8.54],
    'austriaeast':[48.21,16.37], 'belgiumcentral':[50.85,4.35],
    'finlandcentral':[60.17,24.94], 'denmarkeast':[55.68,12.57]
  };
  const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const nearest=regions=>{
    // Fixed Central European reference point; no location permission or tracking.
    const rad=Math.PI/180, a=48.21*rad, b=16.37*rad;
    const ranked=regions.map(r=>{
      const name=normalize(r.name);
      const key=Object.keys(coordinates).find(k=>name===k || name.startsWith(k) || name.includes(k));
      if(!key)return null;
      const [lat,lon]=coordinates[key];
      const c=lat*rad, d=lon*rad;
      const h=Math.sin((c-a)/2)**2+Math.cos(a)*Math.cos(c)*Math.sin((d-b)/2)**2;
      return {region:r,distance:6371*2*Math.asin(Math.sqrt(h))};
    }).filter(Boolean).sort((x,y)=>x.distance-y.distance);
    return ranked[0]?.region||null;
  };
  // Measure only region-specific Xbox endpoints explicitly supplied by Xbox.
  // No third-party hosts, no speculative region IPs, no gameplay-time polling.
  const endpointFor = r => {
    for (const key of ['baseUri','baseUrl','endpoint','url','serviceUrl']) {
      if (typeof r[key] !== 'string') continue;
      try {
        const u = new URL(r[key]);
        if (u.protocol === 'https:' && /(?:^|\.)xboxlive\.com$/i.test(u.hostname)) return u.origin + '/';
      } catch (_) {}
    }
    return null;
  };
  const probe = async url => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const start = performance.now();
    try {
      // HEAD avoids downloading response bodies. Failed/CORS-blocked probes
      // are ignored rather than interpreted as slow servers.
      await Reflect.apply(originalFetch, window, [url, {method:'HEAD',mode:'cors',credentials:'omit',cache:'no-store',signal:controller.signal}]);
      return Math.round(performance.now()-start);
    } catch (_) {return null;}
    finally {clearTimeout(timeout);}
  };
  const bestMeasured = async regions => {
    const candidates = regions.map(r=>({r,url:endpointFor(r)})).filter(x=>x.url).slice(0,6);
    if(candidates.length<2)return null;
    const values=await Promise.all(candidates.map(async x=>({r:x.r,ms:await probe(x.url)})));
    const good=values.filter(x=>x.ms!==null).sort((a,b)=>a.ms-b.ms);
    if(good.length<2)return null;
    return good[0];
  };
  const emit=(type,value)=>window.postMessage({channel:KEY,type,value},location.origin);
  window.addEventListener('message',e=>{
    if(e.source!==window||e.origin!==location.origin||e.data?.channel!==KEY||e.data.type!=='config')return;
    const c=e.data.value||{};
    config={region:typeof c.region==='string'?c.region:'nearest',bypass:c.bypass===true};
  });
  emit('ready',null);
  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:input instanceof URL?input.href:input?.url||'';
    if(!isLogin(url)){const res=await Reflect.apply(originalFetch,this,arguments);if(sessionUrl(url))void observeSession(url,res);return res;}
    let response;
    if(config.bypass){
      try {
        const request=new Request(input,init);
        const headers=new Headers(request.headers);
        headers.set('X-Forwarded-For','20.82.0.1');
        response=await Reflect.apply(originalFetch,this,[new Request(request,{headers})]);
      } catch (_) { response=await Reflect.apply(originalFetch,this,arguments); }
    } else response=await Reflect.apply(originalFetch,this,arguments);
    if(!response.ok)return response;
    try{
      const data=await response.clone().json();
      const regions=data?.offeringSettings?.regions;
      if(!Array.isArray(regions)||!regions.length)return response;
      const available=regions.filter(r=>r&&typeof r.name==='string');
      emit('regions',available.map(r=>({name:r.name,default:r.isDefault===true})));
      let measurement=null;
      if(config.region==='latency')measurement=await bestMeasured(available);
      const selected=config.region==='nearest'?nearest(available):
        config.region==='latency'?(measurement?.r||nearest(available)):
        config.region==='auto'?null:available.find(r=>r.name===config.region);
      if(!selected){
        emit('selection',{name:available.find(r=>r.isDefault)?.name||'',mode:config.region,applied:false,reason:(config.region==='nearest'||config.region==='latency')?'No measurable or recognized regions; Xbox chooses automatically.':'Xbox chooses automatically.'});
        return response;
      }
      emit('selection',{name:selected.name,mode:config.region,applied:true,reason:measurement?('Approximate HTTP response time: '+measurement.ms+' ms; not gameplay ping and does not confirm the actual server.'):(config.region==='latency'?'Test unavailable; selected by geographic distance from a Central European reference point.':'Preferred region based on geographic distance from a Central European reference point; not gameplay ping.')});
      const modified={...data,offeringSettings:{...data.offeringSettings,regions:[{...selected,isDefault:true,fallbackPriority:-1}]}};
      const headers=new Headers(response.headers);
      headers.delete('content-length');headers.delete('content-encoding');
      return new Response(JSON.stringify(modified),{status:response.status,statusText:response.statusText,headers});
    }catch(_){return response;}
  };
})();