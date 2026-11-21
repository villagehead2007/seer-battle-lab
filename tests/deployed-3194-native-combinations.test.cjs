'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3194-native.cjs'),pp='potion:pp';
test('3194全部28招原实例多阶段绑定和原魂hash保留，三代表招真实零PP疲惫不执行且输入只读',()=>{
 const before=structuredClone(H.source);assert.equal(H.source.moves.length,28);for(const m of H.source.moves){const c=H.E.WIKI.compile(m,H.source);assert.equal(c.issue,'');assert.deepEqual([...new Set(c.operations.map(o=>o.index))],m.effectInstances.map((_,i)=>i));for(const o of c.operations){assert.equal(o.effectId,m.effectInstances[o.index].id);assert.deepEqual(o.sourceArgs,m.effectInstances[o.index].args);}}
 for(const id of[10001,20044,19940]){let s=H.make(id);s.fighters[0].pp['wiki:'+id]=0;assert.throws(()=>H.turn(s,id),/有 PP/);s=H.turn(H.make(id,{aAilments:{疲惫:2}}),id);assert.equal(s.fighters[0].pp['wiki:'+id],H.source.moves.find(m=>m.id===id).pp);assert.equal(s.fighters[1].hp,9000);}assert.deepEqual(H.source,before);
});
test('3194万物1193严格低半先制二，1035原八成疲惫有成败，未触发才授下两轮攻击五成害怕',()=>{
 for(const hp of[4499,4500,4501]){const s=H.turn(H.make(25075,{aHp:hp}),25075);assert.equal(s.fighters[0].soulState.resolvedPriority.value,hp<4500?2:0);}
 const seen=new Set();for(let i=1;i<=32&&seen.size<2;i++){const s=H.turn(H.make(25075,{seed:'3194-1035-'+i}),25075),tired=!!s.fighters[1].ailments['疲惫'];seen.add(tired);assert.equal(!!s.fighters[0].effects['攻击概率异常'],!tired);if(!tired){assert.equal(s.fighters[0].effects['攻击概率异常'].start,2);assert.equal(s.fighters[0].effects['攻击概率异常'].end,3);assert.equal(s.fighters[0].effects['攻击概率异常'].chance,50);}}
 assert.equal(seen.size,2);const blocked=H.turn(H.make(25075,{bEffects:{免异常:{start:1,end:4}}}),25075);assert.equal(blocked.fighters[1].ailments['疲惫'],undefined);assert.equal(blocked.fighters[0].effects['攻击概率异常'].chance,50);
});
test('3194绝灭1001仅对手已有异常全强化二，971用招吸取与191反弹独立，神念原四项强化保留',()=>{
 for(const poisoned of[false,true]){const s=H.turn(H.make(25076,{bAilments:poisoned?{中毒:3}:{}}),25076);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===(poisoned?2:1)));assert.equal(s.fighters[0].effects['用招低体双吸'].end,4);assert.equal(s.fighters[0].effects.reflect.end,4);}
 const s=H.turn(H.make(23786),23786);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.acc,0);for(const k of['def','spa','spd','spe'])assert.equal(s.fighters[0].stages[k],1);
});
