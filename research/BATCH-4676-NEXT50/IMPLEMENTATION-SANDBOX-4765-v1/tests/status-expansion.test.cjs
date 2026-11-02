'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/public-status.cjs');
const {E,S,key,game,turn,apply,timer}=H;
const names=['衰弱','山神守护','易燃','束缚','失神','沉默','臣服','星赐','超频','沸涌','砥砺','星赎','空定','狂信','雷解','魇昧'];
test('扩展16状态公共施加、显式持续、刷新、清除及用户确认默认时长',()=>{
 for(const name of names){const s=game(),f=s.fighters[0];const result=S.attempt(f,name,1,{random:()=>0});if(name==='山神守护'){assert.equal(result.reason,'pve-only');assert.deepEqual(f.ailments,{});continue;}assert.equal(result.reason,'applied');assert.equal(f.ailments[name],name==='衰弱'?3:2);apply(s,0,name,3);assert.equal(f.ailments[name],3);S.attempt(f,name,2,{duration:1});assert.equal(f.ailments[name],name==='衰弱'?4:3);assert.equal(S.clear(f,name),true);assert.equal(f.ailments[name],undefined);apply(s,0,name,2);assert.deepEqual(S.expire(f,1),[]);assert.deepEqual(S.expire(f,name==='衰弱'?3:2),[name]);assert.deepEqual(f.ailments,{});f.hp=0;assert.equal(S.attempt(f,name,3,{duration:2}).reason,'defeated');}
});

test('扩展16状态公共免疫、抗性成败、零时长拒绝均不凭空刷新',()=>{
 for(const name of names){const s=game(),f=s.fighters[0];if(name==='山神守护'){f.counts.immune=1;assert.equal(S.attempt(f,name,2,{duration:2}).reason,'pve-only');assert.equal(f.counts.immune,1);continue;}apply(s,0,name,8);const old=name==='衰弱'?3:8;f.counts.immune=1;assert.equal(S.attempt(f,name,2,{duration:2}).reason,'count-immunity');assert.equal(f.counts.immune,0);assert.equal(f.ailments[name],old);assert.equal(S.attempt(f,name,2,{duration:2,gate:()=>false}).reason,'blocked-by-policy');assert.equal(S.attempt(f,name,2,{duration:2,resistanceChance:()=>1,random:()=>0}).reason,'resisted');assert.equal(f.resistUntil,name==='衰弱'?4:3);assert.equal(f.ailments[name],old);assert.equal(S.attempt(f,name,3,{duration:3}).reason,'resistance-window');assert.equal(S.attempt(f,name,5,{duration:2,resistanceChance:()=>.5,random:()=>.9}).applied,true);assert.equal(f.ailments[name],name==='衰弱'?7:8);assert.throws(()=>S.attempt(f,name,5,{duration:0}));assert.equal(f.ailments[name],name==='衰弱'?7:8);}
});

test('易燃降低攻击命中而不影响属性招，清除后恢复并与混乱相乘',()=>{
 const s=game();apply(s,0,'易燃');assert.equal(S.accuracyMultiplier(s.fighters[0],'physical',1),.7);assert.equal(S.accuracyMultiplier(s.fighters[0],'status',1),1);apply(s,0,'混乱');assert.ok(Math.abs(S.accuracyMultiplier(s.fighters[0],'special',1)-.14)<1e-10);S.clearAll(s.fighters[0]);assert.equal(S.accuracyMultiplier(s.fighters[0],'physical',1),1);
 let misses=0;for(let seed=0;seed<32;seed++){const x=game();x.rng=seed;x.moveDefinitions[key(0,0)].alwaysHit=false;const plain=turn(x,0);apply(x,0,'易燃');const o=turn(x,0);if(o.fighters[1].hp===1600){misses++;assert.ok(plain.fighters[1].hp<1600);}}assert.ok(misses>0&&misses<32);
});
test('易燃火击转化按确认规则转化2回合烧伤并拒绝普通攻击触发',()=>{
 const s=game();apply(s,0,'易燃');const context={random:()=>assert.fail(),stage:()=>assert.fail(),source:s.fighters[1]};assert.equal(S.fireHit(s.fighters[0],1,'普通',context),null);const out=S.fireHit(s.fighters[0],1,'火',context);assert.equal(out.duration,2);assert.equal(out.applied,true);assert.equal(s.fighters[0].ailments['烧伤'],2);assert.equal(s.fighters[0].ailments['易燃'],undefined);
});

