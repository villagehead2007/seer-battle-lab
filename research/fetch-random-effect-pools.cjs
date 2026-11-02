'use strict';
const fs=require('fs'),crypto=require('crypto'),{createClient}=require('../wiki-client.cjs');
const file='research/random-effect-pools-live-sources.json',report=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{startedAt:new Date().toISOString(),records:[],failures:[]};
const client=createClient(async url=>{const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{Accept:'application/json','User-Agent':'SeerBattleLab/0.8 (personal battle simulator; read-only research client)'}});const raw=await response.text();let body;try{body=JSON.parse(raw);}catch(e){throw Error(`HTTP ${response.status}: JSON parse failed: ${e.message}`);}return {status:response.status,body,retryAfter:response.headers.get('retry-after')};},{interval:5000,label:'Random pool research'});
async function get(url){if(report.records.some(x=>x.url===url))return;try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),sha256:crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),data});console.log(url,data.hash??'');}catch(e){report.failures.push({url,at:new Date().toISOString(),error:e.message,cause:e.cause?.message,code:e.cause?.code});throw e;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}}
(async()=>{for(const id of [0,1,2])await get('https://api.seerapi.com/v1/skill_effect_param/'+id);
for(const id of [163,176,451,851,1364,1975,2074,786,1332,1059,198,425,446,626,849])await get('https://api.seerapi.com/v1/skill_effect_type/'+id);
for(const id of [567,568,750,984,672])await get('https://api.seerapi.com/v1/soulmark/'+id);
const titles=['效果:2074','效果:786','效果:198','效果:451','效果:851','效果:1364','效果:1975','对战机制'];
await get('https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles='+encodeURIComponent(titles.join('|')));
await get('https://wiki.biligame.com/seer/api.php?action=query&format=json&list=search&srlimit=20&srsearch='+encodeURIComponent('"随机" "异常"'));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
