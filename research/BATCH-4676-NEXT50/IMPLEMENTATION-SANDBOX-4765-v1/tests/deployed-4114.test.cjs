'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {make,turn,pick,key,timer,E}=require('./helpers/4114-battle.cjs');
test('4114孤芒飘游真实1444按使用时剩余HP比例向上取整，满血0、半血50、1%为99',()=>{
 const entry=pick(1444)[0];assert.equal(entry.moveId,34533);
 for(const [hp,power]of [[9000,0],[8999,1],[4500,50],[90,99],[1,100]]){
  const s=make(entry,{hp}),o=turn(s);assert.equal(o.fighters[0].soulState.hpPower1444.power,power);assert.equal(o.fighters[0].pp[key(34533)],s.fighters[0].pp[key(34533)]-1);
  const d=o.damageEvents.find(e=>e.type==='attack');assert.equal(d.settledDamage===0,power===0);assert.ok(o.turns[0].events.some(e=>e.detail?.includes('威力 '+power+' ')));
 }
});
test('4114 1444读取的是自身比例而非HP绝对量，未用招不计算、失效不造成伤害',()=>{
 for(const maxHp of [6000,9000]){const s=make(pick(1444)[0],{hp:maxHp/2,aStats:{maxHp}}),o=turn(s);assert.equal(o.fighters[0].soulState.hpPower1444.power,50);}
 let s=make(pick(1444)[0],{hp:4500});s.fighters[0].ailments['疲惫']=3;let o=turn(s);assert.equal(o.fighters[0].soulState.hpPower1444,undefined);assert.equal(o.fighters[1].hp,9000);
 s=make(pick(1444)[0],{hp:4500});s.fighters[0].counts.nextAttackInvalid=1;o=turn(s);assert.equal(o.fighters[1].hp,9000);
});
test('4114孤芒飘游34533完整真实两效果同时执行动态威力及命中等级负2',()=>{
 const s=make({moveId:34533,index:null},{hp:4500}),o=turn(s);assert.equal(o.fighters[0].soulState.hpPower1444.power,50);assert.equal(o.fighters[1].stages.acc,-2);assert.ok(o.damageEvents.find(e=>e.type==='attack').settledDamage>0);assert.equal(o.fighters[0].pp[key(34533)],s.fighters[0].pp[key(34533)]-1);
});
test('4114 1617零伤不占次数、同招后续正伤才反制且每回合一次，时窗结束不继续',()=>{
 const s=make(pick(1617)[0]);timer(s,1,'免异常');timer(s,0,'攻击伤害上限',{amount:20});s.fighters[0].suitState.shield=20;
 const m=s.moveDefinitions[key(900040)],r=E.WIKI.effectsEngine.registry[31],c=E.WIKI.effectsEngine.compileInstances([{id:31,args:[2,2],description:r.template}],[{id:31,argsNum:r.argsNum,template:r.template}],m);assert.equal(c.issue,'');m.operations=c.operations;m.power=400;
 let o=turn(s,undefined,900040);assert.deepEqual(o.damageEvents.filter(e=>e.type==='attack').map(e=>e.settledDamage),[0,20]);assert.equal(o.fighters[0].stages.atk,1);
 o=turn(o,900031,900040);assert.equal(o.fighters[0].stages.atk,2);o=turn(o,900031,900040);assert.equal(o.fighters[0].stages.atk,3);o=turn(o,900031,900040);assert.equal(o.fighters[0].stages.atk,3);
});
test('4114 1617保留1HP实际零损失但正完整伤害仍反制',()=>{
 const s=make(pick(1617)[0],{hp:1});timer(s,0,'致命保留',{hp:1});const o=turn(s,undefined,900040),d=o.damageEvents.find(e=>e.type==='attack');assert.ok(d.settledDamage>0);assert.equal(d.hpLoss,0);assert.equal(o.fighters[0].hp,1);assert.ok(o.fighters[1].ailments['害怕']);
});


