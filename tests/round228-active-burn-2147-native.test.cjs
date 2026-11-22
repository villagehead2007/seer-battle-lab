'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const originalSouls=E.SOULS;
function member(id,skills=[],soul,maxHp=9000){
 const snapshot=E.WIKI.versionSnapshots(store.species(id))[0];if(soul)snapshot.selectedSoulId=soul;
 const moves=[...skills,...E.WIKI.defaultMoves(snapshot),...E.WIKI.availableMoves(snapshot).map(m=>m.id)].filter((v,i,a)=>a.indexOf(v)===i).slice(0,5);
 return {snapshot,moves,build:{overrides:{maxHp,atk:1,spa:1,def:1000,spd:1000,spe:id===4627?1000:100}}};
}
function scenario(choices,nonLead=true,enemyMaxHp=9000){
 const emperor=member(3291,[10499,20530],622,enemyMaxHp);
 let game=T.create([[member(4627,[37251,28674,10234],1833)],nonLead?[member(3227,[19087],552),emperor]:[emperor]],[0,0],{seed:13,criticals:false});
 const frames=[];
 for(const choice of choices){
  game=T.turn(game,choice);const s=game.battle;
  frames.push({round:s.round-1,active:game.active.slice(),fire:s.fighters[0].soulState.guardedFlame1833??0,hp:s.fighters.map(f=>f.hp),ailments:structuredClone(s.fighters.map(f=>f.ailments)),events:structuredClone(s.turns.at(-1).events),damage:structuredClone((s.damageEvents??[]).filter(e=>e.round===s.round-1))});
  assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS));
 }
 return {game,frames};
}
const fourTurns=[['wiki:10234','wiki:19087'],['wiki:28674',{switchTo:1}],['potion:hp','wiki:10499'],['wiki:37251','potion:hp']];
const active=f=>f.events.filter(e=>e.text.includes('佑灵触发烧伤体力扣除'));
function singleScenario(choices){
 const a=member(4627,[37251,28674,10234],1833),b=member(3291,[10499,20530],622);
 let s=E.createBattle({wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves,b.moves],builds:[a.build,b.build],criticals:false});
 const frames=[];
 for(const choice of choices){s=E.resolveTurn(s,choice);frames.push({round:s.round-1,fire:s.fighters[0].soulState.guardedFlame1833??0,hp:s.fighters.map(f=>f.hp),ailments:structuredClone(s.fighters.map(f=>f.ailments)),events:structuredClone(s.turns.at(-1).events),damage:structuredClone((s.damageEvents??[]).filter(e=>e.round===s.round-1))});assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS));}
 return {frames};
}
test('2147原魂原招自然清烧得2层，真实非首发星皇换入后主动两次真伤穿免粉而不缩烧伤',()=>{
 const {game,frames}=scenario(fourTurns),f=frames[3];
 assert.equal(frames[1].fire,2);assert.equal(frames[1].active[1],1);assert.equal(frames[2].ailments[1]['烧伤'],5);
 assert.equal(frames[2].fire,2);assert.equal(f.fire,0);assert.equal(f.ailments[1]['烧伤'],5);
 assert.deepEqual(active(f).map(e=>e.damage.type),['true','true']);assert.deepEqual(active(f).map(e=>e.damage.settledDamage),[1125,1125]);
 assert.deepEqual(active(f).map(e=>e.damage.sourceSide),[0,0]);assert.equal(f.hp[1],4750);
 const periodic=f.events.filter(e=>e.text.startsWith('B 方 烧伤：'));assert.equal(periodic.length,1);assert.equal(periodic[0].damage.type,'true');assert.equal(periodic[0].damage.settledDamage,1125);
 assert.equal(f.events.some(e=>e.text.includes('佑灵无烧伤理论吸取回复')),false);
 assert.equal(game.battle.fighters[0].soulState.skillUses['wiki:37251'],1);assert.equal(game.battle.fighters[0].soulState.basePPCostThisUse.amount,1);
 assert.equal(game.battle.fighters[0].pp['wiki:37251'],5);assert.equal(game.battle.fighters[0].counts.immune,1);
 assert.equal(game.battle.fighters[0].soulHash,'7d4fbbb');assert.equal(game.battle.fighters[1].soulHash,'2f1e3f2');
});
test('2147原生灼火实际耗尽后第二次完整第五不再触发主动烧伤，原PP恢复仍执行',()=>{
 const {game,frames}=scenario([...fourTurns,['wiki:37251','potion:hp']]),last=frames[4];
 assert.equal(frames[3].fire,0);assert.equal(last.fire,0);assert.equal(active(last).length,0);
 assert.equal(last.damage.filter(e=>e.targetSide===1&&e.type==='true').length,1);
 assert.equal(game.battle.fighters[0].soulState.skillUses['wiki:37251'],2);assert.equal(game.battle.fighters[0].pp['wiki:37251'],5);
});
test('2147原生首发星皇免烧伤时仍走原百分比吸取与实际封顶回复，不把未烧伤分支改成真伤',()=>{
 const {frames}=singleScenario([['wiki:10234','wiki:10499'],['wiki:28674','potion:hp'],['potion:hp','wiki:10499'],['wiki:37251','potion:hp']]),last=frames[3];
 assert.equal(frames[1].fire,2);assert.equal(frames[2].ailments[1]['烧伤'],undefined);assert.equal(last.fire,0);assert.equal(active(last).length,0);
 assert.equal(last.events.filter(e=>e.text.includes('免疫佑灵无烧伤比例吸取的百分比伤害')).length,2);
 assert.deepEqual(last.events.filter(e=>e.text.includes('佑灵无烧伤理论吸取回复')).map(e=>e.text.match(/回复 (\d+) 点/)[1]),['1125','1']);
 assert.equal(last.hp[1],9000);assert.equal(last.damage.filter(e=>e.targetSide===1&&e.type==='true').length,0);
});
test('2147原生三次清除延长烧伤累计灼火至7，七次主动真伤实际击败非首发星皇',()=>{
 const actions=[['wiki:10234','wiki:19087'],['potion:hp','wiki:19087'],['wiki:28674',{switchTo:1}],['potion:hp','wiki:10499'],['potion:hp','wiki:10499'],['wiki:28674','potion:hp'],['potion:hp','wiki:10499'],['potion:hp','wiki:10499'],['wiki:28674','potion:hp'],['potion:hp','wiki:10499'],['wiki:37251','wiki:20530']];
 const {game,frames}=scenario(actions,true,1000),last=frames.at(-1);
 assert.equal(frames[2].fire,3);assert.equal(frames[5].fire,6);assert.equal(frames[8].fire,7);assert.equal(last.fire,0);
 assert.equal(active(last).length,7);assert.ok(active(last).every(e=>e.damage.type==='true'&&e.damage.settledDamage===125&&e.damage.sourceSide===0));
 assert.equal(last.hp[1],0);assert.ok(last.hp[0]>0);assert.equal(game.slots[1][1].fighter.hp,0);
});
