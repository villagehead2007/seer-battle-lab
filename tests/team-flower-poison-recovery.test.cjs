'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const make=()=>T.create([[member(4854,[20249],{spe:1}),member(4750)],[member(2988,[10054],{spa:1800,spe:9999})]],[0,0],{seed:14,criticals:false});
test('云境灵兽真实存活场下把队友反击实际施加的敌中毒改为琼花，己方行动时1500真伤替代普通1125真伤且不重复结算',()=>{
 for(const alive of [true,false]){let g=make();if(!alive)g.slots[0][1].fighter.hp=0;g=T.turn(g,['wiki:20249','wiki:10054']);assert.ok(g.battle.fighters[1].ailments['中毒']>=g.battle.round);const damage=(type)=>(g.battle.damageEvents??[]).filter(e=>e.round===1&&e.targetSide===1&&e.type===type).reduce((n,e)=>n+e.settledDamage,0);assert.equal(damage('true'),alive?1500:1125);assert.equal(damage('percent'),0);}
});
test('云境场下光环与当前中毒替换说明各显示真实来源，用户确认零红不降血时封下一回合且不改原状态',()=>{
 let g=make();g=T.turn(g,['wiki:20249','wiki:10054']);const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='琼花中毒替换光环').value,/云境归真·始祖灵兽.*存活背包/);assert.match(D.team(g,1).find(x=>x.name==='中毒效果替换').value,/1\/6真伤.*HP药反转/);assert.deepEqual(g,before);
 g=T.create([[member(4750,[10003]),member(3056)],[member(3102)]],[0,0],{seed:14,criticals:false});g.battle.fighters[1].effects['攻击伤害免疫']={start:1,end:1};const original=structuredClone(g);const result=T.turn(g,['wiki:10003','potion:pp']);assert.equal(result.battle.fighters[1].effects['不能主动切换'].start,2);assert.equal(result.battle.fighters[1].effects['不能主动切换'].end,2);assert.deepEqual(g,original);
});
test('云境灵兽场下毒转琼花期间敌实际血药反转扣250，源实际换上被击败后继任时恢复普通中毒结算',()=>{
 let g=make();g.battle.fighters[1].ailments['中毒']=8;g.slots[0][1].fighter.hp=1;g=T.turn(g,['potion:pp','potion:hp']);assert.equal(g.battle.fighters[1].hp,7250);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('药剂反转')&&e.text.includes('250')));g=T.turn(g,[{switchTo:1},'wiki:10054']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);g=T.replace(g,[0,null]);g=T.turn(g,['potion:pp','potion:pp']);const poison=g.battle.damageEvents.filter(e=>e.round===g.battle.round-1&&e.targetSide===1&&e.type==='true');assert.equal(poison.length,1);assert.equal(poison[0].settledDamage,1125);assert.ok(!g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.targetSide===1&&e.type==='percent'));
});
