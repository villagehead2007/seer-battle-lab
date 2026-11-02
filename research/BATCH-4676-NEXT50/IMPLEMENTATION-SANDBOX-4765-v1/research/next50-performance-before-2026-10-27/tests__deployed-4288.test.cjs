'use strict';require('./deployed-4288-partial.test.cjs');require('./deployed-4288-answers.test.cjs');require('./deployed-4288-integration.test.cjs');

{const test=require('node:test'),assert=require('node:assert/strict');
test('4288原效果35真实六项增威回归，公共新答不改来源hash与负级规则',()=>{const H=require('./helpers/4288-battle.cjs'),m=H.source.moves.find(m=>m.effectIds.includes(35));assert.ok(m);assert.equal(H.source.effects.find(e=>e.id===35).revision,'seerapi:94f7d2fb');for(const [label,stages]of [['zero',{atk:0,def:0,spa:0,spd:0,spe:0,acc:0}],['positive',{atk:6,def:6,spa:6,spd:6,spe:6,acc:6}],['negative',{atk:-6,def:-6,spa:-6,spd:-6,spe:-6,acc:-6}],['mixed',{atk:2,def:-6,spa:3,spd:-6,spe:4,acc:5}]]){const s=H.make({moveId:m.id,index:null});Object.assign(s.fighters[1].stages,stages);const o=H.turn(s),bonus=Object.values(stages).reduce((n,v)=>n+Math.max(0,v),0),e=o.turns[0].events.find(e=>e.kind==='damage'&&e.detail?.startsWith('威力 '));assert.ok(e.detail.includes('威力 '+(m.power+bonus)+' ·'));assert.ok(o.fighters[1].hp<9000);assert.equal(o.fighters[0].pp[H.key(m.id)],m.pp-1);}});

}
