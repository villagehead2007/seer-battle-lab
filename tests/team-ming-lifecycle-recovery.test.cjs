'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
function make(extraA=[],extraB=[]){return T.create([[member(4785,[10001]),member(2988),...extraA],[member(3102,[10127,20117]),member(3056,[20117]),...extraB]],[0,0],{seed:14,criticals:false});}
test('用户确认痴愚真实换下保留且场下暂停解除判定，扣场下PP不抽随机数，返场恢复解除并反转双方',()=>{
 let g=make();const initialPP=g.battle.fighters[1].pp['wiki:20117'];g.battle.teamDream1972[1].crisis=20;g.battle.fighters[0].stages.atk=2;
 g=T.turn(g,[pp,{switchTo:1}]);let holder=g.slots[1][0].fighter;assert.ok(holder.soulState.chiyu1982);assert.equal(holder.pp['wiki:20117'],initialPP-1);assert.equal(g.battle.fighters[0].soulState.ming1982.drainPercent,1);
 let control=structuredClone(g);delete control.slots[1][0].fighter.soulState.chiyu1982;
 g=T.turn(g,[pp,pp]);control=T.turn(control,[pp,pp]);holder=g.slots[1][0].fighter;assert.ok(holder.soulState.chiyu1982);assert.equal(holder.pp['wiki:20117'],initialPP-2);assert.equal(control.slots[1][0].fighter.pp['wiki:20117'],initialPP-1);assert.equal(g.battle.rng,control.battle.rng);
 g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.chiyu1982,undefined);assert.equal(g.battle.fighters[0].stages.atk,-2);assert.equal(g.battle.teamDream1972[1].crisis,21);assert.equal(g.battle.fighters[0].soulState.ming1982.drainPercent,2);
});
test('铭唤真实下场不暂停当前痴愚持有者解除，真实气力提升在回末反转，返场汲取倍率按统一规则重置',()=>{
 let g=make();g.battle.teamDream1972[1].crisis=20;g.battle.fighters[0].soulState.ming1982.drainPercent=4;
 g=T.turn(g,[{switchTo:1},'wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,-1);assert.equal(g.battle.fighters[1].soulState.chiyu1982,undefined);assert.equal(g.slots[0][0].fighter.soulState.ming1982.drainPercent,1);
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.ming1982.drainPercent,2);assert.equal(g.battle.teamDream1972[1].crisis,21);
});
test('铭唤真实返场扫描所有活敌，活场下痴愚阻止新授，阵亡痴愚不阻止当前目标且真消逝返还共享危机',()=>{
 let g=make();g.battle.teamDream1972[1].crisis=20;
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);g=T.turn(g,[{switchTo:0},pp]);assert.ok(g.slots[1][0].fighter.soulState.chiyu1982);assert.equal(g.battle.fighters[1].soulState.chiyu1982,undefined);
 let h=T.create([[member(4785,[10001],{atk:9999,spe:9999}),member(2988)],[member(3102,[20117],{maxHp:10,def:1}),member(3056,[20117])]],[0,0],{seed:14,criticals:false});h.battle.teamDream1972[1].crisis=8;h.battle.fighters[1].soulState.crisisGained1982=7;
 h=T.turn(h,['wiki:10001',pp]);assert.equal(h.phase,'replace');h=T.replace(h,[null,1]);h=T.turn(h,[pp,pp]);assert.ok(h.slots[1][0].fighter.soulState.vanished);assert.equal(h.battle.teamDream1972[1].crisis,1);assert.equal(h.battle.fighters[0].soulState.ming1982.power,60);assert.equal(h.battle.fighters[0].soulState.ming1982.drainPercent,1);
});
test('仅铭唤共享双方危机而不创建希望之花，真实琉梦同队保留原花成长规则，读取只读',()=>{
 let g=make();assert.equal(g.battle.teamDream1972[0].flower,null);const before=JSON.stringify(g);D.team(g,0);assert.equal(JSON.stringify(g),before);g=T.turn(g,[pp,pp]);assert.equal(g.battle.teamDream1972[0].flower,null);assert.equal(g.battle.teamDream1972[1].crisis,2);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[1].soulState.dream1972.crisis,g.battle.teamDream1972[1].crisis);
 let h=make([member(4761)]);assert.equal(h.battle.teamDream1972[0].flower,0);h=T.turn(h,[pp,pp]);assert.equal(h.battle.teamDream1972[0].flower,2);
});
test('铭唤晚入时阵亡痴愚不挡新授，真实队伍消逝只处理一次，威力奖励本次攻击生效并下场重置',()=>{
 let g=T.create([[member(2988),member(4785,[10001])],[member(3102,[20117]),member(3056,[20117])]],[0,0],{seed:14,criticals:false});const corpse=g.slots[1][1].fighter;corpse.hp=0;corpse.soulState.chiyu1982={sourceSide:0};corpse.soulState.crisisGained1982=3;g.battle.teamDream1972[1].crisis=4;
 g=T.turn(g,[{switchTo:1},pp]);assert.ok(g.battle.fighters[1].soulState.chiyu1982);assert.ok(g.slots[1][1].fighter.soulState.vanished);assert.equal(g.battle.teamDream1972[1].crisis,2);assert.equal(g.battle.fighters[0].soulState.ming1982.power,30);assert.equal(g.battle.vanishEvents.length,1);
 let control=structuredClone(g);control.battle.fighters[0].soulState.ming1982.power=0;const a=T.turn(g,['wiki:10001',pp]),b=T.turn(control,['wiki:10001',pp]);const damage=h=>h.battle.damageEvents.filter(e=>e.round===h.battle.round-1&&e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);assert.ok(damage(a)>damage(b));g=T.turn(a,[{switchTo:0},pp]);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.ming1982.power,0);assert.equal(g.battle.vanishEvents.length,1);
});
