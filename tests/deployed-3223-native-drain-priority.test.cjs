'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs');
test('3223两魂石破天惊597原授持续吸取后基础攻击真实击败仅剩1目标仍名义回复3000，禁疗与满体封顶分开',()=>{
 for(const soul of[558,566])for(const mode of['normal','ban','cap']){let s=H.turn(H.make(25142,{soul,aHp:mode==='cap'?5500:1000,bHp:3001,extraMoves:[10127],aStages:{acc:6},aEffects:mode==='ban'?{技能禁疗:{start:2,end:2}}:{}}),25142);assert.equal(s.fighters[1].hp,1);assert.equal(s.fighters[0].hp,mode==='cap'?8500:4000);s=H.turn(s,10127);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].hp,mode==='cap'?9000:mode==='ban'?4000:7000);assert.equal(H.damage(s,'percent'),0,'目标基础红伤已阵亡不再产生额外吸取伤害事件');}
});
test('3223两魂石破天惊597原四回合技能吸取百分比3000免粉仍名义回血，药剂不触发，禁疗及到期独立',()=>{
 for(const soul of[558,566]){let s=H.turn(H.make(25142,{soul,aHp:1000,extraMoves:[20117],bGear:{resistance:{percent:100}},aEffects:{技能禁疗:{start:4,end:4}}}),25142);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[1].hp,9000);assert.equal(H.damage(s,'percent'),0);s=H.turn(s,20117);assert.equal(s.fighters[0].hp,7000);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].hp,7000);s=H.turn(s,20117);assert.equal(s.fighters[0].hp,7000);s=H.turn(s,20117);assert.equal(s.fighters[0].hp,7000);assert.equal(s.fighters[0].effects.用招吸取体力,undefined);}
});
test('3223两魂石破天惊191真实四回反弹原安魂曲，反弹优先于免异次数而不消费',()=>{
 for(const soul of[558,566]){let found=false;for(let seed=1;seed<=16&&!found;seed++){const s=H.turn(H.make(25142,{soul,seed,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},aCounts:{immune:1}}),25142,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].effects.reflect.end,4);found=!!s.fighters[1].ailments.睡眠;}assert.ok(found);}
});
test('3223狂决斗魇破828原任一正等级才先制增加一，零与负级不触发，原完整67仍保留',()=>{
 for(const stages of[{},{atk:-1},{atk:1},{def:1}]){const old=H.E.WIKI.effectsEngine,seen=[];H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.priority,result=old.run(phase,ops,c);if(phase==='beforeOrder'&&c.a.side===0)seen.push(c.priority-before);return result;}};try{const s=H.turn(H.make(30073,{aStages:stages}),30073);assert.ok(H.damage(s,'attack')>0);assert.ok(seen.length>0);assert.ok(seen.every(n=>n===(Object.values(stages).some(v=>v>0)?1:0)));}finally{H.E.WIKI.effectsEngine=old;}}
});
