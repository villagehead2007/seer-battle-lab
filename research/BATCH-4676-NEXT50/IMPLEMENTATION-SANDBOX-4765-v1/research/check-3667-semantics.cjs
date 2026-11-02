'use strict';
const fs=require('fs'),{createClient}=require('../wiki-client.cjs');
const file='research/3667-semantic-sources.json',report={checkedAt:new Date().toISOString(),records:[],failures:[]};
const client=createClient(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{Accept:'application/json','User-Agent':'SeerBattleLab/0.8 (personal battle simulator; read-only data client)'}});let body;try{body=await r.json();}catch(e){throw Error(`HTTP ${r.status}: JSON parse failed: ${e.message}`);}return {status:r.status,body,retryAfter:r.headers.get('retry-after')};},{interval:5000,label:'Source semantics'});
async function get(url){try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),data});return data;}catch(e){report.failures.push({url,error:e.message,cause:e.cause?.message});throw e;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}}
(async()=>{for(const id of [0,2,9]){const d=await get('https://api.seerapi.com/v1/skill_effect_param/'+id);console.log('param',id,JSON.stringify(d));}
const base='https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=';
const data=await get(base+encodeURIComponent('技能:28684|技能效果:2074|效果:2074|对战机制'));
for(const page of Object.values(data.query.pages))console.log(page.title,'revision',page.revisions?.[0]?.revid,'missing',page.missing??false);
const search=await get('https://wiki.biligame.com/seer/api.php?action=query&format=json&list=search&srsearch='+encodeURIComponent('非限制类异常')+'&srlimit=10');console.log(JSON.stringify(search));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
