'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function version(id,move){const s=E.WIKI.versionSnapshots(store.species(id)).find(x=>E.WIKI.availableMoves(x).some(m=>m.id===move));assert.ok(s,id+'/'+move);return s;}
for(const [id,move,cap]of [[3240,17389,280],[4854,38203,300],[4912,29372,170]])test('全局125整回合额度：完整原'+id+'对原3291魂印额外真实攻击仍共享'+cap,()=>{
 const a=version(id,move),b=version(3291,30380),seen=new Set();
 for(let seed=1;seed<=16;seed++){
  const stats={maxHp:9000,atk:100,spa:100,def:1,spd:1,spe:1000};let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[move]),loadout(b,[30380])],seed:Math.imul(seed,0x9e3779b1)>>>0,criticals:false,builds:[{overrides:stats},{overrides:{...stats,atk:9999,spa:9999,def:5000,spd:5000,spe:100}}]});
  s.fighters[0].stages.acc=6;s.fighters[1].stages.acc=6;
  s=E.resolveTurn(s,['wiki:'+move,'wiki:30380']);
  if(id===4912){assert.ok(s.fighters[0].effects['攻击免疫']||s.fighters[0].effects['攻击伤害免疫'],'原2096烧伤失败授攻击免疫，完整保留');s=E.resolveTurn(s,['potion:pp','potion:pp']);s=E.resolveTurn(s,['potion:pp','wiki:30380']);}
  const red=s.damageEvents.filter(e=>e.round===(id===4912?3:1)&&e.sourceSide===1&&e.targetSide===0&&e.type==='attack');
  assert.ok(red.length===1||red.length===2);seen.add(red.length);assert.equal(red.reduce((n,e)=>n+e.settledDamage,0),cap,'seed'+seed);
  assert.equal(red[0].settledDamage,cap);if(red.length===2)assert.equal(red[1].settledDamage,0);
  assert.equal(s.fighters[0].effects['攻击伤害上限'].cumulativeRoundRed,true);assert.equal(s.fighters[0].effects['攻击伤害上限'].wholeAttackRedCap,undefined);
 }
 assert.deepEqual(seen,new Set([1,2]));
});
