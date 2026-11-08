'use strict';
const E=require('../../dist/engine.js'),assert=require('node:assert/strict'),neutral=require('../../research/BATCH-4676-NEXT50/4766/snapshot.json');
module.exports=function(source){
const key=id=>'wiki:'+id,keys=['atk','def','spa','spd','spe','acc'],fifth=source.moves.find(m=>m.fifth).id,pool=source.moves.filter(m=>!m.fifth).slice(-4).map(m=>m.id);
function make(o={}){const a=structuredClone(source),b=structuredClone(o.enemySource??neutral);if(!o.soul)a.souls=[];if(!o.enemySoul)b.souls=[];const move=o.move??pool[0],m=source.moves.find(m=>m.id===move),ids=o.loadout??(m.fifth?[...pool,m.id]:[m.id,...pool.filter(x=>x!==m.id).slice(0,3),fifth]);const enemy=o.enemyLoadout??[20117,10127,10716,20309,37911];assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemy).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500},old=E.SOULS;if(o.entryImmune||o.selfEntryImmune)E.SOULS={...old,run(event,c){if(event==='battleStart'&&c.a.side===0){if(o.entryImmune)c.t.counts.immune=o.entryImmune;if(o.selfEntryImmune)c.a.counts.immune=o.selfEntryImmune;}old.run(event,c);}};let s;try{s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemy],criticals:o.criticals??false,builds:[{suit:'none',overrides:{...stats,...o.aStats}},{suit:'none',overrides:{...stats,spe:100,...o.bStats}}]});}finally{E.SOULS=old;}
 if(o.index===-1)s.moveDefinitions[key(move)].operations=[];else if(o.index!=null)s.moveDefinitions[key(move)].operations=s.moveDefinitions[key(move)].operations.filter(x=>x.index===o.index);s.auditMoveId=move;s.rng=o.seed??0x9e3779b9;if(o.hp!=null)s.fighters[0].hp=o.hp;if(o.targetHp!=null)s.fighters[1].hp=o.targetHp;
 if(o.hit!==false)for(const f of s.fighters)for(const k of ['攻击必中','属性必中'])f.effects[k]={start:1,end:99};return s;
}
function turn(s,a=s.auditMoveId,b=20117){return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}
const timer=(s,side,name,data={},start=s.round,end=99)=>(s.fighters[side].effects[name]={start,end,...data},s),sum=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side).reduce((n,e)=>n+e.settledDamage,0);
return {E,source,key,keys,make,turn,timer,sum};
};
