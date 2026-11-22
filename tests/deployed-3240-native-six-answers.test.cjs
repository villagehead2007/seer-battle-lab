'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240新答985：禁强仍清敌不获强化不授封属；正常及满六级成功，保护无正失败',()=>{
 for(const mode of['ban','normal','cap','protect','none']){let s=H.make(30145,{enemyMoves:[20889],aStages:{acc:6,...mode==='cap'?{atk:6,def:6}:{}},bStages:mode==='none'?{}:{atk:2,def:1},aEffects:mode==='ban'?{禁强化:{start:1,end:4}}:{},bEffects:mode==='protect'?{强化保护:{start:1,end:4}}:{}});s=H.turn(s,30145,20889);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0,mode);assert.equal(s.fighters[0].stages.atk,mode==='cap'?6:mode==='normal'?2:0,mode);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp',20889);assert.equal(s.fighters[1].stages.spe,['normal','cap'].includes(mode)?r===4?2:1:r,mode+r);}}
});
test('3240全局反弱1069：禁强负级归零不闪避，正常反正闪避，负锁与无负不授',()=>{
 for(const mode of['ban','normal','lock','none']){const s=H.turn(H.make(30147,{enemyMoves:[10086],aStages:{acc:6,atk:mode==='none'?0:-2,def:2},bStages:{acc:6},aEffects:mode==='ban'?{禁强化:{start:1,end:3}}:mode==='lock'?{弱化不可解除反转:{start:1,end:3}}:{}}),30147,10086);assert.equal(s.fighters[0].stages.atk,mode==='normal'?2:mode==='lock'?-2:0);assert.equal(Boolean(s.fighters[0].effects.概率闪避),mode==='normal');assert.equal(H.damage(s,'attack',1)>0,mode!=='normal');}
 let expiry=H.make(30147,{enemyMoves:[10086],aStages:{atk:-2,acc:6},bStages:{acc:6}});for(let r=1;r<=4;r++){expiry=H.turn(expiry,r===1?30147:'potion:pp',10086);assert.equal(H.damage(expiry,'attack',1)>0,r===4,'1069闪避三回期限R'+r);}
});
test('3240新答125：完整原3079多段红伤整回合共280，第二回重置，第三回到期且粉伤独立',()=>{
 let s=H.make(17389,{enemyId:3079,enemyMoves:[16103],aStats:{def:500,spe:4000},bStats:{atk:9999,spe:100},aEffects:{免异常:{start:1,end:4}}});for(let r=1;r<=3;r++){s=H.turn(s,r===1?17389:'potion:pp',16103);assert.equal(H.damage(s,'attack',1)===280,r<=2,'R'+r);if(r===3)assert.ok(H.damage(s,'attack',1)>280);assert.ok(H.damage(s,'percent',1)>0,'原魂425粉伤不混入红伤额度');}
 for(const controlled of[false,true]){const q=H.turn(H.make(17389,{enemyId:3079,enemyMoves:[16103],aStats:{def:500,spe:4000},bStats:{atk:9999,spe:100},bStages:{acc:6},aAilments:controlled?{疲惫:1}:{},aEffects:controlled?{}:{skillBlock:{start:1,end:1}}}),17389,16103);assert.equal(q.fighters[0].effects.攻击伤害上限,undefined);assert.ok(H.damage(q,'attack',1)>280,'未发动125不得限伤');}
});
test('3240新答580：按完整本次红伤40%反百分比，两回末到期，免百分比与免固定分别生效',()=>{
 for(const mode of['normal','fixed-immune','percent-immune']){let s=H.make(23241,{enemyMoves:[10086],bStats:{atk:6000},bStages:{acc:6},aStats:{def:1000},bGear:{resistance:{fixed:mode==='fixed-immune'?100:0,percent:mode==='percent-immune'?100:0}}});for(let r=1;r<=3;r++){s=H.turn(s,r===1?23241:'potion:pp',10086);const red=H.damage(s,'attack',1);assert.ok(red>0);assert.equal(H.damage(s,'percent'),r<=2&&mode!=='percent-immune'?Math.floor(red*.4):0,mode+r);assert.equal(H.damage(s,'fixed'),0);}}
});
test('3240新答703：属性实际用招扣当前3000百分比，上限不变；属性被封仍属用招，药剂未出招不触发',()=>{
 for(const mode of['normal','invalid','control','item','immune']){let s=H.make(24064,{enemyMoves:[20889],bEffects:mode==='invalid'?{skillBlock:{start:1,end:1}}:{},bAilments:mode==='control'?{疲惫:1}:{},bGear:mode==='immune'?{resistance:{percent:100}}:{}});for(let r=1;r<=3;r++){s=H.turn(s,r===1?24064:'potion:pp',mode==='item'?'potion:pp':20889);const expected=r<=2&&mode!=='immune'&&mode!=='item'&&!(mode==='control'&&r===1)?3000:0;assert.equal(H.damage(s,'percent'),expected,mode+r);assert.equal(s.fighters[1].stats.maxHp,9000);if(mode==='normal')assert.equal(s.fighters[1].hp,r===1?6000:3000);}}
});
test('3240新答742：收齐多段整回合红伤再判定，每段低于300但合计超300不害怕，属性不触发',()=>{
 let s=H.turn(H.make(25178,{enemyId:3079,enemyMoves:[16103],aStats:{def:500,spe:4000},bStats:{atk:3000,spe:100}}),25178,16103);assert.ok(H.damage(s,'attack',1)>300);assert.equal(s.fighters[1].ailments.害怕,undefined);s=H.turn(H.make(25178,{enemyMoves:[20889]}),25178,20889);assert.equal(s.fighters[1].ailments.害怕,undefined);
 const low=H.turn(H.make(25178,{enemyId:3079,enemyMoves:[16103],aStats:{def:500,spe:4000},bStats:{atk:100,spe:1000}}),25178,16103);assert.ok(H.damage(low,'attack',1)<300);assert.ok(H.damage(low,'percent',1)>300);assert.ok(low.fighters[1].ailments.害怕,'粉伤不加入整回合红伤阈值');
});
