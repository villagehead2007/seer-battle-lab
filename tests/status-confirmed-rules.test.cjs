'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/public-status.cjs');
const {E,S,key,game,turn,apply,timer}=H;
test('用户规则衰弱固定三回合且始终增伤100%，重复施加重置三回合',()=>{
 let s=game();apply(s,1,'衰弱',1);assert.equal(s.fighters[1].ailments['衰弱'],3);for(let i=0;i<3;i++){const plain=structuredClone(s);delete plain.fighters[1].ailments['衰弱'];const x=turn(plain,0),y=turn(s,0);assert.ok(Math.abs(y.fighters[0].lastAttackDamage-2*x.fighters[0].lastAttackDamage)<=1);s=y;}
 assert.equal(s.fighters[1].ailments['衰弱'],undefined);const f=game().fighters[0];f.ailments['衰弱']=9;S.attempt(f,'衰弱',2,{duration:1});assert.equal(f.ailments['衰弱'],4);
});
test('用户规则到期转化从下一回合计时，绕过免疫反弹抗性且保留更长同名状态',()=>{
 for(const [from,to,n]of [['冰封','冻伤',2],['焚烬','烧伤',2],['感染','中毒',2],['神游','失神',2],['渐冻','冰封',3],['空定','沉默',2]]){const s=game();apply(s,0,from,1);s.fighters[0].counts.immune=3;s.fighters[0].resistUntil=9;timer(s,0,'reflect');let o=turn(s);assert.equal(o.fighters[0].ailments[from],undefined);assert.equal(o.fighters[0].ailments[to],1+n);assert.equal(o.fighters[0].counts.immune,3);assert.equal(o.fighters[0].hp,1600);assert.deepEqual(o.fighters[1].ailments,{});
 const existing=game();apply(existing,0,from,1);apply(existing,0,to,8);assert.equal(turn(existing).fighters[0].ailments[to],8);
 const clear=game();apply(clear,0,from,1);S.clearAll(clear.fighters[0]);o=turn(clear);assert.deepEqual(o.fighters[0].ailments,{});assert.deepEqual(Object.values(o.fighters[0].stages),Array(6).fill(0));}
});
test('用户规则诅咒三种及超频一二回合等宽抽样，明确转化终点',()=>{
 for(const [u,to]of [[0,'烈焰诅咒'],[1/3,'致命诅咒'],[2/3,'虚弱诅咒']]){const f=game().fighters[0];const result=S.convert(f,'诅咒',4,{random:()=>u,stage:()=>assert.fail()});assert.equal(result.to,to);assert.equal(f.ailments[to],6);}
 for(const [u,n]of [[0,1],[.499999,1],[.5,2],[.999999,2]]){const f=game().fighters[0];S.convert(f,'超频',4,{random:()=>u,stage:()=>assert.fail()});assert.equal(f.ailments['瘫痪'],4+n);}
});
test('用户规则易燃只被纯火攻击转化，刷新烧伤采用最大时长且绕过免疫',()=>{
 for(const type of ['普通','火战斗','火']){const s=game();apply(s,1,'易燃',5);apply(s,1,'烧伤',8);s.fighters[1].counts.immune=2;const out=S.fireHit(s.fighters[1],1,type,{random:()=>assert.fail(),stage:()=>assert.fail(),source:s.fighters[0]});assert.equal(s.fighters[1].ailments['易燃'],type==='火'?undefined:5);assert.equal(s.fighters[1].ailments['烧伤'],8);assert.equal(s.fighters[1].counts.immune,2);assert.equal(!!out,type==='火');}
});
test('用户规则睡眠非攻击伤害不唤醒，已失去行动后唤醒不补行动',()=>{
 const s=game([[683,[150,150]]]);apply(s,1,'睡眠',3);const p=turn(s,1);assert.equal(p.fighters[1].hp,1450);assert.equal(p.fighters[1].ailments['睡眠'],3);assert.equal(p.fighters[1].pp[key(1,2)],30);
 const late=game();late.fighters[0].stats.spe=1;apply(late,1,'睡眠',3);const o=turn(late,0,0);assert.equal(o.fighters[1].ailments['睡眠'],undefined);assert.equal(o.fighters[1].pp[key(1,0)],30);assert.equal(o.fighters[0].hp,1600);
});
test('用户规则流血每回合末扣80，不依赖对手行动且来源星哲按实际来源增伤',()=>{
 for(const blocked of [false,true]){const s=game();apply(s,0,'流血',2);if(blocked)apply(s,1,'疲惫',2);let o=turn(s);assert.equal(o.fighters[0].hp,1520);o=turn(o);assert.equal(o.fighters[0].hp,1440);assert.equal(turn(o).fighters[0].hp,1440);}
 const s=game();apply(s,0,'中毒',1);apply(s,1,'星哲',1);assert.equal(turn(s).fighters[0].hp,1340);
});
test('用户规则星赐逐技能回复2PP且饱和，星赎先延长再判断到期',()=>{
 const s=game();apply(s,0,'星赐',1);for(const id of s.fighters[0].moves)s.fighters[0].pp[id]=1;s.fighters[0].pp[key(0,0)]=30;const o=turn(s);assert.equal(o.fighters[0].pp[key(0,0)],30);assert.equal(o.fighters[0].pp[key(0,2)],2);assert.equal(o.fighters[0].pp[key(0,1)],3);
 const x=game();apply(x,0,'星赎',1);apply(x,0,'中毒',1);const y=turn(x);assert.equal(y.fighters[0].ailments['中毒'],2);assert.equal(y.fighters[0].ailments['星赎'],2);assert.equal(y.fighters[0].hp,1400);
});
test('用户规则沸涌在全部减伤免疫后执行最终下限，混乱直接扣血无视所有免伤',()=>{
 for(const crit of [false,true])for(const defense of ['当回合免伤','攻击伤害免疫','攻击伤害上限']){const s=game();apply(s,1,'沸涌',2);timer(s,1,defense,{amount:1});if(crit)timer(s,0,'必定暴击');assert.equal(turn(s,0).fighters[1].hp,crit?800:1120);}
 let matched=false;for(let seed=0;seed<100&&!matched;seed++){const s=game();s.rng=seed;apply(s,0,'混乱',1);timer(s,0,'当回合免伤');s.fighters[0].build.resistance.fixed=100;s.fighters[0].build.resistance.percent=100;const o=turn(s);if(o.fighters[0].hp===1550){matched=true;assert.equal(o.fighters[1].hp,1600);}}assert.ok(matched);
});
test('用户规则砥砺只回复存活目标实际真伤80%，执行异常失败也阻止回复',()=>{
 for(const executed of [false,true]){const f=game().fighters[0];f.hp=1000;S.apply(f,'砥砺',1,2);if(executed)S.markExecution(f,1);f.hp-=100;S.trueDamageTaken(f,1,100,(x,n)=>x.hp+=n);assert.equal(f.hp,executed?900:980);S.trueDamageTaken(f,2,100,(x,n)=>x.hp+=n);assert.equal(f.hp,executed?980:1060);}
 const s=game([[22,[0,1]]]);apply(s,0,'砥砺',2);const o=turn(s,1);assert.equal(o.fighters[0].statusState.ailmentEffectRound,1);assert.deepEqual(o.fighters[1].ailments,{});
 const im=game([[22,[100,1]]]);im.fighters[1].counts.immune=1;const y=turn(im,1);assert.equal(y.fighters[0].statusState.ailmentEffectRound,1);assert.equal(y.fighters[1].counts.immune,0);
 const dead=game().fighters[0];dead.hp=0;S.apply(dead,'砥砺',1,3);S.trueDamageTaken(dead,1,100,()=>assert.fail('不能复活'));
});
test('砥砺真实对局按实际雷解真伤回复，概率失败免疫失败与致死均不回复',()=>{
 for(const mode of ['none','chance-failed','immune-failed','lethal']){const s=game(mode==='chance-failed'?[[22,[0,1]]]:mode==='immune-failed'?[[22,[100,1]]]:[]);apply(s,0,'砥砺',3);apply(s,1,'雷解',3);if(mode==='immune-failed')s.fighters[1].counts.immune=1;if(mode==='lethal')s.fighters[0].hp=1;const o=turn(s,mode.includes('failed')?1:2,0),d=o.fighters[1].lastAttackDamage,n=Math.floor(d*.6);assert.equal(o.fighters[0].hp,mode==='lethal'?0:1600-d-n+(mode==='none'?Math.floor(n*.8):0));}
});
test('转化刷新同轮到期目标后不被旧快照误清除，凝滞阻止条件控制狂信',()=>{
 const s=game();apply(s,0,'冰封',1);apply(s,0,'冻伤',1);const o=turn(s);assert.equal(o.fighters[0].ailments['冻伤'],3);assert.equal(o.fighters[0].stages.spe,-1);assert.equal(o.fighters[0].hp,1400);
 const f=game().fighters[0];S.apply(f,'凝滞',1,3);assert.equal(S.attempt(f,'狂信',1,{duration:2}).applied,false);assert.equal(S.attempt(f,'魇昧',1,{duration:2}).applied,true);
});
test('易燃自然到期或主动清除不会无故转为烧伤',()=>{
 const s=game();apply(s,0,'易燃',1);const o=turn(s);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[0].hp,1600);apply(s,0,'易燃',2);S.clear(s.fighters[0],'易燃');assert.deepEqual(turn(s).fighters[0].ailments,{});
});
