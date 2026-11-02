'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
assert.ok(!fs.existsSync('research/.next50-batch-validation.lock'));
const dir='research/batch3-regression-repair-before';fs.mkdirSync(dir,{recursive:true});
for(const p of ['dist/range-effects.js','dist/souls.js','tests/fixed-drain-confirmed.test.cjs'])fs.copyFileSync(p,dir+'/'+p.replaceAll('/','__'));
function edit(p,a,b){let s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p);fs.writeFileSync(p,s.replace(a,b));}
edit('dist/range-effects.js','consumeNext(f){const records=percentSources1849(f)','consumeNext(f){if(!(f.counts.nextAttackPercentUses>0)&&!f.soulState.nextAttackPercentSources?.length)return [];const records=percentSources1849(f)');
edit('dist/souls.js',"a.soulState.nextAttackPercentPartsThis=m.kind!=='status'?E.WIKI.effectsEngine.registry[1849].consumeNext(a):[];a.soulState.nextAttackPercentThis=a.soulState.nextAttackPercentPartsThis.reduce((n,e)=>n+e.fraction,0);","{const parts=m.kind!=='status'?E.WIKI.effectsEngine.registry[1849].consumeNext(a):[];if(parts.length)a.soulState.nextAttackPercentPartsThis=parts;else delete a.soulState.nextAttackPercentPartsThis;a.soulState.nextAttackPercentThis=parts.reduce((n,e)=>n+e.fraction,0);}");
edit('tests/fixed-drain-confirmed.test.cjs','compileInstances([real.e],real.s.effects,real.m)','compileInstances(real.m.effectInstances,real.s.effects,real.m)');
edit('tests/fixed-drain-confirmed.test.cjs','operations=compiled.operations;q.moveDefinitions','operations=compiled.operations.filter(op=>op.index===real.m.effectInstances.indexOf(real.e));Object.assign(q.moveDefinitions[key(q.auditMoveId)],{wikiId:real.m.id,hash:real.m.hash,revision:real.m.revision});q.moveDefinitions');
console.log('Preserved all original assertions; corrected empty ledger mutation and real instance fixture indices.');
