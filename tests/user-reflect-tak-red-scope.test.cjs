'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H14=require('./helpers/3014-native.cjs'),H17=require('./helpers/3017-native.cjs'),H13=require('./helpers/3013-native.cjs'),H20=require('./helpers/3020-native.cjs'),pp='potion:pp';
const events=(s,type,side)=> (s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side),sum=(s,type,side)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
test('人答天空领域仅本来源138反弹为百分比，固定抗性不挡而百分比抗性阻挡，先手当轮免攻后手不建',()=>{
 for(const resistance of[{fixed:100,percent:0},{fixed:0,percent:100}]){const options={extraMoves:[20651],enemyMoves:[10086],aStats:{def:100},bStats:{atk:9999},bGear:{resistance}},s=H14.turn(H14.make(22976,options),22976,10086),control=H14.turn(H14.make(22976,options),20651,10086);assert.equal(sum(s,'attack',1),0);assert.equal(sum(s,'fixed',0),0);assert.ok(events(s,'percent',0).length>0);assert.equal(sum(s,'percent',0),Math.floor(sum(control,'attack',1)*.5*(1-resistance.percent/100)));}
 const s=H14.turn(H14.make(22976,{enemyMoves:[10086],aStats:{spe:1,def:100},bStats:{spe:9999,atk:9999}}),22976,10086);assert.ok(sum(s,'attack',1)>0);assert.equal(sum(s,'percent',0),0);
});
test('人答塔克林387仅完整红伤60回血，真实附75固定与800百分比不回血，目标1HP溢出红伤不截断',()=>{
 for(const[id,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){const s=H17.turn(H17.make(id,{aHp:1000,aStages:{acc:6}}),id);assert.equal(sum(s,type,0),n);assert.equal(s.fighters[0].hp,1000+Math.floor(sum(s,'attack',0)*.6));}
 const s=H17.turn(H17.make(10611,{aHp:1000,bHp:1,aStages:{acc:6}}),10611),e=events(s,'attack',0)[0];assert.ok(e.settledDamage>1);assert.equal(e.hpLoss,1);assert.equal(s.fighters[0].hp,1000+Math.floor(e.settledDamage*.6));
 const zero=H17.turn(H17.make(10611,{aHp:1000,bHp:1,enemyId:3141,aStages:{acc:6}}),10611),hit=events(zero,'attack',0)[0];assert.ok(hit.settledDamage>1);assert.equal(hit.hpLoss,0);assert.equal(zero.fighters[1].hp,1);assert.equal(zero.fighters[0].hp,1000+Math.floor(hit.settledDamage*.6));
 const reflected=H17.turn(H17.make(24696,{aHp:1000,enemyId:4693,enemyMoves:[20020]}),24696,20020);assert.equal(sum(reflected,'true',0),1125);assert.equal(reflected.fighters[0].hp,1000);
});
test('人答491输出减半仅红伤，不降低真实毒1125及原生附75固定与800百分比',()=>{
 let s=H13.make(19192,{enemyId:4693,enemyMoves:[20020]});s=H13.turn(s,19192,20020);assert.equal(sum(s,'true',1),1125);
 for(const[id,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){s=H13.make(19192,{enemyId:3017,enemyMoves:[id],bStages:{acc:6}});s=H13.turn(s,19192,id);assert.equal(sum(s,type,1),n);const e=events(s,'attack',1)[0];assert.ok(e.settledDamage>0);assert.ok(s.turns[0].events.some(x=>x.damage?.sourceSide===1&&x.damage.type==='attack'&&x.detail.includes('增减伤 0.5')));}
});
test('人答463定额减200仅红伤，真毒1125固定75百分比800照常，三回合后红伤恢复',()=>{
 let s=H20.turn(H20.make(24702,{enemyId:4693,enemyMoves:[20020]}),24702,20020);assert.equal(sum(s,'true',1),1125);
 for(const[id,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){s=H20.turn(H20.make(24702,{enemyId:3017,enemyMoves:[id],bStages:{acc:6}}),24702,id);assert.equal(sum(s,type,1),n);assert.equal(sum(s,'attack',1),0);}
 s=H20.make(24702,{enemyMoves:[10086]});for(let r=1;r<=4;r++){s=H20.turn(s,r===1?24702:pp,10086);assert.equal(sum(s,'attack',1)>0,r===4);}
});
test('人答800限伤仅红伤，真实属性后授下两轮250限额不裁剪毒1125或原生800百分比',()=>{
 let s=H20.make(24701,{enemyId:3017,enemyMoves:[20139,16397],aStats:{def:100},bStages:{acc:6},bStats:{atk:9999}});s=H20.turn(s,24701,20139);assert.equal(s.fighters[0].effects['伤害上限'].start,2);s=H20.turn(s,pp,16397);assert.equal(sum(s,'percent',1),800);assert.ok(sum(s,'attack',1)<=250);assert.ok(sum(s,'attack',1)>0);
 s=H20.make(24701,{enemyMoves:[20889]});s.fighters[0].ailments['中毒']=4;s=H20.turn(s,24701,20889);s=H20.turn(s,pp,pp);assert.equal(sum(s,'true',0),1125);
});
