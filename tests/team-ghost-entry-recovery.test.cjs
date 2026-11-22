'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const [i,k]of skills.entries())if(!moves.includes(k))moves[i+1]=k;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,...stats}}};}
test('百罗鬼帝真实场下等待敌第五耗尽后返场按当前PP获得四鬼祰，药剂不触攻击阈值且离场清除旧鬼祰',()=>{
 let g=T.create([[member(4444),member(3056)],[member(3056)]],[0,0],{seed:14,criticals:false});assert.equal(E.GHOST_RULES.count(g.battle.fighters[0],g.battle.round),0);
 g=T.turn(g,[{switchTo:1},'wiki:19369']);for(let i=0;i<4;i++)g=T.turn(g,['potion:pp','wiki:19369']);assert.equal(g.battle.fighters[1].pp['wiki:19369'],0);
 const entry=g.battle.round;g=T.turn(g,[{switchTo:0},'potion:hp']);const f=g.battle.fighters[0];assert.equal(f.pp['wiki:38384'],4);assert.equal(E.GHOST_RULES.count(f,g.battle.round),4);for(const k of E.GHOST_RULES.kinds){assert.equal(f.effects['鬼祰·'+k].start,entry);assert.equal(f.effects['鬼祰·'+k].end,entry+1);}
 const before=structuredClone(g);assert.ok(E.describeEffects(f,g.battle.round).some(x=>x.includes('鬼祰·魑')));D.fighter(f,g.battle.round);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(E.GHOST_RULES.count(g.slots[0][0].fighter,g.battle.round),0);g=T.turn(g,[{switchTo:0},'potion:hp']);assert.equal(E.GHOST_RULES.count(g.battle.fighters[0],g.battle.round),0);
});
test('百罗鬼帝真实返场将龙予狂宴的狂暴转四回诅咒，源离场即结束本次禁被击败效果，返场按新敌重新判定',()=>{
 let g=T.create([[member(4444),member(3056)],[member(4186,[29188,29187]),member(3056)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,[{switchTo:1},'wiki:29188']);g=T.turn(g,['potion:pp','wiki:29187']);assert.ok(g.battle.fighters[1].ailments['狂暴']>=g.battle.round);
 const entry=g.battle.round;g=T.turn(g,[{switchTo:0},'potion:pp']);let f=g.battle.fighters[0],foe=g.battle.fighters[1];assert.equal(foe.ailments['狂暴'],undefined);assert.equal(foe.ailments['诅咒'],entry+3);assert.equal(f.soulState.ghostEntryCurse,true);assert.deepEqual(foe.soulState.defeatEffectsSuppressed,{sourceSoul:2085,sourceSide:0});
 const before=structuredClone(g);assert.match(D.fighter(f,g.battle.round).items.find(x=>x.name==='本次在场诅咒入场').value,/下场清除/);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.ghostEntryCurse,undefined);assert.equal(g.battle.fighters[1].soulState.defeatEffectsSuppressed,undefined);assert.ok(!D.fighter(g.slots[0][0].fighter,g.battle.round).items.some(x=>x.name==='本次在场诅咒入场'));
 g=T.turn(g,['potion:pp',{switchTo:1}]);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.ghostEntryCurse,undefined);assert.equal(g.battle.fighters[1].soulState.defeatEffectsSuppressed,undefined);
});
