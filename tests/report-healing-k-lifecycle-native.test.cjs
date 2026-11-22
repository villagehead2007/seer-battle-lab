'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/report-restriction-native.cjs'),{T,pp}=H;
// Only fixture source identifiers are extended before any battle is created.
H.defs.K={id:3875,move:33345,effect:679,args:[3],key:'技能禁疗'};
test('报告K原3875施放者离场仍封原目标技能回血，继任真实断回合获得两回合翻倍',()=>{const r=H.lifecycle('K','clear');assert.equal(r.reward.multiple,2);});
test('报告K原生目标离场不传继任，原目标返场不恢复旧禁疗且神泣无收益',()=>{const r=H.lifecycle('K','target');assert.equal(r.originalAfterReturn,undefined);assert.equal(r.reward,undefined);});
test('报告K原生技能禁疗自然到期后不再提供神泣断回合成功收益',()=>{const r=H.lifecycle('K','expired');assert.equal(r.reward,undefined);});
test('报告K原生25582实际回合保护阻止清除，神泣实际命中仍不获得成功收益',()=>{const r=H.lifecycle('K','protected');assert.equal(r.protectedEvent,true);assert.equal(r.reward,undefined);});
test('报告K原生实际23108自损死亡后选择补位，原目标的技能禁疗不传新成员',()=>{const r=H.targetDeath('K');assert.equal(r.newState,undefined);assert.equal(r.replacedNumber,'3008');});
test('报告K原3875施放者被真实攻击击败，己方继任后原目标禁疗仍在且可真实清除获益',()=>{const r=H.casterDeath('K');assert.equal(r.sourceDead,true);assert.equal(r.reward.multiple,2);});
test('报告K原3875仅封真实技能回复150，源离场后原目标血药仍实际恢复250',()=>{let result;for(let seed=1;seed<=32;seed++){let g=H.cast('K',seed,{targetId:3008,targetMoves:[24678],sourceStats:{atk:2000},targetStats:{def:300}});if(!g||9000-g.battle.fighters[1].hp<300)continue;const before=g.battle.fighters[1].hp;g=T.turn(g,[{switchTo:1},'wiki:24678']);assert.equal(g.battle.fighters[1].hp,before);const second=g.battle.fighters[1].hp;g=T.turn(g,[pp,'potion:hp']);assert.equal(g.battle.fighters[1].hp-second,250);result=g;break;}assert.ok(result);});
test('报告K原3875的技能禁疗不封真实410魂印回复，源离场后回满来自实际魂印',()=>{let g=H.cast('K',14,{targetId:3056,targetMoves:[10127]});assert.ok(g);const before=g.battle.fighters[1].hp;assert.ok(before<9000);g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.battle.fighters[1].hp,9000);assert.ok(g.battle.fighters[1].hp>before);assert.equal(g.battle.fighters[1].soulId,410);assert.ok(H.current(g,'技能禁疗'));});
test.after(()=>console.log('REPORT_K_NATIVE_LIFECYCLE_TRACES '+JSON.stringify(H.report())));
