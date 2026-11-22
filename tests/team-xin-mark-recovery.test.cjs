'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
function fall(initialImmune=0){const lead=member(3102,[10127]);lead.build.resistance={fixed:17,percent:23};let g=T.create([[lead,member(3788,[],{def:1}),member(3056,[10127])],[member(3102,[10127],{atk:9999}),member(4925,[20020]),member(3550)]],[0,0],{seed:14,criticals:false});if(initialImmune>0)g.slots[0][2].fighter.counts.immune=initialImmune;g.slots[0][1].fighter.hp=1;g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.deepEqual([g.battle.teamXin1061[0].mark.start,g.battle.teamXin1061[0].mark.end],[2,4]);return g;}

test('天尊真实换入被击败授己方下三回辛印，实际继任与换人全队共享，毒粉在期限内免疫、到期真实中毒',()=>{
 let g=fall();g=T.replace(g,[0,null]);assert.equal(g.battle.round,2);assert.equal(E.SOULS.trait(g.battle.fighters[0],'ailmentImmune'),true);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.round,3);g=T.turn(g,[{switchTo:2},'wiki:20020']);assert.equal(g.active[0],2);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);g=T.turn(g,[pp,'wiki:20020']);assert.equal(g.battle.round,5);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);assert.notEqual(E.SOULS.trait(g.battle.fighters[0],'ailmentImmune'),true);g=T.turn(g,[pp,'wiki:20020']);assert.ok(g.battle.fighters[0].ailments['中毒']>=g.battle.round);assert.match(D.team(g,0).find(e=>e.name==='辛之印记').value,/已结束.*不能再次授予/);
});

test('真实死亡辛印经过公共结算组件免固免粉免弱免异，不免真实伤害且不消耗原次数免异',()=>{
 let g=fall(2);g=T.replace(g,[2,null]);const observations={},old=E.SOULS;
 E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeUse'&&c.a.side===1){for(const type of ['fixed','percent','true']){const hp=c.t.hp;c.hurt(c.t,300,'辛印公共分类边界',type);observations[type]=hp-c.t.hp;}const rank=c.t.stages.atk;c.stage(c.t,-1,['atk']);observations.weak=c.t.stages.atk-rank;observations.poison=c.ailment(c.t,'中毒',c.a);observations.charges=c.t.counts.immune;}}};
 try{g=T.turn(g,[pp,'wiki:10127']);}finally{E.SOULS=old;}
 assert.deepEqual(observations,{fixed:0,percent:0,true:300,weak:0,poison:false,charges:2});assert.ok(g.battle.damageEvents.some(e=>e.type==='true'&&e.settledDamage===300&&e.hpLoss===300));
});

test('辛印实际攻击强制暴击不依赖随机暴击开关，固定百分比有效抗性100不污染原配置且到期恢复',()=>{
 let g=fall();g=T.replace(g,[0,null]);const f=g.battle.fighters[0];assert.equal(f.build.resistance.fixed,17);assert.equal(f.build.resistance.percent,23);assert.equal(E.GEAR.damageResistance(f,'fixed'),100);assert.equal(E.GEAR.damageResistance(f,'percent'),100);const before=structuredClone(g);E.GEAR.mitigate(f,1000,'fixed');D.team(g,0);assert.deepEqual(g,before);
 g=T.turn(g,['wiki:10127',pp]);assert.ok(g.battle.damageEvents.some(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.match(g.history.filter(line=>line.startsWith('第 2 回合')).join('\n'),/致命一击/);g=T.turn(g,[pp,pp]);g=T.turn(g,[pp,pp]);assert.equal(g.battle.round,5);assert.equal(E.GEAR.damageResistance(g.battle.fighters[0],'fixed'),17);assert.equal(E.GEAR.damageResistance(g.battle.fighters[0],'percent'),23);
});

test('真实被击败首次发印后公开同源再次死亡授予组件拒绝，保持原时间不重开且不复活尸体',()=>{
 const g=fall(),mark=structuredClone(g.battle.teamXin1061[0].mark);assert.equal(E.grantXinDeath1061(g.battle,g.battle.fighters[0],8),false);assert.deepEqual(g.battle.teamXin1061[0].mark,mark);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.slots[0][1].fighter.soulState.xin.hp,0);
});

test('百罗鬼帝真实诅咒登场封被击败效果使天尊不发辛印，主人真死亡仍令辛死亡',()=>{
 let g=T.create([[member(3788),member(3056)],[member(3102),member(4444,[10361],{atk:1000}),member(4995)]],[0,0],{seed:2,criticals:false});assert.equal(g.active[1],0);g.battle.fighters[0].hp=1;g.battle.fighters[0].ailments['诅咒']=4;assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,1);assert.ok(T.candidates(g,1).includes(1));g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.fighters[0].soulState.defeatEffectsSuppressed.sourceSoul,2085);assert.ok(g.battle.fighters[0].soulState.xin.hp>0);g=T.turn(g,[pp,'wiki:10361']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[0].soulState.xin.hp,0);assert.equal(g.battle.teamXin1061,undefined);
});

