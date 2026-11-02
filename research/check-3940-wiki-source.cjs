'use strict';
const fs=require('fs'),{spawnSync}=require('child_process'),{createClient}=require('../wiki-client.cjs');const report={checkedAt:new Date().toISOString(),records:[],failures:[]};
const client=createClient(async url=>{const p=spawnSync('curl.exe',['--silent','--show-error','--max-time','25','--write-out','\n%{http_code}',url],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(p.status!==0)throw Error('curl exit '+p.status+': '+p.stderr);const i=p.stdout.lastIndexOf('\n'),status=Number(p.stdout.slice(i+1));return {status,body:JSON.parse(p.stdout.slice(0,i))};},{interval:10000,label:'BWIKI'});
const url='https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles='+encodeURIComponent('精灵:3940|魂印:1203|魂印:1241');
(async()=>{try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),data});console.log(JSON.stringify(data));}catch(e){report.failures.push({url,error:e.message});console.error(e.message);process.exitCode=1;}finally{fs.writeFileSync('research/3940-wiki-source.json',JSON.stringify(report,null,2)+'\n');}})();





