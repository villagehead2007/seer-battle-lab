'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),{createClient}=require('../wiki-client.cjs');
const file='data/types/sources.json';
fs.mkdirSync('data/types',{recursive:true});
const report=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{schemaVersion:1,records:[],failures:[],cooldowns:{}};
const save=()=>fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
const sha=data=>crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
const clients=new Map();
function client(origin){if(!clients.has(origin))clients.set(origin,createClient(async url=>{
 const response=await fetch(url,{signal:AbortSignal.timeout(30000)}),text=await response.text();
 const status=response.status,retryAfter=response.headers.get('retry-after');
 if([403,429,567,502,503,504].includes(status)){
  const seconds=Math.max(status===403?1800:[429,567].includes(status)?900:60,Number(retryAfter)||0);
  report.cooldowns[origin]={status,until:new Date(Date.now()+seconds*1000).toISOString()};save();
 }
 let body;try{body=JSON.parse(text);}catch(e){throw Error(`HTTP ${status}: JSON parse failed: ${e.message}; prefix=${text.slice(0,100)}`);}
  if(status!==200){report.failures.push({url,at:new Date().toISOString(),status,body});save();}
  return {status,body,retryAfter};
},{interval:2500,label:'属性资料'}));return clients.get(origin);}
async function get(key,url){
 const cached=report.records.find(r=>r.url===url);if(cached)return cached.data;
 const origin=new URL(url).origin;
 if(Date.parse(report.cooldowns[origin]?.until)>Date.now())throw Error(`Cooldown until ${report.cooldowns[origin].until}`);
 try{const data=await client(origin).request(url);report.records.push({key,url,loadedAt:new Date().toISOString(),sha256:sha(data),data});save();console.log(key,data.count??data.hash??'ok');return data;}
 catch(e){report.failures.push({key,url,at:new Date().toISOString(),error:e.message,cause:e.cause?.message??null,code:e.cause?.code??null});save();throw e;}
}
(async()=>{
 if(process.argv.includes('--search')){
  for(const term of ['属性克制','双属性'])await get('wiki-search:'+term,'https://wiki.biligame.com/seer/api.php?'+new URLSearchParams({action:'query',format:'json',list:'search',srsearch:term,srlimit:'10'}));return;
 }
 const titles=process.argv.find(x=>x.startsWith('--titles='))?.slice(9);
 if(titles){await get('wiki-pages:'+titles,'https://wiki.biligame.com/seer/api.php?'+new URLSearchParams({action:'query',format:'json',prop:'revisions',rvprop:'ids|timestamp|content',rvslots:'main',titles,redirects:'1'}));return;}
 for(const resource of ['element_type','element_type_combination']){
  let url=`https://api.seerapi.com/v1/${resource}?limit=30&expand=true`,page=0;
  try{while(url){if(new URL(url).origin!=='https://api.seerapi.com')throw Error('Unexpected pagination origin');const data=await get(resource+':'+page++,url);if(!Array.isArray(data.results))throw Error('Missing results');url=data.next;}}catch(e){console.error(resource,e.message);}
 }
 const url='https://wiki.biligame.com/seer/api.php?'+new URLSearchParams({action:'query',format:'json',prop:'revisions',rvprop:'ids|timestamp|content',rvslots:'main',titles:'属性|属性克制|双属性',redirects:'1'});
 try{await get('wiki-types',url);}catch(e){console.error('wiki-types',e.message);}
})().catch(e=>{console.error(e);process.exitCode=1;});