test('实际零至五名阵亡队友使天尊闪避逐只6%，英雄圣殿真实圣光灵神翻倍，消逝不计且显示只读',()=>{
 const ids=[3102,3056,2988,3223,3524];
 for(const temple of [false,true])for(let dead=0;dead<=5;dead++){
  const foe=temple?member(3311,[12897]):member(3102,[10127]);let g=T.create([[member(3788),...ids.map(id=>member(id))],[foe]],[0,0],{seed:14,criticals:false});for(let i=1;i<=dead;i++)g.slots[0][i].fighter.hp=0;
  g=T.turn(g,[pp,temple?'wiki:12897':'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.xinDodgeChance1061,dead*.06*(temple?2:1));const before=structuredClone(g);assert.match(D.team(g,0).find(e=>e.name==='天尊阵亡闪避').value,new RegExp('^'+dead*6*(temple?2:1)+'%'));assert.deepEqual(g,before);
 }
 let h=T.create([[member(3788),member(3056)],[member(3102,[10127])]],[0,0],{seed:14,criticals:false});h.slots[0][1].fighter.hp=0;h.slots[0][1].fighter.soulState.vanished=true;h=T.turn(h,[pp,'wiki:10127']);assert.equal(h.battle.fighters[0].soulState.xinDodgeChance1061,0);
});

test('重生之翼真实被击败复活天尊后再次被击败不重授辛印，辛不会借复活重新召唤',()=>{
 let checked=0;
 for(let seed=1;seed<=24;seed++){
  let g=T.create([[member(3102),member(3788,[],{maxHp:10,def:1}),member(2987,[],{maxHp:1,def:1,spe:1})],[member(3102,[10127],{atk:9999,spe:9999})]],[0,0],{seed,criticals:false});
  g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);const mark=structuredClone(g.battle.teamXin1061[0].mark);g=T.replace(g,[2,null]);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);if(g.slots[0][1].fighter.hp<=0)continue;
  assert.equal(g.slots[0][1].fighter.hp,10);g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulState.xin.hp,0);assert.equal(Boolean(g.battle.fighters[0].soulState.xinFusion),false);assert.equal(g.battle.fighters[0].build.resistance.fixed,0);for(let attempt=0;attempt<8&&g.battle.fighters[0].hp>0;attempt++)g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);assert.deepEqual(g.battle.teamXin1061[0].mark,mark);checked++;
 }
 assert.ok(checked>0);
});

test('五名阵亡队友的实际三成闪避在初始种子组中有命中和闪避，未命中不产生攻击伤害事件',()=>{
 const seen=new Set();for(let seed=1;seed<=32;seed++){
  let g=T.create([[member(3788),...[3102,3056,2988,3223,3524].map(id=>member(id))],[member(3102,[10127])]],[0,0],{seed,criticals:false});for(const slot of g.slots[0].slice(1))slot.fighter.hp=0;
  g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.xinDodgeChance1061,.3);const red=(g.battle.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===1&&e.type==='attack');seen.add(red.length?'hit':'dodge');if(!red.length)assert.equal(g.battle.fighters[0].soulState.xin.hp,9000);
 }assert.deepEqual([...seen].sort(),['dodge','hit']);
});
