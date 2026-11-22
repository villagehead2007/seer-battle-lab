'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const cases=[
 {id:4647,move:28734,policy:{qualified532Equal4647:'nominal'},hp:8950,healLabel:'星光既授使用回复',damageLabel:'星光回复等量百分'},
 {id:4648,move:28737,policy:{qualified1239Equal4648:'nominal'},hp:4000,healLabel:'星光·水天一色恢复体力',damageLabel:'星光·水天一色低体等量百分比'},
 {id:4649,move:28741,policy:{qualified532Basis4649:'requested'},hp:8950,healLabel:'星光使用技能回复',damageLabel:'星光使用技能等量百分比'},
 {id:4650,move:28744,policy:{qualified1875Basis4650:'requested'},hp:8950,healLabel:'风暴用招低体回复',damageLabel:'风暴用招等量百分比'},
 {id:4665,move:28792,policy:{qualifiedHealEqual4665:{1875:'requested'}},hp:8950,healLabel:'终末神湮回复',damageLabel:'终末神湮回复等量'},
 {id:4665,move:37483,policy:{qualifiedHealEqual4665:{997:'requested'}},hp:4000,healLabel:'生死盘灵回复',damageLabel:'生死盘灵回复等量'}
];
function verify(row){const observations=[];
 for(const mode of ['cap','full','ban']){
  const a=store.species(row.id),b=store.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};
  let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[row.move]),loadout(b,[])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});
  s.fighters[0].hp=mode==='full'?9000:row.hp;
  Object.assign(s.fighters[0].soulState,structuredClone(row.policy));
  if(mode==='ban')s.fighters[0].effects['无法通过自身技能恢复体力']={start:1,end:3};
  s=E.resolveTurn(s,['wiki:'+row.move,'potion:pp']);
  const events=s.turns.at(-1).events,healed=events.filter(e=>e.kind==='heal'&&e.text.startsWith('A 方 '+row.healLabel)).reduce((n,e)=>n+Number(e.text.match(/回复 (\d+) 点体力/)?.[1]??0),0);
  const damage=events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='percent'&&e.text.includes(row.damageLabel)).reduce((n,e)=>n+e.damage.settledDamage,0);
  const expected=mode==='cap'?Math.min(9000-row.hp,row.id===4665&&row.move===37483?4500:9000):0;
  assert.equal(healed,expected,row.id+' '+mode+' actual recovery');
  assert.equal(damage,healed,row.id+' '+mode+' percent must equal actual recovery');
  observations.push({mode,healed,damage});
 }
 return observations;
}
test('4647/28734真实整招先回复后等量百分比，旧理论量资格不能覆盖统一实际恢复规则',()=>{for(const p of verify(cases[0]))assert.equal(p.damage,p.healed);});
test('4648/28737真实整招先回复后等量百分比，旧理论量资格不能覆盖统一实际恢复规则',()=>{for(const p of verify(cases[1]))assert.equal(p.damage,p.healed);});
test('4649/28741真实整招先回复后等量百分比，旧理论量资格不能覆盖统一实际恢复规则',()=>{for(const p of verify(cases[2]))assert.equal(p.damage,p.healed);});
test('4650/28744真实整招先回复后等量百分比，旧理论量资格不能覆盖统一实际恢复规则',()=>{for(const p of verify(cases[3]))assert.equal(p.damage,p.healed);});
test('4665/28792真实整招先回复后等量百分比，旧理论量资格不能覆盖统一实际恢复规则',()=>{for(const p of verify(cases[4]))assert.equal(p.damage,p.healed);});
test('4665/37483真实整招先回复后等量百分比，旧理论量资格不能覆盖统一实际恢复规则',()=>{for(const p of verify(cases[5]))assert.equal(p.damage,p.healed);});
