'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round77-3407-lightning-native.cjs');
test('原3407强化魂2093物攻特攻使用前自然雷解3轮并获九劫1层，触发当次真实附加红伤六成且药剂不再获层自然到期',()=>{assert.equal(H.trigger().length,2);});
test('原3407强化魂2093属性技能和药剂不触发雷解九劫，低体与等体攻击也不触发',()=>{assert.equal(H.nonAttacks().length,4);});
test('原3407强化魂2093真实免异阻雷解不获九劫并即时令对手焚烬3轮，原攻击红伤独立不附雷解真实伤害',()=>{assert.equal(H.immunity(),true);});
test('原3407强化魂2093实际攻击MISS整招无效封命中仍触发使用时雷解，受控零PP不触发且零PP不改原状态',()=>{assert.equal(H.useGates().length,5);});
test.after(()=>console.log('ROUND77_3407_LIGHTNING_COUNTS '+JSON.stringify(H.report())));
