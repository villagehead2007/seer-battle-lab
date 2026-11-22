'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242全部原23招整招无效不造成攻击与附伤但实际消耗PP，完整来源及两版魂保留',()=>{
 for(const soul of [567,568])for(const move of H.source.moves){const s=H.make(move.id,{soul,aEffects:{skillBlock:{start:1,end:1}}}),before=s.fighters[0].pp['wiki:'+move.id],out=H.turn(s,move.id);assert.equal(out.fighters[1].hp,9000,move.name);assert.equal(out.fighters[0].pp['wiki:'+move.id],before-1,move.name);assert.equal((out.damageEvents??[]).filter(e=>e.sourceSide===0).length,0,move.name);}
});
test('3242全部原23招疲惫未出招不消耗PP且技能不产生伤害，魂异常弱化仍独立发生',()=>{
 for(const move of H.source.moves){const s=H.make(move.id,{aAilments:{疲惫:1}}),before=s.fighters[0].pp['wiki:'+move.id],out=H.turn(s,move.id);assert.equal(out.fighters[0].pp['wiki:'+move.id],before,move.name);assert.equal(out.fighters[1].hp,9000,move.name);assert.equal((out.damageEvents??[]).filter(e=>e.sourceSide===0).length,0,move.name);assert.equal(Object.values(out.fighters[1].stages).filter(n=>n===-1).length,2);}
});
test('3242原非必中攻击MISS不造成红伤及技能附伤，仍消耗原PP，原必中不强造MISS',()=>{
 let checked=0;for(const move of H.source.moves.filter(m=>m.kind!=='status'&&!m.alwaysHit)){const s=H.make(move.id,{aEffects:{攻击必失:{start:1,end:1}}}),before=s.fighters[0].pp['wiki:'+move.id],out=H.turn(s,move.id);assert.equal(out.fighters[1].hp,9000,move.name);assert.equal((out.damageEvents??[]).filter(e=>e.sourceSide===0).length,0,move.name);assert.equal(out.fighters[0].pp['wiki:'+move.id],before-1,move.name);checked++;}assert.ok(checked>=10);
});
