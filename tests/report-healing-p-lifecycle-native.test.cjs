'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/report-restriction-native.cjs'),{T,pp}=H;
test('报告P原生施放者离场仍留原目标，己方继任实际断回合并获得两回合翻倍',()=>{const r=H.lifecycle('P','clear');assert.equal(r.reward.multiple,2);});
test('报告P原生目标离场不传继任，原目标返场不恢复旧限制且神泣无收益',()=>{const r=H.lifecycle('P','target');assert.equal(r.originalAfterReturn,undefined);assert.equal(r.reward,undefined);});
test('报告P原生限制自然到期后实际神泣不能凭旧限制得到成功收益',()=>{const r=H.lifecycle('P','expired');assert.equal(r.reward,undefined);});
test('报告P原生实际25582回合保护阻止清除，神泣命中仍不获断回合成功收益',()=>{const r=H.lifecycle('P','protected');assert.equal(r.protectedEvent,true);assert.equal(r.reward,undefined);});
test('报告P原4109药剂反转在源离场后真实血药扣250，瑞奥原技能仍恢复150',()=>{let g=H.cast('P',14,{targetId:3008,targetMoves:[24678]});assert.ok(g);const first=g.battle.fighters[1].hp;g=T.turn(g,[{switchTo:1},'potion:hp']);assert.equal(g.battle.fighters[1].hp-first,-250);const second=g.battle.fighters[1].hp;g=T.turn(g,[pp,'wiki:24678']);assert.equal(g.battle.fighters[1].hp-second,150);});
test('报告P原4109药剂反转不影响真实410魂印3000回复，施放轮与次回合起算保持',()=>{let g=H.cast('P',14,{targetId:3056,targetMoves:[10127]});assert.ok(g);assert.equal(g.battle.fighters[1].effects['药剂反转'].start,2);assert.equal(g.battle.fighters[1].effects['药剂反转'].end,6);const before=g.battle.fighters[1].hp;assert.ok(9000-before>=3000);g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.battle.fighters[1].hp-before,3000);assert.equal(g.battle.fighters[1].soulId,410);});
test.after(()=>console.log('REPORT_P_NATIVE_LIFECYCLE_TRACES '+JSON.stringify(H.report())));

test('报告P原生目标真实使用23108自损死亡后指定补位，已授限制不传新成员',()=>{const r=H.targetDeath('P');assert.equal(r.newState,undefined);assert.equal(r.replacedNumber,'3008');});
test('报告P原生施放者被真实攻击击败，继任后限制仍在原目标且真实断回合获益',()=>{const r=H.casterDeath('P');assert.equal(r.sourceDead,true);assert.equal(r.reward.multiple,2);});
