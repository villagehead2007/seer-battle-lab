'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const file='research/zero-damage-hit-2026-10-29/assertion-update-plan.json',plan=JSON.parse(fs.readFileSync(file));
assert.equal(plan.status,'prepared-not-applied');
const files=new Map();
for(const x of plan.plan){let s=files.get(x.file)??fs.readFileSync(x.file,'utf8');const start=x.scope?s.indexOf(x.scope):0;assert.ok(start>=0,x.scope);const next=x.scope?s.indexOf('\ntest(',start+1):-1,end=next<0?s.length:next,part=s.slice(start,end);assert.equal(part.split(x.before).length,2,x.file+' '+x.before);files.set(x.file,s.slice(0,start)+part.replace(x.before,x.after)+s.slice(end));}
for(const [file,text] of files){const backup=path.join('research/zero-damage-hit-2026-10-29/old-assertions',file);fs.mkdirSync(path.dirname(backup),{recursive:true});assert.ok(!fs.existsSync(backup));fs.copyFileSync(file,backup);fs.writeFileSync(file,text);}
plan.status='applied-awaiting-verification';plan.appliedAt=new Date().toISOString();fs.writeFileSync(file,JSON.stringify(plan,null,2)+'\n');console.log({changes:plan.plan.length,files:files.size});