test('束缚压制正负先制，超频不能绕过，解除按百分比抗性扣血',()=>{
 for(const p of [-3,3]){const s=game();s.fighters[1].stats.spe=1000;s.moveDefinitions[key(0,0)].priority=p;apply(s,0,'束缚',1);apply(s,0,'超频',2);const o=turn(s,0);assert.equal(o.turns[0].first,1);assert.equal(o.fighters[0].hp,1400);assert.equal(o.fighters[0].ailments['束缚'],undefined);assert.equal(turn(o,0).turns[1].first,p>0?0:1);}
 const s=game([[2240,[0]]]);s.moveDefinitions[key(0,0)].operations=s.moveDefinitions[key(0,1)].operations;apply(s,0,'束缚',3);s.fighters[0].build.resistance.percent=50;const o=turn(s,0);assert.equal(o.fighters[0].hp,1500);assert.equal(o.fighters[0].ailments['束缚'],undefined);assert.equal(turn(o).fighters[0].hp,1500);
});
test('失神属性招50%失效仍扣PP，攻击和到期不受影响',()=>{
 let yes=0,no=0;for(let seed=0;seed<32;seed++){const s=game([[4,[0,100,1]]]);apply(s,0,'失神',1);s.rng=seed;const o=turn(s,1);assert.equal(o.fighters[0].pp[key(0,1)],29);if(o.fighters[0].stages.atk===1)yes++;else{assert.equal(o.fighters[0].stages.atk,0);no++;}assert.equal(turn(o,1).fighters[0].stages.atk,o.fighters[0].stages.atk+1);}assert.ok(yes>0&&no>0);const s=game();apply(s,0,'失神');assert.equal(turn(s,0).fighters[1].hp,turn(game(),0).fighters[1].hp);
});
test('沉默通过真实第五标记封招且每回合扣八分之一，普通攻击可用',()=>{
 const s=game();assert.equal(s.moveDefinitions[key(0,4)].fifth,true);apply(s,0,'沉默',2);let o=turn(s,4);assert.equal(o.fighters[1].hp,1600);assert.equal(o.fighters[0].hp,1400);assert.equal(o.fighters[0].pp[key(0,4)],29);o=turn(o,3);assert.ok(o.fighters[1].hp<1600);assert.equal(o.fighters[0].hp,1200);assert.equal(o.fighters[0].ailments['沉默'],undefined);const next=turn(o,4);assert.ok(next.fighters[1].hp<o.fighters[1].hp);assert.equal(next.fighters[0].hp,1200);
 const im=game();apply(im,0,'沉默',1);timer(im,0,'当回合免伤');assert.equal(turn(im).fighters[0].hp,1600);
});
test('臣服禁止攻击固定百分比对外伤害，真实伤害和自身中毒仍生效',()=>{
 const s=game();apply(s,0,'臣服',2);assert.equal(turn(s,0).fighters[1].hp,1600);
 for(const [effect,args]of [[683,[150,300]],[1213,[1,8]]]){const x=game([[effect,args]]);apply(x,0,'臣服');assert.equal(turn(x,1).fighters[1].hp,1600);}
 assert.equal(S.preventsDamage(s.fighters[0],s.fighters[1],'true',1),false);assert.equal(S.preventsDamage(s.fighters[0],s.fighters[0],'percent',1),false);
 apply(s,0,'中毒',1);assert.equal(turn(s).fighters[0].hp,1400);S.clear(s.fighters[0],'臣服');assert.ok(turn(s,0).fighters[1].hp<1600);
});
test('星赐攻击伤害提升30%，星赎恢复提升30%且禁疗仍优先',()=>{
 const s=game();apply(s,0,'星赐');const p=turn(game(),0),o=turn(s,0);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-1.3*p.fighters[0].lastAttackDamage)<=1);S.clear(s.fighters[0],'星赐');assert.equal(turn(s,0).fighters[1].hp,p.fighters[1].hp);
 const heal=game([[77,[1,100]]]);heal.fighters[0].hp=100;apply(heal,0,'星赎');assert.equal(turn(heal,1).fighters[0].hp,230);timer(heal,0,'技能禁疗');assert.equal(turn(heal,1).fighters[0].hp,100);
});
test('星赎只延长当前自身非限制异常，使用项目确认排除两项',()=>{
 const s=game();for(const n of ['星赎','中毒','瘫痪','凝滞'])apply(s,0,n,2);apply(s,1,'中毒',2);const o=turn(s);assert.equal(o.fighters[0].ailments['星赎'],3);assert.equal(o.fighters[0].ailments['中毒'],3);assert.equal(o.fighters[0].ailments['瘫痪'],2);assert.equal(o.fighters[0].ailments['凝滞'],2);assert.equal(o.fighters[1].ailments['中毒'],2);S.clear(o.fighters[0],'星赎');assert.equal(turn(o).fighters[0].ailments['中毒'],3);
});
test('超频行动开始回复所选技能PP并先制加一，结束转化确认的一至二回合瘫痪',()=>{
 const s=game();s.fighters[0].stats.spe=1;s.fighters[0].pp[key(0,0)]=2;s.fighters[0].pp[key(0,1)]=5;apply(s,0,'超频',1);const o=turn(s,0);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].pp[key(0,0)],29);assert.equal(o.fighters[0].pp[key(0,1)],5);assert.equal(o.fighters[0].ailments['瘫痪'],2);assert.equal(o.pendingStatusTransitions,undefined);
 const c=game();apply(c,0,'超频',2);apply(c,0,'疲惫',1);c.fighters[0].pp[key(0,0)]=1;assert.equal(turn(c,0).fighters[0].pp[key(0,0)],30);
});
test('沸涌非暴击30%与暴击50%伤害下限，最终下限覆盖完全免伤',()=>{
 for(const crit of [false,true]){const s=game();apply(s,1,'沸涌');if(crit)timer(s,0,'必定暴击');const o=turn(s,0);assert.equal(o.fighters[0].lastAttackDamage,crit?800:480);const im=structuredClone(s);timer(im,1,'当回合免伤');assert.equal(turn(im,0).fighters[1].hp,crit?800:1120);apply(s,0,'臣服');assert.equal(turn(s,0).fighters[1].hp,crit?800:1120);}
 const zero=game();zero.moveDefinitions[key(0,0)].power=0;apply(zero,1,'沸涌');assert.equal(turn(zero,0).fighters[1].hp,1600);
});
test('空定控制不扣PP且结束绕过免疫转为后续两回合沉默',()=>{
 const s=game();apply(s,0,'空定',2);let o=turn(s,0);assert.equal(o.fighters[0].pp[key(0,0)],30);assert.equal(o.fighters[1].hp,1600);o=turn(o,0);assert.equal(o.fighters[0].ailments['空定'],undefined);assert.equal(o.pendingStatusTransitions,undefined);assert.equal(o.fighters[0].ailments['沉默'],4);assert.ok(turn(o,0).fighters[1].hp<1600);
});
test('狂信只在对手是已绑定来源时控制，免疫不绑定且重施不覆盖信仰',()=>{
 const s=game();apply(s,0,'狂信',2,1);assert.equal(s.fighters[0].statusState.faithSourceSide,1);assert.equal(turn(s,0).fighters[0].pp[key(0,0)],30);
 S.attempt(s.fighters[0],'狂信',1,{duration:3,source:s.fighters[0]});assert.equal(s.fighters[0].statusState.faithSourceSide,1);S.clear(s.fighters[0],'狂信');assert.ok(turn(s,0).fighters[1].hp<1600);
 const self=game();apply(self,0,'狂信',2,0);assert.ok(turn(self,0).fighters[1].hp<1600);
 const im=game();im.fighters[0].counts.immune=1;apply(im,0,'狂信',2,1);assert.equal(im.fighters[0].statusState,undefined);assert.deepEqual(im.fighters[0].ailments,{});
});
test('雷解仅按实际红伤附加60%真实伤害，未命中或零伤不触发',()=>{
 const s=game();apply(s,0,'雷解');const o=turn(s,0),d=o.fighters[0].lastAttackDamage;assert.equal(1600-o.fighters[1].hp,d+Math.floor(d*.6));assert.equal(turn(s).fighters[1].hp,1600);
 const im=structuredClone(s);timer(im,1,'当回合免伤');assert.equal(turn(im,0).fighters[1].hp,1600);const miss=structuredClone(s);miss.moveDefinitions[key(0,0)].alwaysHit=false;timer(miss,0,'攻击必失');assert.equal(turn(miss,0).fighters[1].hp,1600);apply(s,0,'臣服');assert.equal(turn(s,0).fighters[1].hp,1600);
});
