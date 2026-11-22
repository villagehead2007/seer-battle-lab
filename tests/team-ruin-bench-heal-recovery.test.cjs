'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,stats={}){const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const make=()=>T.create([[member(4922),... [3102,3056,2988,4647,4648].map(id=>member(id))],[member(3056)]],[0,0],{seed:14,criticals:false});
test('墟婆真实战阶扣当前7000的1400，五名场下分别回复实扣量、溢出封顶且尸体不复活',()=>{
 let g=make();g.battle.fighters[0].hp=7000;const hp=[1000,8000,9000,0,8000];g.slots[0].slice(1).forEach((slot,i)=>slot.fighter.hp=hp[i]);g.slots[0][5].fighter.effects['回复效果削减']={start:1,end:9,fraction:.5};g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].hp,5600);assert.deepEqual(g.slots[0].slice(1).map(x=>x.fighter.hp),[2400,9000,9000,0,8700]);assert.ok(g.battle.healthLossEvents.some(e=>e.targetSide===0&&e.requested===1400&&e.hpLoss===1400));
});
test('墟婆场下回复战报注明各队友姓名，范围数排除阵亡者且读取不改状态',()=>{
 let g=make();g.slots[0][1].fighter.hp=1000;g.slots[0][2].fighter.hp=1000;g.slots[0][3].fighter.hp=0;const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='墟婆场下回复').value,/场下存活 4 名.*当前体力20%.*实耗量/);assert.deepEqual(g,before);g=T.turn(g,['potion:pp','potion:pp']);const text=g.battle.turns.at(-1).events.map(x=>x.text).join('\n');assert.match(text,/墟婆场下回复 · 斗天武神·瑞尔斯/);assert.match(text,/墟婆场下回复 · 圣甲·盖亚/);
});
test('墟婆严格扣后低半体才自回满，队友只取先前实际消耗；零消耗不奶，盾罩和免攻击不挡自身消耗',()=>{
 for(const start of [5625,5623,1]){let g=make();g.battle.fighters[0].hp=start;g.battle.fighters[0].suitState.shield=5000;g.battle.fighters[0].suitState.barrier=5000;g.battle.fighters[0].effects['攻击伤害免疫']={start:1,end:1};g.slots[0][1].fighter.hp=1000;g=T.turn(g,['potion:pp','potion:pp']);const paid=Math.floor(start*.2);assert.equal(g.slots[0][1].fighter.hp,1000+paid);assert.equal(g.battle.fighters[0].hp,start-paid<4500?9000:start-paid);assert.equal(g.battle.fighters[0].suitState.shield,5000);assert.equal(g.battle.fighters[0].suitState.barrier,5000);}
});
test('墟婆给场下的魂印回复不被技能禁疗挡住，完全削减才不回且逐人按真实剩余上限处理',()=>{
 let g=make();g.battle.fighters[0].hp=7000;for(let i=1;i<g.slots[0].length;i++)g.slots[0][i].fighter.hp=1000;g.slots[0][1].fighter.effects['技能禁疗']={start:1,end:9};g.slots[0][2].fighter.effects['回复效果削减']={start:1,end:9,fraction:1};g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.slots[0][1].fighter.hp,2400);assert.equal(g.slots[0][2].fighter.hp,1000);assert.equal(g.slots[0][3].fighter.hp,2400);
});
