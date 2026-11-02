'use strict';
const fs=require('node:fs'),{createClient}=require('../wiki-client.cjs');
const client=createClient(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(25000)});let body;try{body=await r.json();}catch(e){throw new Error(`HTTP ${r.status}: JSON parse failed: ${e.message}`);}return {status:r.status,body,retryAfter:r.headers.get('retry-after')};},{interval:2500,label:'SeerAPI'});
const file='research/3623-source-check'+(process.argv.includes('--external')?'-external':'')+'.json';
const report=fs.existsSync(file)&&process.argv.includes('--resume')?JSON.parse(fs.readFileSync(file)):{checkedAt:new Date().toISOString(),records:[],failures:[]};
(async()=>{const queue=['pet/3623','soulmark/917','soulmark/1863','pet_advance/22','element_type?limit=30&expand=true','pet_gender/1','pet_gender/2'];
const pet=require('./seerapi-cache/3623/pet-3623.json');
const types=new Set([pet.type.id]),effects=new Set();
for(const learn of pet.skill){queue.push('skill/'+learn.skill.id);const m=require('./seerapi-cache/3623/skill-'+learn.skill.id+'.json');types.add(m.type.id);for(const e of m.skill_effect)effects.add(e.effect.id);}
for(const id of types)queue.push('element_type_combination/'+id);
for(const id of effects)queue.push('skill_effect_type/'+id);
for(const resource of queue){const url='https://api.seerapi.com/v1/'+resource;if(report.records.some(r=>r.url===url))continue;try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),data});console.log(resource,data.hash??'',data.name??'');}catch(e){report.failures.push({url,error:e.message,cause:e.cause?.message,code:e.cause?.code});throw e;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}}})().catch(e=>{console.error(e.message);process.exitCode=1;});
