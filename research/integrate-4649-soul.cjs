'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const dir='research/parallel-drafts/next50-4649-soul/',sha=x=>crypto.createHash('sha256').update(x).digest('hex'),freeze=JSON.parse(fs.readFileSync(dir+'FREEZE.json'));
assert.equal(freeze.tests.tests,17);
for(const f of [...freeze.code,...freeze.documents])assert.equal(sha(fs.readFileSync(dir+f.name)),f.sha256,f.name);
const record='research/4649-soul-production-integration.json';assert.ok(!fs.existsSync(record));
const texts=new Map(),read=p=>texts.has(p)?texts.get(p):fs.readFileSync(p,'utf8');
const range='dist/range-souls.js';let s=read(range);assert.ok(!s.includes("registry[1849]={name:'星光·魔焰猩猩'"));const end=s.lastIndexOf('});');assert.ok(end>0);s=s.slice(0,end)+fs.readFileSync(dir+'range-souls.production-fragment.js','utf8')+'\n'+s.slice(end);texts.set(range,s);
const patches=JSON.parse(fs.readFileSync(dir+'souls.production-edits.json'));for(const p of patches){s=read(p.target);assert.equal(s.split(p.old).length-1,1,p.label);texts.set(p.target,s.replace(p.old,p.replacement));}
for(const [a,b]of [['production-ready-1849-battle.cjs','tests/helpers/4649-soul-battle.cjs'],['production-ready-soul1849.test.cjs','tests/next50-4649-soul.test.cjs']]){assert.ok(!fs.existsSync(b));texts.set(b,fs.readFileSync(dir+a,'utf8'));}
const before=[...texts.keys()].map(path=>({path,before:fs.existsSync(path)?sha(fs.readFileSync(path)):null}));
for(const[p,t]of texts)fs.writeFileSync(p,t);
fs.writeFileSync(record,JSON.stringify({at:new Date().toISOString(),freeze:dir+'FREEZE.json',privateExecutions:freeze.tests,files:before.map(x=>({...x,after:sha(fs.readFileSync(x.path))})),patches:patches.map(x=>x.label),productionValidationPending:true,formalDeployment:false},null,2)+'\n');console.log(JSON.stringify({integrated:[...texts.keys()],patches:patches.length,privateExecutions:freeze.tests}));
