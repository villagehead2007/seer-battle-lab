'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname, output=path.join(root,'sources.json');
const out=fs.existsSync(output)?JSON.parse(fs.readFileSync(output)):{records:[],failures:[]};
const client=require('../../wiki-client.cjs').createClient(async url=>{
 const r=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{Accept:'application/json','User-Agent':'SeerBattleLab/0.8 (read-only research)'}});
 const raw=await r.text();let body;try{body=JSON.parse(raw);}catch{throw new Error('HTTP '+r.status+' invalid JSON: '+raw.slice(0,150));}
 return {status:r.status,retryAfter:r.headers.get('retry-after'),body};
},{interval:1500,label:'SeerAPI',capacity:240});
async function get(key){const url='https://api.seerapi.com/v1/'+key;try{const data=await client.request(url);const record={url,loadedAt:new Date().toISOString(),sha256:crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),data};out.records.push(record);fs.writeFileSync(output,JSON.stringify(out,null,2)+'\n');console.log(key,JSON.stringify(data).slice(0,1800));return data;}catch(e){out.failures.push({url,at:new Date().toISOString(),error:e.message,cause:e.cause?.message});fs.writeFileSync(output,JSON.stringify(out,null,2)+'\n');console.log('FAILED',key,e.message);return null;}}
module.exports={out,get};
if(require.main===module)(async()=>{for(const key of process.argv.slice(2))await get(key);})().catch(e=>{console.error(e);process.exitCode=1;});
