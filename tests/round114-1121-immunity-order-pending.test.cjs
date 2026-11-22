'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round114-conditional-native-input-20261113.json'),leaves=rows.filter(r=>r.category==='leaf'),stats={maxHp:9000,atk:180,spa:360,def:500,spd:500,spe:9999};
function snapshot(row){const s=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest);assert.ok(s,row.key);return s;}
function make(row,o={}){
 const own=snapshot(row),enemy=L.species(o.enemy??3102),plain=own.moves.find(m=>m.power>0&&!m.fifth&&!m.effectInstances.length);assert.ok(plain);const enemyMove=o.enemyMove??10127,enemyMoves=loadout(enemy,[enemyMove,...(o.enemy===3056?[10716]:[])]),s=E.createBattle({wikiSnapshots:[own,enemy],wikiLoadouts:[loadout(own,[row.move,plain.id]),enemyMoves],builds:[{overrides:stats},{overrides:{...stats,maxHp:9999,atk:o.enemyAtk??400,spa:o.enemyAtk??400,def:9999,spd:9999,spe:1}}],criticals:false,seed:o.seed??14}),a=s.fighters[0],t=s.fighters[1];
 a.hp=8000;a.stages.acc=6;t.effects.免异常={start:1,end:99};if(o.ownNegative)a.stages.atk=-2;if(o.enemyNegative)t.stages.spa=-2;if(o.positive)a.stages.atk=2;if(o.kill)t.hp=1;
 if(o.pinkImmune)a.effects['固定百分比免疫']={start:1,end:99};if(o.mode==='invalid')a.effects.skillBlock={start:1,end:1};if(o.mode==='control')a.ailments.疲惫=2;if(o.mode==='zero')a.pp['wiki:'+row.move]=0;
 assert.deepEqual(s.moveDefinitions['wiki:'+row.move].operations.map(x=>[Number(x.effectId),x.index,x.phase,x.sourceArgs]),row.operations);assert.equal(a.soulId,row.soul);return{s,plain:plain.id,enemyMove};
}
function turn(s,action,enemy='potion:pp'){
 const original=E.WIKI.effectsEngine,frames={},move=typeof action==='number'?action:Number(String(action).replace('wiki:',''));
 E.WIKI.effectsEngine={...original,run(phase,ops,c){const out=original.run(phase,ops,c);if(c.a.side===0&&c.m.wikiId===move)frames[phase]={a:structuredClone(c.a),t:structuredClone(c.t),crit:c.crit};return out;}};
 let out;try{out=E.resolveTurn(s,[typeof action==='number'?'wiki:'+action:action,typeof enemy==='number'?'wiki:'+enemy:enemy]);}finally{E.WIKI.effectsEngine=original;}return{out,frames};
}
function cast(row,o={}){const x=make(row,o);if(o.mode==='zero'){const before=structuredClone(x.s);assert.throws(()=>turn(x.s,row.move),/请选择|有 PP/);assert.deepEqual(x.s,before);return{...x,frames:{}};}return{...x,...turn(x.s,o.mode==='potion'?'potion:pp':row.move,o.castEnemy??'potion:pp')};}
function gates(row){for(const mode of['invalid','control','potion','zero'])assert.equal(cast(row,{mode}).frames.afterHit,undefined,row.key+':'+mode);}
const sum=(s,round,type,side=1)=>(s.damageEvents??[]).filter(e=>e.round===round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);

// Pending human ruling; retains the original unproven no-consumption assertion. Not used as passing evidence.
test('两条原1121完整原招授下一次固粉减半，真实红伤不耗、固定与百分比首笔减半后不重减，免粉优先不耗次数',()=>{
 for(const row of leaves.filter(r=>r.effect===1121)){const x=cast(row,{enemy:3056});assert.equal(x.frames.afterHit.a.counts.nextPinkReduction,1);assert.equal(x.frames.afterHit.a.soulState.nextPinkReductionFraction,.5);let s=turn(x.out,'potion:pp',10127).out;assert.equal(s.fighters[0].counts.nextPinkReduction,1);s=turn(s,'potion:pp',10716).out;assert.equal(sum(s,3,'fixed'),25);assert.equal(s.fighters[0].counts.nextPinkReduction,0);s=turn(s,'potion:pp',10716).out;assert.equal(sum(s,4,'fixed'),50);
 const pink=cast(row,{enemy:4665,enemyMove:37483}),control=structuredClone(pink.out);control.fighters[0].counts.nextPinkReduction=0;const base=turn(control,'potion:pp',37483).out,actual=turn(pink.out,'potion:pp',37483).out;assert.ok(sum(base,2,'percent')>0);assert.ok(Math.abs(sum(actual,2,'percent')-sum(base,2,'percent')*.5)<=1);assert.equal(actual.fighters[0].counts.nextPinkReduction,0);
 const immune=cast(row,{enemy:3056,pinkImmune:true}),blocked=turn(immune.out,'potion:pp',10716).out;assert.equal(sum(blocked,2,'fixed'),0);assert.equal(blocked.fighters[0].counts.nextPinkReduction,1);gates(row);}
});

