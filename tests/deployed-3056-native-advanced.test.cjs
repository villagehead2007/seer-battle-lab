'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3056-native.cjs'),pp='potion:pp';
test('3056激光31完整原生3至5段真实初始种子覆盖两端，每招只耗一PP且每段保独立红伤',()=>{
 let min=6,max=0;for(let seed=1;seed<=24;seed++){const s=turn(make(15966,{seed,aStages:{acc:6}}),15966),hits=s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0);min=Math.min(min,hits.length);max=Math.max(max,hits.length);assert.ok(hits.length>=3&&hits.length<=5);assert.ok(hits.every(e=>e.settledDamage>0&&e.attackValue===1200));assert.equal(s.fighters[0].pp['wiki:15966'],14);}assert.equal(min,3);assert.equal(max,5);
});
test('3056碎星459只按对手未计能力等级的防御面板40%附百分比1600，正负六不变且抗性100只挡百分比',()=>{
 for(const def of[-6,0,6]){const s=turn(make(15969,{bStages:{def},aStages:{acc:6}}),15969);assert.equal(s.damageEvents.find(e=>e.type==='percent'&&e.sourceSide===0).settledDamage,1600);assert.ok(s.damageEvents.find(e=>e.type==='attack').settledDamage>0);}const s=turn(make(15969,{bGear:{resistance:{percent:100}},aStages:{acc:6}}),15969);assert.equal(s.damageEvents.find(e=>e.type==='percent').settledDamage,0);assert.ok(s.damageEvents.find(e=>e.type==='attack').settledDamage>0);
});
test('3056天威456红伤后严格299秒杀300不秒，原生MISS不消耗PP以外的伤害效果',()=>{
 const options={aStages:{acc:6}},base=turn(make(19368,options),19368),damage=base.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;for(const n of[299,300]){const s=turn(make(19368,{...options,bHp:damage+n}),19368);assert.equal(s.fighters[1].hp,n===299?0:300);}let missed=false;for(let seed=1;seed<=48&&!missed;seed++){const s=turn(make(19368,{seed,bHp:299,aStages:{acc:-6}}),19368);if(!s.damageEvents?.some(e=>e.type==='attack'&&e.sourceSide===0)){missed=true;assert.equal(s.fighters[1].hp,299);assert.equal(s.fighters[0].pp['wiki:19368'],4);}}assert.ok(missed);
});
test('3056第五422按冥王保1实际红损零的完整红伤40%附固定，不按零HP损失；固定抗性独立',()=>{
 for(const blocked of[false,true]){const s=turn(make(19369,{enemyId:3141,bHp:1,bStats:{def:1000},bGear:blocked?{resistance:{fixed:100}}:{}}),19369),red=s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0),fixed=s.damageEvents.find(e=>e.type==='fixed'&&e.sourceSide===0);assert.ok(red.settledDamage>1);assert.equal(red.hpLoss,0);assert.equal(fixed.settledDamage,blocked?0:Math.floor(red.settledDamage*.4));assert.equal(s.fighters[0].pp['wiki:19369'],4);}
});
test('3056气魄894低体固定吸400等高体200，理论回复不随过量或抗性截断，技能禁疗仍只阻技能回复不阻魂印3000',()=>{
 for(const[aHp,bHp,n]of[[1000,9000,400],[5000,5000,200],[5001,5000,200],[1000,1,200]]){const s=turn(make(24779,{aHp,bHp}),24779),heal=s.turns.at(-1).events.find(e=>e.kind==='heal'&&e.text.startsWith('A 方 圣甲气魄'));assert.ok(heal.text.includes('回复 '+n+' 点'));const fixed=s.damageEvents.find(e=>e.type==='fixed'&&e.sourceSide===0);assert.equal(fixed.settledDamage,n);assert.equal(fixed.hpLoss,Math.min(bHp,n));}let s=turn(make(24779,{aHp:1000,bGear:{resistance:{fixed:100}}}),24779);assert.ok(s.turns.at(-1).events.some(e=>e.text==='A 方 圣甲气魄：回复 400 点体力。'));s=turn(make(24779,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),24779);assert.equal(s.fighters[0].hp,4000);assert.ok(s.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===400));s=turn(make(23285,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),23285);assert.equal(s.fighters[0].hp,4000);
});
