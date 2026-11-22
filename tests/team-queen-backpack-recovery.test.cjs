'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const make=()=>T.create([[[4854,[20249]],...[3056,3102,2988,4647,4648].map(id=>[id,[]])].map(([id,skills])=>member(id,skills)),[member(2988,[10054],{spa:1800})]],[0,0],{seed:14,criticals:false});
const red=g=>(g.battle.damageEvents??[]).filter(e=>e.round===g.battle.round-1&&e.sourceSide===1&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
test('西忒蕾妃真实一至六存活含自身按每只50吸取及每只5%红减，死亡替补不贡献，原生摆尾和敌纯旋风实际执行',()=>{
 for(let count=1;count<=6;count++){let g=make();g.slots[0].forEach((slot,i)=>{if(i>=count)slot.fighter.hp=0;});const control=structuredClone(g);control.slots[0].forEach((slot,i)=>{if(i>0)slot.fighter.hp=0;});const base=T.turn(control,['wiki:20249','wiki:10054']);g=T.turn(g,['wiki:20249','wiki:10054']);const fixed=g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===0&&e.targetSide===1&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0);assert.equal(fixed,count*50);assert.ok(red(base)>0);assert.ok(Math.abs(red(g)-red(base)*(1-count*.05)/.95)<=2);}
});
test('西忒蕾妃队友实际被击败后由玩家选回，原两存活吸取100即时变为仅自身50且理论回复相同',()=>{
 let g=T.create([[member(4854,[20249]),member(3102,[],{maxHp:1,spd:1})],[member(2988,[10054],{spa:1800})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=5000;g=T.turn(g,['wiki:20249','potion:pp']);assert.equal(g.battle.fighters[0].hp,5100);g=T.turn(g,[{switchTo:1},'wiki:10054']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);g=T.replace(g,[0,null]);g=T.turn(g,['wiki:20249','potion:pp']);assert.equal(g.battle.fighters[0].hp,5150);assert.equal(g.battle.damageEvents.filter(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),50);
});
test('西忒蕾妃实际低额旋风触发敌中毒后次回才获图特300盾，额外精灵只贡献存活计数且显示只读',()=>{
 let g=T.create([[member(4854,[20249]),member(4850),member(3102)],[member(2988,[10054],{spa:1800})]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:20249','wiki:10054']);assert.ok(g.battle.fighters[1].ailments['中毒']>=g.battle.round);assert.equal(g.battle.fighters[0].suitState.shield,0);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,300);const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='背包存活贡献').value,/3 只.*15%.*150 点/);assert.match(D.team(g,0).find(x=>x.name==='图特搭配护盾').value,/图特摩斯.*300护盾/);assert.deepEqual(g,before);
 g=make();g.battle.extraStar2584=[{number:3291,alive:true},null];g=T.turn(g,['wiki:20249','potion:pp']);assert.equal(g.slots[0].length,6);assert.equal(g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),350);assert.match(D.team(g,0).find(x=>x.name==='背包存活贡献').value,/7 只.*35%.*350 点/);
});
test('西忒蕾妃真实背包有图特摩斯且敌中毒时回初授300同源盾，普通阵亡仍存在、消逝或无图特不授',()=>{
 for(const mode of ['alive','dead','vanished','absent']){let g=T.create([[member(4854),member(mode==='absent'?3102:4850)],[member(3056)]],[0,0],{seed:14,criticals:false});if(['dead','vanished'].includes(mode))g.slots[0][1].fighter.hp=0;if(mode==='vanished')g.slots[0][1].fighter.soulState.vanished=true;g.battle.fighters[1].ailments['中毒']=5;g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,['alive','dead'].includes(mode)?300:0);}
});
