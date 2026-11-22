'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240原魂564回复按严格低半60否则40完整红，4499和4500及4501、全禁疗技能禁疗与封顶独立',()=>{
 for(const hp of[4499,4500,4501,8950])for(const mode of['normal','all-ban','skill-ban']){const s=H.turn(H.make(10535,{aHp:hp,aStats:{atk:4000},bStats:{def:1000},aEffects:mode==='all-ban'?{四杀鬼囹:{start:1,end:2}}:mode==='skill-ban'?{技能禁疗:{start:1,end:2}}:{}}),10535),red=H.damage(s,'attack');assert.ok(red>1);assert.equal(s.fighters[0].hp,mode==='all-ban'?hp:Math.min(9000,hp+Math.floor(red*(hp<4500?.6:.4))));}
});
test('3240原魂低伤授下次技能先制三，实际PP药不消费不使其过期，下一次原属性招使用后消耗',()=>{
 let s=H.turn(H.make(10535,{extraMoves:[20230],aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086]}),10535,10086);assert.ok(H.damage(s,'attack')<280);s=H.turn(s,'potion:pp');s=H.turn(s,20230,10086);assert.equal(s.turns.at(-1).first,0,'下次技能不能因前一回合吃药而过期');s=H.turn(s,20230,10086);assert.equal(s.turns.at(-1).first,1,'真实属性用招后仅消费一次，不再延续');
});
