'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs'),pp='potion:pp';
test('3141所有原物特招真实红伤遵守面板攻防本系相性浮动，首发愤怒40和夜袭先手120独立',()=>{
 for(const soul of[480,611])for(const m of H.source.moves.filter(m=>m.kind!=='status'&&m.power>0)){const s=H.make(m.id,{soul,aStages:{acc:6},enemyMoves:[10086]}),a=s.fighters[0],b=s.fighters[1],power=m.power*(m.id===10405?2:1),atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*power*atk/def)/50)+2,factor=H.E.sameTypeBonus(m.type,a.type,s.typeChart)*H.E.typeEffectiveness(m.type,b.type,s.typeChart),out=H.turn(s,m.id,10086),e=out.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack');assert.ok(e.settledDamage>=Math.floor(base*factor*.85)&&e.settledDamage<=Math.floor(base*factor),JSON.stringify({soul,id:m.id,base,factor,e}));}
});
test('3141愤怒原连续40至60至80封顶，属性技能真正打断连续后重返40',()=>{
 let s=H.make(10074,{extraMoves:[20496],aStages:{acc:6}});for(const power of[40,60,80,80]){s=H.turn(s,10074);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('威力 '+power+' '));}s=H.turn(s,20496);s=H.turn(s,10074);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('威力 40 '));
});
test('3141冲击仅严格低半威力双倍，夜袭后手不翻倍，幻影先手固定50后手无附伤',()=>{
 for(const hp of[4499,4500,4501]){const s=H.turn(H.make(10530,{bHp:hp,aStages:{acc:6}}),10530);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('威力 '+(hp<4500?100:50)+' '));}
 for(const first of[false,true])for(const id of[10405,14112]){const s=H.turn(H.make(id,{aHp:9000,bHp:9000,aStats:{spe:first?2000:1},enemyMoves:[10086],aStages:{acc:6}}),id,10086);assert.equal(s.turns.at(-1).first,first?0:1);if(id===10405)assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('威力 '+(first?120:60)+' '));else{const e=s.damageEvents.find(e=>e.sourceSide===0&&e.type==='fixed');if(first)assert.equal(e.settledDamage,50);else assert.equal(e,undefined);}}
});
