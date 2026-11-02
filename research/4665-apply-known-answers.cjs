'use strict';
const fs=require('node:fs'),path=require('node:path');
const base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/4665-before';fs.mkdirSync(base,{recursive:true});
function edit(file,pairs){let s=fs.readFileSync(file,'utf8');fs.writeFileSync(path.join(base,path.basename(file)),s,{flag:'wx'});for(const [a,b]of pairs){if(!s.includes(a))throw Error('Missing '+a);s=s.replace(a,b);}fs.writeFileSync(file,s);}
edit('dist/range-souls.js',[
 ['const p=c.a.soulState.qualified1868Zero;','const p=c.a.soulState.qualified1868Zero??(c.attackImmune?\'skip\':\'trigger\');'],
 ['const p=c.a.soulState.qualified1868Invalid;','const p=c.a.soulState.qualified1868Invalid??(e.reason.miss||e.reason.blind||e.reason.forcedMiss||e.reason.evaded?\'invalid\':\'not-invalid\');']
]);
edit('dist/souls.js',[["...(a.soulId===1866?{attackImmune:!anyNonImmuneHit}:{})","...([1866,1868].includes(a.soulId)?{attackImmune:!anyNonImmuneHit}:{})"]]);
edit('dist/range-effects.js',[
 ['policy=c.a.soulState.qualified1875First4665;','policy=c.a.soulState.qualified1875First4665??\'grant-use\';'],
 ['const policy=c.a.soulState.qualified1875LateKO4665;','const policy=c.a.soulState.qualified1875LateKO4665??\'exclude\';']
]);
edit('tests/next50-4665-soul.test.cjs',[
 ["assert.throws(()=>turn(a,10535,20013),/Q-N50-4665-001/);","turn(a,10535,20013);assert.equal(red(a),0);assert.equal(a.fighters[1].effects.statusBlock,undefined);const shield=make();shield.fighters[1].suitState.shield=9999;turn(shield,10535,20013);assert.equal(red(shield),0);assert.ok(shield.fighters[1].effects.statusBlock);"],
 ["assert.throws(()=>turn(structuredClone(s),20013,20013),/Q-N50-4514-001/);","const confirmed=structuredClone(s);turn(confirmed,20013,20013);assert.ok(confirmed.fighters[0].ailments['狂暴']>=2);"]
]);
edit('tests/next50-4665-skills.test.cjs',[
 ["assert.throws(()=>turn(create()),/Q-N50-4589-004/);","const confirmed=turn(create());assert.equal(confirmed.fighters[1].hp,0);assert.equal(confirmed.fighters[0].ailments['狂暴'],undefined);assert.equal(sum(confirmed,'percent'),6000);"],
 ["assert.throws(()=>turn(make(e(1875),{hp:1000})),/Q-N50-4625-011/);","const confirmed=turn(make(e(1875),{hp:1000}));assert.equal(confirmed.fighters[0].hp,7000);assert.equal(sum(confirmed,'percent'),6000);"]
]);
console.log('4665 confirmed zero, invalid, initial-use and late-KO branches applied; unresolved heal/shield/immunity guards retained.');
