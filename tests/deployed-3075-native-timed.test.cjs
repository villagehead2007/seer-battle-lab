'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3075-native.cjs'),pp='potion:pp';
test('3075月下77当前三轮用技能回120第四停，幻色57四轮回复三分一第五停，与魂印150分别结算',()=>{
 for(const[id,last,n]of[[23402,3,120],[24825,4,3200]]){let s=make(id,{extraMoves:[10499],aHp:1,aStats:{maxHp:9600},aAilments:id===24825?{中毒:7}:{}}),hp=1;for(let r=1;r<=last+1;r++){s=turn(s,r===1?id:10499);hp=Math.min(9600,hp+(r<=last?n:0))-(id===24825?1200:0)+150;assert.equal(s.fighters[0].hp,hp);}s=turn(make(id,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:3}}}),id);assert.equal(s.fighters[0].hp,1150);s=turn(make(id,{aHp:1000}),id);const before=s.fighters[0].hp;s=turn(s,pp);assert.equal(s.fighters[0].hp,before+150);}
});
test('3075念力48四轮免原生睡眠第五恢复，幻色191四轮反弹原生睡眠第五恢复',()=>{
 for(const id of[23400,24825]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);if(id===24825)assert.ok(s.fighters[1].ailments['睡眠']);for(let r=3;r<=4;r++)s=turn(s,pp);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
});
test('3075念力477两轮受真实冲顶令敌命中每次降一，第三停，未受攻击药剂不削弱',()=>{
 let s=make(23400,{enemyMoves:[10086],bStages:{acc:6}});for(let r=1;r<=3;r++){s=turn(s,r===1?23400:pp,10086);assert.equal(s.fighters[1].stages.acc,r===1?5:4);}s=turn(make(23400),23400);assert.equal(s.fighters[1].stages.acc,0);
});
test('3075赤月469仅真实属性技能触发害怕，药剂不触发且第四轮新属性技能不再被施加',()=>{
 let s=make(23401,{enemyMoves:[20889]});s=turn(s,23401,20889);assert.ok(s.fighters[1].ailments['害怕']);for(let r=2;r<=3;r++)s=turn(s,pp);s=turn(s,pp,20889);assert.equal(s.fighters[1].ailments['害怕'],undefined);s=turn(make(23401),23401);assert.equal(s.fighters[1].ailments['害怕'],undefined);
});
