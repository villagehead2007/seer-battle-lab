'use strict';
const fs=require('fs'),{spawnSync}=require('child_process'),{createClient}=require('../wiki-client.cjs');const report={checkedAt:new Date().toISOString(),records:[],failures:[]};
const client=createClient(async url=>{const p=spawnSync('curl.exe',['--silent','--show-error','--max-time','25','--write-out','\n%{http_code}',url],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(p.status!==0)throw Error('curl exit '+p.status+': '+p.stderr);const i=p.stdout.lastIndexOf('\n'),status=Number(p.stdout.slice(i+1));return {status,body:JSON.parse(p.stdout.slice(0,i))};},{interval:10000,label:'BWIKI'});
const url='https://wiki.biligame.com/seer/api.php?action=parse&format=json&prop=text%7Crevid&page='+encodeURIComponent('魂印:2121');
(async()=>{try{const data=await client.request(url);report.records.push({url,loadedAt:new Date().toISOString(),data});const html=data.parse?.text?.['*']??'';console.log(JSON.stringify({revid:data.parse?.revid,length:html.length,contexts:[...html.matchAll(/神圣之霆|荣光之裁/g)].map(m=>html.slice(Math.max(0,m.index-200),m.index+700)).slice(0,10)}));}catch(e){report.failures.push({url,error:e.message});console.error(e.message);process.exitCode=1;}finally{fs.writeFileSync('research/4004-soul-render-source.json',JSON.stringify(report,null,2)+'\n');}})();





