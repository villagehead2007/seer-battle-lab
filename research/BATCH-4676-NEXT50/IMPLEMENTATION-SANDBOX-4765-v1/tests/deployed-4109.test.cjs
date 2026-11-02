'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {make,turn,timer,key,E}=require('./helpers/4109-battle.cjs');
function strong(s,amount,count=1){s.moveDefinitions[key(s.auditMoveId)].power=9999;timer(s,1,'攻击伤害上限',{amount});if(count>1){const m=s.moveDefinitions[key(s.auditMoveId)],r=E.WIKI.effectsEngine.registry[31],c=E.WIKI.effectsEngine.compileInstances([{id:31,args:[count,count],description:r.template}],[{id:31,argsNum:r.argsNum,template:r.template}],m);assert.equal(c.issue,'');m.operations=c.operations;}}
test('4109魂印按整回合完整攻击合计严格阈值，低于百分比3000、等于不触发，高于实际回复等量',()=>{
 for(const n of [2999,3000,3001]){const s=make(undefined,{soul:1342,hp:1000});strong(s,n);const o=turn(s),percent=o.damageEvents.filter(e=>e.type==='percent');assert.equal(o.damageEvents.find(e=>e.type==='attack').settledDamage,n);assert.equal(o.fighters[0].hp,n>3000?4000:1000);assert.equal(percent.length,n===3000?0:1);if(percent.length)assert.equal(percent[0].settledDamage,3000);}
});
test('4109高伤附伤跟随实际回复、回复削减和满血，不以理论量或净HP差代替',()=>{
 for(const [hp,fraction,want]of [[8900,0,100],[1000,.5,1500],[9000,0,0],[1000,1,0]]){
  const s=make(undefined,{soul:1342,hp});strong(s,3100);timer(s,0,'回复效果削减',{fraction});const o=turn(s);assert.equal(o.fighters[0].hp,hp+want);const ds=o.damageEvents.filter(e=>e.type==='percent');assert.equal(ds.length,want?1:0);if(want)assert.equal(ds[0].settledDamage,want);
 }
});
test('4109多段各2000合计4000只执行一次高伤回复，固定百分比附伤不计攻击门槛',()=>{
 const s=make(undefined,{soul:1342,hp:1000});strong(s,2000,2);const o=turn(s);assert.equal(o.damageEvents.filter(e=>e.type==='attack').length,2);assert.equal(o.fighters[0].hp,4000);assert.equal(o.damageEvents.filter(e=>e.type==='percent').length,1);
 const t=make(undefined,{soul:1342,hp:1000});strong(t,2000);const m=t.moveDefinitions[key(t.auditMoveId)],r=E.WIKI.effectsEngine.registry[29],c=E.WIKI.effectsEngine.compileInstances([{id:29,args:[2000],description:r.template}],[{id:29,argsNum:r.argsNum,template:r.template}],m);assert.equal(c.issue,'');m.operations=c.operations;
 const x=turn(t);assert.equal(x.fighters[0].hp,1000);assert.equal(x.damageEvents.find(e=>e.type==='fixed').settledDamage,2000);assert.equal(x.damageEvents.find(e=>e.type==='percent').settledDamage,3000);
});
test('4109保留1HP零实际损失仍按完整3100攻击进入高伤分支',()=>{
 const s=make(undefined,{soul:1342,hp:1000,targetHp:1});strong(s,3100);timer(s,1,'致命保留',{hp:1});const o=turn(s),d=o.damageEvents.find(e=>e.type==='attack');assert.equal(d.settledDamage,3100);assert.equal(d.hpLoss,0);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].hp,1);
});
test('4109未用攻击、控制与MISS不凭零自动触发，免疫百分比不改变高伤实际回复',()=>{
 for(const mode of ['status','control','miss']){const s=make(undefined,{soul:1342,hp:1000,hit:mode!=='miss'});if(mode==='control')s.fighters[0].ailments['疲惫']=3;if(mode==='miss'){s.moveDefinitions[key(s.auditMoveId)].accuracy=0;s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;}const o=turn(s,mode==='status'?900031:undefined);assert.equal(o.fighters[0].hp,1000);assert.equal((o.damageEvents??[]).some(e=>e.type==='percent'),false);}
 const s=make(undefined,{soul:1342,hp:1000});strong(s,3100);timer(s,1,'固定百分比免疫');const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].hp,5900);
});
