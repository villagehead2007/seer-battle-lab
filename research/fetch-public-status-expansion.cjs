'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),{createClient}=require('../wiki-client.cjs');
const file='research/public-status-expansion-sources.json',report=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{startedAt:new Date().toISOString(),records:[],failures:[]};
const client=createClient(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{Accept:'application/json','User-Agent':'SeerBattleLab/0.8 (read-only source research)'}});let body;try{body=await r.json();}catch(e){throw Error(`HTTP ${r.status}; JSON: ${e.message}`);}return {status:r.status,body,retryAfter:r.headers.get('retry-after')};},{interval:5000,label:'Public status research'});
const wiki='https://wiki.biligame.com/seer/api.php?action=query&format=json&',urls=[
 ...['skill_effect_type/1348','skill_effect_param/1','soulmark/1935','eid_effect/2348'].map(p=>'https://api.seerapi.com/v1/'+p),
 wiki+'prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles='+encodeURIComponent('对战机制|效果:1348|睡眠|山神守护|异常状态|魂印:1935'),
 ...['"睡眠" "回合"','"山神守护"','"吸取" "PP值"','"随机异常"'].map(q=>wiki+'list=search&srlimit=20&srsearch='+encodeURIComponent(q))
];
(async()=>{for(const url of urls){if(report.records.some(r=>r.url===url))continue;try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),sha256:crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),data});console.log(url, data.hash??Object.values(data.query?.pages??{}).map(p=>({title:p.title,revision:p.revisions?.[0]?.revid,missing:p.missing})),data.query?.search?.map(p=>p.title));}catch(e){report.failures.push({url,error:e.message,cause:e.cause?.message,code:e.cause?.code,at:new Date().toISOString()});throw e;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}}})().catch(e=>{console.error(e.message);process.exitCode=1;});
