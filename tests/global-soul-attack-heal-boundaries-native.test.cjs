'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
test('伊维特390原无生无灭同时造成红伤与随机固伤，仅红伤参与魂印吸血',()=>{
 const a=store.species(3019),b=store.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[19211]),loadout(b,[])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});s.fighters[0].hp=1000;const calls=[],old=E.SOULS;
 E.SOULS={...old,run(event,c){if(event!=='damageDealt'||c.a.side!==0)return old.run(event,c);return old.run(event,{...c,heal(f,n,label,...rest){if(label==='伊维特魂印吸血')calls.push({n,type:c.type,complete:c.settledDamage});return c.heal(f,n,label,...rest);}});}};try{s=E.resolveTurn(s,['wiki:19211','potion:pp']);}finally{E.SOULS=old;}
 assert.ok(s.damageEvents.some(e=>e.sourceSide===0&&e.type==='fixed'&&e.settledDamage>=100));assert.ok(s.damageEvents.some(e=>e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0));assert.equal(calls.length,1);assert.equal(calls[0].type,'attack');assert.equal(calls[0].n,calls[0].complete*.4);
});
