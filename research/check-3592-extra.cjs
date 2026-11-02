'use strict';
const fs=require('node:fs'),{createClient}=require('../wiki-client.cjs');
const client=createClient(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(25000)});return {status:r.status,body:await r.json(),retryAfter:r.headers.get('retry-after')};},{interval:2500,label:'SeerAPI'});
const report={checkedAt:new Date().toISOString(),records:[],failures:[]};
(async()=>{for(const resource of ["skill/30127","skill_effect_type/954","skill/32624","skill/31929"]){const url='https://api.seerapi.com/v1/'+resource;try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),data});console.log(resource,data.hash??'',data.name??'');}catch(e){report.failures.push({url,error:e.message,cause:e.cause?.message});throw e;}finally{fs.writeFileSync('research/3592-extra-source'+(process.argv.includes('--external')?'-external':'')+'.json',JSON.stringify(report,null,2)+'\n');}}})().catch(e=>{console.error(e.message);process.exitCode=1;});
