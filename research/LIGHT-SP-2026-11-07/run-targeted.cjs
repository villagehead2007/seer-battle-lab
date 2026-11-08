'use strict';const fs=require('fs'),cp=require('child_process'),path=require('path');
const tag=process.argv[2],files=process.argv.slice(3);if(!/^[\w-]+$/.test(tag)||!files.length)throw Error('arguments');
const log=path.join(__dirname,tag+'.log'),result=path.join(__dirname,tag+'-result.json'),start=new Date().toISOString(),stream=fs.createWriteStream(log,{flags:'wx'}),child=cp.spawn(process.execPath,['--test','--test-concurrency=8',...files],{windowsHide:true,stdio:['ignore','pipe','pipe']});let tail='';
for(const s of [child.stdout,child.stderr])s.on('data',data=>{stream.write(data);tail=(tail+data).slice(-4000);});
child.on('exit',(code,signal)=>{stream.end();const report={startedAt:start,completedAt:new Date().toISOString(),pid:child.pid,exitCode:code,signal,files,log};fs.writeFileSync(result,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));console.log(tail);process.exitCode=code??1;});
console.log('Started',child.pid,log);
