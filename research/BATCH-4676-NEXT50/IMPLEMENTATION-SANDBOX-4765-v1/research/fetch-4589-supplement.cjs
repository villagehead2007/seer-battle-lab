'use strict';
const fs=require('fs'),{createClient}=require('../wiki-client.cjs');
const file='research/4589-source-supplement.json',report=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{records:[],failures:[]};
const client=createClient(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(25000)});return {status:r.status,body:await r.json()};},{interval:5000,label:'4589-source'});
const wiki=new URL('https://wiki.biligame.com/seer/api.php');
for(const[k,v]of Object.entries({action:'query',format:'json',prop:'revisions',rvprop:'ids|timestamp|content',rvslots:'main',titles:'魂印:1797|魂印:1864|效果:989|效果:849|效果:1474|效果:1933|效果:983|效果:733|效果:717|技能:37039|技能:28554|技能:28400|技能:28782|曜焰万象·文森特'}))wiki.searchParams.set(k,v);
(async()=>{for(const url of ['https://api.seerapi.com/v1/eid_effect/2190','https://api.seerapi.com/v1/eid_effect/2259',wiki.href]){if(report.records.some(r=>r.url===url))continue;try{report.records.push({url,data:await client.request(url),loadedAt:new Date().toISOString()});console.log(url);}catch(e){report.failures.push({url,error:e.message,cause:e.cause?.code,at:new Date().toISOString()});process.exitCode=1;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}}})();
