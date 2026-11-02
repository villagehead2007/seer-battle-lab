'use strict';const {test}=require('node:test'),assert=require('node:assert/strict');const {E,make,turn,pick,timer,key}=require('./helpers/3788-battle.cjs');const fixture=(options={})=>make({moveId:10001,index:null},{soul:1061,omit:true,...options});
function hit(s,amount,type='fixed'){s.moveDefinitions[key(900041)].operations=[{effectId:683,index:0,phase:'afterHit',params:[amount,amount],sourceArgs:[amount,amount]}];if(type==='percent')s.moveDefinitions[key(900041)].operations=[{effectId:906,index:0,phase:'afterHit',params:[amount,0,amount],sourceArgs:[amount,0,amount]}];return turn(s,900031);}
test('3788辛初始等同最大HP，粉伤与攻击分担60%，余血不足仍挡完整份额',()=>{
 const s=fixture();assert.equal(s.fighters[0].soulState.xin.hp,9000);const n=hit(s,1000);assert.equal(n.fighters[0].hp,8600);assert.equal(n.fighters[0].soulState.xin.hp,8400);
 const p=hit(fixture(),20,'percent');assert.equal(p.fighters[0].hp,8280);assert.equal(p.fighters[0].soulState.xin.hp,7920);
 const low=fixture();low.fighters[0].soulState.xin.hp=100;const l=hit(low,1000);assert.equal(l.fighters[0].hp,8600);assert.equal(l.fighters[0].soulState.xin.hp,0);assert.equal(l.fighters[0].soulState.xinFusion,true);assert.equal(l.fighters[0].build.resistance.fixed,100);assert.equal(l.fighters[0].build.resistance.percent,100);
 const plain=fixture();plain.fighters[0].soulId=null;const base=turn(plain,900031,900040);const a=turn(fixture(),900031,900040),damage=base.fighters[1].lastAttackDamage;assert.equal(9000-a.fighters[0].hp,damage-Math.floor(damage*.6));assert.equal(9000-a.fighters[0].soulState.xin.hp,Math.floor(damage*.6));
});
test('3788辛分担在免疫减伤护盾之后，真伤和自损不分担',()=>{
 const shield=fixture();shield.fighters[0].suitState.shield=200;const n=hit(shield,1000);assert.equal(n.fighters[0].hp,8680);assert.equal(n.fighters[0].soulState.xin.hp,8520);
 const immune=fixture();timer(immune,0,'当回合免伤');assert.equal(hit(immune,1000).fighters[0].soulState.xin.hp,9000);
 const reduced=fixture();timer(reduced,0,'全伤害减半');const r=hit(reduced,1000);assert.equal(r.fighters[0].hp,8800);assert.equal(r.fighters[0].soulState.xin.hp,8700);
 const trueHit=fixture();trueHit.moveDefinitions[key(900041)].operations=[{effectId:2388,index:0,phase:'afterHit',params:[35,50,18],sourceArgs:[35,50,18]}];const own=turn(trueHit,900031);assert.equal(own.fighters[1].hp,5850);assert.equal(own.fighters[1].soulState.xin,undefined);
 const self=fixture();self.moveDefinitions[key(900031)].operations=[{effectId:479,index:0,phase:'afterHit',params:[500,0,1,1],sourceArgs:[500,0,1,1]}];const cost=turn(self,900031);assert.equal(cost.fighters[0].hp,8500);assert.equal(cost.fighters[0].soulState.xin.hp,9000);
 // Existing true-damage counter, activated by the opponent's attack.
 const t=fixture();timer(t,1,'符文咒印');const out=turn(t,900030);assert.equal(out.fighters[0].soulState.xin.hp,9000);assert.ok(out.fighters[0].hp<9000);
});
test('3788辛归零同回合立即停分担，融合免粉免弱仅回合结束后',()=>{
 const s=fixture();s.fighters[0].soulState.xin.hp=100;s.moveDefinitions[key(900041)].operations=[{effectId:683,index:0,phase:'afterHit',params:[1000,1000],sourceArgs:[1000,1000]},{effectId:683,index:1,phase:'afterHit',params:[1000,1000],sourceArgs:[1000,1000]},{effectId:5,index:2,phase:'afterHit',params:{chance:1,stat:'atk',amount:-1,target:'opponent'},sourceArgs:[0,100,-1]}];const n=turn(s,900031);assert.equal(n.fighters[0].hp,7600);assert.equal(n.fighters[0].stages.atk,-1);assert.equal(n.fighters[0].soulState.xinFusion,true);const later=turn(n,900031);assert.equal(later.fighters[0].hp,7600);assert.equal(later.fighters[0].stages.atk,-1);
});
test('3788辛回合初失血20%档位增伤，归零后下一回合不再有增伤',()=>{
 const base=turn(fixture(),900030).fighters[0].lastAttackDamage;for(const loss of [1799,1800,3599,3600,7200]){const s=fixture();s.fighters[0].soulState.xin.hp=9000-loss;const n=turn(s,900030);assert.equal(n.fighters[0].soulState.xinBonus,Math.floor(loss/1800)*.1);assert.ok(Math.abs(n.fighters[0].lastAttackDamage-base*(1+Math.floor(loss/1800)*.1))<=2);}const dead=fixture();dead.fighters[0].soulState.xin.hp=0;assert.equal(turn(dead,900030).fighters[0].lastAttackDamage,base);
});
test('3788辛异常清PP只抽正PP，弱化回合初记录且辛后死仍结算当回合',()=>{
 const s=fixture();s.fighters[0].ailments['疲惫']=2;s.fighters[1].moves.forEach(id=>s.fighters[1].pp[id]=0);s.fighters[1].pp[key(900040)]=3;const n=turn(s,900031,900040);assert.equal(n.fighters[1].pp[key(900040)],0);assert.equal(n.fighters[0].pp[key(900031)],99);
 const weak=fixture();weak.fighters[0].stages.atk=-1;weak.fighters[0].soulState.xin.hp=100;const out=hit(weak,1000);assert.equal(out.fighters[1].hp,6750);assert.equal(out.fighters[0].soulState.xin.hp,0);assert.equal(turn(fixture(),900031).fighters[1].hp,9000);
 const died=fixture();died.fighters[0].soulState.xin.hp=0;died.fighters[0].stages.atk=-1;assert.equal(turn(died,900031).fighters[1].hp,9000);
});
test('3788自身死亡同步令辛死亡，死亡印记保持多精灵延期',()=>{const s=fixture({hp:100});s.moveDefinitions[key(900031)].operations=[{effectId:479,index:0,phase:'afterHit',params:[100,0,1,1],sourceArgs:[100,0,1,1]}];const n=turn(s,900031);assert.equal(n.fighters[0].hp,0);assert.equal(n.fighters[0].soulState.xin.hp,0);assert.equal(n.finished,true);});
