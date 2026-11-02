'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {make,turn,pick,timer,key}=require('./helpers/3763-battle.cjs');
const e=id=>pick(id)[0];
test('3763 1697百分比追加与免疫后真伤、非免疫零伤不冒充免疫',()=>{
 const s=make(e(1697)),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,2250);
 const im=make(e(1697));im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=2;const n=turn(im);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,2250);assert.ok(n.turns[0].events.some(x=>JSON.stringify(x).includes('百分比免疫追加')));
 const shield=make(e(1697));shield.fighters[1].suitState.barrier=3000;const sh=turn(shield);assert.equal(9000-sh.fighters[1].hp,sh.fighters[0].lastAttackDamage);assert.equal(sh.fighters[1].suitState.barrier,750);
 const no=make(e(1697));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
});
test('3763 1422护罩消失单次回复、部分消耗不回复、禁疗与满体边界',()=>{
 for(const hp of [1000,8999,9000]){const s=make(e(1422),{hp}),o=turn(s);assert.equal(o.fighters[0].suitState.barrier,300);assert.equal(o.fighters[0].hp,hp);
 o.moveDefinitions[key(900041)].operations=[{effectId:683,index:0,phase:'afterHit',params:[200,200],sourceArgs:[200,200]}];const part=turn(o,900031);assert.equal(part.fighters[0].suitState.barrier,100);assert.equal(part.fighters[0].hp,hp);
 const gone=turn(part,900031);assert.equal(gone.fighters[0].suitState.barrier,0);assert.equal(gone.fighters[0].hp,Math.min(9000,hp+300)-100);assert.equal(gone.fighters[0].soulState.barrierGoneHeal,undefined);
 const later=turn(gone,900031);assert.equal(later.fighters[0].hp,gone.fighters[0].hp-200);
 timer(part,0,'技能禁疗');assert.equal(turn(part,900031).fighters[0].hp,hp-100);
 }
});
test('3763 1400束缚复用回合清除响应，免疫与保护仍生效',()=>{
 const s=make(e(1400)),o=turn(s);o.moveDefinitions[key(900041)].operations=[{effectId:797,index:0,phase:'afterHit',params:[2],sourceArgs:[2]}];const n=turn(o,900031);assert.ok([3,4].includes(n.fighters[1].ailments['束缚']));assert.equal(n.fighters[0].effects['回合被清追加异常'],undefined);
 const im=structuredClone(o);im.fighters[1].counts.immune=1;assert.equal(turn(im,900031).fighters[1].ailments['束缚'],undefined);timer(o,0,'protect');assert.equal(turn(o,900031).fighters[1].ailments['束缚'],undefined);
});

test('3763 2287按实际回复追加、仅上限溢出转盾和禁疗减疗',()=>{
 for(const hp of [1000,8000,9000]){const s=make(e(2287),{hp}),o=turn(s),gain=Math.min(4500,9000-hp);assert.equal(o.fighters[0].hp,hp+gain);assert.equal(o.fighters[0].suitState.shield,4500-gain);assert.equal(o.fighters[1].hp,9000-gain);assert.equal(o.fighters[0].effects['用招回复溢出盾'].end,4);timer(s,0,'技能禁疗');const no=turn(s);assert.equal(no.fighters[0].hp,hp);assert.equal(no.fighters[0].suitState.shield,0);assert.equal(no.fighters[1].hp,9000);}
 const s=make(e(2287),{hp:8000});timer(s,0,'回复效果削减',{fraction:.7});const o=turn(s);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].suitState.shield,350);assert.equal(o.fighters[1].hp,8000);o.round=5;assert.equal(turn(o,900031).fighters[0].suitState.shield,350);
});
test('3763 1799只后手控失败保底，2116先手减疗及到期',()=>{
 for(const slow of [false,true]){const s=make(e(1799),{aStats:{spe:slow?1:500}}),o=turn(s);assert.equal(!!o.fighters[1].ailments['束缚'],slow);assert.equal(o.fighters[1].counts.nextAttackInvalid??0,0);s.fighters[1].counts.immune=1;const no=turn(s);assert.equal(no.fighters[1].counts.nextAttackInvalid??0,slow?1:0);if(slow){const used=turn(no,900031,900040);assert.equal(used.fighters[0].hp,9000);assert.equal(used.fighters[1].counts.nextAttackInvalid,0);}}
 for(const slow of [false,true]){const s=make(e(2116),{targetHp:1000,aStats:{spe:slow?1:500}});s.moveDefinitions[key(900041)].operations=[{effectId:43,index:0,phase:'afterHit',params:{fraction:.5},sourceArgs:[2]}];const o=turn(s);assert.equal(o.fighters[1].hp,1000-(o.fighters[0].lastAttackDamage??0)+(slow?4500:1350));const before=o.fighters[1].hp;const later=turn(o,900031);assert.equal(later.fighters[1].hp,Math.min(9000,before+4500));}
});
test('3763 1804选择消耗、双防视图、消强不触发且实际强化保留',()=>{
 const s=make(e(1804)),o=turn(s);assert.equal(o.fighters[0].counts.opponentBoostsAsWeak,2);o.fighters[1].stages.spd=2;o.fighters[1].stages.atk=3;
 const plain=structuredClone(o);plain.fighters[0].counts.opponentBoostsAsWeak=0;
 o.moveDefinitions[key(900030)].operations=[{effectId:868,index:0,phase:'afterHit',params:[3],sourceArgs:[3]}];const n=turn(o,900030),base=turn(plain,900030);assert.ok(n.fighters[0].lastAttackDamage>base.fighters[0].lastAttackDamage);assert.equal(n.fighters[1].stages.spd,2);assert.equal(n.fighters[1].stages.atk,3);assert.equal(n.fighters[0].counts.opponentBoostsAsWeak,1);assert.equal(n.fighters[1].effects['先制降低'],undefined);
 n.fighters[0].ailments['疲惫']=9;const controlled=turn(n,900030);assert.equal(controlled.fighters[0].counts.opponentBoostsAsWeak,0);assert.equal(controlled.fighters[0].pp[key(900030)],n.fighters[0].pp[key(900030)]);assert.equal(controlled.fighters[1].stages.spd,2);
 assert.equal(turn(o,900031).fighters[0].counts.opponentBoostsAsWeak,2);
});
test('3763 190受击清强、零伤也清、免强保护与177未命中回复',()=>{
 const s=make(e(190));s.fighters[1].stages.atk=2;const n=turn(s,s.auditMoveId,900040);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].effects['受击清强'].end,3);timer(s,0,'攻击伤害免疫');assert.equal(turn(s,s.auditMoveId,900040).fighters[1].stages.atk,0);timer(s,1,'幽蝶强化保护');assert.equal(turn(s,s.auditMoveId,900040).fighters[1].stages.atk,2);
 const m=make(e(177),{hp:1000});m.moveDefinitions[key(900040)].alwaysHit=false;timer(m,1,'攻击必失');const o=turn(m,m.auditMoveId,900040);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[0].effects['对手未命中回复'].end,3);timer(m,0,'技能禁疗');assert.equal(turn(m,m.auditMoveId,900040).fighters[0].hp,1000);delete m.fighters[0].effects['技能禁疗'];timer(m,1,'skillBlock');assert.equal(turn(m,m.auditMoveId,900040).fighters[0].hp,1000);
});
