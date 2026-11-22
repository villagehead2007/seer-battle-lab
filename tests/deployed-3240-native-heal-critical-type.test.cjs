'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240罗刹瞬428仅天敌属性原固定120，中性或弱效目标不附，粉免不删原红',()=>{
 for(const[enemyId,expected]of[[2989,120],[3211,0],[3056,0]])for(const immune of[false,true]){const s=H.turn(H.make(15885,{enemyId,aStages:{acc:6},bEffects:immune?{固定百分比免疫:{start:1,end:4}}:{}}),15885);assert.equal(H.damage(s,'fixed'),immune?0:expected);assert.ok(H.damage(s,'attack')>0);assert.equal(H.E.typeEffectiveness(s.fighters[1].type,s.fighters[0].type)>1,expected===120);}
});
test('3240罗刹谶原击败回复三分一未击败五分一，技能禁疗保留魂回血、全禁疗均阻且满体封顶',()=>{
 for(const ko of[false,true])for(const ban of['none','skill','all']){const s=H.turn(H.make(15887,{aHp:1000,aStages:{acc:6},bHp:ko?1:9000,aEffects:ban==='skill'?{技能禁疗:{start:1,end:4}}:ban==='all'?{四杀鬼囹:{start:1,end:4}}:{}}),15887),red=H.damage(s,'attack');assert.ok(red>0);assert.equal(s.fighters[1].hp===0,ko);assert.equal(s.fighters[0].hp,1000+(ban==='all'?0:Math.floor(red*.6))+(ban==='none'?(ko?3000:1800):0));}const cap=H.turn(H.make(15887,{aHp:8999,aStages:{acc:6}}),15887);assert.equal(cap.fighters[0].hp,9000);
});
test('3240邪神降临58仅下两回合原抽打必暴，施放当回合无攻击，第四回正常且命中强化保留',()=>{
 let s=H.turn(H.make(23239,{extraMoves:[10535]}),23239);assert.equal(H.damage(s,'attack'),0);assert.equal(s.fighters[0].stages.acc,2);assert.equal(s.fighters[0].effects['必定暴击'].start,2);assert.equal(s.fighters[0].effects['必定暴击'].end,3);for(let r=2;r<=4;r++){s=H.turn(s,10535);assert.ok(H.damage(s,'attack')>0);assert.equal(s.turns.at(-1).events.some(e=>e.text?.includes('致命一击')),r<=3);}
});
test('3240妖祭原191三回免反真实安魂曲，反弹到施术者且过期后原安魂曲正常催眠',()=>{
 // 保留原143，不能把对方初始命中+6当作反转后仍在；中间血药也不回满安魂曲PP。
 let found;for(let seed=1;seed<=24&&!found;seed++){let s=H.turn(H.make(23240,{seed,enemyId:3205,enemyMoves:[22053]}),23240);if(s.fighters[1].ailments.疲惫)continue;s=H.turn(s,'potion:pp',22053);if(!s.fighters[1].ailments.睡眠)continue;assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].effects.reflect.end,3);for(let r=3;r<=4;r++)s=H.turn(s,'potion:pp','potion:hp');s=H.turn(s,'potion:pp',22053);if(s.fighters[0].ailments.睡眠>=5)found=s;}assert.ok(found,'合法初始种子使原安魂曲两次均命中，不删143、不修改中途命中或PP');assert.equal(found.fighters[0].effects.reflect,undefined);assert.equal(found.fighters[1].pp['wiki:22053'],8);
});
