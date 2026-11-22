'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/report-restriction-native.cjs'),{T,pp}=H;
test('报告C原生施放者离场仍留原目标，己方继任实际断回合并获得两回合翻倍',()=>{const r=H.lifecycle('C','clear');assert.equal(r.reward.multiple,2);});
test('报告C原生目标离场不传继任，原目标返场不恢复旧限制且神泣无收益',()=>{const r=H.lifecycle('C','target');assert.equal(r.originalAfterReturn,undefined);assert.equal(r.reward,undefined);});
test('报告C原生限制自然到期后实际神泣不能凭旧限制得到成功收益',()=>{const r=H.lifecycle('C','expired');assert.equal(r.reward,undefined);});
test('报告C原生实际25582回合保护阻止清除，神泣命中仍不获断回合成功收益',()=>{const r=H.lifecycle('C','protected');assert.equal(r.protectedEvent,true);assert.equal(r.reward,undefined);});
test('报告C原3971技能转伤在源离场后仍将瑞奥真实回复150转为50百分比伤害，血药照常回复250',()=>{let g=H.cast('C',14,{targetId:3008,targetMoves:[24678]});assert.ok(g);const first=g.battle.fighters[1].hp;g=T.turn(g,[{switchTo:1},'wiki:24678']);assert.equal(g.battle.fighters[1].hp-first,-50);assert.ok(g.battle.turns.at(-1).events.some(e=>e.damage?.type==='percent'&&e.damage.hpLoss===50&&e.text.includes('技能回复转伤害')));const second=g.battle.fighters[1].hp;g=T.turn(g,[pp,'potion:hp']);assert.equal(g.battle.fighters[1].hp-second,250);});
test('报告C原3971仅转技能来源，原目标真实410魂印回血仍正常且来源离场不撤销转伤',()=>{let g=H.cast('C',14,{targetId:3056,targetMoves:[10127]});assert.ok(g);const before=g.battle.fighters[1].hp;assert.ok(before<9000);g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.battle.fighters[1].hp,9000);assert.ok(g.battle.fighters[1].hp>before);assert.equal(g.battle.fighters[1].soulId,410);assert.ok(H.current(g,'技能回复转伤害'));assert.equal(g.battle.turns.at(-1).events.some(e=>e.text.includes('技能回复转伤害')),false);});
test.after(()=>console.log('REPORT_C_NATIVE_LIFECYCLE_TRACES '+JSON.stringify(H.report())));

test('报告C原生目标真实使用23108自损死亡后指定补位，已授限制不传新成员',()=>{const r=H.targetDeath('C');assert.equal(r.newState,undefined);assert.equal(r.replacedNumber,'3008');});
test('报告C原生施放者被真实攻击击败，继任后限制仍在原目标且真实断回合获益',()=>{const r=H.casterDeath('C');assert.equal(r.sourceDead,true);assert.equal(r.reward.multiple,2);});
