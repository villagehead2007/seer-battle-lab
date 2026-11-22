'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3150-native.cjs');
test('3150复用旧全部技能原生接入，补22招原有序操作和源参数绑定、代表性零PP与疲惫，原档不改',()=>{
 const before=structuredClone(H.source);assert.equal(H.source.moves.length,22);for(const m of H.source.moves){const c=H.E.WIKI.compile(m,H.source);assert.equal(c.issue,'');assert.deepEqual([...new Set(c.operations.map(o=>o.index))],m.effectInstances.map((_,index)=>index));for(const o of c.operations){const raw=m.effectInstances[o.index];assert.equal(o.effectId,raw.id);assert.deepEqual(o.sourceArgs,raw.args);assert.ok(o.phase);}}
 for(const soul of[492,528])for(const id of[10006,20196,19765]){let s=H.make(id,{soul}),k='wiki:'+id,m=H.source.moves.find(m=>m.id===id);s.fighters[0].pp[k]=0;assert.throws(()=>H.turn(s,id),/有 PP/);s=H.turn(H.make(id,{soul,aAilments:{疲惫:2}}),id);assert.equal(s.fighters[0].pp[k],m.pp);assert.equal(s.fighters[1].hp,9000);}assert.deepEqual(H.source,before);
});
