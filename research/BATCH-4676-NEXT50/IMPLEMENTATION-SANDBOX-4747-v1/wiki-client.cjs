'use strict';
// In-memory cache and per-origin circuit breaker. No cookies or disk data store.
function createClient(transport,{now=Date.now,sleep=ms=>new Promise(r=>setTimeout(r,ms)),interval=2500,ttl=1800000,capacity=160,label='Wiki'}={}){
 const cache=new Map(),inflight=new Map();let tail=Promise.resolve(),nextAt=0,blockedUntil=0,lastStatus=null;
 function cooldown(){const error=new Error(`${label} 请求已暂停，请在 ${Math.ceil((blockedUntil-now())/1000)} 秒后重试。`);error.status=503;error.retryAfter=Math.max(1,Math.ceil((blockedUntil-now())/1000));return error;}
 function retrySeconds(value){if(/^\d+$/.test(String(value??'')))return Number(value);const date=Date.parse(value);return Number.isFinite(date)?Math.max(0,Math.ceil((date-now())/1000)):0;}
 async function run(key){if(now()<blockedUntil)throw cooldown();await sleep(Math.max(0,nextAt-now()));if(now()<blockedUntil)throw cooldown();let response;try{response=await transport(key);}finally{nextAt=now()+interval;}
 const {status,body,retryAfter}=response;lastStatus=status;
 if(status!==200||body?.error){const code=body?.error?.code,limited=[403,429,567].includes(status),busy=[502,503,504].includes(status)||['maxlag','ratelimited'].includes(code);
  if(limited||busy){blockedUntil=now()+Math.max(retrySeconds(retryAfter),status===403?1800:limited?900:60)*1000;throw cooldown();}
  throw new Error(`${label} 返回 HTTP ${status}${code?'，API '+code:''}，未使用该数据。`);
 }
 if(!body||typeof body!=='object')throw new Error(label+' 响应不完整');if(cache.size>=capacity)cache.delete(cache.keys().next().value);cache.set(key,{time:now(),data:body});return body;
 }
 function request(key){const hit=cache.get(key);if(hit&&now()-hit.time<ttl)return Promise.resolve(hit.data);if(inflight.has(key))return inflight.get(key);if(now()<blockedUntil)return Promise.reject(cooldown());if(inflight.size>=12)return Promise.reject(new Error('请求队列已满，请稍后再试。'));const task=tail.then(()=>run(key));tail=task.catch(()=>{});inflight.set(key,task);task.then(()=>inflight.delete(key),()=>inflight.delete(key));return task;}
 return {request,status:()=>({paused:now()<blockedUntil,retryAfter:Math.max(0,Math.ceil((blockedUntil-now())/1000)),lastStatus,cacheEntries:cache.size,pending:inflight.size,intervalMs:interval,cacheMinutes:ttl/60000})};
}
module.exports={createClient};
