'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
test('3221魔化之躯125原三回合单次红伤限250，到期原冲顶真实红伤超过250',()=>{
 let s=H.turn(H.make(22357,{aHp:8000,bHp:5000,aStats:{spe:4000,def:1000},enemyMoves:[10086],bStats:{atk:9999}}),22357,10086);assert.equal(H.damage(s,'attack',1),250);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp',10086);if(r<=3)assert.equal(H.damage(s,'attack',1),250);else assert.ok(H.damage(s,'attack',1)>250);}
});
test('3221魔化之躯125按既有默认仅限红，原固定100与百分比3000及真伤90分别不被限250',()=>{
 let s=H.turn(H.make(22357,{aHp:8000,bHp:5000,enemyMoves:[19070]}),22357,19070);assert.equal(H.damage(s,'fixed',1),100);s=H.turn(H.make(22357,{aHp:8000,bHp:4000,enemyId:3211,enemyMoves:[25114]}),22357,25114);assert.equal(H.damage(s,'percent',1),3000);s=H.turn(H.make(22357,{aHp:8000,enemyId:4785}),22357);assert.equal(H.damage(s,'true',1),90);
});
test('3221九天揽月127原百分百两回合减红一半，当轮及次轮130到期260，不叠原魂低体条件',()=>{
 let s=H.turn(H.make(19588,{aHp:8000,bHp:5000,aStats:{spe:4000},enemyId:3142,enemyMoves:[24970],aEffects:{id984:{start:1,end:1,amount:4}},aStages:{acc:6},bEffects:{禁强化:{start:1,end:5}}}),19588,24970);assert.equal(H.damage(s,'attack',1),130);s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),130);s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),260);
});
test('3221战灵冲锋85吸强成功保护失败与自身禁强独立，514按对手已损HP百分比仍独立结算并遵守免粉',()=>{
 for(const mode of['normal','protect','ban','percent-immune']){const s=H.turn(H.make(19587,{aHp:1000,bHp:5000,aStages:{acc:6},bStages:{atk:2,def:1,spd:-2},bEffects:mode==='protect'?{强化保护:{start:1,end:5}}:{},aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{},bGear:mode==='percent-immune'?{resistance:{percent:100}}:{}}),19587);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(s.fighters[1].stages.def,mode==='protect'?1:0);assert.equal(s.fighters[1].stages.spd,-2);assert.equal(s.fighters[0].stages.atk,['protect','ban'].includes(mode)?0:2);assert.equal(s.fighters[0].stages.def,['protect','ban'].includes(mode)?0:1);assert.equal(H.damage(s,'percent'),mode==='percent-immune'?0:Math.floor((4000+H.damage(s,'attack'))*.3));}
});

