'use strict';
// Read-only source acquisition for the explicitly requested species.
const fs=require('node:fs'),path=require('node:path');
const {createClient}=require('../wiki-client.cjs');
const dir=path.join(__dirname,'seerapi-cache','3579');fs.mkdirSync(dir,{recursive:true});
const manifest={species:3579,records:[],failures:[]};
const client=createClient(async url=>{
  const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{Accept:'application/json','User-Agent':'SeerBattleLab/0.17 (read-only source audit)'}});
  const text=await response.text();let body;try{body=JSON.parse(text);}catch{throw Error(`HTTP ${response.status}: non-JSON response`);}
  return {status:response.status,body,retryAfter:response.headers.get('retry-after')};
},{interval:1500,label:'SeerAPI',capacity:240});
function save(resource,id,data,url,loadedAt){const file=`${resource}-${String(id).startsWith('?' )?'all':id}.json`;fs.writeFileSync(path.join(dir,file),JSON.stringify(data,null,2)+'\n');manifest.records.push({file,url,hash:data.hash,loadedAt});fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');return data;}
const memo=new Map();
async function get(resource,id){const url=`https://api.seerapi.com/v1/${resource}/${id}`;if(memo.has(url))return memo.get(url);try{const data=await client.request(url);if(!data.hash)throw Error('missing source hash');save(resource,id,data,url,new Date().toISOString());memo.set(url,data);console.log(resource,id,data.name??'',data.hash);return data;}catch(e){manifest.failures.push({url,error:e.message,cause:e.cause?.message,checkedAt:new Date().toISOString()});fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');throw e;}}
(async()=>{
  const p=await get('pet',3579),types=new Set([p.type.id]);
  for(const ref of p.soulmark){const s=await get('soulmark',ref.id);if(s.intensified_to)await get('soulmark',s.intensified_to.id);if(s.advance)console.log('SOURCE ADVANCE REQUIRES REVIEW',s.advance);}
  for(const entry of p.skill){const m=await get('skill',entry.skill.id);types.add(m.type.id);for(const e of [...m.skill_effect,...(m.friend_skill_effect??[])])await get('skill_effect_type',e.effect.id);}
  for(const id of types)await get('element_type_combination',id);
  await get('element_type','?limit=30&expand=true');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
