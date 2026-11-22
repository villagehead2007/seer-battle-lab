(() => {
  if(location.hostname!=='127.0.0.1'||location.pathname==='/room')return;
  let presence;
  function connect(){if(!presence)presence=new EventSource('/api/launcher/page');}
  // Legacy servers still serve files from this directory but have no presence endpoint.
  fetch('/api/launcher/health').then(r=>r.json()).then(h=>{if(h.launcherControl===1){connect();window.addEventListener('pageshow',connect);}}).catch(()=>{});
  window.addEventListener('pagehide',()=>{presence?.close();presence=null;});
  const ticket=/^#launch=([a-f\d-]{36})$/.exec(location.hash)?.[1];
  if(!ticket)return;
  let sending=false;
  async function visible(){
    if(document.visibilityState!=='visible'||sending)return;
    sending=true;
    try{
      const r=await fetch('/api/launcher/visible',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticket})});
      if(r.ok){history.replaceState(null,'',location.pathname+location.search);document.removeEventListener('visibilitychange',visible);}
    }finally{sending=false;}
  }
  document.addEventListener('visibilitychange',visible);visible().catch(()=>{});
})();
