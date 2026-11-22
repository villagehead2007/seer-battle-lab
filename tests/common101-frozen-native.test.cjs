'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),bindings=require('../research/TEAM-STAGE-2/USER-CONFIRMATIONS-LUBU-COMMON101-795-2026-11-11.json').affectedFrozen101;
test('统一101冻结18实例原生过量与冥王保1都按完整红伤比例回复，技能禁疗均阻挡',()=>{
 assert.equal(bindings.length,18);
 for(const binding of bindings)for(const enemyId of[2989,3141])for(const blocked of[false,true]){
  const[id,,mid]=binding.key.split(':'),snapshot=store.species(+id),target=store.species(enemyId),move=snapshot.moves.find(m=>m.id===+mid),stats={maxHp:9000,atk:3000,spa:3000,def:1000,spd:1000,spe:1000};let s=E.createBattle({wikiSnapshots:[snapshot,target],wikiLoadouts:[loadout(snapshot,[move.id]),loadout(target,[])],builds:[{overrides:stats},{overrides:{...stats,maxHp:1,spe:100}}],seed:14,criticals:false});
  s.fighters[0].hp=1000;s.fighters[1].hp=1;if(blocked)s.fighters[0].effects['无法通过自身技能恢复体力']={start:1,end:2};
  s=E.resolveTurn(s,['wiki:'+move.id,'potion:pp']);const red=s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0),label=move.name+(binding.key.startsWith('4648:')?'伤害百分回复':''),heals=s.turns.at(-1).events.filter(e=>e.kind==='heal'&&e.text.startsWith('A 方 '+label+'：回复 ')),amount=heals.reduce((n,e)=>n+Number(e.text.match(/回复 (\d+) 点体力/)[1]),0),context=binding.key+' target '+enemyId+' blocked '+blocked;
  assert.ok(red&&red.settledDamage>1,context+' actual red');assert.equal(red.hpLoss,enemyId===3141?0:1,context+' actual hp loss');assert.equal(amount,blocked?0:Math.floor(red.settledDamage*binding.args[0]/100),context+' healing');assert.equal(s.fighters[0].pp['wiki:'+move.id],move.pp-1,context+' PP');
 }
});
