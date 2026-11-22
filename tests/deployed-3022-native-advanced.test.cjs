'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,loadout,make,turn}=require('./helpers/3022-native.cjs'),pp='potion:pp';
const detail=s=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail;
test('3022狂龙战吼2仅敌体严格低半威力140，等半及高半70；音速原生先制一真实慢速抢先',()=>{
 for(const[bHp,power]of[[4499,140],[4500,70],[4501,70]]){const s=turn(make(10616,{bHp}),10616);assert.ok(detail(s).includes('威力 '+power+' ·'));assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.settledDamage>0));}const s=turn(make(10613,{enemyMoves:[10086],aStats:{spe:1},bStats:{spe:9999}}),10613,10086);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);
});
test('3022龙子43恢复半上限封顶，技能禁疗只阻自身技能不阻低体魂印三分一',()=>{
 for(const[aHp,bHp,blocked,expected]of[[1000,2000,false,8500],[1000,2000,true,4000],[8999,1000,false,9000]]){const s=turn(make(24717,{aHp,bHp,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:2}}:{}}),24717);assert.equal(s.fighters[0].hp,expected);}
});
test('3022龙子886下次攻击忽双防45%，药剂和属性保留，只首个真实物攻或特攻消费且后续恢复原防',()=>{
 for(const attack of[10613,10622]){let s=turn(make(24717,{extraMoves:[attack,20269]}),24717);assert.equal(s.fighters[0].counts.nextDefenseIgnore,.45);s=turn(s,pp);assert.equal(s.fighters[0].counts.nextDefenseIgnore,.45);s=turn(s,20269);assert.equal(s.fighters[0].counts.nextDefenseIgnore,.45);s=turn(s,attack);assert.equal(s.fighters[0].counts.nextDefenseIgnore,undefined);assert.ok(detail(s).includes('/ 防御 2200 ·'));s=turn(s,attack);assert.ok(detail(s).includes('/ 防御 4000 ·'));}
});
test('3022第五882按不同正等级项目数每项30威力，不按等级合计；760真实远古微弱0点5按普通1计算',()=>{
 for(const[stages,power]of[[{},160],[{atk:6},190],[{atk:1,def:1,spa:1,spd:1,spe:1,acc:1},340],[{atk:-1,def:1,acc:-1},190]]){const s=turn(make(19230,{aStages:stages}),19230);assert.ok(detail(s).includes('威力 '+power+' ·'));assert.ok(s.damageEvents.find(e=>e.type==='attack').settledDamage>0);}const before=make(19230,{enemyId:3001}),m=before.moveDefinitions['wiki:19230'];assert.equal(E.typeEffectiveness(m.type,before.fighters[1].type,before.typeChart),.5);const out=turn(before,19230);assert.ok(detail(out).includes('属性 1 ×'));assert.ok(out.damageEvents.find(e=>e.type==='attack').settledDamage>0);
});
test('3022第五883真实连续命中叠下位上限比例伤害13到52封顶，真正继任者承受百分比伤害而上限保持',()=>{
 const T=require('../dist/team-engine.js'),store=require('../local-species.cjs');function member(id){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,id===3022?[19230]:[]),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000}}};}
 for(const count of[1,4,5]){let g=T.create([[member(3022)],[member(2989),member(3102)]],[0,0],{seed:14,criticals:false});for(let i=0;i<count;i++){g=T.turn(g,['wiki:19230',pp]);assert.equal(g.battle.fighters[1].stats.maxHp,9000);assert.equal(g.slots[1][1].fighter.stats.maxHp,9000);}g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.active[1],1);assert.equal(g.battle.fighters[1].stats.maxHp,9000);assert.equal(g.battle.fighters[1].hp,count===1?7830:4320);assert.equal(g.battle.damageEvents.filter(e=>e.round===g.battle.turns.at(-1).round&&e.type==='percent'&&e.sourceSide===0&&e.targetSide===1).reduce((n,e)=>n+e.settledDamage,0),count===1?1170:4680);}
});
