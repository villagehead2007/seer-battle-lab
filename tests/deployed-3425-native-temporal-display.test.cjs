'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{versions,pp,make,turn,equipped,firstFailure}=require('./helpers/3425-status-native.cjs');
const rows=g=>D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions,g.battle).items.filter(x=>x.name.startsWith('奥斯卡 · '));
test('3425四真实版本原攻击生成奖励在下一待执行回合显示正确红增伤和100%红伤回复，药剂跳过后不显示过期资格',()=>{
 for(const source of versions){let g=turn(make(source),'wiki:10047'),item=rows(g).find(x=>x.name==='奥斯卡 · 当回合奖励');assert.ok(item);assert.ok(item.value.includes('第 2 回合可用'));assert.ok(item.value.includes('红伤 +'+(g.battle.fighters[0].soulId===1030?100:50)+'%'));assert.ok(item.value.includes('按完整红伤100%回复'));assert.ok(item.value.includes('下场清除'));g=turn(g);assert.equal(g.battle.round,3);assert.equal(rows(g).some(x=>x.name.includes('奖励')),false);}
});
test('3425真实失败保底显示区分740下回合与1030下一次，跨药剂回合仅1030保留且实际成功封属后移除',()=>{
 for(const source of versions.filter(v=>!equipped(make(v)))){let{g}=firstFailure(source,'3425-ui-guard'),item=rows(g).find(x=>x.name==='奥斯卡 · 封属保底');assert.ok(item);assert.ok(item.value.includes(g.battle.fighters[0].soulId===1030?'下次':'第 2 回合'));g=turn(g);const visible=rows(g).some(x=>x.name==='奥斯卡 · 封属保底');assert.equal(visible,g.battle.fighters[0].soulId===1030);if(visible){g=turn(g,pp,'wiki:20889');assert.equal(g.battle.fighters[1].stages.spe,1);assert.equal(rows(g).some(x=>x.name==='奥斯卡 · 封属保底'),false);}}
});
test('3425奖励真实离场后不作为场下保留资源显示，重新登场也无旧资格且不改战斗状态',()=>{
 for(const source of versions){let g=turn(make(source),'wiki:10047');assert.ok(rows(g).length);g=turn(g,{switchTo:1});const before=JSON.stringify(g),items=D.team(g,0);assert.equal(JSON.stringify(g),before);assert.equal(items.some(x=>x.name.includes('奥斯卡 · 当回合奖励')||x.name.includes('奥斯卡 · 待生效奖励')),false);g=turn(g,{switchTo:0});assert.equal(rows(g).some(x=>x.name.includes('奖励')),false);}
});
