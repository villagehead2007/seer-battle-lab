'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,skills=[],overrides={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
const make=(id,skills=[])=>T.create([[member(id,skills),member(3102)],[member(3056)]],[0,0],{seed:14,criticals:false});
const red=g=>g.battle.damageEvents.filter(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
test('吉甘提卡真实第五交换满体效果，离场返场复原未交换态，原生触角用后重新附300固定而非保留交换零值',()=>{
 let g=make(4704,[10559]);g=T.turn(g,['wiki:37713','potion:pp']);assert.equal(g.battle.fighters[0].soulState.gigan1908.flipped,true);assert.equal(g.battle.fighters[0].soulState.gigan1908.attackCount,10);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.gigan1908.flipped,false);assert.equal(g.battle.fighters[0].soulState.gigan1908.attackCount,0);g=T.turn(g,['wiki:10559','potion:pp']);assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='fixed'&&e.settledDamage===300));
});
test('吉甘提卡交换、卡塔两首次资源和仙人掌回复加成中文读取实际状态且只读',()=>{
 for(const [id,name,pattern,skill]of [[4704,'体力效果交换',/已交换.*下场/,37713],[4707,'首次属性瘫痪',/已用/,20038],[4734,'本次在场回复加成',/20%.*下场/,'potion:pp']]){let g=make(id,typeof skill==='number'?[skill]:[]);g=T.turn(g,[typeof skill==='number'?'wiki:'+skill:skill,'potion:pp']);const before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name===name).value,pattern);assert.deepEqual(g,before);}
});
test('卡塔真实首次铁臂与撞击分别消费属性攻击资源，换下返场重授两次资格且真实撞击再次双倍伤害',()=>{
 let g=make(4707,[20038,10001]);g=T.turn(g,['wiki:20038','potion:pp']);assert.equal(g.battle.fighters[0].soulState.kata1910.statusReady,false);g=T.turn(g,['wiki:10001','potion:pp']);assert.equal(g.battle.fighters[0].soulState.kata1910.attackReady,false);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);const st=g.battle.fighters[0].soulState.kata1910;assert.equal(st.statusReady,true);assert.equal(st.attackReady,true);const control=structuredClone(g);control.battle.fighters[0].soulState.kata1910.attackReady=false;const ordinary=T.turn(control,['wiki:10001','potion:pp']);g=T.turn(g,['wiki:10001','potion:pp']);assert.ok(red(ordinary)>0);assert.ok(Math.abs(red(g)-red(ordinary)*2)<=1);assert.equal(g.battle.fighters[0].soulState.kata1910.attackReady,false);assert.equal(g.battle.fighters[0].soulState.kata1910.statusReady,true);
});
test('巨型仙人掌真实五次战阶回复加成封顶100，主动下场清除，返场首个战阶仅重新累加20',()=>{
 let g=make(4734);for(let i=0;i<6;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.cactus1933.healingBonus,1);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.cactus1933?.healingBonus??0,0);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.cactus1933.healingBonus,.2);assert.equal(g.battle.fighters[0].soulState.cactus1933.phases.length,1);
});
