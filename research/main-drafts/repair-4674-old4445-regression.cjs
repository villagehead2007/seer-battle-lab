'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const dir='research/main-drafts/next50-4674-old4445-repair';fs.mkdirSync(dir,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),changes=[];
function edit(path,from,to){const before=fs.readFileSync(path,'utf8');assert.ok(before.includes(from),path);fs.writeFileSync(dir+'/'+path.replaceAll('/','__'),before,{flag:'wx'});const after=before.replace(from,to);fs.writeFileSync(path,after);changes.push({path,before:sha(before),after:sha(after)});}
edit('tests/helpers/4445-battle.cjs','const c=E.WIKI.effectsEngine.compileInstances([x],[e],m);assert.equal(c.issue,\'\');for(const op of c.operations)out.push({...op,index:i});','const c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m);assert.equal(c.issue,\'\');for(const op of c.operations.filter(op=>op.index===i))out.push({...op,index:i});');
edit('dist/range-effects.js','自身主动换下时使己方下只出场精灵恢复400体力；真实换宠/后继目标延期','自身主动换下时使己方下一只出场精灵按原实例参数恢复体力；真实换宠/后继目标延期');
fs.writeFileSync(dir+'/record.json',JSON.stringify({at:new Date().toISOString(),reason:'4445 isolated non-direct compiler rebased real skill 20144 second instance to zero; compile complete sourced move then select original index. Generic 1702 deferred label must describe all preserved instance parameters, not hardcode 4658 400. No source or assertion changed.',changes},null,2)+'\n');
const bp='research/BATCH-4509-NEXT50-STATUS.json',b=JSON.parse(fs.readFileSync(bp));b.activeProcesses=[];b.currentTargetedResult='research/4674-production-targeted-v1-result.json';fs.writeFileSync(bp,JSON.stringify(b,null,2)+'\n');
const runner=fs.readFileSync('research/run-next50-tail-production-targeted.cjs','utf8').replaceAll('production-targeted-v1','production-targeted-v2');fs.writeFileSync('research/run-next50-tail-production-targeted-v2.cjs',runner,{flag:'wx'});
console.log(JSON.stringify({changes,assertionsPreserved:true}));
