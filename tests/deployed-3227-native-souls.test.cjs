'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs');
test('3227原552及伙伴553完整原痛击分别附对方双防50或60固定，回复只取自身双防，零等级基数独立',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]])for(const[aDef,aSpd,bDef,bSpd]of[[500,1000,2000,3000],[1000,2000,2000,3000],[500,1000,3000,1000]]){const s=H.turn(H.make(10250,{soul,aHp:1000,aStats:{def:aDef,spd:aSpd},bStats:{def:bDef,spd:bSpd},aStages:{acc:6}}),10250);assert.equal(H.damage(s,'fixed'),(bDef+bSpd)*fraction);assert.equal(s.fighters[0].hp,1000+(aDef+aSpd)*fraction);assert.equal(H.damage(s,'percent'),0);assert.equal(H.damage(s,'true'),0);}
});
test('3227两原魂附固定遵守免固但不阻独立面板回复，保1不截断，魂回复受全禁疗而不受技能禁疗并封顶',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]])for(const mode of['immune','floor','all-ban','skill-ban','cap']){const s=H.turn(H.make(10250,{soul,aHp:mode==='cap'?8950:1000,bHp:mode==='floor'?1:9000,aStats:{def:1000,spd:2000},bStats:{def:2000,spd:3000},aStages:{acc:6},bGear:mode==='immune'?{resistance:{fixed:100}}:{},bEffects:mode==='floor'?{致命保留:{start:1,end:5,hp:1}}:{},aEffects:mode==='all-ban'?{四杀鬼囹:{start:1,end:5}}:mode==='skill-ban'?{技能禁疗:{start:1,end:5}}:{}}),10250);assert.equal(H.damage(s,'fixed'),mode==='immune'?0:5000*fraction);assert.equal(s.fighters[0].hp,mode==='cap'?9000:mode==='all-ban'?1000:1000+3000*fraction);if(mode==='floor')assert.equal(s.fighters[1].hp,1);}
});
test('3227两原魂基础红伤实际击败对手后不再附固伤，但自身按双防的独立回复仍执行',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]]){const s=H.turn(H.make(10250,{soul,aHp:1000,bHp:1,aStats:{def:1000,spd:2000},aStages:{acc:6}}),10250);assert.equal(s.fighters[1].hp,0);assert.ok(H.damage(s,'attack')>0);assert.equal(H.damage(s,'fixed'),0);assert.equal(s.fighters[0].hp,1000+3000*fraction);}
});
test('3227两原魂属性技能与真实MISS或整招封锁不触发攻击附固和独立攻击回复',()=>{
 for(const soul of[552,553]){let s=H.turn(H.make(20013,{soul,aHp:1000}),20013);assert.equal(s.fighters[0].hp,1000);assert.equal(H.damage(s,'fixed'),0);s=H.turn(H.make(10250,{soul,aHp:1000,aEffects:{skillBlock:{start:1,end:1}}}),10250);assert.equal(s.fighters[0].hp,1000);assert.equal(H.damage(s,'fixed'),0);let found=false;for(let seed=1;seed<=24&&!found;seed++){let miss=false;const old=H.E.SOULS;H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===0)miss=!!c.invalidReason?.miss;}};try{s=H.turn(H.make(10250,{soul,seed,aHp:1000,aStages:{acc:-6}}),10250);}finally{H.E.SOULS=old;}if(!miss)continue;found=true;assert.equal(H.damage(s,'fixed'),0);assert.equal(s.fighters[0].hp,1000);}assert.ok(found);}
});
test('3227两魂真实原沉默提升自身双防后攻击回复变3000或3600，对手原沉默则只改变固定附伤',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]]){let s=H.turn(H.make(20521,{soul,aHp:1000,aStats:{def:1000,spd:2000},bStats:{def:2000,spd:3000},extraMoves:[10250],aStages:{acc:6}}),20521);assert.equal(s.fighters[0].hp,1000);s=H.turn(s,10250);assert.equal(s.fighters[0].hp,1000+6000*fraction);assert.equal(H.damage(s,'fixed'),5000*fraction);let q=H.turn(H.make(10250,{soul,aHp:1000,aStats:{def:1000,spd:2000},enemyId:3227,enemyMoves:[20521],bStats:{def:2000,spd:3000},aStages:{acc:6}}),'potion:pp',20521);q=H.turn(q,10250);assert.equal(q.fighters[0].hp,1000+3000*fraction);assert.equal(H.damage(q,'fixed'),10000*fraction);}
});
