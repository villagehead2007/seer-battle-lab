'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs');
const pp='potion:pp',profiles=[{kind:'clear',enemyId:3221,remove:16600,probe:23641,marker:'免异常'},{kind:'steal',enemyId:3223,remove:30066,probe:25143,marker:'强化被清封属'}];
function make(soul,p,extra={}){return H.make(25143,{soul,enemyId:p.enemyId,enemyMoves:[p.remove,p.probe],aStats:{spe:4000},bStats:{spe:100},bStages:{acc:6},...extra});}
test('3223两原魂两原1025自身禁强化仍清对手正级、不获正级且不获成功回复，原PP实际扣除',()=>{
 for(const soul of[558,566])for(const move of[30066,30071]){const input=H.make(move,{soul,aHp:5000,aStages:{acc:6},bStages:{atk:2,def:1},aEffects:{禁强化:{start:1,end:5}}}),oldPP=input.fighters[0].pp['wiki:'+move],s=H.turn(input,move);assert.equal(s.fighters[0].soulHash,soul===558?'d120b40f':'e78ded43');assert.equal(s.fighters[0].pp['wiki:'+move],oldPP-1);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].hp,5000);}
});
test('3223原25143之834实际正强化被原16600清除或原30066吸取才封对方属性，二回合后正常出招',()=>{
 for(const soul of[558,566])for(const p of profiles){let s=H.turn(make(soul,p),25143);assert.equal(s.fighters[0].effects.强化被清封属.end,4);assert.equal(s.fighters[0].stages.atk,2);s=H.turn(s,pp,p.remove);assert.equal(s.fighters[0].stages.atk,0);assert.deepEqual([s.fighters[1].effects.statusBlock.start,s.fighters[1].effects.statusBlock.end],[3,4]);for(let r=3;r<=4;r++){s=H.turn(s,pp,p.probe);assert.equal(s.fighters[1].effects[p.marker],undefined,'下两回合仍封属性：'+p.kind+'/'+r);}s=H.turn(s,pp,p.probe);assert.ok(s.fighters[1].effects[p.marker],'回合5恢复真实属性招：'+p.kind);}
});
test('3223原834零正强化不假触发且四回合观察窗结束后的真实消强吸强不封属',()=>{
 for(const soul of[558,566])for(const p of profiles){let s=H.turn(make(soul,p,{aEffects:{禁强化:{start:1,end:5}}}),25143);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));assert.ok(s.fighters[0].effects.强化被清封属);s=H.turn(s,pp,p.remove);assert.equal(s.fighters[1].effects.statusBlock,undefined,'没有正强化不能发生被消除事件');s=H.turn(s,pp,p.probe);assert.ok(s.fighters[1].effects[p.marker]);s=H.turn(make(soul,p),25143);for(let r=2;r<=4;r++)s=H.turn(s,pp);s=H.turn(s,pp,p.remove);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].effects.强化被清封属,undefined);assert.equal(s.fighters[1].effects.statusBlock,undefined,'观察窗到期不补发封属');}
});
