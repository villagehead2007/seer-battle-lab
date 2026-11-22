'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function run(id,skill,grade,enemyId=2989,setup=false){const a=store.species(id),b=store.species(enemyId);let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[skill]),setup?loadout(b,[20355]):E.WIKI.defaultMoves(b)],seed:14,criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:600,spd:400,spe:1000}},{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:100}}]});s.fighters[0].stages.def=grade;s.fighters[0].stages.spd=grade;if(setup){s=E.resolveTurn(s,['potion:pp','wiki:20355']);assert.ok(s.fighters[1].effects['必定暴击']);}return E.resolveTurn(s,['wiki:'+skill,'potion:pp']);}
const percent=s=>(s.damageEvents??[]).filter(e=>e.sourceSide===0&&e.type==='percent').reduce((n,e)=>n+e.settledDamage,0);
test('3010原第五534按原始600加400的10%恒100百分比，双防正零负等级不入基数且星皇免粉',()=>{
 for(const grade of [-2,0,2]){const s=run(3010,17625,grade);assert.equal(percent(s),100);assert.equal(s.fighters[0].stats.def,600);assert.equal(s.fighters[0].stats.spd,400);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}const immune=run(3010,17625,2,3291);assert.equal(percent(immune),0);
});
test('2991原19085有参534也按原双防10%恒100百分比，原独立消回合保持且免粉阻挡',()=>{
 for(const grade of [-2,0,2]){const s=run(2991,19085,grade,2989,true);assert.equal(percent(s),100);assert.equal(s.fighters[0].stats.def+s.fighters[0].stats.spd,1000);assert.equal(s.fighters[1].effects['必定暴击'],undefined);}assert.equal(percent(run(2991,19085,2,3291)),0);
});
test('3007原15026无参534不因原生每回合双防加一扩大百分比，三初始等级及免粉边界均保留',()=>{
 for(const grade of [-2,0,2]){const s=run(3007,15026,grade);assert.equal(percent(s),100);assert.equal(s.fighters[0].stages.def,grade+1);assert.equal(s.fighters[0].stages.spd,grade+1);}assert.equal(percent(run(3007,15026,2,3291)),0);
});
