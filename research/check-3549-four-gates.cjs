'use strict';
const fs=require('fs'),{spawnSync}=require('child_process'),{createClient}=require('../wiki-client.cjs');const report={checkedAt:new Date().toISOString(),records:[],failures:[]};
const client=createClient(async url=>{const p=spawnSync('curl.exe',['--silent','--show-error','--max-time','25','--write-out','\n%{http_code}',url],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(p.status!==0)throw Error('curl exit '+p.status+': '+p.stderr);const i=p.stdout.lastIndexOf('\n'),status=Number(p.stdout.slice(i+1));return {status,body:JSON.parse(p.stdout.slice(0,i))};},{interval:10000,label:'BWIKI'});
const url='https://wiki.biligame.com/seer/api.php?action=query&format=json&list=search&srsearch='+encodeURIComponent('四象门')+'&srwhat=text&srlimit=15';
(async()=>{try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),data});console.log('pages',Object.keys(data.query?.pages??{}).length);}catch(e){report.failures.push({url,error:e.message});console.error(e.message);process.exitCode=1;}finally{fs.writeFileSync('research/3549-four-gates-search.json',JSON.stringify(report,null,2)+'\n');}})();

