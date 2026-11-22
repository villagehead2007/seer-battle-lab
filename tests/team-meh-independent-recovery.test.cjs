'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const pp='potion:pp';
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function meh(){const m=member(4853);m.moves=[38206,29229,38207,29230,38173];return m;}

test('永沐真实活或死场下来源均仍位于背包，毒气10%成功失败都附曝，100%不附且消逝来源不触发',()=>{
 const seen=new Set();for(let seed=1;seed<=48;seed++)for(const mode of ['alive','dead','vanished','high']){
  let g=T.create([[member(3102),meh()],[member(4925,[10114,20020])]],[0,0],{seed,criticals:false});if(mode==='dead')g.slots[0][1].fighter.hp=0;if(mode==='vanished'){g.slots[0][1].fighter.hp=0;g.slots[0][1].fighter.soulState.vanished=true;}
  g=T.turn(g,[pp,mode==='high'?'wiki:20020':'wiki:10114']);assert.equal(!!g.battle.fighters[1].soulState.exposure4853,!['high','vanished'].includes(mode));if(mode==='alive')seen.add(!!g.battle.fighters[0].ailments['中毒']);
  if(mode==='alive'||mode==='dead')assert.ok(g.battle.ailmentExecutions4853.some(e=>e.observerPosition===1&&e.chance===10&&e.allowed&&e.added));
 }assert.deepEqual(seen,new Set([false,true]));
});

test('薇尔诗真实活背包禁止场下永沐指定场上敌人，死源解除封锁；梅赫维特当前在场则不受该场下限制',()=>{
 for(const mode of ['blocked','dead-verse','active-meh']){
  let g=T.create([[member(3102),meh(),member(4000)],[member(4925,[10114])]],[mode==='active-meh'?1:0,0],{seed:14,criticals:false});if(mode==='dead-verse')g.slots[0][2].fighter.hp=0;g=T.turn(g,[pp,'wiki:10114']);assert.equal(!!g.battle.fighters[1].soulState.exposure4853,mode!=='blocked');if(mode==='blocked')assert.ok(g.battle.ailmentExecutions4853.some(e=>e.observerPosition===1&&!e.allowed&&!e.added));
 }
});

test('破黯穿穹每句与别句相同都计50场下回复，两句同词回100、四句同词回200、四不同不回，死者消逝不复活',()=>{
 for(const [list,expected]of [[[2372,2372,2373,2374],100],[[2372,2372,2372,2372],200],[[2372,2373,2374,2375],0]]){
  let g=T.create([[meh(),member(3102),member(3056),member(2988),member(3223)],[member(3102)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=6000;g.battle.fighters[0].soulState.lyrics4853={list:list.slice(),gainedRound:0,equipped:{}};g.slots[0][1].fighter.hp=1000;g.slots[0][1].fighter.effects['无法通过自身技能恢复体力']={start:1,end:3};g.slots[0][2].fighter.hp=8990;g.slots[0][3].fighter.hp=0;g.slots[0][4].fighter.hp=0;g.slots[0][4].fighter.soulState.vanished=true;
  g=T.turn(g,['wiki:38206',pp]);assert.equal(g.slots[0][1].fighter.hp,1000+expected);assert.equal(g.slots[0][2].fighter.hp,Math.min(9000,8990+expected));assert.equal(g.slots[0][3].fighter.hp,0);assert.equal(g.slots[0][4].fighter.hp,0);assert.equal(g.battle.fighters[0].hp,6000);const burst=g.battle.fighters[0].soulState.lyricBursts4853[0];assert.equal(burst.repeated,expected/50);assert.equal(burst.different,new Set(list).size);assert.equal(burst.benchHealing.length,2);assert.ok(burst.benchHealing.every(e=>e.requested===expected));assert.deepEqual(g.battle.fighters[0].soulState.lyrics4853.list,[]);
 }
});

test('玄武使梅赫维特实际驱逐离场后余晖只给紧接的一位一回反弹，隔位不重授；本人面对曝再入回满HP和PP',()=>{
 let g=T.create([[meh(),member(3102),member(3056)],[member(4925,[10114,20020]),member(4995)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=6000;g=T.turn(g,['wiki:38206','wiki:10114']);assert.ok(g.battle.fighters[1].soulState.exposure4853);assert.ok(g.battle.fighters[0].hp<9000);assert.equal(g.battle.fighters[0].pp['wiki:38206'],39);assert.equal(g.battle.fighters[1].ailments['中毒'],undefined);
 g=T.turn(g,[{switchTo:1},'wiki:20020']);assert.equal(g.active[0],1);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);assert.equal(g.battle.fighters[0].effects.reflect,undefined);assert.ok(g.battle.fighters[1].ailments['中毒']);
 g=T.turn(g,['potion:hp','wiki:20020']);assert.ok(g.battle.fighters[0].ailments['中毒']);
 g=T.turn(g,[{switchTo:2},'wiki:20020']);assert.equal(g.battle.fighters[0].effects.reflect,undefined);assert.ok(g.battle.fighters[0].ailments['中毒']);
 g=T.turn(g,[{switchTo:0},'wiki:20020']);assert.equal(g.battle.fighters[0].hp,9000);assert.equal(g.battle.fighters[0].pp['wiki:38206'],39);/* 朝曦回满40后，中切自动一号位真实消耗1PP。 */assert.equal(g.battle.fighters[0].soulState.mehSwitchIn2038.move,'wiki:38206');assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);assert.equal(g.battle.fighters[0].effects.reflect,undefined);assert.equal(g.battle.teamEntryGrants[0].length,0);
});

test('对手没有曝的真实驱逐离场不凭余晖给继任反弹，继任仍被原生毒粉实际中毒',()=>{
 let g=T.create([[meh(),member(3102)],[member(4925,[20020]),member(4995)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:38206','wiki:20020']);assert.equal(g.battle.fighters[1].soulState.exposure4853,undefined);g=T.turn(g,[{switchTo:1},'wiki:20020']);assert.equal(g.battle.fighters[0].effects.reflect,undefined);assert.ok(g.battle.fighters[0].ailments['中毒']);
});
