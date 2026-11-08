'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../..'),tag=process.argv[2];if(!/^[\w-]+$/.test(tag))throw Error('tag');
const pattern=/当回合免伤|低伤免疫返还|小额伤害免疫|immuneDamageTypes|虚无/;
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const selected=[];
for(const file of fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.test.cjs'))){const t=fs.readFileSync(path.join(root,'tests',file),'utf8');if(!pattern.test(t))continue;const names=t.split(/(?=\btest\s*\()/).filter(b=>pattern.test(b)).map(b=>b.match(/^test\s*\(\s*(['"])(.*?)\1/)?.[2]);selected.push({file,names:names.filter(Boolean),all:names.some(n=>!n)});}
fs.writeFileSync(path.join(__dirname,tag+'-selection.json'),JSON.stringify(selected,null,2)+'\n',{flag:'wx'});
const results=[];
for(let i=0;i<selected.length;i+=8){const group=selected.slice(i,i+8),match=group.some(g=>g.all)?'.*':group.flatMap(g=>g.names.map(escape)).join('|'),log=path.join(__dirname,tag+'-'+i+'.log'),fd=fs.openSync(log,'wx'),args=['--test','--test-concurrency=8','--test-name-pattern='+match,...group.map(g=>'tests/'+g.file)],start=new Date().toISOString();console.log('Checking group',i,group.map(g=>g.file).join(', '));const r=cp.spawnSync(process.execPath,args,{cwd:root,windowsHide:true,stdio:['ignore',fd,fd],timeout:40*60*1000});fs.closeSync(fd);const text=fs.readFileSync(log,'utf8'),result={i,files:group.map(g=>g.file),startedAt:start,completedAt:new Date().toISOString(),exitCode:r.status,error:r.error?.message??null,log:path.relative(root,log),failures:text.split('\n').filter(l=>l.startsWith('✖'))};results.push(result);fs.writeFileSync(path.join(__dirname,tag+'-results.json'),JSON.stringify({selectedFiles:selected.length,results},null,2)+'\n');console.log(JSON.stringify(result));}
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
