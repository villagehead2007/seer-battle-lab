'use strict';
const fs=require('fs'),{createClient}=require('../wiki-client.cjs'),file='research/4612-source-supplement.json';
const report=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{records:[],failures:[]};
const client=createClient(async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(25000)}),raw=await r.text();let body;try{body=JSON.parse(raw)}catch{body={error:{code:'non-json '+raw.slice(0,240)}}}return{status:r.status,body,retryAfter:r.headers.get('retry-after')};},{interval:5000,label:'4612-source'});
const s=JSON.parse(fs.readFileSync('research/4612-reviewed-snapshot.json')),wiki=new URL('https://wiki.biligame.com/seer/api.php');
const titles=['魂印:1820','魂弦',...s.effects.map(e=>'效果:'+e.id),...s.moves.slice(-7).map(m=>'技能:'+m.id),'护盾','护罩','技能PP值','回合类效果'];
for(const[k,v]of Object.entries({action:'query',format:'json',prop:'revisions',rvprop:'ids|timestamp|content',rvslots:'main',titles:titles.join('|')}))wiki.searchParams.set(k,v);
(async()=>{for(const url of ['https://api.seerapi.com/v1/eid_effect/2208',wiki.href]){if(report.records.some(r=>r.url===url))continue;try{report.records.push({url,data:await client.request(url),loadedAt:new Date().toISOString()});console.log(url);}catch(e){report.failures.push({url,error:e.message,cause:e.cause?.code,at:new Date().toISOString()});process.exitCode=1;}finally{fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}}})();
