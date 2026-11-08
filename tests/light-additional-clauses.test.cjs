'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/light-source-battle.cjs');
test('第五43按最大体力回满，禁疗失败与满体力上限；盛凌868只在清强成功授下回合负先制',()=>{
 const healed=H.turn(H.make(38635,{index:2,hp:100}));assert.equal(healed.fighters[0].hp,900);const no=H.make(38635,{index:2,hp:100});H.timer(no,0,'技能禁疗');assert.equal(H.turn(no).fighters[0].hp,100);assert.equal(H.turn(H.make(38635,{index:2,hp:900})).fighters[0].hp,900);
 const s=H.make(38633,{index:2});s.fighters[1].stages.atk=2;const out=H.turn(s);assert.equal(out.fighters[1].stages.atk,0);assert.ok(Object.values(out.fighters[1].effects).some(x=>x.start===2&&x.end===2));const failed=H.make(38633,{index:2});failed.fighters[1].stages.atk=2;H.timer(failed,1,'强化保护');assert.equal(H.turn(failed).fighters[1].stages.atk,2);
});
test('SP1440两次免异同源刷新而非叠加，478封属实扣PP后无强化并到期',()=>{
 const s=H.make(29502,{id:13311,index:0});let out=H.turn(s);assert.equal(out.fighters[0].counts.immune,2);out=H.turn(out);assert.equal(out.fighters[0].counts.immune,2);
 const sealed=H.make(38625,{id:13311,index:1});const first=H.turn(sealed,38625,H.BOOST);assert.equal(first.fighters[1].pp['wiki:'+H.BOOST],19);assert.equal(first.fighters[1].stages.def,0);assert.equal(first.fighters[1].effects.statusBlock.end,2);const second=H.turn(first,H.WAIT,H.BOOST);assert.equal(second.fighters[1].stages.def,0);const expired=H.turn(second,H.WAIT,H.BOOST);assert.equal(expired.fighters[1].stages.def,1);
});
test('SP486下两回合实际无视防御强化，当前授予不提前生效且期满恢复防御倍率',()=>{
 const s=H.make(29503,{id:13311,index:3});s.fighters[1].stages.def=6;const first=H.turn(s);assert.equal(first.fighters[0].effects['无视对手强化'].start,2);assert.equal(first.fighters[1].stages.def,6);const plain=structuredClone(first);delete plain.fighters[0].effects['无视对手强化'];first.rng=plain.rng=2048;const a=H.sum(H.turn(first,H.HIT),'attack')-H.sum(first,'attack'),b=H.sum(H.turn(plain,H.HIT),'attack')-H.sum(plain,'attack');assert.ok(a>b*2);let last=H.turn(first,H.WAIT);last=H.turn(last,H.WAIT);last=H.turn(last,H.WAIT);assert.equal(last.fighters[0].effects['无视对手强化'],undefined);
});
test('同效果不同来源参数分别生效：四象免异5回合、烽火280上限3回合、SP必中暴击2回合',()=>{
 const five=H.turn(H.make(21506));assert.equal(five.fighters[0].effects['免异常'].end,5);
 const cap=H.make(30467,{index:0,enemyAttack:9999});let out=H.turn(cap,30467,H.HIT);assert.equal(H.sum(out,'attack',1),280);assert.equal(out.fighters[0].effects['攻击伤害上限'].end,3);
 const crit=H.turn(H.make(29503,{id:13311,index:2}));crit.criticals=true;let next=H.turn(crit,H.HIT);assert.ok(next.turns.at(-1).events.some(e=>e.text.includes('致命一击')));next=H.turn(next,H.HIT);assert.ok(next.turns.at(-1).events.some(e=>e.text.includes('致命一击')));assert.equal(next.fighters[0].effects['必定暴击'],undefined);
});
