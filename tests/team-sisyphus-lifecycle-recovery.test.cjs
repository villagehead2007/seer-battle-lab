'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(id===4905&&!moves.includes(20177))moves[1]=20177;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
{
const soul=2092;test('西西弗2092真实用招封顶六项后离场清个人增益，敌禁疗按原期限结束，返场重置且药剂不计次',()=>{
 const initial=soul===2092?1:2;let g=T.create([[member(4905,soul),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(let i=initial;i<=6;i++)g=T.turn(g,['wiki:20177','potion:pp']);
 let f=g.battle.fighters[0],st=f.soulState.sisy4905;assert.equal(st.nextCount,6);assert.equal(st.usesHere,7-initial);assert.deepEqual([...st.events.at(-1).selected].sort(),[0,1,2,3,4,5]);
 for(const name of ['必定暴击','无视对手强化','强化保护','西西弗魂印减伤','西西弗魂印战阶回复'])assert.ok(f.effects[name]);
 assert.equal(f.effects['西西弗魂印减伤'].fraction,soul===2092?.3:.5);assert.equal(f.effects['西西弗魂印战阶回复'].amount,soul===2092?300:400);
 const before=structuredClone(g),items=D.fighter(f,g.battle.round).items;assert.equal(items.find(x=>x.name==='下次用招触发效果').value,'6 / 6 项');assert.equal(items.find(x=>x.name==='本次在场已用技能').value,(7-initial)+' 次');assert.deepEqual(g,before);
 const ends=g.battle.fighters[1].effects['技能禁疗'].end;
 g=T.turn(g,[{switchTo:1},'potion:pp']);
 for(const name of ['必定暴击','无视对手强化','强化保护','西西弗魂印减伤','西西弗魂印战阶回复'])assert.equal(g.slots[0][0].fighter.effects[name],undefined);
 assert.equal(g.battle.turns.at(-1).round,ends);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text==='B 方 技能禁疗到期。'));assert.equal(g.battle.fighters[1].effects['技能禁疗'],undefined);
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[1].effects['技能禁疗'],undefined);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.sisy4905.nextCount,initial);assert.equal(g.battle.fighters[0].soulState.sisy4905.usesHere,0);
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.sisy4905.nextCount,initial);
 g=T.turn(g,['wiki:20177','potion:pp']);st=g.battle.fighters[0].soulState.sisy4905;assert.equal(st.events.at(-1).selected.length,initial);assert.equal(st.usesHere,1);assert.equal(st.nextCount,initial+1);
});

}

{
const soul=2106;test('西西弗2106真实用招封顶六项后离场清个人增益，敌禁疗按原期限结束，返场重置且药剂不计次',()=>{
 const initial=soul===2092?1:2;let g=T.create([[member(4905,soul),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(let i=initial;i<=6;i++)g=T.turn(g,['wiki:20177','potion:pp']);
 let f=g.battle.fighters[0],st=f.soulState.sisy4905;assert.equal(st.nextCount,6);assert.equal(st.usesHere,7-initial);assert.deepEqual([...st.events.at(-1).selected].sort(),[0,1,2,3,4,5]);
 for(const name of ['必定暴击','无视对手强化','强化保护','西西弗魂印减伤','西西弗魂印战阶回复'])assert.ok(f.effects[name]);
 assert.equal(f.effects['西西弗魂印减伤'].fraction,soul===2092?.3:.5);assert.equal(f.effects['西西弗魂印战阶回复'].amount,soul===2092?300:400);
 const before=structuredClone(g),items=D.fighter(f,g.battle.round).items;assert.equal(items.find(x=>x.name==='下次用招触发效果').value,'6 / 6 项');assert.equal(items.find(x=>x.name==='本次在场已用技能').value,(7-initial)+' 次');assert.deepEqual(g,before);
 const ends=g.battle.fighters[1].effects['技能禁疗'].end;
 g=T.turn(g,[{switchTo:1},'potion:pp']);
 for(const name of ['必定暴击','无视对手强化','强化保护','西西弗魂印减伤','西西弗魂印战阶回复'])assert.equal(g.slots[0][0].fighter.effects[name],undefined);
 assert.equal(g.battle.turns.at(-1).round,ends);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text==='B 方 技能禁疗到期。'));assert.equal(g.battle.fighters[1].effects['技能禁疗'],undefined);
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[1].effects['技能禁疗'],undefined);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.sisy4905.nextCount,initial);assert.equal(g.battle.fighters[0].soulState.sisy4905.usesHere,0);
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.sisy4905.nextCount,initial);
 g=T.turn(g,['wiki:20177','potion:pp']);st=g.battle.fighters[0].soulState.sisy4905;assert.equal(st.events.at(-1).selected.length,initial);assert.equal(st.usesHere,1);assert.equal(st.nextCount,initial+1);
});

}
