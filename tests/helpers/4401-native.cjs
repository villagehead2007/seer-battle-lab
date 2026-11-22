'use strict';
const assert=require('node:assert/strict'),E=require('../../dist/engine.js'),store=require('../../local-species.cjs'),{loadout}=require('./3001-native.cjs');
const original=store.species(4401),versions=E.WIKI.versionSnapshots(original),enemy=store.species(2989),pp='potion:pp';
assert.equal(versions.length,2);assert.ok(versions.every(s=>s.souls.some(x=>x.id===1618&&x.hash==='3fc997ef')));
// Complete genuine variant snapshots and legal original loadouts. No neutral
// moves, stripped soul clauses, injected operations, or post-turn state edits.
function make(source,moveId,options={}){
 const selected=loadout(source,[moveId]),opponent=loadout(enemy,[]),before=JSON.stringify(source),stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:1000};
 assert.ok(selected.every(id=>source.moves.some(m=>m.id===id)));assert.ok(opponent.every(id=>enemy.moves.some(m=>m.id===id)));
 assert.equal(E.WIKI.assess(source,selected).supported,true);
 const state=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[selected,opponent],seed:14,criticals:true,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});
 assert.equal(JSON.stringify(source),before);assert.equal(Number(state.fighters[0].number),4401);assert.equal(Number(state.fighters[1].number),2989);assert.equal(state.fighters[0].soulId,1618);
 state.fighters[0].hp=options.hp??1000;state.fighters[1].hp=options.enemyHp??9000;
 Object.assign(state.fighters[0].effects,structuredClone(options.aEffects??{}));Object.assign(state.fighters[1].effects,structuredClone(options.bEffects??{}));
 const raw=source.moves.find(m=>m.id===moveId),compiled=state.moveDefinitions['wiki:'+moveId];
 assert.deepEqual(compiled.operations.map(o=>o.effectId),raw.effectInstances.map(x=>x.id));assert.deepEqual(compiled.operations.map(o=>o.sourceArgs),raw.effectInstances.map(x=>x.args));
 return {state,source,raw};
}
const turn=(s,id)=>E.resolveTurn(s,['wiki:'+id,pp]),events=(s,type,side=0,target=1)=>(s.damageEvents??[]).filter(x=>x.round===1&&x.sourceSide===side&&x.targetSide===target&&x.type===type),sum=(s,type,side=0,target=1)=>events(s,type,side,target).reduce((n,x)=>n+x.settledDamage,0);
module.exports={E,original,versions,enemy,make,turn,events,sum};
