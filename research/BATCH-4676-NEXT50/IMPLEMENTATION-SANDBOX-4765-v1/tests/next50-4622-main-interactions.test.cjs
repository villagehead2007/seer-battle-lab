'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4622-battle.cjs'),entry=id=>H.entries.find(x=>x.id===id);
test('4622主线1829回合初烧伤使993真实全属性加2，烧伤被免时只加1且实际扣PP',()=>{
  const e=entry(993);for(const immune of [false,true]){const s=H.make(e,{soul:1829});if(immune)H.timer(s,1,'免异常');const o=H.turn(s);for(const k of H.keys)assert.equal(o.fighters[0].stages[k],immune?1:2);assert.equal(!!o.fighters[1].ailments['烧伤'],!immune);assert.equal(o.fighters[0].pp[H.key(e.moveId)],H.source.moves.find(m=>m.id===e.moveId).pp-1);assert.equal(o.fighters[0].hp,9000);if(immune)assert.equal(o.fighters[1].hp,9000);else assert.ok(o.fighters[1].hp<9000);}
});
test('4622主线1829先于本轮1002判定烧伤，使真实第五抢先而免烧对照由高速敌先手',()=>{
  const e=entry(1002);for(const immune of [false,true]){const s=H.make(e,{soul:1829,aStats:{spe:1},bStats:{spe:500}});if(immune)H.timer(s,1,'免异常');assert.equal(H.source.moves.find(m=>m.id===e.moveId).fifth,true);const o=H.turn(s,e.moveId,920040);assert.equal(o.turns[0].first,immune?1:0);assert.equal(o.fighters[0].pp[H.key(e.moveId)],4);assert.ok(o.fighters[0].hp<9000);assert.ok(o.fighters[1].hp<9000);assert.equal(!!o.fighters[1].ailments['烧伤'],!immune);}
});
test('4622主线1960本体KO即时保护，隔离实例1829回末真伤晚杀在回末补授真实保护',()=>{
  const e=entry(1960),direct=H.turn(H.make(e,{soul:1829,targetHp:1}));assert.equal(direct.fighters[1].hp,0);assert.ok(direct.fighters[0].effects['强化保护']);assert.equal(direct.fighters[0].pp[H.key(e.moveId)],4);
  // Isolate this original index2 from942. This verifies a real mixed-source guard;
  // it does not claim that every full-fifth loadout reaches this exact fixture.
  let s=H.make(e,{soul:1829,aStats:{atk:1},bStats:{def:3000}});s=H.turn(s,920031);assert.equal(s.fighters[0].soulState.intent1829,2);s.fighters[1].hp=10;H.timer(s,1,'固定百分比免疫');
  const old=H.E.SOULS;let seen;H.E.SOULS={...old,run(event,c){if(event==='roundEnd'&&c.a.soulId===1829){const before=c.t.hp;const out=old.run(event,c);seen={before,hp:c.t.hp,pp:c.a.pp[H.key(e.moveId)],layers:c.a.soulState.intent1829};return out;}return old.run(event,c);}};
  let result;try{result=H.turn(s);}finally{H.E.SOULS=old;}assert.ok(result.fighters[0].effects['强化保护']);assert.equal(result.fighters[0].soulState.sito1960Award.phase,'round-end');
  assert.ok(seen.before>0&&seen.before<10);assert.equal(seen.hp,0);assert.equal(seen.pp,4);assert.equal(seen.layers,4);
});
