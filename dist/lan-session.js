'use strict';
(() => {
  if(location.pathname!=='/room')return;
  const invite=location.hash.slice(1);
  const session=sessionStorage.getItem('seat')||Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
  sessionStorage.setItem('seat',session);
  const nativeFetch=window.fetch.bind(window);
  window.lanConnected=(async()=>{
    if(invite){
      const response=await nativeFetch('/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({invite,session})});
      if(!response.ok)throw Error((await response.json()).error||'加入失败');
      history.replaceState(null,'',location.pathname+location.search);
    }
  })();
  window.fetch=async(input,init={})=>{
    if(typeof input==='string'&&/^\/(api\/local\/|command$|state$)/.test(input)){
      await window.lanConnected;
      return nativeFetch(input,{...init,headers:{...init.headers,'X-Room-Session':session}});
    }
    return nativeFetch(input,init);
  };
})();
