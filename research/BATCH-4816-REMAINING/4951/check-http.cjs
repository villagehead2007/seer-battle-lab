'use strict';
const fs=require('fs'),{spawn}=require('child_process'),{once}=require('events'),assert=require('assert/strict'),request=require('../../../dist/wiki-request.js');
(async()=>{const child=spawn(process.execPath,['server.cjs'],{cwd:process.cwd(),env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});let stderr='';child.stderr.on('data',x=>stderr+=x);const out={at:new Date().toISOString(),id:4951,formalIntegrationPassed:false};
try{const origin=await new Promise((resolve,reject)=>{let raw='';const timer=setTimeout(()=>reject(Error('server startup timeout')),10000);child.once('error',reject);child.once('exit',code=>reject(Error('server exited '+code+' '+stderr)));child.stdout.on('data',x=>{raw+=x;const match=raw.match(/Local: (http:\/\/127\.0\.0\.1:\d+)/);if(match){clearTimeout(timer);resolve(match[1]);}});});
 const call=(route,params)=>request('local',route,params,{fetchImpl:(url,options)=>fetch(new URL(url,origin),options),timeout:10000});
 out.search=await call('search',{q:'4951'});assert.equal(out.search.results.length,0,'pending source must not be reported as formally deployed');
 try{await call('species',{id:'4951'});throw Error('unexpected successful pending deployment');}catch(e){out.loadError={message:e.message,status:e.status??null};assert.match(e.message,/尚未|本地|不存在|未部署/);}
 out.result='真实HTTP确认未部署；不是接入通过。正式加载须等待2151临时体力上限语义待答，以及正式来源/审核/专项门槛。';out.exitCode=0;
}catch(e){out.exitCode=1;out.error=e.stack;process.exitCode=1;}finally{if(child.exitCode===null){const done=once(child,'exit');child.kill();await done;}out.completedAt=new Date().toISOString();fs.writeFileSync('research/BATCH-4816-REMAINING/4951/http-pending-result.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));}})();
