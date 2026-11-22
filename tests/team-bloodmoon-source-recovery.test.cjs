'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('真实双月碰撞按已有用户确认全部暂停三回合，暂停期场下星皇能指定，恢复后血月重新封锁',()=>{
 const caster=member(3432);if(!caster.moves.includes(29465))caster.moves[1]=29465;
 let g=T.create([[caster,member(3291)],[member(4147,2110)]],[0,0],{seed:13,criticals:false});
 for(const side of [0,1])assert.match(D.team(g,side).find(x=>x.name==='血月').value,/中立，等待归属 · 本场持续/);
 g.battle.fighters[0].hp=4500;g.battle.fighters[1].hp=4000;
 g=T.turn(g,['wiki:29465','potion:pp']);
 const moons=g.battle.celestials.filter(m=>['寒月','血月'].includes(m.name));
 assert.equal(moons.length,2);assert.ok(moons.every(m=>m.side===0&&m.suspendedUntil===3));
 const snapshot=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='血月').value,/暂停，余 2 回合/);assert.deepEqual(g,snapshot);
 const before=g.battle.fighters[0].hp;g=T.turn(g,['potion:pp','potion:pp']);
 assert.equal(g.battle.fighters[0].hp,Math.min(9000,before+1125));
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.round,4);
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.celestials.find(m=>m.name==='血月').side,0);assert.ok(g.battle.celestials.find(m=>m.name==='血月').suspendedUntil<g.battle.round);
 // The original transfer and suspension really elapsed above. Independent active-blood-moon / missing-HP initial boundary avoids a full-HP no-heal assertion.
 // Numerical missing-HP component clones the complete genuinely transferred/expired field, preserving all correlated lunar runtime state. It is not a claim of naturally taking damage.
 g=structuredClone(g);g.battle.fighters[0].hp=7000;g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].hp,7000);
 assert.equal(g.battle.celestials.find(m=>m.name==='血月').side,0);
 assert.match(D.team(g,0).find(x=>x.name==='血月').value,/己方持有/);
});
test('暂停的血月不拦场下封邪支援，恢复生效的血月则阻止两层护盾承伤加成',()=>{
 const caster=member(3432);if(!caster.moves.includes(29465))caster.moves[1]=29465;
 const king=member(3516,1985),foe=member(4147,2110);foe.build.overrides.atk=9999;if(!foe.moves.includes(10086))foe.moves[1]=10086;
 let g=T.create([[caster,king],[foe]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].hp=6000;g.battle.fighters[1].hp=4000;
 g.slots[0][1].fighter.soulState.sealLayers=2;g.battle.fighters[0].suitState.shield=500;g=T.turn(g,['wiki:29465','potion:pp']);assert.ok(g.battle.celestials.every(m=>m.suspendedUntil===3));
 const native=T.turn(g,['potion:pp','wiki:10086']);assert.ok(native.battle.turns.at(-1).events.some(e=>e.text.includes('护盾抵挡 600 点')));
 // The real native original-soul transfer and shield interaction are asserted above; only the following numerical counterfactual clones neutralize receiver nonlinearity.
 // The real transfer has finished. Neutralize the receiver's nonlinear
 // post-shield soul reduction in both controls to isolate shield capacity.
 g=structuredClone(g);g.battle.fighters[0].soulId=null;g.battle.fighters[0].soulHash=null;
 const active=structuredClone(g);for(const moon of active.battle.celestials)delete moon.suspendedUntil;
 const paused=T.turn(g,['potion:pp','wiki:10086']),blocked=T.turn(active,['potion:pp','wiki:10086']);
 assert.ok(paused.battle.turns.at(-1).events.some(e=>e.text.includes('护盾抵挡 600 点')));
 assert.ok(blocked.battle.turns.at(-1).events.some(e=>e.text.includes('护盾抵挡 500 点')));
 assert.equal(paused.battle.fighters[0].hp-blocked.battle.fighters[0].hp,100,JSON.stringify({paused:paused.battle.turns.at(-1).events.filter(e=>e.kind==='damage'),blocked:blocked.battle.turns.at(-1).events.filter(e=>e.kind==='damage')}));
});
